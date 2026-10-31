// ==========================================================================
// CampusTrack - Master Application Orchestrator
// Coordinates Services, Components, State, Sockets, and Role Views
// ==========================================================================

class CampusTrackApp {
  constructor() {
    this.currentUser = {
      user_id: 4,
      name: 'Shreyansh Patel',
      email: 'student@campus.edu',
      role: 'student'
    };
    this.currentRole = 'student';
    this.currentRoute = null;
    this.currentBus = null;
    this.currentTrip = null;
    this.assignedStop = null;
    this.latestLocation = null;
    this.lastLocationTime = Date.now();
    this.staleThresholdSeconds = 30;

    // Component instances
    this.sidebar = null;
    this.topbar = null;
    this.mapView = null;
    this.bottomCards = null;
    this.driverModal = null;
    this.adminModal = null;
    this.loginModal = null;
    this.routeModal = null;
    this.notifModal = null;
    this.sosModal = null;
    this.reportsModal = null;
  }

  async init() {
    console.log('[CampusTrack] Initializing system...');

    // 1. Initialize Components
    this.sidebar = new window.SidebarComponent('sidebarContainer');
    this.topbar = new window.TopbarComponent('topbarContainer');
    this.mapView = new window.MapViewComponent('mapContainer');
    this.bottomCards = new window.BottomCardsComponent('bottomCardsContainer');

    this.driverModal = new window.DriverModalComponent('driverModalContainer');
    this.adminModal = new window.AdminModalComponent('adminModalContainer');
    this.loginModal = new window.LoginModalComponent('loginModalContainer');
    this.routeModal = new window.RouteModalComponent('routeModalContainer');
    this.notifModal = new window.NotifModalComponent('notifModalContainer');
    this.sosModal = new window.SosModalComponent('sosModalContainer');
    this.reportsModal = new window.ReportsModalComponent('reportsModalContainer');

    // 2. Initial Render
    this.sidebar.render(this.currentUser, 'home');
    this.mapView.render();

    // 3. Authenticate with backend or verify token
    try {
      const meRes = await window.apiService.getMe();
      if (meRes && meRes.user) {
        this.currentUser = meRes.user;
        this.currentRole = meRes.user.role;
      }
    } catch (e) {
      // Auto-login default demo student if no valid token
      try {
        const loginRes = await window.apiService.login('student@campus.edu', 'password123');
        this.currentUser = loginRes.user;
      } catch (err) {
        console.log('[CampusTrack] Running with embedded demo user state.');
      }
    }

    // 4. Load Route & Assignment Data
    await this.loadInitialData();

    // 5. Connect Socket.IO
    this.initSockets();

    // 6. Start Stale GPS Heartbeat Monitor (SRS FR-RT-007)
    this.startHeartbeatMonitor();

    // 7. Auto-start route simulation for immediate visual gratification
    setTimeout(() => {
      window.gpsEngine.startSimulation(105, (loc) => {
        this.onGpsUpdate(loc);
      });
      window.toast?.success('CampusTrack live tracking connected to Bus 04.');
    }, 1200);
  }

  async loadInitialData() {
    try {
      // Load Route 1 (West Campus)
      const routeRes = await window.apiService.getRouteDetails(1);
      if (routeRes && routeRes.route) {
        this.currentRoute = routeRes.route;
      }

      // Load Student Assignment
      const assignRes = await window.apiService.getStudentAssignment();
      if (assignRes && assignRes.assignment) {
        const a = assignRes.assignment;
        this.assignedStop = a.stop;
        this.currentBus = a.bus;
        this.currentTrip = a.activeTrip;
      }
    } catch (e) {
      console.warn('Initial data loaded from fallback defaults.');
      this.currentRoute = {
        route_id: 1,
        route_name: 'Route 105 - West Campus to Main Terminal',
        stops: [
          { stop_id: 1, stop_order: 1, stop_name: 'Westside Transit Center', latitude: 18.520430, longitude: 73.856743, address: 'Bay 4, Westside Bus Depot' },
          { stop_id: 2, stop_order: 2, stop_name: "St. Peter's Square Stop", latitude: 18.528350, longitude: 73.864210, address: 'Opposite City Library, 789 College Blvd' },
          { stop_id: 3, stop_order: 3, stop_name: 'Greenwood Highlands', latitude: 18.535620, longitude: 73.871150, address: 'Greenwood Gate 2, Ring Road' },
          { stop_id: 4, stop_order: 4, stop_name: 'South Campus Junction', latitude: 18.542890, longitude: 73.878540, address: 'Near South Gate Overpass' },
          { stop_id: 5, stop_order: 5, stop_name: 'University Engineering Annex', latitude: 18.548900, longitude: 73.886320, address: 'Building B Drop-off Point' },
          { stop_id: 6, stop_order: 6, stop_name: 'Main Campus Central Terminal', latitude: 18.553200, longitude: 73.893450, address: 'University Central Oval Terminal' }
        ]
      };
      this.assignedStop = this.currentRoute.stops[1]; // St. Peter's Square Stop
      this.currentBus = {
        bus_id: 1,
        bus_label: 'Bus 04 (South Express)',
        registration_no: 'KA-04-E-2024',
        driver_name: 'Rajesh Kumar',
        capacity: 42,
        current_occupancy: 34
      };
      this.currentTrip = { trip_id: 105, status: 'Active' };
    }

    // Render Components with live data
    this.topbar.render({
      routes: [this.currentRoute],
      currentRouteId: this.currentRoute?.route_id || 1,
      currentRole: this.currentRole,
      isLive: true,
      isStale: false
    });

    if (this.currentRoute) {
      this.mapView.assignedStop = this.assignedStop;
      this.mapView.renderRoute(this.currentRoute);
    }

    this.bottomCards.render({
      stop: this.assignedStop,
      bus: this.currentBus,
      eta: { minutes: 7, distanceKm: 2.4 },
      location: { speed: 35, accuracy: 4.2 }
    });

    this.driverModal.render(this.currentTrip, this.currentBus);
  }

  initSockets() {
    window.socketService.connect();
    window.socketService.joinTrip(105);

    // Location update listener
    window.socketService.on('locationUpdate', (data) => {
      this.onGpsUpdate(data);
    });

    // Trip events
    window.socketService.on('tripStarted', (data) => {
      window.toast?.success('Trip Started: Bus 04 is now en-route.');
      this.topbar.updateLiveStatus({ isLive: true, isStale: false });
    });

    window.socketService.on('tripPaused', (data) => {
      window.toast?.warning(`Trip Paused: ${data.reason || 'Holding position'}`);
    });

    window.socketService.on('tripResumed', () => {
      window.toast?.info('Trip Resumed.');
    });

    window.socketService.on('tripCompleted', () => {
      window.toast?.info('Trip Completed: Destination reached.');
    });

    window.socketService.on('tripAlert', (data) => {
      window.toast?.warning(`Driver Alert: ${data.message}`);
    });
  }

  onGpsUpdate(loc) {
    this.latestLocation = loc;
    this.lastLocationTime = Date.now();

    // 1. Update Map Marker
    this.mapView.updateLiveLocation(loc);

    // 2. Calculate dynamic ETA to student's stop
    let etaMinutes = 7;
    let distanceKm = 2.4;

    if (this.assignedStop) {
      const R = 6371; // Earth radius km
      const dLat = (this.assignedStop.latitude - loc.latitude) * Math.PI / 180;
      const dLon = (this.assignedStop.longitude - loc.longitude) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(loc.latitude * Math.PI / 180) * Math.cos(this.assignedStop.latitude * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const straightKm = R * c;
      distanceKm = parseFloat((straightKm * 1.25).toFixed(1));
      const speedKmH = (loc.speed && loc.speed > 5) ? loc.speed : 30;
      etaMinutes = Math.max(1, Math.round((distanceKm / speedKmH) * 60));

      // Trigger proximity alert if bus is very close (<0.8 km)
      if (distanceKm <= 0.8 && !this._proximityAlertFired) {
        this._proximityAlertFired = true;
        window.toast?.success(`Bus 04 is approaching your stop (${distanceKm} km away)! Get ready to board.`);
      }
    }

    // 3. Update Map HUD
    this.mapView.updateHud({
      busLabel: this.currentBus?.bus_label || 'Bus 04',
      stopName: this.assignedStop?.stop_name || "St. Peter's Square",
      etaMinutes,
      speed: loc.speed
    });

    // 4. Update Bottom Metric Cards
    this.bottomCards.updateMetrics({
      etaMinutes,
      distanceKm,
      speed: loc.speed,
      accuracy: loc.accuracy
    });

    // 5. Update Top Status
    this.topbar.updateLiveStatus({ isLive: true, isStale: false });
  }

  startHeartbeatMonitor() {
    setInterval(() => {
      if (!this.lastLocationTime) return;
      const ageSeconds = Math.floor((Date.now() - this.lastLocationTime) / 1000);
      const isStale = ageSeconds > this.staleThresholdSeconds;

      if (isStale) {
        this.topbar.updateLiveStatus({ isLive: true, isStale: true });
        const hud = document.getElementById('mapFloatingHud');
        if (hud) hud.classList.add('stale');
      }
    }, 5000);
  }

  switchRole(role) {
    this.currentRole = role;
    this.topbar.render({
      routes: [this.currentRoute],
      currentRouteId: this.currentRoute?.route_id || 1,
      currentRole: role,
      isLive: true,
      isStale: false
    });

    if (role === 'driver') {
      this.driverModal.open();
      window.toast?.info('Driver Operations Console opened.');
    } else if (role === 'admin') {
      this.adminModal.open();
      window.toast?.info('Admin Fleet Management opened.');
    } else {
      window.toast?.info('Switched to Student Commuter view.');
      this.mapView.recenter();
    }
  }

  onUserLoggedIn(user) {
    this.currentUser = user;
    this.currentRole = user.role;
    this.sidebar.render(user, 'home');
    this.switchRole(user.role);
  }

  navigate(tab) {
    this.sidebar.render(this.currentUser, tab);
    if (tab === 'home') {
      this.mapView.recenter();
    }
  }

  focusStop(stopId) {
    this.mapView.focusStop(stopId);
  }

  openDriverModal() { this.driverModal.open(); }
  openAdminModal() { this.adminModal.open(); }
  openLoginModal() { this.loginModal.open(); }
  openRouteModal() { this.routeModal.open(this.currentRoute, this.assignedStop); }
  openNotificationsModal() { this.notifModal.open(); }
  openSosModal() { this.sosModal.open(); }
  openReportsModal() { this.reportsModal.open(); }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.app = new CampusTrackApp();
  window.app.init();
});
