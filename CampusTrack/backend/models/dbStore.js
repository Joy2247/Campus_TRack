const bcrypt = require('bcryptjs');
const db = require('../config/db');

// In-Memory Fallback Seed Database
// Pre-seeded with password "password123" ($2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e)
const SEED_PASS_HASH = bcrypt.hashSync('password123', 10);

const store = {
  users: [
    { user_id: 1, name: 'System Administrator', email: 'admin@campus.edu', password_hash: SEED_PASS_HASH, role: 'admin', account_status: 'active', created_at: new Date() },
    { user_id: 2, name: 'Rajesh Kumar', email: 'driver@campus.edu', password_hash: SEED_PASS_HASH, role: 'driver', account_status: 'active', created_at: new Date() },
    { user_id: 3, name: 'Michael Chen', email: 'driver2@campus.edu', password_hash: SEED_PASS_HASH, role: 'driver', account_status: 'active', created_at: new Date() },
    { user_id: 4, name: 'Shreyansh Patel', email: 'student@campus.edu', password_hash: SEED_PASS_HASH, role: 'student', account_status: 'active', created_at: new Date() },
    { user_id: 5, name: 'Emily Watson', email: 'student2@campus.edu', password_hash: SEED_PASS_HASH, role: 'student', account_status: 'active', created_at: new Date() },
    { user_id: 6, name: 'Alex Turner', email: 'student3@campus.edu', password_hash: SEED_PASS_HASH, role: 'student', account_status: 'active', created_at: new Date() }
  ],
  students: [
    { student_id: 1, user_id: 4, roll_no: 'CS-2024-042', department: 'Computer Science & Engineering', year_of_study: 3, phone: '+1 (555) 234-5678' },
    { student_id: 2, user_id: 5, roll_no: 'ME-2024-118', department: 'Mechanical Engineering', year_of_study: 2, phone: '+1 (555) 345-6789' },
    { student_id: 3, user_id: 6, roll_no: 'EE-2024-089', department: 'Electrical Engineering', year_of_study: 4, phone: '+1 (555) 456-7890' }
  ],
  drivers: [
    { driver_id: 1, user_id: 2, license_no: 'DL-KA-2018-994821', phone: '+1 (555) 890-1234', employment_status: 'active' },
    { driver_id: 2, user_id: 3, license_no: 'DL-KA-2019-332145', phone: '+1 (555) 901-2345', employment_status: 'active' }
  ],
  buses: [
    { bus_id: 1, registration_no: 'KA-04-E-2024', bus_label: 'Bus 04 (South Express)', capacity: 42, status: 'active', driver_id: 1, current_occupancy: 34 },
    { bus_id: 2, registration_no: 'KA-04-E-5512', bus_label: 'Bus 07 (North Metro Shuttle)', capacity: 38, status: 'active', driver_id: 2, current_occupancy: 28 },
    { bus_id: 3, registration_no: 'KA-04-E-8830', bus_label: 'Bus 12 (Tech Park Shuttle)', capacity: 45, status: 'maintenance', driver_id: null, current_occupancy: 0 }
  ],
  routes: [
    {
      route_id: 1,
      route_name: 'Route 105 - West Campus to Main Terminal',
      description: 'Daily morning pickup and evening drop connecting Westside, St. Peter Square, and Main University Hub.',
      status: 'active'
    },
    {
      route_id: 2,
      route_name: 'Route 202 - North Valley & Metro Hub',
      description: 'Fast-track express line connecting North Metro terminal, Tech Park, and East Campus.',
      status: 'active'
    }
  ],
  stops: [
    { stop_id: 1, stop_name: 'Westside Transit Center', latitude: 18.520430, longitude: 73.856743, address: 'Bay 4, Westside Bus Depot' },
    { stop_id: 2, stop_name: "St. Peter's Square Stop", latitude: 18.528350, longitude: 73.864210, address: 'Opposite City Library, 789 College Blvd' },
    { stop_id: 3, stop_name: 'Greenwood Highlands', latitude: 18.535620, longitude: 73.871150, address: 'Greenwood Gate 2, Ring Road' },
    { stop_id: 4, stop_name: 'South Campus Junction', latitude: 18.542890, longitude: 73.878540, address: 'Near South Gate Overpass' },
    { stop_id: 5, stop_name: 'University Engineering Annex', latitude: 18.548900, longitude: 73.886320, address: 'Building B Drop-off Point' },
    { stop_id: 6, stop_name: 'Main Campus Central Terminal', latitude: 18.553200, longitude: 73.893450, address: 'University Central Oval Terminal' }
  ],
  route_stops: [
    { route_id: 1, stop_id: 1, stop_order: 1, estimated_minutes_from_start: 0 },
    { route_id: 1, stop_id: 2, stop_order: 2, estimated_minutes_from_start: 8 },
    { route_id: 1, stop_id: 3, stop_order: 3, estimated_minutes_from_start: 16 },
    { route_id: 1, stop_id: 4, stop_order: 4, estimated_minutes_from_start: 25 },
    { route_id: 1, stop_id: 5, stop_order: 5, estimated_minutes_from_start: 33 },
    { route_id: 1, stop_id: 6, stop_order: 6, estimated_minutes_from_start: 42 }
  ],
  student_assignments: [
    { assignment_id: 1, student_id: 1, bus_id: 1, stop_id: 2, effective_from: '2026-08-01', status: 'active' },
    { assignment_id: 2, student_id: 2, bus_id: 1, stop_id: 3, effective_from: '2026-08-01', status: 'active' },
    { assignment_id: 3, student_id: 3, bus_id: 1, stop_id: 4, effective_from: '2026-08-01', status: 'active' }
  ],
  trips: [
    {
      trip_id: 105,
      bus_id: 1,
      driver_id: 1,
      route_id: 1,
      status: 'Active',
      scheduled_start: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      actual_start: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      actual_end: null,
      notes: 'Morning Run - On Schedule'
    }
  ],
  bus_locations: [
    {
      location_id: 1,
      trip_id: 105,
      latitude: 18.524100,
      longitude: 73.860100,
      accuracy: 4.2,
      speed: 34.5,
      heading: 58.0,
      device_timestamp: new Date().toISOString(),
      received_at: new Date().toISOString()
    }
  ],
  notifications: [
    {
      notification_id: 1,
      user_id: 4,
      trip_id: 105,
      title: 'Trip Started',
      message: 'Bus 04 departed Westside Transit Center. Expected at St. Peter\'s Square in ~7 mins.',
      is_read: false,
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      notification_id: 2,
      user_id: 4,
      trip_id: 105,
      title: 'Approaching Stop',
      message: 'Bus 04 is currently 2.4 km away from your stop.',
      is_read: false,
      created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString()
    }
  ],
  audit_logs: [
    {
      audit_id: 1,
      actor_user_id: 1,
      action: 'SYSTEM_INITIALIZATION',
      entity_type: 'SYSTEM',
      entity_id: '1',
      created_at: new Date().toISOString(),
      metadata: { version: '1.0', engine: 'CampusTrack v1.0' }
    }
  ]
};

// ==========================================
// Database Model & Repository Methods
// ==========================================

const dbStore = {
  // Users
  async findUserByEmail(email) {
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  async findUserById(userId) {
    const user = store.users.find(u => u.user_id === Number(userId));
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  },

  async createUser({ name, email, password, role, account_status = 'active' }) {
    const password_hash = await bcrypt.hash(password, 10);
    const user_id = store.users.length + 1;
    const newUser = { user_id, name, email, password_hash, role, account_status, created_at: new Date() };
    store.users.push(newUser);
    return { user_id, name, email, role, account_status };
  },

  // Students
  async getStudentByUserId(userId) {
    const student = store.students.find(s => s.user_id === Number(userId));
    if (!student) return null;
    const user = store.users.find(u => u.user_id === Number(userId));
    return { ...student, name: user ? user.name : '', email: user ? user.email : '' };
  },

  async getAllStudents() {
    return store.students.map(s => {
      const user = store.users.find(u => u.user_id === s.user_id) || {};
      const assignment = store.student_assignments.find(a => a.student_id === s.student_id && a.status === 'active');
      const bus = assignment ? store.buses.find(b => b.bus_id === assignment.bus_id) : null;
      const stop = assignment ? store.stops.find(st => st.stop_id === assignment.stop_id) : null;
      return {
        ...s,
        name: user.name,
        email: user.email,
        assigned_bus: bus ? bus.bus_label : 'Unassigned',
        assigned_stop: stop ? stop.stop_name : 'Unassigned'
      };
    });
  },

  // Drivers
  async getDriverByUserId(userId) {
    const driver = store.drivers.find(d => d.user_id === Number(userId));
    if (!driver) return null;
    const user = store.users.find(u => u.user_id === Number(userId));
    const bus = store.buses.find(b => b.driver_id === driver.driver_id);
    return { ...driver, name: user ? user.name : '', email: user ? user.email : '', assigned_bus: bus || null };
  },

  async getAllDrivers() {
    return store.drivers.map(d => {
      const user = store.users.find(u => u.user_id === d.user_id) || {};
      const bus = store.buses.find(b => b.driver_id === d.driver_id);
      return {
        ...d,
        name: user.name,
        email: user.email,
        assigned_bus: bus ? bus.bus_label : 'None'
      };
    });
  },

  // Student Assignment & Transport Info
  async getStudentAssignmentDetails(userId) {
    const student = store.students.find(s => s.user_id === Number(userId));
    if (!student) return null;

    const assignment = store.student_assignments.find(a => a.student_id === student.student_id && a.status === 'active');
    if (!assignment) return null;

    const bus = store.buses.find(b => b.bus_id === assignment.bus_id);
    const stop = store.stops.find(s => s.stop_id === assignment.stop_id);
    const activeTrip = store.trips.find(t => t.bus_id === bus.bus_id && (t.status === 'Active' || t.status === 'Scheduled' || t.status === 'Paused'));
    const route = activeTrip ? store.routes.find(r => r.route_id === activeTrip.route_id) : store.routes[0];

    const driver = bus && bus.driver_id ? store.drivers.find(d => d.driver_id === bus.driver_id) : null;
    const driverUser = driver ? store.users.find(u => u.user_id === driver.user_id) : null;

    return {
      student,
      assignment,
      bus: bus ? {
        ...bus,
        driver_name: driverUser ? driverUser.name : 'Unassigned',
        driver_phone: driver ? driver.phone : 'N/A'
      } : null,
      stop,
      route,
      activeTrip: activeTrip || null
    };
  },

  // Buses
  async getAllBuses() {
    return store.buses.map(b => {
      const driver = b.driver_id ? store.drivers.find(d => d.driver_id === b.driver_id) : null;
      const driverUser = driver ? store.users.find(u => u.user_id === driver.user_id) : null;
      const activeTrip = store.trips.find(t => t.bus_id === b.bus_id && (t.status === 'Active' || t.status === 'Paused'));
      return {
        ...b,
        driver_name: driverUser ? driverUser.name : 'Unassigned',
        active_trip: activeTrip || null
      };
    });
  },

  async getBusById(busId) {
    return store.buses.find(b => b.bus_id === Number(busId)) || null;
  },

  async createBus(busData) {
    const bus_id = store.buses.length + 1;
    const newBus = { bus_id, ...busData, current_occupancy: 0 };
    store.buses.push(newBus);
    return newBus;
  },

  async updateBus(busId, updateData) {
    const idx = store.buses.findIndex(b => b.bus_id === Number(busId));
    if (idx === -1) return null;
    store.buses[idx] = { ...store.buses[idx], ...updateData };
    return store.buses[idx];
  },

  // Routes & Stops
  async getAllRoutes() {
    return store.routes.map(r => {
      const stops = store.route_stops
        .filter(rs => rs.route_id === r.route_id)
        .sort((a, b) => a.stop_order - b.stop_order)
        .map(rs => {
          const stopInfo = store.stops.find(s => s.stop_id === rs.stop_id);
          return { ...rs, ...stopInfo };
        });
      return { ...r, stops };
    });
  },

  async getRouteById(routeId) {
    const route = store.routes.find(r => r.route_id === Number(routeId));
    if (!route) return null;
    const stops = store.route_stops
      .filter(rs => rs.route_id === route.route_id)
      .sort((a, b) => a.stop_order - b.stop_order)
      .map(rs => {
        const stopInfo = store.stops.find(s => s.stop_id === rs.stop_id);
        return { ...rs, ...stopInfo };
      });
    return { ...route, stops };
  },

  async getAllStops() {
    return store.stops;
  },

  // Trips
  async getTripById(tripId) {
    const trip = store.trips.find(t => t.trip_id === Number(tripId));
    if (!trip) return null;
    const bus = store.buses.find(b => b.bus_id === trip.bus_id);
    const route = store.routes.find(r => r.route_id === trip.route_id);
    const driver = store.drivers.find(d => d.driver_id === trip.driver_id);
    const driverUser = driver ? store.users.find(u => u.user_id === driver.user_id) : null;
    const latestLocation = await this.getLatestBusLocation(trip.trip_id);

    return {
      ...trip,
      bus,
      route,
      driver: { ...driver, name: driverUser ? driverUser.name : 'N/A' },
      latestLocation
    };
  },

  async getActiveTripForDriver(userId) {
    const driver = store.drivers.find(d => d.user_id === Number(userId));
    if (!driver) return null;

    let trip = store.trips.find(t => t.driver_id === driver.driver_id && (t.status === 'Active' || t.status === 'Paused'));
    if (!trip) {
      // Find upcoming scheduled trip
      trip = store.trips.find(t => t.driver_id === driver.driver_id && t.status === 'Scheduled');
    }
    if (!trip) return null;
    return this.getTripById(trip.trip_id);
  },

  async getAllTrips() {
    return Promise.all(store.trips.map(t => this.getTripById(t.trip_id)));
  },

  async updateTripStatus(tripId, status, { actual_start, actual_end, notes } = {}) {
    const trip = store.trips.find(t => t.trip_id === Number(tripId));
    if (!trip) return null;
    trip.status = status;
    if (actual_start) trip.actual_start = actual_start;
    if (actual_end) trip.actual_end = actual_end;
    if (notes) trip.notes = notes;
    return trip;
  },

  // Bus Locations (GPS)
  async recordBusLocation({ trip_id, latitude, longitude, accuracy = 5, speed = 0, heading = 0, device_timestamp }) {
    const location_id = store.bus_locations.length + 1;
    const newLocation = {
      location_id,
      trip_id: Number(trip_id),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      accuracy: parseFloat(accuracy),
      speed: parseFloat(speed),
      heading: parseFloat(heading),
      device_timestamp: device_timestamp || new Date().toISOString(),
      received_at: new Date().toISOString()
    };
    store.bus_locations.push(newLocation);
    return newLocation;
  },

  async getLatestBusLocation(tripId) {
    const locs = store.bus_locations.filter(l => l.trip_id === Number(tripId));
    if (!locs.length) return null;
    return locs[locs.length - 1];
  },

  async getLocationHistory(tripId, limit = 50) {
    const locs = store.bus_locations.filter(l => l.trip_id === Number(tripId));
    return locs.slice(-limit);
  },

  // Notifications
  async getUserNotifications(userId) {
    return store.notifications
      .filter(n => n.user_id === Number(userId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createNotification({ user_id, trip_id, title, message }) {
    const notification_id = store.notifications.length + 1;
    const notif = {
      notification_id,
      user_id: Number(user_id),
      trip_id: trip_id ? Number(trip_id) : null,
      title,
      message,
      is_read: false,
      created_at: new Date().toISOString()
    };
    store.notifications.push(notif);
    return notif;
  },

  // Audit Logs
  async createAuditLog({ actor_user_id, action, entity_type, entity_id, metadata }) {
    const audit_id = store.audit_logs.length + 1;
    const log = {
      audit_id,
      actor_user_id: actor_user_id ? Number(actor_user_id) : null,
      action,
      entity_type,
      entity_id: String(entity_id || ''),
      created_at: new Date().toISOString(),
      metadata: metadata || {}
    };
    store.audit_logs.push(log);
    return log;
  },

  async getAuditLogs(limit = 20) {
    return store.audit_logs.slice(-limit).reverse();
  },

  // Dashboard Overview Metrics
  async getOverviewStats() {
    const activeTrips = store.trips.filter(t => t.status === 'Active').length;
    const activeBuses = store.buses.filter(b => b.status === 'active').length;
    const totalStudents = store.students.length;
    const totalDrivers = store.drivers.length;
    const routesCount = store.routes.length;

    return {
      activeBuses,
      activeTrips,
      totalStudents,
      totalDrivers,
      routesCount,
      onTimeRate: '98.4%',
      avgGpsLatencyMs: 420
    };
  }
};

module.exports = dbStore;
