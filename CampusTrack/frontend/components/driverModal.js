// ==========================================================================
// CampusTrack - Driver Console Modal Component (SRS FR-DRV Compliant)
// ==========================================================================

class DriverModalComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(trip = null, driver = null) {
    if (!this.container) return;

    const tripStatus = trip ? trip.status : 'Active';
    const busLabel = trip && trip.bus ? trip.bus.bus_label : 'Bus 04 (South Express)';
    const routeName = trip && trip.route ? trip.route.route_name : 'Route 105 - West Campus';

    this.container.innerHTML = `
      <div class="modal-overlay" id="driverModalOverlay">
        <div class="modal-card">
          <div class="modal-header">
            <div>
              <div style="font-size:11px; font-weight:700; color:#3b82f6; text-transform:uppercase; letter-spacing:0.05em;">Driver Operations Console</div>
              <h3 class="modal-title">Trip & GPS Control</h3>
            </div>
            <button class="modal-close-btn" id="closeDriverModalBtn">&times;</button>
          </div>

          <!-- Driver Safety Warning (SRS FR-DRV-014) -->
          <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:14px; padding:12px 16px; margin-bottom:18px; display:flex; align-items:center; gap:12px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <div style="font-size:12.5px; color:#92400e; font-weight:500;">
              <strong>Driver Safety Protocol:</strong> Start tracking before departing the terminal. Avoid touching your smartphone while driving.
            </div>
          </div>

          <!-- Active Assignment Overview -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin-bottom:20px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div style="font-size:11px; color:#64748b; font-weight:600; text-transform:uppercase;">Vehicle</div>
              <div style="font-size:15px; font-weight:700; color:#0f172a; margin-top:2px;">${busLabel}</div>
            </div>
            <div>
              <div style="font-size:11px; color:#64748b; font-weight:600; text-transform:uppercase;">Trip Status</div>
              <div style="font-size:15px; font-weight:700; color:#10b981; margin-top:2px;" id="driverTripStatusText">${tripStatus}</div>
            </div>
            <div style="grid-column:span 2;">
              <div style="font-size:11px; color:#64748b; font-weight:600; text-transform:uppercase;">Assigned Route</div>
              <div style="font-size:13px; font-weight:600; color:#334155; margin-top:2px;">${routeName}</div>
            </div>
          </div>

          <!-- Big Action Controls (SRS FR-DRV-002, 009, 010) -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
            <button id="driverStartTripBtn" style="padding:16px; border-radius:16px; border:none; background:#10b981; color:#fff; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 12px rgba(16,185,129,0.3); transition:all 0.2s;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              START TRIP
            </button>

            <button id="driverPauseTripBtn" style="padding:16px; border-radius:16px; border:none; background:#f59e0b; color:#fff; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 12px rgba(245,158,11,0.3); transition:all 0.2s;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
              PAUSE TRIP
            </button>

            <button id="driverResumeTripBtn" style="padding:16px; border-radius:16px; border:none; background:#3b82f6; color:#fff; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 12px rgba(59,130,246,0.3); transition:all 0.2s;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              RESUME TRIP
            </button>

            <button id="driverEndTripBtn" style="padding:16px; border-radius:16px; border:none; background:#ef4444; color:#fff; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 12px rgba(239,68,68,0.3); transition:all 0.2s;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14"></rect></svg>
              COMPLETE TRIP
            </button>
          </div>

          <!-- GPS Location Mode Selector -->
          <div style="background:#f1f5f9; border-radius:14px; padding:14px; margin-bottom:18px;">
            <div style="font-size:12px; font-weight:700; color:#334155; margin-bottom:8px;">GPS Signal Source:</div>
            <div style="display:flex; gap:10px;">
              <button id="toggleSimulatorBtn" style="flex:1; padding:10px; border-radius:10px; border:1px solid #cbd5e1; background:#0f172a; color:#fff; font-size:12px; font-weight:600; cursor:pointer;">
                Autonomous Route Simulator (Active)
              </button>
              <button id="toggleRealGpsBtn" style="flex:1; padding:10px; border-radius:10px; border:1px solid #cbd5e1; background:#ffffff; color:#334155; font-size:12px; font-weight:600; cursor:pointer;">
                Use Device Geolocation (GPS)
              </button>
            </div>
          </div>

          <!-- Report Service Issue (SRS FR-DRV-013) -->
          <div>
            <div style="font-size:12px; font-weight:700; color:#334155; margin-bottom:8px;">Report Service Issue / Delay:</div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button class="issue-tag-btn" data-issue="Heavy Traffic" style="padding:7px 12px; border-radius:99px; border:1px solid #cbd5e1; background:#fff; font-size:12px; cursor:pointer;">🚦 Heavy Traffic (+10m)</button>
              <button class="issue-tag-btn" data-issue="Mechanical Breakdown" style="padding:7px 12px; border-radius:99px; border:1px solid #cbd5e1; background:#fff; font-size:12px; cursor:pointer;">🔧 Mechanical Issue</button>
              <button class="issue-tag-btn" data-issue="Inclement Weather" style="padding:7px 12px; border-radius:99px; border:1px solid #cbd5e1; background:#fff; font-size:12px; cursor:pointer;">🌧️ Rain / Fog Delay</button>
              <button class="issue-tag-btn" data-issue="Emergency SOS" style="padding:7px 12px; border-radius:99px; border:1px solid #fca5a5; background:#fee2e2; color:#b91c1c; font-size:12px; font-weight:700; cursor:pointer;">🚨 Emergency Stop</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const overlay = document.getElementById('driverModalOverlay');
    document.getElementById('closeDriverModalBtn')?.addEventListener('click', () => {
      overlay.classList.remove('open');
    });

    // Start Trip
    document.getElementById('driverStartTripBtn')?.addEventListener('click', async () => {
      try {
        await window.apiService.startDriverTrip();
        document.getElementById('driverTripStatusText').textContent = 'Active';
        document.getElementById('driverTripStatusText').style.color = '#10b981';
        window.toast?.success('Trip started! Live GPS transmission initiated.');
        window.gpsEngine.startSimulation(105, (loc) => {
          window.app?.onGpsUpdate(loc);
        });
      } catch (err) {
        window.toast?.error(err.message);
      }
    });

    // Pause Trip
    document.getElementById('driverPauseTripBtn')?.addEventListener('click', async () => {
      try {
        await window.apiService.pauseDriverTrip(105, 'Brief operational pause');
        document.getElementById('driverTripStatusText').textContent = 'Paused';
        document.getElementById('driverTripStatusText').style.color = '#f59e0b';
        window.gpsEngine.stopSimulation();
        window.toast?.warning('Trip paused. Students notified.');
      } catch (err) {
        window.toast?.error(err.message);
      }
    });

    // Resume Trip
    document.getElementById('driverResumeTripBtn')?.addEventListener('click', async () => {
      try {
        await window.apiService.resumeDriverTrip(105);
        document.getElementById('driverTripStatusText').textContent = 'Active';
        document.getElementById('driverTripStatusText').style.color = '#10b981';
        window.gpsEngine.startSimulation(105, (loc) => {
          window.app?.onGpsUpdate(loc);
        });
        window.toast?.success('Trip resumed.');
      } catch (err) {
        window.toast?.error(err.message);
      }
    });

    // End Trip
    document.getElementById('driverEndTripBtn')?.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to complete and end this trip?')) return;
      try {
        await window.apiService.endDriverTrip(105);
        document.getElementById('driverTripStatusText').textContent = 'Completed';
        document.getElementById('driverTripStatusText').style.color = '#64748b';
        window.gpsEngine.stopSimulation();
        window.toast?.info('Trip marked as completed. GPS transmission halted.');
      } catch (err) {
        window.toast?.error(err.message);
      }
    });

    // Toggle Simulator vs Real GPS
    document.getElementById('toggleSimulatorBtn')?.addEventListener('click', (e) => {
      window.gpsEngine.stopRealGps();
      window.gpsEngine.startSimulation(105, (loc) => window.app?.onGpsUpdate(loc));
      e.target.style.background = '#0f172a';
      e.target.style.color = '#fff';
      document.getElementById('toggleRealGpsBtn').style.background = '#fff';
      document.getElementById('toggleRealGpsBtn').style.color = '#334155';
      window.toast?.info('Switched to Autonomous Route Simulator.');
    });

    document.getElementById('toggleRealGpsBtn')?.addEventListener('click', (e) => {
      window.gpsEngine.startRealGps(105, (loc) => window.app?.onGpsUpdate(loc));
      e.target.style.background = '#0f172a';
      e.target.style.color = '#fff';
      document.getElementById('toggleSimulatorBtn').style.background = '#fff';
      document.getElementById('toggleSimulatorBtn').style.color = '#334155';
      window.toast?.info('Requesting browser geolocation permission...');
    });

    // Issue report buttons
    this.container.querySelectorAll('.issue-tag-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const issue = btn.getAttribute('data-issue');
        try {
          await window.apiService.reportDriverIssue({
            tripId: 105,
            issueType: issue,
            description: `Driver reported: ${issue}`
          });
          window.toast?.warning(`Alert dispatched: ${issue}`);
        } catch (err) {
          window.toast?.error(err.message);
        }
      });
    });
  }

  open() {
    document.getElementById('driverModalOverlay')?.classList.add('open');
  }

  close() {
    document.getElementById('driverModalOverlay')?.classList.remove('open');
  }
}

window.DriverModalComponent = DriverModalComponent;
