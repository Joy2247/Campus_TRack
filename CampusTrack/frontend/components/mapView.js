// ==========================================================================
// CampusTrack - Interactive Map View & HUD Component (Lavasa Campus Edition)
// ==========================================================================

class MapViewComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.map = null;
    this.busMarker = null;
    this.stopMarkers = [];
    this.routePolyline = null;
    // Lavasa geographic coordinates (Dasve Lake & Christ University)
    this.currentLocation = {
      latitude: 18.407500,
      longitude: 73.506500,
      speed: 32,
      heading: 42,
      accuracy: 3.8
    };
    this.assignedStop = null;
    this.busInfo = { label: 'Bus 04', reg: 'MH-12-CT-2024' };
    this.etaInfo = { minutes: 8, distanceKm: 1.8 };
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="map-wrapper">
        <div id="map"></div>

        <!-- Campus Location Indicator Badge -->
        <div style="position:absolute; top:16px; left:16px; z-index:25; background:rgba(255,255,255,0.92); backdrop-filter:blur(8px); padding:6px 14px; border-radius:99px; border:1px solid rgba(226,232,240,0.9); box-shadow:0 4px 12px rgba(0,0,0,0.06); display:flex; align-items:center; gap:8px;">
          <span style="font-size:14px;">📍</span>
          <span style="font-size:12px; font-weight:700; color:#0f172a;">Lavasa Hill City</span>
          <span style="font-size:11px; color:#64748b;">• Dasve Lake & Hostels Loop</span>
        </div>

        <!-- Floating Dark HUD Capsule Overlay (Exact Match to Reference Screenshot) -->
        <div class="floating-hud-capsule" id="mapFloatingHud">
          <div class="hud-segment">
            <span class="hud-value" id="hudBusNumber">04</span>
            <span class="hud-label">Bus Number</span>
          </div>
          <div class="hud-segment highlight">
            <span class="hud-value highlight" id="hudEtaPrice">ETA: 8 Mins</span>
            <span class="hud-label" id="hudStopName">Banyan Tree Boys Hostel</span>
          </div>
          <div class="hud-segment">
            <span class="hud-value" id="hudSpeedAge">32 km/h</span>
            <span class="hud-label">Live Speed</span>
          </div>
        </div>

        <!-- Floating Simulation & Recenter Pill Controls -->
        <div class="map-controls-pill">
          <button class="map-pill-btn active" id="simToggleBtn" title="Start/Pause GPS Simulator">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span id="simBtnLabel">Simulating</span>
          </button>
          <button class="map-pill-btn" id="simSpeedBtn" title="Toggle Speed">2x Speed</button>
          <button class="map-pill-btn" id="recenterBtn" title="Center map on bus in Lavasa">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>
            Center Lavasa
          </button>
        </div>

        <!-- Floating Bottom-Right Action Button (Matches Screenshot) -->
        <button class="map-floating-btn" id="mapSupportBtn" title="Campus Safety & Emergency SOS">
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

    // Lavasa Center coordinates: 18.4080° N, 73.5080° E
    const defaultCenter = [this.currentLocation.latitude, this.currentLocation.longitude];

    this.map = L.map('map', {
      center: defaultCenter,
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // Custom CartoDB Positron / Minimal light map layer (soft pastel aesthetics matching reference image)
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

    this.stopMarkers.forEach(m => this.map.removeLayer(m));
    this.stopMarkers = [];
    if (this.routePolyline) {
      this.map.removeLayer(this.routePolyline);
    }

    const latLngs = [];

    // Create glowing amber stop & hostel markers
    route.stops.forEach((stop, index) => {
      const isAssigned = this.assignedStop && this.assignedStop.stop_id === stop.stop_id;
      const isHostel = stop.stop_name.toLowerCase().includes('hostel');
      latLngs.push([stop.latitude, stop.longitude]);

      const stopIcon = L.divIcon({
        className: 'custom-stop-div-icon',
        html: `
          <div class="custom-stop-marker ${isAssigned ? 'assigned-stop' : ''}" title="${stop.stop_name} (#${index + 1})">
            <div class="stop-marker-halo" style="${isHostel ? 'width:32px; height:32px; background:rgba(245,158,11,0.32);' : ''}"></div>
            <div class="stop-marker-dot" style="${isHostel ? 'width:15px; height:15px; background:#f59e0b; border:2px solid #fff;' : ''}"></div>
            ${isHostel ? '<span style="position:absolute; top:-22px; font-size:10px; font-weight:700; background:#0f172a; color:#fff; padding:1px 5px; border-radius:4px; white-space:nowrap; box-shadow:0 2px 5px rgba(0,0,0,0.2);">🏨 Hostel</span>' : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon })
        .addTo(this.map)
        .bindPopup(`
          <div style="font-family: var(--font-family); padding: 4px;">
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${stop.stop_name}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Lavasa Route Stop #${index + 1} • ${stop.address || ''}</div>
            ${isHostel ? '<div style="margin-top:6px; display:inline-block; font-size:10.5px; font-weight:700; background:#fef3c7; color:#92400e; padding:2px 8px; border-radius:99px;">Designated Student Hostel</div>' : ''}
            ${isAssigned ? '<div style="margin-top:4px; display:inline-block; font-size:10.5px; font-weight:700; background:#d1fae5; color:#065f46; padding:2px 8px; border-radius:99px;">Your Assigned Pickup Stop</div>' : ''}
          </div>
        `);

      this.stopMarkers.push(marker);
    });

    // Draw route polyline through Lavasa
    this.routePolyline = L.polyline(latLngs, {
      color: '#0f172a',
      weight: 4.5,
      opacity: 0.8,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.map);

    // Fit map bounds to show full Lavasa route nicely
    this.map.fitBounds(this.routePolyline.getBounds(), { padding: [50, 50] });

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

    const speed = Math.round(locationData.speed || 32);
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
    document.getElementById('recenterBtn')?.addEventListener('click', () => {
      this.recenter();
    });

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
          window.toast?.success('Live GPS route simulation active in Lavasa.');
        }
      });
    }

    const speedBtn = document.getElementById('simSpeedBtn');
    if (speedBtn) {
      const speeds = [1, 2, 5, 10];
      let sIdx = 1;
      speedBtn.addEventListener('click', () => {
        sIdx = (sIdx + 1) % speeds.length;
        const mult = speeds[sIdx];
        speedBtn.textContent = `${mult}x Speed`;
        window.gpsEngine.setSpeedMultiplier(mult);
        window.toast?.info(`Simulation speed set to ${mult}x.`);
      });
    }

    document.getElementById('mapSupportBtn')?.addEventListener('click', () => {
      window.app?.openSosModal();
    });
  }
}

window.MapViewComponent = MapViewComponent;
