// ==========================================================================
// CampusTrack - Route Stops & Schedule Modal
// ==========================================================================

class RouteModalComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(route = null, assignedStop = null) {
    if (!this.container) return;

    const stops = route?.stops || [
      { stop_order: 1, stop_name: 'Westside Transit Center', address: 'Bay 4, Westside Bus Depot', estimated_minutes_from_start: 0 },
      { stop_order: 2, stop_name: "St. Peter's Square Stop", address: 'Opposite City Library, 789 College Blvd', estimated_minutes_from_start: 8 },
      { stop_order: 3, stop_name: 'Greenwood Highlands', address: 'Greenwood Gate 2, Ring Road', estimated_minutes_from_start: 16 },
      { stop_order: 4, stop_name: 'South Campus Junction', address: 'Near South Gate Overpass', estimated_minutes_from_start: 25 },
      { stop_order: 5, stop_name: 'University Engineering Annex', address: 'Building B Drop-off Point', estimated_minutes_from_start: 33 },
      { stop_order: 6, stop_name: 'Main Campus Central Terminal', address: 'University Central Oval Terminal', estimated_minutes_from_start: 42 }
    ];

    const stopsList = stops.map((s, idx) => {
      const isAssigned = assignedStop && (assignedStop.stop_id === s.stop_id || s.stop_order === 2);
      return `
        <div style="display:flex; gap:16px; position:relative; padding-bottom:20px;">
          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="width:26px; height:26px; border-radius:50%; background:${isAssigned ? '#10b981' : '#0f172a'}; color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; z-index:2;">
              ${s.stop_order || idx + 1}
            </div>
            ${idx < stops.length - 1 ? '<div style="width:2px; height:100%; background:#e2e8f0; position:absolute; top:26px; z-index:1;"></div>' : ''}
          </div>
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h4 style="font-size:14.5px; font-weight:700; color:#0f172a;">${s.stop_name}</h4>
              <span style="font-size:11.5px; font-weight:700; color:#64748b; background:#f1f5f9; padding:2px 8px; border-radius:99px;">+${s.estimated_minutes_from_start || (idx * 8)}m</span>
            </div>
            <p style="font-size:12px; color:#64748b; margin-top:2px;">${s.address || 'Designated Campus Transit Point'}</p>
            ${isAssigned ? '<span style="display:inline-block; font-size:10.5px; font-weight:700; color:#065f46; background:#d1fae5; padding:2px 8px; border-radius:99px; margin-top:4px;">Your Assigned Pickup Stop</span>' : ''}
          </div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="modal-overlay" id="routeModalOverlay">
        <div class="modal-card" style="max-width:540px;">
          <div class="modal-header">
            <div>
              <div style="font-size:11px; font-weight:700; color:#f59e0b; text-transform:uppercase; letter-spacing:0.05em;">Route Progression</div>
              <h3 class="modal-title">${route?.route_name || 'Route 105 - West Campus'}</h3>
            </div>
            <button class="modal-close-btn" id="closeRouteModalBtn">&times;</button>
          </div>

          <div style="font-size:12.5px; color:#64748b; margin-bottom:18px;">
            ${route?.description || 'Daily campus express line with scheduled stops. Real-time arrival updates calculated dynamically.'}
          </div>

          <div style="padding-left:6px;">
            ${stopsList}
          </div>
        </div>
      </div>
    `;

    document.getElementById('closeRouteModalBtn')?.addEventListener('click', () => {
      this.close();
    });
  }

  open(route, assignedStop) {
    this.render(route, assignedStop);
    document.getElementById('routeModalOverlay')?.classList.add('open');
  }

  close() {
    document.getElementById('routeModalOverlay')?.classList.remove('open');
  }
}

window.RouteModalComponent = RouteModalComponent;
