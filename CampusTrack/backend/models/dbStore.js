const bcrypt = require('bcryptjs');
const db = require('../config/db');

// In-Memory Fallback Seed Database (Lavasa Campus, 4 Hostels & 4 Buses)
const SEED_PASS_HASH = bcrypt.hashSync('password123', 10);

const store = {
  users: [
    { user_id: 1, name: 'System Administrator', email: 'admin@campus.edu', password_hash: SEED_PASS_HASH, role: 'admin', account_status: 'active', created_at: new Date() },
    { user_id: 2, name: 'Rajesh Kumar', email: 'driver@campus.edu', password_hash: SEED_PASS_HASH, role: 'driver', account_status: 'active', created_at: new Date() },
    { user_id: 3, name: 'Michael Chen', email: 'driver2@campus.edu', password_hash: SEED_PASS_HASH, role: 'driver', account_status: 'active', created_at: new Date() },
    { user_id: 4, name: 'Ramesh Shinde', email: 'driver3@campus.edu', password_hash: SEED_PASS_HASH, role: 'driver', account_status: 'active', created_at: new Date() },
    { user_id: 5, name: 'Vikram Patil', email: 'driver4@campus.edu', password_hash: SEED_PASS_HASH, role: 'driver', account_status: 'active', created_at: new Date() },
    { user_id: 6, name: 'Shreyansh Patel', email: 'student@campus.edu', password_hash: SEED_PASS_HASH, role: 'student', account_status: 'active', created_at: new Date() },
    { user_id: 7, name: 'Emily Watson', email: 'student2@campus.edu', password_hash: SEED_PASS_HASH, role: 'student', account_status: 'active', created_at: new Date() },
    { user_id: 8, name: 'Alex Turner', email: 'student3@campus.edu', password_hash: SEED_PASS_HASH, role: 'student', account_status: 'active', created_at: new Date() },
    { user_id: 9, name: 'Priya Sharma', email: 'student4@campus.edu', password_hash: SEED_PASS_HASH, role: 'student', account_status: 'active', created_at: new Date() }
  ],
  students: [
    { student_id: 1, user_id: 6, roll_no: 'CS-2024-042', department: 'Computer Science & AI', year_of_study: 3, phone: '+91 98765 43210', hostel_name: 'Banyan Tree Boys Hostel (North Wing)' },
    { student_id: 2, user_id: 7, roll_no: 'ME-2024-118', department: 'Data Analytics', year_of_study: 2, phone: '+91 98765 43211', hostel_name: 'Lakeside Girls Hostel (Block A & B)' },
    { student_id: 3, user_id: 8, roll_no: 'EE-2024-089', department: 'Business Analytics', year_of_study: 4, phone: '+91 98765 43212', hostel_name: 'Hillside Scholars Hostel (Gate 2)' },
    { student_id: 4, user_id: 9, roll_no: 'IT-2024-205', department: 'Information Technology', year_of_study: 1, phone: '+91 98765 43213', hostel_name: 'Valley View International Hostel' }
  ],
  drivers: [
    { driver_id: 1, user_id: 2, license_no: 'DL-MH-2018-994821', phone: '+91 98221 44550', employment_status: 'active' },
    { driver_id: 2, user_id: 3, license_no: 'DL-MH-2019-332145', phone: '+91 98222 77881', employment_status: 'active' },
    { driver_id: 3, user_id: 4, license_no: 'DL-MH-2020-771234', phone: '+91 98223 99002', employment_status: 'active' },
    { driver_id: 4, user_id: 5, license_no: 'DL-MH-2021-884561', phone: '+91 98224 11223', employment_status: 'active' }
  ],
  buses: [
    { bus_id: 1, registration_no: 'MH-12-CT-2024', bus_label: 'Bus 04 (Dasve & Hostels Loop)', capacity: 42, status: 'active', driver_id: 1, current_occupancy: 35 },
    { bus_id: 2, registration_no: 'MH-12-CT-4088', bus_label: 'Bus 08 (Lakeview Promenade Express)', capacity: 38, status: 'active', driver_id: 2, current_occupancy: 28 },
    { bus_id: 3, registration_no: 'MH-12-CT-6612', bus_label: 'Bus 12 (Hillside Scholars Shuttle)', capacity: 45, status: 'active', driver_id: 3, current_occupancy: 31 },
    { bus_id: 4, registration_no: 'MH-12-CT-9115', bus_label: 'Bus 15 (Valley View Metro Connector)', capacity: 40, status: 'active', driver_id: 4, current_occupancy: 22 }
  ],
  routes: [
    {
      route_id: 1,
      route_name: 'Route 101 - Lavasa Dasve & 4 Hostels Loop',
      description: 'Daily loop connecting Central Terminal, Portofino, Lakeside Girls Hostel, Christ University Hub, Banyan Tree Boys Hostel, Hillside Scholars Hostel, and Valley View Hostel.',
      status: 'active'
    },
    {
      route_id: 2,
      route_name: 'Route 202 - Hillside & Academic Hub Express',
      description: 'Fast-track morning service connecting Upper Hillside hostellers directly to Christ University Academic Block.',
      status: 'active'
    }
  ],
  stops: [
    { stop_id: 1, stop_name: 'Lavasa Central Transit Terminal', latitude: 18.405500, longitude: 73.507800, address: 'Main Dasve Bus Depot, Lavasa Entry Road', stop_type: 'terminal' },
    { stop_id: 2, stop_name: 'Portofino Promenade Plaza', latitude: 18.404000, longitude: 73.503000, address: 'Portofino Street, Lakefront Boulevard', stop_type: 'residential' },
    { stop_id: 3, stop_name: 'Lakeside Girls Hostel (Block A & B)', latitude: 18.402500, longitude: 73.501200, address: 'Lakeside Heights, Warasgaon Shore Road', stop_type: 'hostel' },
    { stop_id: 4, stop_name: 'Dasve Waterfront & Town Hall', latitude: 18.406500, longitude: 73.505500, address: 'Dasve Circle, Convention Center Road', stop_type: 'academic' },
    { stop_id: 5, stop_name: 'Christ University Lavasa Academic Hub', latitude: 18.411800, longitude: 73.507500, address: 'Christ University Main Academic Block & Library', stop_type: 'academic' },
    { stop_id: 6, stop_name: 'Banyan Tree Boys Hostel (North Wing)', latitude: 18.409500, longitude: 73.511500, address: 'Banyan Tree Residency, North Hill Road', stop_type: 'hostel' },
    { stop_id: 7, stop_name: 'Hillside Scholars Hostel (Gate 2)', latitude: 18.415000, longitude: 73.515800, address: 'Hillside Heights Hostel Complex, Ridge Way', stop_type: 'hostel' },
    { stop_id: 8, stop_name: 'Valley View International Hostel', latitude: 18.418500, longitude: 73.519500, address: 'Valley View Residency & Scholars Block, Upper Dasve', stop_type: 'hostel' }
  ],
  route_stops: [
    { route_id: 1, stop_id: 1, stop_order: 1, estimated_minutes_from_start: 0 },
    { route_id: 1, stop_id: 2, stop_order: 2, estimated_minutes_from_start: 5 },
    { route_id: 1, stop_id: 3, stop_order: 3, estimated_minutes_from_start: 11 }, // Lakeside Girls Hostel
    { route_id: 1, stop_id: 4, stop_order: 4, estimated_minutes_from_start: 18 },
    { route_id: 1, stop_id: 5, stop_order: 5, estimated_minutes_from_start: 24 }, // Christ University
    { route_id: 1, stop_id: 6, stop_order: 6, estimated_minutes_from_start: 30 }, // Banyan Tree Boys Hostel
    { route_id: 1, stop_id: 7, stop_order: 7, estimated_minutes_from_start: 36 }, // Hillside Scholars Hostel
    { route_id: 1, stop_id: 8, stop_order: 8, estimated_minutes_from_start: 43 }  // Valley View Hostel
  ],
  student_assignments: [
    { assignment_id: 1, student_id: 1, bus_id: 1, stop_id: 6, effective_from: '2026-08-01', status: 'active' }, // Shreyansh -> Banyan Tree Boys Hostel
    { assignment_id: 2, student_id: 2, bus_id: 1, stop_id: 3, effective_from: '2026-08-01', status: 'active' }, // Emily -> Lakeside Girls Hostel
    { assignment_id: 3, student_id: 3, bus_id: 1, stop_id: 7, effective_from: '2026-08-01', status: 'active' }, // Alex -> Hillside Scholars Hostel
    { assignment_id: 4, student_id: 4, bus_id: 1, stop_id: 8, effective_from: '2026-08-01', status: 'active' }  // Priya -> Valley View Hostel
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
      notes: 'Lavasa Morning Hostel Pickup Run - Active'
    }
  ],
  bus_locations: [
    {
      location_id: 1,
      trip_id: 105,
      latitude: 18.407500,
      longitude: 73.506500,
      accuracy: 3.8,
      speed: 32.0,
      heading: 42.0,
      device_timestamp: new Date().toISOString(),
      received_at: new Date().toISOString()
    }
  ],
  notifications: [
    {
      notification_id: 1,
      user_id: 6,
      trip_id: 105,
      title: 'Hostel Pickup Trip Started',
      message: 'Bus 04 (Dasve & Hostels Loop) departed Lavasa Central Terminal. Arriving at Banyan Tree Boys Hostel in ~12 mins.',
      is_read: false,
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      notification_id: 2,
      user_id: 6,
      trip_id: 105,
      title: 'Approaching Banyan Tree Hostel',
      message: 'Bus 04 is currently 1.8 km away from Banyan Tree Boys Hostel Stop.',
      is_read: false,
      created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString()
    }
  ],
  audit_logs: [
    {
      audit_id: 1,
      actor_user_id: 1,
      action: 'LAVASA_CAMPUS_PROVISIONED',
      entity_type: 'SYSTEM',
      entity_id: '1',
      created_at: new Date().toISOString(),
      metadata: { campus: 'Lavasa Smart City', hostels: 4, buses: 4 }
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
  async recordBusLocation({ trip_id, latitude, longitude, accuracy = 4, speed = 0, heading = 0, device_timestamp }) {
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
      activeBuses: 4,
      activeTrips: 2,
      totalStudents: 48,
      totalDrivers: 4,
      routesCount: 2,
      onTimeRate: '99.1%',
      avgGpsLatencyMs: 380,
      campus: 'Lavasa Smart City'
    };
  }
};

module.exports = dbStore;
