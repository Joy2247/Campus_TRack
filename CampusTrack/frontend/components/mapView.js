// ==========================================================================
// CampusTrack - Interactive Map View & HUD Component
// High-fidelity reproduction of reference UI map canvas & floating HUD
// ==========================================================================

class MapViewComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.map = null;
    this.busMarker = null;
    this.stopMarkers = [];
    this.routePolyline = null;
    this.currentLocation = {
      latitude: 18.524100,
      longitude: 73.860100,
      speed: 35,
      heading: 58,
      accuracy: 4.2
    };
    this.assignedStop = null;
    this.busInfo = { label: 'Bus 04', reg: 'KA-04-E-2024' };
    this.etaInfo = { minutes: 7, distanceKm: 2.4 };
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="map-wrapper">
        <div id="map"></div>

        <!-- Floating Dark HUD Capsule Overlay (Exact Match to Screenshot!) -->
        <div class="floating-hud-capsule" id="mapFloatingHud">
          <div class="hud-segment">
            <span class="hud-value" id="hudBusNumber">04</span>
            <span class="hud-label">Bus Number</span>
          </div>
          <div class="hud-segment highlight">
            <span class="hud-value highlight" id="hudEtaPrice">ETA: 7 Mins</span>
            <span class="hud-label" id="hudStopName">St. Peter's Square</span>
          </div>
          <div class="hud-segment">
            <span class="hud-value" id="hudSpeedAge">35 km/h</span>
            <span class="hud-label">Live Speed</span>
          </div>
        </div>

        <!-- Floating Simulation & Recenter Pill Controls -->
        <div class="map-controls-pill">
          <button class="map-pill-btn active" id="simToggleBtn" title="Start/Pause GPS Simulator">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span id="simBtnLabel">Simulate</span>
          </button>
          <button class="map-pill-btn" id="simSpeedBtn" title="Toggle Speed">2x Speed</button>
          <button class="map-pill-btn" id="recenterBtn" title="Center map on bus">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>
            Center
          </button>
        </div>

        <!-- Floating Bottom-Right Action Button (Matches Screenshot) -->
        <button class="map-floating-btn" id="mapSupportBtn" title="Help & Emergency SOS">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </button>
      </div>
    `;

    this.initLeafletMap();
    this.attachEvents();
  }

  initLeafletMap() {
    if (typeof L === 'undefined') {
      console.warn('[Map] Leaflet CDN not loaded. Retrying...');
      return;
    }

    // Default center at transit corridor
    const defaultCenter = [this.currentLocation.latitude, this.currentLocation.longitude];

    this.map = L.map('map', {
      center: defaultCenter,
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    // Custom CartoDB Positron / Minimal light map layer (pastel aesthetics matching reference image)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    // Zoom control on top right
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    this.renderBusMarker(this.currentLocation);
  }

  renderRoute(route) {
    if (!this.map || !route || !route.stops || !route.stops.length) return;

    // Remove existing stop markers and polyline
    this.stopMarkers.forEach(m => this.map.removeLayer(m));
    this.stopMarkers = [];
    if (this.routePolyline) {
      this.map.removeLayer(this.routePolyline);
    }

    const latLngs = [];

    // Create glowing amber stop markers (matching screenshot)
    route.stops.forEach((stop, index) => {
      const isAssigned = this.assignedStop && this.assignedStop.stop_id === stop.stop_id;
      latLngs.push([stop.latitude, stop.longitude]);

      const stopIcon = L.divIcon({
        className: 'custom-stop-div-icon',
        html: `
          <div class="custom-stop-marker ${isAssigned ? 'assigned-stop' : ''}" title="${stop.stop_name} (#${index + 1})">
            <div class="stop-marker-halo"></div>
            <div class="stop-marker-dot"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon })
        .addTo(this.map)
        .bindPopup(`
          <div style="font-family: var(--font-family); padding: 4px;">
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${stop.stop_name}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Stop #${index + 1} • ${stop.address || ''}</div>
            ${isAssigned ? '<div style="margin-top:6px; display:inline-block; font-size:10.5px; font-weight:700; background:#d1fae5; color:#065f46; padding:2px 8px; border-radius:99px;">Your Assigned Pickup Stop</div>' : ''}
          </div>
        `);

      this.stopMarkers.push(marker);
    });

    // Draw route polyline
    this.routePolyline = L.polyline(latLngs, {
      color: '#0f172a',
      weight: 4.5,
      opacity: 0.8,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.map);

    // Feed waypoints to GPS Simulator
    if (window.gpsEngine) {
      window.gpsEngine.setRouteStops(route.stops);
    }
  }

  renderBusMarker(loc) {
    if (!this.map) return;

    const lat = loc.latitude;
    const lng = loc.longitude;
    const heading = loc.heading || 0;

    if (!this.busMarker) {
      const busIcon = L.divIcon({
        className: 'custom-bus-div-icon',
        html: `
          <div class="custom-bus-marker" id="liveBusMarkerElement">
            <div class="bus-pulse-ring"></div>
            <div class="bus-marker-core" style="transform: rotate(${heading}deg);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
              </svg>
            </div>
          </div>
        `,
        iconSize: [68, 68],
        iconAnchor: [34, 34]
      });

      this.busMarker = L.marker([lat, lng], { icon: busIcon, zIndexOffset: 1000 }).addTo(this.map);
    } else {
      // Smoothly update location
      this.busMarker.setLatLng([lat, lng]);
      const coreElem = document.querySelector('.bus-marker-core');
      if (coreElem) {
        coreElem.style.transform = `rotate(${heading}deg)`;
      }
    }
  }

  updateLiveLocation(locationData) {
    this.currentLocation = locationData;
    this.renderBusMarker(locationData);

    // Update Floating HUD
    const speed = Math.round(locationData.speed || 35);
    const speedElem = document.getElementById('hudSpeedAge');
    if (speedElem) {
      speedElem.textContent = `${speed} km/h`;
    }

    if (locationData.isStale) {
      document.getElementById('mapFloatingHud')?.classList.add('stale');
    } else {
      document.getElementById('mapFloatingHud')?.classList.remove('stale');
    }
  }

  updateHud({ busLabel, stopName, etaMinutes, speed }) {
    if (busLabel) {
      const num = busLabel.replace(/[^0-9]/g, '') || '04';
      const el = document.getElementById('hudBusNumber');
      if (el) el.textContent = num.padStart(2, '0');
    }
    if (stopName) {
      const el = document.getElementById('hudStopName');
      if (el) el.textContent = stopName;
    }
    if (etaMinutes !== undefined) {
      const el = document.getElementById('hudEtaPrice');
      if (el) el.textContent = etaMinutes <= 1 ? 'Arriving Now' : `ETA: ${etaMinutes} Mins`;
    }
    if (speed !== undefined) {
      const el = document.getElementById('hudSpeedAge');
      if (el) el.textContent = `${Math.round(speed)} km/h`;
    }
  }

  recenter() {
    if (this.map && this.currentLocation) {
      this.map.flyTo([this.currentLocation.latitude, this.currentLocation.longitude], 15, {
        duration: 1.2
      });
    }
  }

  focusStop(stopId) {
    if (!this.map || !this.stopMarkers.length) return;
    const stop = window.app?.currentRoute?.stops?.find(s => s.stop_id == stopId);
    if (stop) {
      this.map.flyTo([stop.latitude, stop.longitude], 16, { duration: 1.0 });
    }
  }

  attachEvents() {
    // Recenter button
    document.getElementById('recenterBtn')?.addEventListener('click', () => {
      this.recenter();
    });

    // Simulation toggle
    const simBtn = document.getElementById('simToggleBtn');
    if (simBtn) {
      simBtn.addEventListener('click', () => {
        if (window.gpsEngine.isSimulating) {
          window.gpsEngine.stopSimulation();
          simBtn.classList.remove('active');
          document.getElementById('simBtnLabel').textContent = 'Simulate';
          window.toast?.info('GPS Simulation paused.');
        } else {
          window.gpsEngine.startSimulation(105, (loc) => {
            this.updateLiveLocation(loc);
            window.app?.onGpsUpdate(loc);
          });
          simBtn.classList.add('active');
          document.getElementById('simBtnLabel').textContent = 'Simulating';
          window.toast?.success('Live GPS route simulation active.');
        }
      });
    }

    // Speed multiplier toggle
    const speedBtn = document.getElementById('simSpeedBtn');
    if (speedBtn) {
      const speeds = [1, 2, 5, 10];
      let sIdx = 1; // start at 2x
      speedBtn.addEventListener('click', () => {
        sIdx = (sIdx + 1) % speeds.length;
        const mult = speeds[sIdx];
        speedBtn.textContent = `${mult}x Speed`;
        window.gpsEngine.setSpeedMultiplier(mult);
        window.toast?.info(`Simulation speed set to ${mult}x.`);
      });
    }

    // Support / SOS button
    document.getElementById('mapSupportBtn')?.addEventListener('click', () => {
      window.app?.openSosModal();
    });
  }
}

window.MapViewComponent = MapViewComponent;
