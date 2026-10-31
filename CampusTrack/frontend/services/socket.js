// ==========================================================================
// CampusTrack - Real-Time Socket.IO Client Service
// ==========================================================================

class SocketService {
  constructor() {
    this.socket = null;
    this.currentTripId = null;
    this.callbacks = {
      locationUpdate: [],
      tripStarted: [],
      tripPaused: [],
      tripResumed: [],
      tripCompleted: [],
      tripAlert: [],
      statusChange: []
    };
    this.connected = false;
  }

  connect(token) {
    if (this.socket && this.socket.connected) {
      return;
    }

    if (typeof io === 'undefined') {
      console.warn('[Socket] Socket.IO client library not loaded. Real-time updates will use polling.');
      return;
    }

    const authToken = token || window.apiService.getToken();

    this.socket = io(window.location.origin, {
      auth: { token: authToken },
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to real-time tracking gateway. ID:', this.socket.id);
      this.connected = true;
      this.trigger('statusChange', { connected: true });

      if (this.currentTripId) {
        this.joinTrip(this.currentTripId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[Socket] Disconnected:', reason);
      this.connected = false;
      this.trigger('statusChange', { connected: false, reason });
    });

    this.socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
      this.connected = false;
      this.trigger('statusChange', { connected: false, error: err.message });
    });

    // Tracking Events
    this.socket.on('location_update', (data) => {
      this.trigger('locationUpdate', data);
    });

    this.socket.on('trip_started', (data) => {
      this.trigger('tripStarted', data);
    });

    this.socket.on('trip_paused', (data) => {
      this.trigger('tripPaused', data);
    });

    this.socket.on('trip_resumed', (data) => {
      this.trigger('tripResumed', data);
    });

    this.socket.on('trip_completed', (data) => {
      this.trigger('tripCompleted', data);
    });

    this.socket.on('trip_alert', (data) => {
      this.trigger('tripAlert', data);
    });
  }

  joinTrip(tripId) {
    this.currentTripId = Number(tripId);
    if (this.socket && this.socket.connected) {
      console.log(`[Socket] Joining trip room: trip_${this.currentTripId}`);
      this.socket.emit('join_trip', { tripId: this.currentTripId });
    }
  }

  sendLocation(payload) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('bus_location', payload);
    }
  }

  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  trigger(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in socket callback for ${event}:`, e);
        }
      });
    }
  }
}

window.socketService = new SocketService();
