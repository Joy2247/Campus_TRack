// ==========================================================================
// CampusTrack - REST API Service Client
// ==========================================================================

const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? `${window.location.origin}/api`
  : '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('campustrack_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('campustrack_token', token);
    } else {
      localStorage.removeItem('campustrack_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('campustrack_token');
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${API_BASE}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...(options.headers || {})
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`[API] Error on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth Endpoints
  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    }
    this.setToken(null);
  }

  // Student Endpoints
  async getStudentAssignment() {
    return this.request('/student/assignment');
  }

  async getStudentBusLocation(busId) {
    const ep = busId ? `/student/bus/${busId}/location` : '/student/bus';
    return this.request(ep);
  }

  async getStudentTrip() {
    return this.request('/student/trip');
  }

  async getRouteDetails(routeId) {
    return this.request(`/student/route/${routeId}`);
  }

  async getStudentNotifications() {
    return this.request('/student/notifications');
  }

  async getFleetLocations() {
    return this.request('/student/fleet/locations');
  }

  // Driver Endpoints
  async getDriverAssignedTrip() {
    return this.request('/driver/assigned-trip');
  }

  async startDriverTrip() {
    return this.request('/driver/trips/start', { method: 'POST' });
  }

  async pauseDriverTrip(tripId, reason) {
    return this.request(`/driver/trips/${tripId}/pause`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  async resumeDriverTrip(tripId) {
    return this.request(`/driver/trips/${tripId}/resume`, { method: 'POST' });
  }

  async endDriverTrip(tripId) {
    return this.request(`/driver/trips/${tripId}/end`, { method: 'POST' });
  }

  async sendDriverLocation(payload) {
    return this.request('/driver/location', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async reportDriverIssue(payload) {
    return this.request('/driver/issue', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Admin Endpoints
  async getAdminOverview() {
    return this.request('/admin/overview');
  }

  async getAdminStudents() {
    return this.request('/admin/students');
  }

  async getAdminDrivers() {
    return this.request('/admin/drivers');
  }

  async getAdminBuses() {
    return this.request('/admin/buses');
  }

  async createAdminBus(busData) {
    return this.request('/admin/buses', {
      method: 'POST',
      body: JSON.stringify(busData)
    });
  }

  async getAdminRoutes() {
    return this.request('/admin/routes');
  }

  async getAdminTrips() {
    return this.request('/admin/trips');
  }

  async getAdminReports() {
    return this.request('/admin/reports');
  }

  async getAdminAuditLogs() {
    return this.request('/admin/audit-logs');
  }
}

window.apiService = new ApiService();
