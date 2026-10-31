// ==========================================================================
// CampusTrack - Master Application Orchestrator (Lavasa Campus & 4 Hostels)
// ==========================================================================

class CampusTrackApp {
  constructor() {
    this.currentUser = {
      user_id: 6,
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

    // Components
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
    this.githubModal = null;
    this.boardingPassModal = null;
  }

  async init() {
    console.log('[CampusTrack] Initializing Lavasa Campus Fleet System...');

    // Theme recovery
    if (localStorage.getItem('campustrack_theme') === 'dark') {
      document.body.classList.add('dark-mode');
    }

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
    this.githubModal = new window.GithubModalComponent('githubModalContainer');
    this.boardingPassModal = new window.BoardingPassModalComponent('boardingPassModalContainer');

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
      try {
        const loginRes = await window.apiService.login('student@campus.edu', 'password123');
        this.currentUser = loginRes.user;
      } catch (err) {
        console.log('[CampusTrack] Running with embedded demo user state.');
      }
    }

    // 4. Load Lavasa Route, Hostels & Assignment Data
    await this.loadInitialData();

    // 5. Connect Socket.IO
    this.initSockets();

    // 6. Start Stale GPS Heartbeat Monitor (SRS FR-RT-007)
    this.startHeartbeatMonitor();

    // 7. Auto-start route simulation through Lavasa
    setTimeout(() => {
      window.gpsEngine.onFleetUpdateCallback = (fleet) => {
        this.mapView.updateFleetMarkers(fleet);
      };

      window.gpsEngine.startSimulation(105, (loc) => {
        this.onGpsUpdate(loc);
      });
      window.toast?.success('Connected to Bus 04 in Lavasa (Dasve & Hostels Loop).');
    }, 1200);
  }

  async loadInitialData() {
    try {
      const routeRes = await window.apiService.getRouteDetails(1);
      if (routeRes && routeRes.route) {
        this.currentRoute = routeRes.route;
      }

      const assignRes = await window.apiService.getStudentAssignment();
      if (assignRes && assignRes.assignment) {
        const a = assignRes.assignment;
        this.assignedStop = a.stop;
        this.currentBus = a.bus;
        this.currentTrip = a.activeTrip;
      }
    } catch (e) {
      console.warn('Initial data loaded from Lavasa defaults.');
      this.currentRoute = {
        route_id: 1,
        route_name: 'Route 101 - Lavasa Dasve & 4 Hostels Loop',
        stops: [
          { stop_id: 1, stop_order: 1, stop_name: 'Lavasa Central Transit Terminal', latitude: 18.405500, longitude: 73.507800, address: 'Main Dasve Bus Depot' },
          { stop_id: 2, stop_order: 2, stop_name: 'Portofino Promenade Plaza', latitude: 18.404000, longitude: 73.503000, address: 'Portofino Lakefront Street' },
          { stop_id: 3, stop_order: 3, stop_name: 'Lakeside Girls Hostel (Block A & B)', latitude: 18.402500, longitude: 73.501200, address: 'Lakeside Heights, Warasgaon Shore' },
          { stop_id: 4, stop_order: 4, stop_name: 'Dasve Waterfront & Town Hall', latitude: 18.406500, longitude: 73.505500, address: 'Convention Center Circle' },
          { stop_id: 5, stop_order: 5, stop_name: 'Christ University Lavasa Academic Hub', latitude: 18.411800, longitude: 73.507500, address: 'Academic Block & Central Library' },
          { stop_id: 6, stop_order: 6, stop_name: 'Banyan Tree Boys Hostel (North Wing)', latitude: 18.409500, longitude: 73.511500, address: 'North Hill Road' },
          { stop_id: 7, stop_order: 7, stop_name: 'Hillside Scholars Hostel (Gate 2)', latitude: 18.415000, longitude: 73.515800, address: 'Hillside Heights Hostel Complex' },
          { stop_id: 8, stop_order: 8, stop_name: 'Valley View International Hostel', latitude: 18.418500, longitude: 73.519500, address: 'Upper Dasve Ridge' }
        ]
      };
      this.assignedStop = this.currentRoute.stops[5];
      this.currentBus = {
        bus_id: 1,
        bus_label: 'Bus 04 (Dasve & Hostels Loop)',
        registration_no: 'MH-12-CT-2024',
        driver_name: 'Rajesh Kumar',
        capacity: 42,
        current_occupancy: 35
      };
      this.currentTrip = { trip_id: 105, status: 'Active' };
    }

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
      eta: { minutes: 8, distanceKm: 1.8 },
      location: { speed: 32, accuracy: 3.8 }
    });

    this.driverModal.render(this.currentTrip, this.currentBus);
  }

  initSockets() {
    window.socketService.connect();
    window.socketService.joinTrip(105);

    window.socketService.on('locationUpdate', (data) => {
      this.onGpsUpdate(data);
    });

    window.socketService.on('tripStarted', (data) => {
      window.toast?.success('Trip Started: Bus 04 is now en-route through Lavasa.');
      this.topbar.updateLiveStatus({ isLive: true, isStale: false });
    });

    window.socketService.on('tripPaused', (data) => {
      window.toast?.warning(`Trip Paused: ${data.reason || 'Holding position in Dasve'}`);
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

    this.mapView.updateLiveLocation(loc);

    let etaMinutes = 8;
    let distanceKm = 1.8;

    if (this.assignedStop) {
      const R = 6371;
      const dLat = (this.assignedStop.latitude - loc.latitude) * Math.PI / 180;
      const dLon = (this.assignedStop.longitude - loc.longitude) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(loc.latitude * Math.PI / 180) * Math.cos(this.assignedStop.latitude * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const straightKm = R * c;
      distanceKm = parseFloat((straightKm * 1.3).toFixed(1));
      const speedKmH = (loc.speed && loc.speed > 5) ? loc.speed : 30;
      etaMinutes = Math.max(1, Math.round((distanceKm / speedKmH) * 60));

      if (distanceKm <= 0.6 && !this._proximityAlertFired) {
        this._proximityAlertFired = true;
        window.soundService?.playArrivalChime();
        window.toast?.success(`Bus 04 is approaching your hostel stop (${distanceKm} km away)! Please proceed to the boarding gate.`);
      }
    }

    this.mapView.updateHud({
      busLabel: this.currentBus?.bus_label || 'Bus 04',
      stopName: this.assignedStop?.stop_name || "Banyan Tree Boys Hostel",
      etaMinutes,
      speed: loc.speed
    });

    this.bottomCards.updateMetrics({
      etaMinutes,
      distanceKm,
      speed: loc.speed,
      accuracy: loc.accuracy
    });

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

  selectBus(busId) {
    const fleet = [
      { bus_id: 1, bus_label: 'Bus 04 (Dasve & Hostels Loop)', registration_no: 'MH-12-CT-2024', driver_name: 'Rajesh Kumar', capacity: 42, current_occupancy: 35 },
      { bus_id: 2, bus_label: 'Bus 08 (Lakeview Promenade Express)', registration_no: 'MH-12-CT-4088', driver_name: 'Michael Chen', capacity: 38, current_occupancy: 28 },
      { bus_id: 3, bus_label: 'Bus 12 (Hillside Scholars Shuttle)', registration_no: 'MH-12-CT-6612', driver_name: 'Ramesh Shinde', capacity: 45, current_occupancy: 31 },
      { bus_id: 4, bus_label: 'Bus 15 (Valley View Metro Connector)', registration_no: 'MH-12-CT-9115', driver_name: 'Vikram Patil', capacity: 40, current_occupancy: 22 }
    ];

    const bus = fleet.find(b => b.bus_id == busId) || fleet[0];
    this.currentBus = bus;
    window.gpsEngine?.selectBus(busId);
    this.bottomCards.render({
      stop: this.assignedStop,
      bus: this.currentBus,
      eta: { minutes: 8, distanceKm: 1.8 },
      location: { speed: 32, accuracy: 3.8 }
    });
    this.mapView.updateHud({ busLabel: bus.bus_label });
    window.toast?.info(`Viewing telemetry for ${bus.bus_label}`);
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
      window.toast?.info('Switched to Student Hostel Commuter view.');
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
    const stop = this.currentRoute?.stops?.find(s => s.stop_id == stopId);
    if (stop) {
      this.assignedStop = stop;
      this.bottomCards.render({
        stop: this.assignedStop,
        bus: this.currentBus,
        eta: { minutes: 8, distanceKm: 1.8 },
        location: { speed: 32, accuracy: 3.8 }
      });
      this.mapView.updateHud({ stopName: stop.stop_name });
      window.toast?.info(`Selected: ${stop.stop_name}`);
    }
  }

  openDriverModal() { this.driverModal.open(); }
  openAdminModal() { this.adminModal.open(); }
  openLoginModal() { this.loginModal.open(); }
  openRouteModal() { this.routeModal.open(this.currentRoute, this.assignedStop); }
  openNotificationsModal() { this.notifModal.open(); }
  openSosModal() { this.sosModal.open(); }
  openReportsModal() { this.reportsModal.open(); }
  openGithubModal() { this.githubModal.open(); }
  openBoardingPassModal() { this.boardingPassModal.open(this.currentUser, this.currentBus, this.assignedStop); }

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('campustrack_theme', isDark ? 'dark' : 'light');
    window.toast?.info(isDark ? '🌙 Night Cockpit Mode activated.' : '☀️ Day Transit Mode activated.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new CampusTrackApp();
  window.app.init();
});
