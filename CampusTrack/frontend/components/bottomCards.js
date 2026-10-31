// ==========================================================================
// CampusTrack - Bottom 3 Cards Component
// Exact reproduction of the reference UI bottom card deck
// ==========================================================================

class BottomCardsComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(data = {}) {
    if (!this.container) return;

    const stop = data.stop || {
      stop_name: "St. Peter's Square Stop",
      address: "789 College Blvd, North Campus - Gate 3"
    };

    const bus = data.bus || {
      bus_label: "Bus 04 (South Express)",
      registration_no: "KA-04-E-2024",
      driver_name: "Rajesh Kumar",
      driver_phone: "+1 (555) 890-1234",
      capacity: 42,
      current_occupancy: 34
    };

    const eta = data.eta || { minutes: 7, distanceKm: 2.4 };
    const loc = data.location || { speed: 35, accuracy: 4.2, isLive: true };

    const occupancy = bus.current_occupancy || 34;
    const capacity = bus.capacity || 42;
    const occupancyPct = Math.round((occupancy / capacity) * 100);

    // SVG semi-circle arc calculation (perimeter = PI * R)
    // Radius = 80, Arc circumference = 3.14159 * 80 = ~251.3
    const radius = 80;
    const arcTotal = Math.PI * radius; // ~251.3
    const filledLength = (occupancyPct / 100) * arcTotal;

    this.container.innerHTML = `
      <div class="bottom-cards-deck">
        <!-- Card 1: Stop Location & 3 Metric Tiles -->
        <div class="dash-card">
          <div>
            <div class="card-location-header">
              <div class="location-title-wrap">
                <span class="location-badge-label">Assigned Pickup Stop</span>
                <h3 class="location-main-name" id="cardStopName">${stop.stop_name}</h3>
                <p class="location-sub-address" id="cardStopAddress">${stop.address}</p>
              </div>
              <div class="heart-pin-icon" title="Favorited Student Stop">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
            </div>

            <div class="location-date-row">
              <span>Route 105 • Stop #2</span>
              <span>31 Oct 2026</span>
            </div>
          </div>

          <!-- 3 Rounded Metric Tiles -->
          <div class="location-metrics-grid">
            <!-- Tile 1: ETA -->
            <div class="metric-tile">
              <div class="metric-tile-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <div class="metric-tile-label">Arrival ETA</div>
                <div class="metric-tile-value" id="cardEtaVal">${eta.minutes} mins</div>
              </div>
            </div>

            <!-- Tile 2: Distance -->
            <div class="metric-tile">
              <div class="metric-tile-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
              <div>
                <div class="metric-tile-label">Distance Away</div>
                <div class="metric-tile-value" id="cardDistVal">${eta.distanceKm} km</div>
              </div>
            </div>

            <!-- Tile 3: Speed / GPS Signal -->
            <div class="metric-tile">
              <div class="metric-tile-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>
              </div>
              <div>
                <div class="metric-tile-label">GPS Accuracy</div>
                <div class="metric-tile-value" id="cardGpsVal">±${loc.accuracy || 4}m</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Visual Hero Vehicle & Driver -->
        <div class="dash-card card-visual-media">
          <!-- Real architectural bus transit image -->
          <img class="vehicle-cover-img" src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80" alt="Campus Bus Coach" onerror="this.src='https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=700&q=80'" />
          <div class="visual-overlay-gradient"></div>

          <div class="visual-content-body">
            <div class="driver-pill-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Driver: ${bus.driver_name || 'Rajesh Kumar'}</span>
            </div>
            <h4 class="visual-bus-name" id="cardBusName">${bus.bus_label}</h4>
            <div class="visual-bus-sub">
              <span>${bus.registration_no}</span>
              <span>•</span>
              <span style="color:#34d399; font-weight:600;">Active On Route</span>
            </div>
          </div>
        </div>

        <!-- Card 3: Commuter Community & Radial Gauge Arc (Exact Match to Screenshot!) -->
        <div class="dash-card">
          <div>
            <div class="card-capacity-header">
              <div>
                <h4 class="capacity-title">Commuters</h4>
                <p class="capacity-subtitle">Join our growing community of active campus members.</p>
              </div>
              <!-- Avatar Stack -->
              <div class="avatar-stack">
                <img class="avatar-img" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Student" />
                <img class="avatar-img" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Student" />
                <img class="avatar-img" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Student" />
                <div class="avatar-more-count">+${Math.max(1, occupancy - 3)}</div>
              </div>
            </div>
          </div>

          <!-- Semi-Circle Arc Radial Gauge (Golden Amber from Reference Screenshot!) -->
          <div class="gauge-container">
            <svg class="gauge-svg" viewBox="0 0 200 110">
              <defs>
                <linearGradient id="gaugeAmberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#f59e0b" />
                  <stop offset="100%" stop-color="#fbbf24" />
                </linearGradient>
              </defs>
              <!-- Background Arc -->
              <path class="gauge-bg-path" d="M 20 100 A 80 80 0 0 1 180 100" />
              <!-- Filled Meter Arc -->
              <path class="gauge-meter-path" id="gaugeMeterPath"
                d="M 20 100 A 80 80 0 0 1 180 100"
                stroke-dasharray="${filledLength} ${arcTotal}" />
            </svg>

            <div class="gauge-stats-overlay">
              <div class="gauge-big-number" id="cardGaugeNumber">${occupancy} <span style="font-size:16px; font-weight:600; color:#64748b;">/ ${capacity}</span></div>
              <div class="gauge-sub-label">assigned members (${occupancyPct}%)</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  updateMetrics({ etaMinutes, distanceKm, speed, accuracy }) {
    if (etaMinutes !== undefined) {
      const el = document.getElementById('cardEtaVal');
      if (el) el.textContent = etaMinutes <= 1 ? 'Arriving' : `${etaMinutes} mins`;
    }
    if (distanceKm !== undefined) {
      const el = document.getElementById('cardDistVal');
      if (el) el.textContent = `${distanceKm} km`;
    }
    if (accuracy !== undefined) {
      const el = document.getElementById('cardGpsVal');
      if (el) el.textContent = `±${Math.round(accuracy)}m`;
    }
  }
}

window.BottomCardsComponent = BottomCardsComponent;
