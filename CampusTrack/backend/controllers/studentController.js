const dbStore = require('../models/dbStore');
const { STALE_GPS_THRESHOLD_SECONDS } = require('../config/constants');

// Haversine formula for distance in kilometers
function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const studentController = {
  async getProfile(req, res) {
    try {
      const student = await dbStore.getStudentByUserId(req.user.user_id);
      if (!student) {
        return res.status(404).json({ success: false, error: 'Student record not found.' });
      }
      return res.json({ success: true, student });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to fetch student profile.' });
    }
  },

  async getAssignment(req, res) {
    try {
      const details = await dbStore.getStudentAssignmentDetails(req.user.user_id);
      if (!details) {
        return res.status(404).json({
          success: false,
          error: 'No active bus assignment found for your account. Please consult the Transport Office.'
        });
      }
      return res.json({ success: true, assignment: details });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to fetch assignment details.' });
    }
  },

  async getBusLocation(req, res) {
    try {
      const details = await dbStore.getStudentAssignmentDetails(req.user.user_id);
      if (!details || !details.bus) {
        return res.status(404).json({ success: false, error: 'No bus assigned.' });
      }

      const activeTrip = details.activeTrip;
      if (!activeTrip) {
        return res.json({
          success: true,
          status: 'No Active Trip',
          message: 'The assigned bus is not currently on an active run.',
          isLive: false,
          location: null
        });
      }

      const location = await dbStore.getLatestBusLocation(activeTrip.trip_id);
      if (!location) {
        return res.json({
          success: true,
          status: 'GPS Unavailable',
          trip: activeTrip,
          isLive: false,
          location: null
        });
      }

      // Check if location is stale (>30s)
      const now = new Date();
      const receivedAt = new Date(location.received_at || location.device_timestamp);
      const ageSeconds = Math.max(0, Math.floor((now - receivedAt) / 1000));
      const isStale = ageSeconds > STALE_GPS_THRESHOLD_SECONDS;

      // Calculate ETA to student's assigned stop
      let etaMinutes = null;
      let distanceKm = null;
      if (details.stop && details.stop.latitude && details.stop.longitude) {
        const straightKm = calculateHaversineDistanceKm(
          location.latitude,
          location.longitude,
          details.stop.latitude,
          details.stop.longitude
        );
        // Multiply by 1.25 road-factor for realistic street network approximation
        distanceKm = parseFloat((straightKm * 1.25).toFixed(1));
        const estimatedSpeed = (location.speed && location.speed > 5) ? location.speed : 30; // 30 km/h average
        etaMinutes = Math.max(1, Math.round((distanceKm / estimatedSpeed) * 60));
      }

      return res.json({
        success: true,
        tripId: activeTrip.trip_id,
        tripStatus: activeTrip.status,
        bus: details.bus,
        stop: details.stop,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          speed: location.speed,
          heading: location.heading,
          accuracy: location.accuracy,
          received_at: location.received_at,
          ageSeconds
        },
        isLive: !isStale && activeTrip.status === 'Active',
        isStale,
        eta: {
          minutes: etaMinutes,
          distanceKm,
          calculatedAt: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('[StudentController.getBusLocation]', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve live bus location.' });
    }
  },

  async getTrip(req, res) {
    try {
      const details = await dbStore.getStudentAssignmentDetails(req.user.user_id);
      if (!details || !details.activeTrip) {
        return res.json({ success: true, trip: null });
      }
      const trip = await dbStore.getTripById(details.activeTrip.trip_id);
      return res.json({ success: true, trip });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve trip details.' });
    }
  },

  async getRouteDetails(req, res) {
    try {
      const { routeId } = req.params;
      const route = await dbStore.getRouteById(routeId);
      if (!route) {
        return res.status(404).json({ success: false, error: 'Route not found.' });
      }
      return res.json({ success: true, route });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve route details.' });
    }
  },

  async getNotifications(req, res) {
    try {
      const notifications = await dbStore.getUserNotifications(req.user.user_id);
      return res.json({ success: true, notifications });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve notifications.' });
    }
  },

  async getFleetLocations(req, res) {
    try {
      const buses = await dbStore.getAllBuses();
      const trips = await dbStore.getAllTrips();

      const fleet = buses.map(bus => {
        const trip = trips.find(t => t.bus_id === bus.bus_id && (t.status === 'Active' || t.status === 'Paused'));
        return {
          bus_id: bus.bus_id,
          bus_label: bus.bus_label,
          registration_no: bus.registration_no,
          driver_name: bus.driver_name,
          capacity: bus.capacity,
          current_occupancy: bus.current_occupancy,
          status: bus.status,
          trip: trip || null,
          location: trip?.latestLocation || null
        };
      });

      return res.json({ success: true, fleet });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve fleet locations.' });
    }
  }
};

module.exports = studentController;
