// ==========================================================================
// CampusTrack - Bottom 3 Cards Component (Lavasa Edition with Boarding Pass)
// ==========================================================================

class BottomCardsComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(data = {}) {
    if (!this.container) return;

    const stop = data.stop || {
      stop_name: "Banyan Tree Boys Hostel (North Wing)",
      address: "Banyan Tree Residency, North Hill Road, Lavasa"
    };

    const bus = data.bus || {
      bus_label: "Bus 04 (Dasve & Hostels Loop)",
      registration_no: "MH-12-CT-2024",
      driver_name: "Rajesh Kumar",
      driver_phone: "+91 98221 44550",
      capacity: 42,
      current_occupancy: 35
    };

    const eta = data.eta || { minutes: 8, distanceKm: 1.8 };
    const loc = data.location || { speed: 32, accuracy: 3.8, isLive: true };

    const occupancy = bus.current_occupancy || 35;
    const capacity = bus.capacity || 42;
    const occupancyPct = Math.round((occupancy / capacity) * 100);

    const radius = 80;
    const arcTotal = Math.PI * radius; // ~251.3
    const filledLength = (occupancyPct / 100) * arcTotal;

    this.container.innerHTML = `
      <div class="bottom-cards-deck">
        <!-- Card 1: Stop / Hostel Location & 3 Metric Tiles -->
        <div class="dash-card">
          <div>
            <div class="card-location-header">
              <div class="location-title-wrap">
                <span class="location-badge-label">Assigned Student Residence</span>
                <h3 class="location-main-name" id="cardStopName">${stop.stop_name}</h3>
                <p class="location-sub-address" id="cardStopAddress">${stop.address}</p>
              </div>
              <div class="heart-pin-icon" title="Favorited Hostel Stop">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
            </div>

            <div class="location-date-row" style="align-items:center;">
              <span>Lavasa Route 101 • Stop #6</span>
              <button id="openPassBtn" style="padding:4px 10px; border-radius:99px; border:1px solid #cbd5e1; background:#ffffff; color:#0f172a; font-size:11px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:4px; box-shadow:0 1px 4px rgba(0,0,0,0.04);">
                <span>🎟️ Boarding Pass</span>
              </button>
            </div>
          </div>

          <!-- 3 Rounded Metric Tiles (Exact Layout from Reference Screenshot) -->
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

            <!-- Tile 3: Cruising Speed / GPS -->
            <div class="metric-tile">
              <div class="metric-tile-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>
              </div>
              <div>
                <div class="metric-tile-label">GPS Accuracy</div>
                <div class="metric-tile-value" id="cardGpsVal">±${loc.accuracy || 3.8}m</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Visual Hero Vehicle & Driver -->
        <div class="dash-card card-visual-media">
          <img class="vehicle-cover-img" src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80" alt="Lavasa Campus Coach" onerror="this.src='https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=700&q=80'" />
          <div class="visual-overlay-gradient"></div>

          <div class="visual-content-body">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div class="driver-pill-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Driver: ${bus.driver_name || 'Rajesh Kumar'}</span>
              </div>
              <a href="tel:${bus.driver_phone?.replace(/[^0-9+]/g, '') || '9822144550'}" style="text-decoration:none; padding:4px 10px; border-radius:99px; background:rgba(255,255,255,0.2); backdrop-filter:blur(8px); color:#fff; font-size:11px; font-weight:700; border:1px solid rgba(255,255,255,0.3);">
                📞 Call Driver
              </a>
            </div>

            <h4 class="visual-bus-name" id="cardBusName">${bus.bus_label}</h4>
            <div class="visual-bus-sub">
              <span>${bus.registration_no}</span>
              <span>•</span>
              <span style="color:#34d399; font-weight:600;">Active in Lavasa</span>
            </div>
          </div>
        </div>

        <!-- Card 3: Hostel Commuters & Radial Gauge Arc (Exact Match to Screenshot!) -->
        <div class="dash-card">
          <div>
            <div class="card-capacity-header">
              <div>
                <h4 class="capacity-title">Hostel Commuters</h4>
                <p class="capacity-subtitle">Connect across all 4 Lavasa student residences.</p>
              </div>
              <div class="avatar-stack">
                <img class="avatar-img" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Hosteller" />
                <img class="avatar-img" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Hosteller" />
                <img class="avatar-img" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Hosteller" />
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
              <path class="gauge-bg-path" d="M 20 100 A 80 80 0 0 1 180 100" />
              <path class="gauge-meter-path" id="gaugeMeterPath"
                d="M 20 100 A 80 80 0 0 1 180 100"
                stroke-dasharray="${filledLength} ${arcTotal}" />
            </svg>

            <div class="gauge-stats-overlay">
              <div class="gauge-big-number" id="cardGaugeNumber">${occupancy} <span style="font-size:16px; font-weight:600; color:#64748b;">/ ${capacity}</span></div>
              <div class="gauge-sub-label">hostellers onboard (${occupancyPct}%)</div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('openPassBtn')?.addEventListener('click', () => {
      window.app?.openBoardingPassModal();
    });
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
      if (el) el.textContent = `±${accuracy.toFixed(1)}m`;
    }
  }
}

window.BottomCardsComponent = BottomCardsComponent;
