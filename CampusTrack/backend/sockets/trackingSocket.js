const jwt = require('jsonwebtoken');
const { JWT_SECRET, STALE_GPS_THRESHOLD_SECONDS } = require('../config/constants');
const dbStore = require('../models/dbStore');

let ioInstance = null;

function initSocket(io) {
  ioInstance = io;

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        return next(new Error('Authentication token required for Socket connection.'));
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await dbStore.findUserById(decoded.userId);
      if (!user || user.account_status !== 'active') {
        return next(new Error('User inactive or not found.'));
      }
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Socket authentication error: ' + err.message));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.user.name} (${socket.user.role}) [ID: ${socket.id}]`);

    // 1. Join Trip Room
    socket.on('join_trip', async ({ tripId }) => {
      try {
        const id = Number(tripId);
        const trip = await dbStore.getTripById(id);
        if (!trip) {
          return socket.emit('error', { message: `Trip ${tripId} not found.` });
        }

        const roomName = `trip_${id}`;
        socket.join(roomName);
        console.log(`[Socket] ${socket.user.name} joined room ${roomName}`);

        // Send latest known location right away
        const latestLoc = await dbStore.getLatestBusLocation(id);
        if (latestLoc) {
          const now = new Date();
          const recAt = new Date(latestLoc.received_at || latestLoc.device_timestamp);
          const ageSeconds = Math.max(0, Math.floor((now - recAt) / 1000));
          const isStale = ageSeconds > STALE_GPS_THRESHOLD_SECONDS;

          socket.emit('location_update', {
            tripId: id,
            busId: trip.bus_id,
            latitude: latestLoc.latitude,
            longitude: latestLoc.longitude,
            speed: latestLoc.speed,
            heading: latestLoc.heading,
            accuracy: latestLoc.accuracy,
            received_at: latestLoc.received_at,
            device_timestamp: latestLoc.device_timestamp,
            isStale,
            ageSeconds
          });
        }
      } catch (err) {
        console.error('[Socket join_trip error]', err);
      }
    });

    // 2. Driver Location Broadcast
    socket.on('bus_location', async (payload) => {
      try {
        if (socket.user.role !== 'driver' && socket.user.role !== 'admin') {
          return socket.emit('error', { message: 'Only authorized drivers can send bus locations.' });
        }

        const { tripId, latitude, longitude, accuracy, speed, heading, deviceTimestamp } = payload;
        const id = Number(tripId);
        const trip = await dbStore.getTripById(id);

        if (!trip) {
          return socket.emit('error', { message: 'Trip not found.' });
        }

        if (trip.status !== 'Active') {
          return socket.emit('error', { message: `Cannot update location: Trip is ${trip.status}.` });
        }

        const savedLocation = await dbStore.recordBusLocation({
          trip_id: id,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          accuracy: accuracy || 5,
          speed: speed || 0,
          heading: heading || 0,
          device_timestamp: deviceTimestamp || new Date().toISOString()
        });

        const updatePayload = {
          tripId: id,
          busId: trip.bus_id,
          latitude: savedLocation.latitude,
          longitude: savedLocation.longitude,
          speed: savedLocation.speed,
          heading: savedLocation.heading,
          accuracy: savedLocation.accuracy,
          received_at: savedLocation.received_at,
          device_timestamp: savedLocation.device_timestamp,
          isStale: false,
          ageSeconds: 0
        };

        // Broadcast to all students and admins monitoring this trip
        io.to(`trip_${id}`).emit('location_update', updatePayload);
      } catch (err) {
        console.error('[Socket bus_location error]', err);
      }
    });

    // 3. Leave Room
    socket.on('leave_trip', ({ tripId }) => {
      const roomName = `trip_${tripId}`;
      socket.leave(roomName);
    });

    socket.on('disconnect', () => {
      // Disconnected gracefully
    });
  });

  return io;
}

function broadcastLocationUpdate(tripId, location) {
  if (!ioInstance) return;
  ioInstance.to(`trip_${tripId}`).emit('location_update', {
    tripId: Number(tripId),
    latitude: location.latitude,
    longitude: location.longitude,
    speed: location.speed,
    heading: location.heading,
    accuracy: location.accuracy,
    received_at: location.received_at,
    device_timestamp: location.device_timestamp,
    isStale: false,
    ageSeconds: 0
  });
}

function broadcastTripEvent(tripId, eventName, payload) {
  if (!ioInstance) return;
  ioInstance.to(`trip_${tripId}`).emit(eventName, payload);
  // Also broadcast to general admin dashboard
  ioInstance.emit(`admin_${eventName}`, payload);
}

module.exports = {
  initSocket,
  broadcastLocationUpdate,
  broadcastTripEvent
};
