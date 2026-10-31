// ==========================================================================
// CampusTrack - Top Navigation & Filter Bar Component (Lavasa Edition)
// ==========================================================================

class TopbarComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render({ routes = [], currentRouteId = 1, currentRole = 'student', isLive = true, isStale = false }) {
    if (!this.container) return;

    const routesOptions = routes.map(r => `
      <option value="${r.route_id}" ${r.route_id == currentRouteId ? 'selected' : ''}>
        ${r.route_name.split(' - ')[0]} (${r.route_name.split(' - ')[1] || 'Main Line'})
      </option>
    `).join('') || '<option value="1">Route 101 (Lavasa Dasve & Hostels Loop)</option><option value="2">Route 202 (Hillside Express)</option>';

    const liveStatusClass = isLive ? (isStale ? 'stale' : '') : 'offline';
    const liveStatusText = isLive ? (isStale ? 'GPS Stale (>30s)' : 'Live GPS: Synced') : 'GPS Offline';

    this.container.innerHTML = `
      <div class="top-filter-bar">
        <!-- Search Pill -->
        <div class="search-pill-container">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="globalSearchInput" class="search-pill-input" placeholder="Search hostel, student, or bus in Lavasa..." />
        </div>

        <!-- Bus Fleet Selector (4 Buses) -->
        <div class="filter-dropdown-pill">
          <span style="color:#64748b; font-size:12px;">Bus</span>
          <select id="busFilterSelect" class="filter-select">
            <option value="1" selected>Bus 04 (Dasve Loop)</option>
            <option value="2">Bus 08 (Lakeview Shuttle)</option>
            <option value="3">Bus 12 (Hillside Shuttle)</option>
            <option value="4">Bus 15 (Valley View Link)</option>
          </select>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>

        <!-- Route Filter Pill -->
        <div class="filter-dropdown-pill">
          <span style="color:#64748b; font-size:12px;">Route</span>
          <select id="routeFilterSelect" class="filter-select">
            ${routesOptions}
          </select>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>

        <!-- Stop / Hostel Filter Pill (4 Hostels Highlighted) -->
        <div class="filter-dropdown-pill">
          <span style="color:#64748b; font-size:12px;">Hostel / Stop</span>
          <select id="stopFilterSelect" class="filter-select">
            <option value="6" selected>🏨 Banyan Tree Boys Hostel</option>
            <option value="3">🏨 Lakeside Girls Hostel</option>
            <option value="7">🏨 Hillside Scholars Hostel</option>
            <option value="8">🏨 Valley View International Hostel</option>
            <option value="5">🎓 Christ Univ Academic Hub</option>
            <option value="4">🏛️ Dasve Waterfront</option>
            <option value="1">🚌 Central Transit Terminal</option>
          </select>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>

        <!-- Role Switcher Pills -->
        <div class="role-switch-container">
          <button class="role-btn ${currentRole === 'student' ? 'active' : ''}" data-role="student">Student</button>
          <button class="role-btn ${currentRole === 'driver' ? 'active' : ''}" data-role="driver">Driver</button>
          <button class="role-btn ${currentRole === 'admin' ? 'active' : ''}" data-role="admin">Admin</button>
        </div>

        <!-- Live Heartbeat Badge -->
        <div class="live-status-pill ${liveStatusClass}" id="topLiveStatusBadge">
          <span class="live-beacon-dot"></span>
          <span id="topLiveStatusText">${liveStatusText}</span>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const roleBtns = this.container.querySelectorAll('.role-btn');
    roleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetRole = e.target.getAttribute('data-role');
        if (window.app) {
          window.app.switchRole(targetRole);
        }
      });
    });

    const routeSelect = this.container.querySelector('#routeFilterSelect');
    if (routeSelect) {
      routeSelect.addEventListener('change', (e) => {
        if (window.app) {
          window.app.loadRoute(e.target.value);
        }
      });
    }

    const busSelect = this.container.querySelector('#busFilterSelect');
    if (busSelect) {
      busSelect.addEventListener('change', (e) => {
        if (window.app) {
          window.app.selectBus(e.target.value);
        }
      });
    }

    const stopSelect = this.container.querySelector('#stopFilterSelect');
    if (stopSelect) {
      stopSelect.addEventListener('change', (e) => {
        if (window.app && window.app.mapView) {
          window.app.focusStop(e.target.value);
        }
      });
    }
  }

  updateLiveStatus({ isLive, isStale }) {
    const badge = document.getElementById('topLiveStatusBadge');
    const text = document.getElementById('topLiveStatusText');
    if (!badge || !text) return;

    badge.className = `live-status-pill ${isLive ? (isStale ? 'stale' : '') : 'offline'}`;
    text.textContent = isLive ? (isStale ? 'GPS Stale (>30s)' : 'Live GPS: Synced') : 'GPS Offline';
  }
}

window.TopbarComponent = TopbarComponent;
