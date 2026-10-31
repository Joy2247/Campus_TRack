const dbStore = require('../models/dbStore');
const { broadcastLocationUpdate, broadcastTripEvent } = require('../sockets/trackingSocket');

const driverController = {
  async getProfile(req, res) {
    try {
      const driver = await dbStore.getDriverByUserId(req.user.user_id);
      if (!driver) {
        return res.status(404).json({ success: false, error: 'Driver profile not found.' });
      }
      return res.json({ success: true, driver });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve driver profile.' });
    }
  },

  async getAssignedTrip(req, res) {
    try {
      const trip = await dbStore.getActiveTripForDriver(req.user.user_id);
      return res.json({ success: true, trip });
    } catch (err) {
      console.error('[DriverController.getAssignedTrip]', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve assigned trip.' });
    }
  },

  async startTrip(req, res) {
    try {
      const driver = await dbStore.getDriverByUserId(req.user.user_id);
      if (!driver) return res.status(404).json({ success: false, error: 'Driver not found.' });

      let trip = await dbStore.getActiveTripForDriver(req.user.user_id);
      if (!trip) {
        return res.status(400).json({ success: false, error: 'No scheduled trip assigned to start.' });
      }

      if (trip.status === 'Active') {
        return res.json({ success: true, message: 'Trip is already active.', trip });
      }

      const updated = await dbStore.updateTripStatus(trip.trip_id, 'Active', {
        actual_start: new Date().toISOString()
      });

      // Broadcast event
      broadcastTripEvent(trip.trip_id, 'trip_started', {
        tripId: trip.trip_id,
        busId: trip.bus_id,
        timestamp: new Date().toISOString()
      });

      // Audit
      await dbStore.createAuditLog({
        actor_user_id: req.user.user_id,
        action: 'TRIP_STARTED',
        entity_type: 'TRIP',
        entity_id: trip.trip_id,
        metadata: { bus_id: trip.bus_id }
      });

      return res.json({ success: true, message: 'Trip started successfully.', trip: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to start trip.' });
    }
  },

  async pauseTrip(req, res) {
    try {
      const { tripId } = req.params;
      const trip = await dbStore.getTripById(tripId);

      if (!trip) return res.status(404).json({ success: false, error: 'Trip not found.' });
      if (trip.driver_id !== (await dbStore.getDriverByUserId(req.user.user_id))?.driver_id) {
        return res.status(403).json({ success: false, error: 'Unauthorized to modify this trip.' });
      }

      const updated = await dbStore.updateTripStatus(tripId, 'Paused');

      broadcastTripEvent(tripId, 'trip_paused', {
        tripId,
        reason: req.body.reason || 'Brief stop / traffic hold',
        timestamp: new Date().toISOString()
      });

      return res.json({ success: true, message: 'Trip paused.', trip: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to pause trip.' });
    }
  },

  async resumeTrip(req, res) {
    try {
      const { tripId } = req.params;
      const trip = await dbStore.getTripById(tripId);

      if (!trip) return res.status(404).json({ success: false, error: 'Trip not found.' });
      if (trip.driver_id !== (await dbStore.getDriverByUserId(req.user.user_id))?.driver_id) {
        return res.status(403).json({ success: false, error: 'Unauthorized to modify this trip.' });
      }

      const updated = await dbStore.updateTripStatus(tripId, 'Active');

      broadcastTripEvent(tripId, 'trip_resumed', {
        tripId,
        timestamp: new Date().toISOString()
      });

      return res.json({ success: true, message: 'Trip resumed.', trip: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to resume trip.' });
    }
  },

  async endTrip(req, res) {
    try {
      const { tripId } = req.params;
      const trip = await dbStore.getTripById(tripId);

      if (!trip) return res.status(404).json({ success: false, error: 'Trip not found.' });
      const driver = await dbStore.getDriverByUserId(req.user.user_id);
      if (trip.driver_id !== driver?.driver_id) {
        return res.status(403).json({ success: false, error: 'Unauthorized to modify this trip.' });
      }

      const updated = await dbStore.updateTripStatus(tripId, 'Completed', {
        actual_end: new Date().toISOString()
      });

      broadcastTripEvent(tripId, 'trip_completed', {
        tripId,
        timestamp: new Date().toISOString()
      });

      await dbStore.createAuditLog({
        actor_user_id: req.user.user_id,
        action: 'TRIP_COMPLETED',
        entity_type: 'TRIP',
        entity_id: tripId,
        metadata: { duration: 'Completed' }
      });

      return res.json({ success: true, message: 'Trip completed successfully.', trip: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to end trip.' });
    }
  },

  async updateLocation(req, res) {
    try {
      const { trip_id, latitude, longitude, accuracy, speed, heading, device_timestamp } = req.validatedLocation;

      const trip = await dbStore.getTripById(trip_id);
      if (!trip) {
        return res.status(404).json({ success: false, error: 'Trip not found.' });
      }

      const driver = await dbStore.getDriverByUserId(req.user.user_id);
      if (trip.driver_id !== driver?.driver_id) {
        return res.status(403).json({ success: false, error: 'Unauthorized: You are not the assigned driver for this trip.' });
      }

      if (trip.status !== 'Active') {
        return res.status(400).json({
          success: false,
          error: `Cannot update location: Trip status is '${trip.status}', not 'Active'.`
        });
      }

      const savedLocation = await dbStore.recordBusLocation({
        trip_id,
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
        device_timestamp
      });

      // Real-time broadcast
      broadcastLocationUpdate(trip_id, savedLocation);

      return res.json({
        success: true,
        message: 'Location accepted.',
        location: savedLocation
      });
    } catch (err) {
      console.error('[DriverController.updateLocation]', err);
      return res.status(500).json({ success: false, error: 'Failed to process location update.' });
    }
  },

  async reportIssue(req, res) {
    try {
      const { tripId, issueType, description } = req.body;
      const driver = await dbStore.getDriverByUserId(req.user.user_id);

      await dbStore.createAuditLog({
        actor_user_id: req.user.user_id,
        action: 'DRIVER_ISSUE_REPORTED',
        entity_type: 'TRIP',
        entity_id: tripId,
        metadata: { issueType, description, driver: driver?.name }
      });

      broadcastTripEvent(tripId, 'trip_alert', {
        tripId,
        type: issueType,
        message: description || `Issue reported: ${issueType}`,
        timestamp: new Date().toISOString()
      });

      return res.json({ success: true, message: 'Issue reported to transport admin and assigned students.' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to report issue.' });
    }
  }
};

module.exports = driverController;
