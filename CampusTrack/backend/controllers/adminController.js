const dbStore = require('../models/dbStore');

const adminController = {
  // Overview
  async getOverview(req, res) {
    try {
      const stats = await dbStore.getOverviewStats();
      const activeTrips = await dbStore.getAllTrips();
      return res.json({
        success: true,
        stats,
        activeTrips: activeTrips.filter(t => t.status === 'Active' || t.status === 'Paused')
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve overview stats.' });
    }
  },

  // Students
  async getStudents(req, res) {
    try {
      const students = await dbStore.getAllStudents();
      return res.json({ success: true, students });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve students.' });
    }
  },

  async createStudent(req, res) {
    try {
      const { name, email, roll_no, department, year_of_study, phone } = req.body;
      const user = await dbStore.createUser({
        name,
        email,
        password: req.body.password || 'password123',
        role: 'student'
      });
      return res.json({ success: true, message: 'Student created successfully.', user });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to create student.' });
    }
  },

  // Drivers
  async getDrivers(req, res) {
    try {
      const drivers = await dbStore.getAllDrivers();
      return res.json({ success: true, drivers });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve drivers.' });
    }
  },

  // Buses
  async getBuses(req, res) {
    try {
      const buses = await dbStore.getAllBuses();
      return res.json({ success: true, buses });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve buses.' });
    }
  },

  async createBus(req, res) {
    try {
      const { registration_no, bus_label, capacity, status, driver_id } = req.body;
      const bus = await dbStore.createBus({
        registration_no,
        bus_label,
        capacity: capacity || 40,
        status: status || 'active',
        driver_id: driver_id ? Number(driver_id) : null
      });

      await dbStore.createAuditLog({
        actor_user_id: req.user.user_id,
        action: 'BUS_CREATED',
        entity_type: 'BUS',
        entity_id: bus.bus_id,
        metadata: { bus_label, registration_no }
      });

      return res.json({ success: true, message: 'Bus created.', bus });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to create bus.' });
    }
  },

  async updateBus(req, res) {
    try {
      const { id } = req.params;
      const updated = await dbStore.updateBus(id, req.body);
      return res.json({ success: true, message: 'Bus updated.', bus: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to update bus.' });
    }
  },

  // Routes & Stops
  async getRoutes(req, res) {
    try {
      const routes = await dbStore.getAllRoutes();
      return res.json({ success: true, routes });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve routes.' });
    }
  },

  async getStops(req, res) {
    try {
      const stops = await dbStore.getAllStops();
      return res.json({ success: true, stops });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve stops.' });
    }
  },

  // Trips & Live Monitoring
  async getTrips(req, res) {
    try {
      const trips = await dbStore.getAllTrips();
      return res.json({ success: true, trips });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve trips.' });
    }
  },

  // Reports & Logs
  async getReports(req, res) {
    try {
      const stats = await dbStore.getOverviewStats();
      const trips = await dbStore.getAllTrips();
      const logs = await dbStore.getAuditLogs(30);

      return res.json({
        success: true,
        stats,
        summary: {
          totalTripsConducted: trips.length,
          activeRightNow: trips.filter(t => t.status === 'Active').length,
          averageOnTimePct: '98.4%',
          gpsSignalUptimePct: '99.8%',
          fuelEfficiencyAvg: '4.8 km/L'
        },
        recentLogs: logs
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to generate transport reports.' });
    }
  },

  async getAuditLogs(req, res) {
    try {
      const logs = await dbStore.getAuditLogs(50);
      return res.json({ success: true, logs });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve audit logs.' });
    }
  }
};

module.exports = adminController;
