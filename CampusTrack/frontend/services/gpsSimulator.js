// ==========================================================================
// CampusTrack - Multi-Bus Fleet GPS Simulator & Geolocation Engine
// Real-time autonomous transit simulation for all 4 buses across Lavasa
// ==========================================================================

class GpsEngine {
  constructor() {
    this.isSimulating = false;
    this.isRealGpsActive = false;
    this.speedMultiplier = 2; // Default 2x speed
    this.timer = null;
    this.watchId = null;
    this.selectedBusId = 1; // Default Bus 04
    this.waypoints = [];
    this.onLocationCallback = null;
    this.onFleetUpdateCallback = null;

    // The 4 Active Buses in Lavasa Fleet
    this.fleet = [
      {
        busId: 1,
        busLabel: 'Bus 04 (Dasve & Hostels Loop)',
        reg: 'MH-12-CT-2024',
        driverName: 'Rajesh Kumar',
        capacity: 42,
        currentOccupancy: 35,
        tripId: 105,
        stepIndex: 0,
        direction: 1,
        color: '#f59e0b', // Amber
        latitude: 18.4075,
        longitude: 73.5065,
        speed: 32,
        heading: 42,
        accuracy: 3.8
      },
      {
        busId: 2,
        busLabel: 'Bus 08 (Lakeview Promenade Express)',
        reg: 'MH-12-CT-4088',
        driverName: 'Michael Chen',
        capacity: 38,
        currentOccupancy: 28,
        tripId: 106,
        stepIndex: 40,
        direction: -1,
        color: '#3b82f6', // Blue
        latitude: 18.4035,
        longitude: 73.5020,
        speed: 28,
        heading: 210,
        accuracy: 4.1
      },
      {
        busId: 3,
        busLabel: 'Bus 12 (Hillside Scholars Shuttle)',
        reg: 'MH-12-CT-6612',
        driverName: 'Ramesh Shinde',
        capacity: 45,
        currentOccupancy: 31,
        tripId: 107,
        stepIndex: 85,
        direction: 1,
        color: '#10b981', // Emerald
        latitude: 18.4130,
        longitude: 73.5135,
        speed: 34,
        heading: 65,
        accuracy: 3.5
      },
      {
        busId: 4,
        busLabel: 'Bus 15 (Valley View Metro Connector)',
        reg: 'MH-12-CT-9115',
        driverName: 'Vikram Patil',
        capacity: 40,
        currentOccupancy: 22,
        tripId: 108,
        stepIndex: 120,
        direction: -1,
        color: '#8b5cf6', // Purple
        latitude: 18.4170,
        longitude: 73.5180,
        speed: 30,
        heading: 180,
        accuracy: 4.0
      }
    ];
  }

  setRouteStops(stops) {
    if (!stops || stops.length < 2) return;
    this.waypoints = [];

    // Interpolate smooth points along the Lavasa terrain
    for (let i = 0; i < stops.length - 1; i++) {
      const p1 = stops[i];
      const p2 = stops[i + 1];
      const stepsBetween = 22;

      for (let s = 0; s <= stepsBetween; s++) {
        const ratio = s / stepsBetween;
        const lat = p1.latitude + (p2.latitude - p1.latitude) * ratio;
        const lng = p1.longitude + (p2.longitude - p1.longitude) * ratio;

        const dLng = (p2.longitude - p1.longitude);
        const y = Math.sin(dLng) * Math.cos(p2.latitude);
        const x = Math.cos(p1.latitude) * Math.sin(p2.latitude) -
                  Math.sin(p1.latitude) * Math.cos(p2.latitude) * Math.cos(dLng);
        let heading = Math.atan2(y, x) * (180 / Math.PI);
        heading = (heading + 360) % 360;

        const isNearStop = s < 3 || s > (stepsBetween - 3);
        const speed = isNearStop ? 16.0 + Math.random() * 4 : 32.0 + Math.random() * 8;

        this.waypoints.push({
          latitude: lat,
          longitude: lng,
          heading: Math.round(heading),
          speed: Math.round(speed),
          accuracy: 3.8 + (Math.random() * 1.2)
        });
      }
    }
  }

  startSimulation(tripId = 105, onUpdate) {
    if (this.isSimulating) return;
    this.stopRealGps();
    this.isSimulating = true;
    this.onLocationCallback = onUpdate;

    const intervalMs = Math.max(800, Math.floor(3500 / this.speedMultiplier));
    this.timer = setInterval(() => {
      this.stepSimulation();
    }, intervalMs);

    this.stepSimulation();
  }

  stepSimulation() {
    if (!this.waypoints.length) return;

    // Advance all 4 buses across their respective positions
    this.fleet.forEach((bus, index) => {
      const totalPts = this.waypoints.length;
      let nextIdx = (bus.stepIndex + bus.direction + totalPts) % totalPts;
      bus.stepIndex = nextIdx;

      const pt = this.waypoints[nextIdx];
      bus.latitude = pt.latitude + (index * 0.00015); // subtle street lane offset
      bus.longitude = pt.longitude + (index * 0.00012);
      bus.heading = bus.direction === 1 ? pt.heading : (pt.heading + 180) % 360;
      bus.speed = pt.speed;
      bus.accuracy = pt.accuracy;
      bus.deviceTimestamp = new Date().toISOString();

      // If this is the active user's selected bus, trigger primary callback
      if (bus.busId === this.selectedBusId) {
        if (window.socketService && window.socketService.connected) {
          window.socketService.sendLocation({
            tripId: bus.tripId,
            latitude: bus.latitude,
            longitude: bus.longitude,
            speed: bus.speed,
            heading: bus.heading,
            accuracy: bus.accuracy,
            deviceTimestamp: bus.deviceTimestamp
          });
        }

        if (this.onLocationCallback) {
          this.onLocationCallback({
            busId: bus.busId,
            busLabel: bus.busLabel,
            tripId: bus.tripId,
            latitude: bus.latitude,
            longitude: bus.longitude,
            speed: bus.speed,
            heading: bus.heading,
            accuracy: bus.accuracy,
            received_at: new Date().toISOString(),
            isStale: false,
            ageSeconds: 0
          });
        }
      }
    });

    // Notify map of the entire fleet's live positions
    if (this.onFleetUpdateCallback) {
      this.onFleetUpdateCallback(this.fleet);
    }
  }

  selectBus(busId) {
    this.selectedBusId = Number(busId);
    const bus = this.fleet.find(b => b.busId === this.selectedBusId);
    if (bus && this.onLocationCallback) {
      this.onLocationCallback({
        busId: bus.busId,
        busLabel: bus.busLabel,
        tripId: bus.tripId,
        latitude: bus.latitude,
        longitude: bus.longitude,
        speed: bus.speed,
        heading: bus.heading,
        accuracy: bus.accuracy,
        received_at: new Date().toISOString(),
        isStale: false,
        ageSeconds: 0
      });
    }
  }

  teleportToStop(stopOrder) {
    if (!this.waypoints.length) return;
    const bus = this.fleet.find(b => b.busId === this.selectedBusId);
    if (!bus) return;

    // Approximate waypoints per stop segment: 22 points
    const targetIdx = Math.min(this.waypoints.length - 1, Math.max(0, (stopOrder - 1) * 22));
    bus.stepIndex = targetIdx;
    this.stepSimulation();
  }

  stopSimulation() {
    this.isSimulating = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  setSpeedMultiplier(mult) {
    this.speedMultiplier = mult;
    if (this.isSimulating) {
      this.stopSimulation();
      this.startSimulation(105, this.onLocationCallback);
    }
  }

  startRealGps(tripId = 105, onUpdate) {
    if (!navigator.geolocation) {
      alert('Geolocation API is not supported on this browser.');
      return;
    }

    this.stopSimulation();
    this.isRealGpsActive = true;
    this.onLocationCallback = onUpdate;

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const payload = {
          busId: this.selectedBusId,
          tripId: tripId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          speed: pos.coords.speed ? pos.coords.speed * 3.6 : 30.0,
          heading: pos.coords.heading || 0,
          accuracy: pos.coords.accuracy || 4,
          deviceTimestamp: new Date(pos.timestamp).toISOString()
        };

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
        console.warn('[GPS Engine] Geolocation error:', err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
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
