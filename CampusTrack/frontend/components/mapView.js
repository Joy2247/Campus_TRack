// ==========================================================================
// CampusTrack - Interactive Multi-Bus Map View & HUD Component
// High-craft reproduction with 4-bus live markers, timeline drawer, & audio
// ==========================================================================

class MapViewComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.map = null;
    this.fleetMarkers = {}; // busId -> marker
    this.stopMarkers = [];
    this.routePolyline = null;
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
    this.timelineOpen = false;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="map-wrapper">
        <div id="map"></div>

        <!-- Campus Location Indicator Badge & Weather -->
        <div style="position:absolute; top:16px; left:16px; z-index:25; display:flex; gap:8px; align-items:center;">
          <div style="background:rgba(255,255,255,0.92); backdrop-filter:blur(8px); padding:6px 14px; border-radius:99px; border:1px solid rgba(226,232,240,0.9); box-shadow:0 4px 12px rgba(0,0,0,0.06); display:flex; align-items:center; gap:8px;">
            <span style="font-size:14px;">📍</span>
            <span style="font-size:12px; font-weight:700; color:#0f172a;">Lavasa Hill City</span>
            <span style="font-size:11px; color:#64748b;">• Dasve & 4 Hostels</span>
          </div>

          <div style="background:rgba(255,255,255,0.92); backdrop-filter:blur(8px); padding:6px 12px; border-radius:99px; border:1px solid rgba(226,232,240,0.9); box-shadow:0 4px 12px rgba(0,0,0,0.06); font-size:11.5px; font-weight:600; color:#334155;">
            ⛅ 23°C • Clear Air
          </div>
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

        <!-- Interactive Route Timeline Drawer Toggle -->
        <div id="mapTimelineDrawer" style="position:absolute; top:16px; right:16px; z-index:25; display:flex; flex-direction:column; align-items:flex-end;">
          <button id="toggleTimelineBtn" style="padding:8px 16px; border-radius:99px; border:1px solid rgba(226,232,240,0.9); background:rgba(255,255,255,0.95); backdrop-filter:blur(10px); color:#0f172a; font-size:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 4px 14px rgba(0,0,0,0.08);">
            <span>🚏 Route Timeline</span>
            <span style="font-size:10px; background:#f1f5f9; padding:2px 6px; border-radius:99px; color:#64748b;">8 Stops</span>
          </button>

          <!-- Drawer Content Panel -->
          <div id="timelinePanelContent" style="display:none; width:300px; max-height:360px; overflow-y:auto; background:rgba(255,255,255,0.97); backdrop-filter:blur(16px); border-radius:18px; border:1px solid rgba(226,232,240,0.9); margin-top:8px; padding:16px; box-shadow:0 12px 30px rgba(0,0,0,0.12);">
            <div style="font-size:12px; font-weight:700; color:#0f172a; margin-bottom:10px; display:flex; justify-content:space-between;">
              <span>Lavasa Route Progression</span>
              <span style="color:#10b981;">● Live Sync</span>
            </div>
            <div id="timelineStopsList"></div>
          </div>
        </div>

        <!-- Floating Simulation, Recenter & Audio Controls -->
        <div class="map-controls-pill">
          <button class="map-pill-btn active" id="simToggleBtn" title="Start/Pause GPS Simulator">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span id="simBtnLabel">Simulating</span>
          </button>
          <button class="map-pill-btn" id="simSpeedBtn" title="Toggle Speed">2x Speed</button>
          <button class="map-pill-btn" id="simSkipBtn" title="Jump to next stop">
            <span>⏭️ Next Stop</span>
          </button>
          <button class="map-pill-btn" id="audioToggleBtn" title="Toggle Arrival Chime Sound">
            <span id="audioBtnLabel">🔔 Sound On</span>
          </button>
          <button class="map-pill-btn" id="recenterBtn" title="Center map on bus in Lavasa">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>
            Center
          </button>
        </div>

        <!-- Floating Bottom-Right Action Button (SOS / Safety) -->
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
    if (typeof L === 'undefined') return;

    const defaultCenter = [this.currentLocation.latitude, this.currentLocation.longitude];

    this.map = L.map('map', {
      center: defaultCenter,
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    L.control.zoom({ position: 'topleft' }).addTo(this.map);
  }

  renderRoute(route) {
    if (!this.map || !route || !route.stops || !route.stops.length) return;

    this.stopMarkers.forEach(m => this.map.removeLayer(m));
    this.stopMarkers = [];
    if (this.routePolyline) {
      this.map.removeLayer(this.routePolyline);
    }

    const latLngs = [];

    // Render Stops & Hostels
    route.stops.forEach((stop, index) => {
      const isAssigned = this.assignedStop && this.assignedStop.stop_id === stop.stop_id;
      const isHostel = stop.stop_name.toLowerCase().includes('hostel');
      latLngs.push([stop.latitude, stop.longitude]);

      const stopIcon = L.divIcon({
        className: 'custom-stop-div-icon',
        html: `
          <div class="custom-stop-marker ${isAssigned ? 'assigned-stop' : ''}" title="${stop.stop_name}">
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
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Stop #${index + 1} • ${stop.address || ''}</div>
            ${isHostel ? '<div style="margin-top:6px; display:inline-block; font-size:10.5px; font-weight:700; background:#fef3c7; color:#92400e; padding:2px 8px; border-radius:99px;">Designated Student Hostel</div>' : ''}
            ${isAssigned ? '<div style="margin-top:4px; display:inline-block; font-size:10.5px; font-weight:700; background:#d1fae5; color:#065f46; padding:2px 8px; border-radius:99px;">Your Assigned Pickup Stop</div>' : ''}
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

    this.map.fitBounds(this.routePolyline.getBounds(), { padding: [50, 50] });

    // Populate timeline list
    this.renderTimelineStops(route.stops);

    if (window.gpsEngine) {
      window.gpsEngine.setRouteStops(route.stops);
    }
  }

  renderTimelineStops(stops) {
    const container = document.getElementById('timelineStopsList');
    if (!container) return;

    container.innerHTML = stops.map((s, idx) => {
      const isHostel = s.stop_name.toLowerCase().includes('hostel');
      const isAssigned = this.assignedStop && this.assignedStop.stop_id === s.stop_id;

      return `
        <div style="display:flex; align-items:center; gap:10px; padding:7px 0; border-bottom:1px solid #f1f5f9; cursor:pointer;" onclick="window.app.focusStop(${s.stop_id})">
          <div style="width:20px; height:20px; border-radius:50%; background:${isAssigned ? '#10b981' : (isHostel ? '#f59e0b' : '#e2e8f0')}; color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center;">
            ${s.stop_order || idx + 1}
          </div>
          <div style="flex:1; overflow:hidden;">
            <div style="font-size:12px; font-weight:700; color:#0f172a; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${s.stop_name}</div>
            <div style="font-size:10.5px; color:#64748b;">+${s.estimated_minutes_from_start || (idx * 6)}m • ${isHostel ? 'Hostel' : 'Campus'}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Update Multi-Bus Fleet Markers on the Map
  updateFleetMarkers(fleet) {
    if (!this.map || !fleet) return;

    const colors = {
      1: { hex: '#f59e0b', num: '04' },
      2: { hex: '#3b82f6', num: '08' },
      3: { hex: '#10b981', num: '12' },
      4: { hex: '#8b5cf6', num: '15' }
    };

    fleet.forEach(bus => {
      const info = colors[bus.busId] || { hex: '#0f172a', num: String(bus.busId) };
      const isSelected = window.gpsEngine?.selectedBusId === bus.busId;

      if (!this.fleetMarkers[bus.busId]) {
        const busIcon = L.divIcon({
          className: 'custom-bus-div-icon',
          html: `
            <div class="custom-bus-marker" id="busMarker_${bus.busId}">
              <div class="bus-pulse-ring" style="background:${info.hex}33; border-color:${info.hex}88;"></div>
              <div class="bus-marker-core" style="background:${info.hex}; transform: rotate(${bus.heading || 0}deg);">
                <span style="font-size:11px; font-weight:800; color:#fff;">${info.num}</span>
              </div>
            </div>
          `,
          iconSize: [54, 54],
          iconAnchor: [27, 27]
        });

        const marker = L.marker([bus.latitude, bus.longitude], { icon: busIcon, zIndexOffset: isSelected ? 1200 : 800 })
          .addTo(this.map)
          .bindPopup(`
            <div style="font-family: var(--font-family); padding: 4px; min-width: 180px;">
              <div style="font-weight: 800; font-size: 14px; color: #0f172a;">${bus.busLabel}</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Driver: ${bus.driverName} • ${bus.reg}</div>
              <div style="font-size: 11.5px; font-weight:600; color: #10b981; margin: 4px 0;">Occupancy: ${bus.currentOccupancy}/${bus.capacity} seats</div>
              <button onclick="window.app.selectBus(${bus.busId})" style="width:100%; margin-top:6px; padding:6px; border-radius:8px; border:none; background:#0f172a; color:#fff; font-size:11.5px; font-weight:700; cursor:pointer;">Track This Bus</button>
            </div>
          `);

        this.fleetMarkers[bus.busId] = marker;
      } else {
        const marker = this.fleetMarkers[bus.busId];
        marker.setLatLng([bus.latitude, bus.longitude]);
        const elem = document.querySelector(`#busMarker_${bus.busId} .bus-marker-core`);
        if (elem) {
          elem.style.transform = `rotate(${bus.heading || 0}deg)`;
        }
      }
    });
  }

  updateLiveLocation(locationData) {
    this.currentLocation = locationData;
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
      this.map.flyTo([this.currentLocation.latitude, this.currentLocation.longitude], 15, { duration: 1.2 });
    }
  }

  focusStop(stopId) {
    if (!this.map) return;
    const stop = window.app?.currentRoute?.stops?.find(s => s.stop_id == stopId);
    if (stop) {
      this.map.flyTo([stop.latitude, stop.longitude], 16, { duration: 1.0 });
    }
  }

  attachEvents() {
    document.getElementById('recenterBtn')?.addEventListener('click', () => {
      this.recenter();
    });

    // Toggle Timeline Drawer
    const timelineBtn = document.getElementById('toggleTimelineBtn');
    const timelineContent = document.getElementById('timelinePanelContent');
    timelineBtn?.addEventListener('click', () => {
      this.timelineOpen = !this.timelineOpen;
      timelineContent.style.display = this.timelineOpen ? 'block' : 'none';
    });

    // Skip to next stop
    document.getElementById('simSkipBtn')?.addEventListener('click', () => {
      if (window.gpsEngine) {
        window.gpsEngine.stepIndex = (window.gpsEngine.stepIndex || 0) + 22;
        window.gpsEngine.stepSimulation();
        window.toast?.info('Simulated vehicle progressed to next segment.');
      }
    });

    // Toggle Audio Chime
    const audioBtn = document.getElementById('audioToggleBtn');
    const audioLabel = document.getElementById('audioBtnLabel');
    audioBtn?.addEventListener('click', () => {
      const enabled = window.soundService?.toggleSound();
      if (audioLabel) {
        audioLabel.textContent = enabled ? '🔔 Sound On' : '🔕 Muted';
      }
      if (enabled) {
        window.soundService?.playArrivalChime();
        window.toast?.info('Arrival sound chimes enabled.');
      } else {
        window.toast?.info('Sound chimes muted.');
      }
    });

    // Simulation toggle
    const simBtn = document.getElementById('simToggleBtn');
    if (simBtn) {
      simBtn.addEventListener('click', () => {
        if (window.gpsEngine.isSimulating) {
          window.gpsEngine.stopSimulation();
          simBtn.classList.remove('active');
          document.getElementById('simBtnLabel').textContent = 'Simulate';
          window.toast?.info('Simulation paused.');
        } else {
          window.gpsEngine.startSimulation(105, (loc) => {
            this.updateLiveLocation(loc);
            window.app?.onGpsUpdate(loc);
          });
          simBtn.classList.add('active');
          document.getElementById('simBtnLabel').textContent = 'Simulating';
          window.toast?.success('Simulation resumed across Lavasa fleet.');
        }
      });
    }

    // Speed multiplier toggle
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
