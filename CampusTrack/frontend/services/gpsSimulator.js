// ==========================================================================
// CampusTrack - GPS Simulator & Browser Geolocation Engine
// Allows realistic autonomous vehicle movement testing & phone GPS tracking
// ==========================================================================

class GpsEngine {
  constructor() {
    this.isSimulating = false;
    this.isRealGpsActive = false;
    this.speedMultiplier = 2; // Default 2x speed for testing
    this.timer = null;
    this.watchId = null;
    this.currentStepIndex = 0;
    this.currentTripId = 105;
    this.waypoints = [];
    this.onLocationCallback = null;
  }

  // Pre-generate smooth interpolated route waypoints
  setRouteStops(stops) {
    if (!stops || stops.length < 2) return;
    this.waypoints = [];

    // Interpolate points between consecutive stops for smooth animation
    for (let i = 0; i < stops.length - 1; i++) {
      const p1 = stops[i];
      const p2 = stops[i + 1];
      const stepsBetween = 25; // 25 intermediate points per segment

      for (let s = 0; s <= stepsBetween; s++) {
        const ratio = s / stepsBetween;
        const lat = p1.latitude + (p2.latitude - p1.latitude) * ratio;
        const lng = p1.longitude + (p2.longitude - p1.longitude) * ratio;

        // Calculate heading angle in degrees
        const dLng = (p2.longitude - p1.longitude);
        const y = Math.sin(dLng) * Math.cos(p2.latitude);
        const x = Math.cos(p1.latitude) * Math.sin(p2.latitude) -
                  Math.sin(p1.latitude) * Math.cos(p2.latitude) * Math.cos(dLng);
        let heading = Math.atan2(y, x) * (180 / Math.PI);
        heading = (heading + 360) % 360;

        // Realistic vehicle speed (slower near stops, faster in transit)
        const isNearStop = s < 3 || s > (stepsBetween - 3);
        const speed = isNearStop ? 15.0 + Math.random() * 5 : 36.0 + Math.random() * 8;

        this.waypoints.push({
          latitude: lat,
          longitude: lng,
          heading: Math.round(heading),
          speed: Math.round(speed),
          accuracy: 4.2 + (Math.random() * 1.5)
        });
      }
    }
    console.log(`[GPS Engine] Generated ${this.waypoints.length} smooth waypoints.`);
  }

  startSimulation(tripId = 105, onUpdate) {
    if (this.isSimulating) return;
    this.stopRealGps();
    this.isSimulating = true;
    this.currentTripId = tripId;
    this.onLocationCallback = onUpdate;

    console.log('[GPS Engine] Simulation started.');
    const intervalMs = Math.max(1000, Math.floor(4000 / this.speedMultiplier));

    this.timer = setInterval(() => {
      this.stepSimulation();
    }, intervalMs);

    this.stepSimulation(); // Immediate first step
  }

  stepSimulation() {
    if (!this.waypoints.length) return;

    const pt = this.waypoints[this.currentStepIndex];
    const payload = {
      tripId: this.currentTripId,
      latitude: pt.latitude,
      longitude: pt.longitude,
      speed: pt.speed,
      heading: pt.heading,
      accuracy: pt.accuracy,
      deviceTimestamp: new Date().toISOString()
    };

    // Send to backend via Socket / API
    if (window.socketService && window.socketService.connected) {
      window.socketService.sendLocation(payload);
    } else if (window.apiService) {
      window.apiService.sendDriverLocation(payload).catch(() => {});
    }

    if (this.onLocationCallback) {
      this.onLocationCallback({
        ...payload,
        received_at: new Date().toISOString(),
        isStale: false,
        ageSeconds: 0
      });
    }

    // Advance to next waypoint
    this.currentStepIndex = (this.currentStepIndex + 1) % this.waypoints.length;
  }

  stopSimulation() {
    this.isSimulating = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    console.log('[GPS Engine] Simulation stopped.');
  }

  setSpeedMultiplier(mult) {
    this.speedMultiplier = mult;
    if (this.isSimulating) {
      this.stopSimulation();
      this.startSimulation(this.currentTripId, this.onLocationCallback);
    }
  }

  // Real Browser Geolocation (HTML5 Geolocation API)
  startRealGps(tripId = 105, onUpdate) {
    if (!navigator.geolocation) {
      alert('Geolocation API is not supported on this browser.');
      return;
    }

    this.stopSimulation();
    this.isRealGpsActive = true;
    this.currentTripId = tripId;
    this.onLocationCallback = onUpdate;

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const payload = {
          tripId: this.currentTripId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          speed: pos.coords.speed ? pos.coords.speed * 3.6 : 28.0, // m/s to km/h
          heading: pos.coords.heading || 0,
          accuracy: pos.coords.accuracy || 5,
          deviceTimestamp: new Date(pos.timestamp).toISOString()
        };

        if (window.socketService && window.socketService.connected) {
          window.socketService.sendLocation(payload);
        } else if (window.apiService) {
          window.apiService.sendDriverLocation(payload).catch(() => {});
        }

        if (this.onLocationCallback) {
          this.onLocationCallback({
            ...payload,
            received_at: new Date().toISOString(),
            isStale: false,
            ageSeconds: 0
          });
        }
      },
      (err) => {
        console.warn('[GPS Engine] Geolocation watch error:', err.message);
        if (err.code === 1) {
          alert('Location permission denied. Please allow location access in your browser settings.');
        }
      },
      options
    );

    console.log('[GPS Engine] Real phone/device GPS tracking activated.');
  }

  stopRealGps() {
    this.isRealGpsActive = false;
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}

window.gpsEngine = new GpsEngine();
