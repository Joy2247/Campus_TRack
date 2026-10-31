// ==========================================================================
// CampusTrack - Route Stops & Schedule Modal (Lavasa Campus & 4 Hostels)
// ==========================================================================

class RouteModalComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(route = null, assignedStop = null) {
    if (!this.container) return;

    const stops = route?.stops || [
      { stop_order: 1, stop_name: 'Lavasa Central Transit Terminal', address: 'Main Dasve Bus Depot, Lavasa Entry Road', estimated_minutes_from_start: 0 },
      { stop_order: 2, stop_name: 'Portofino Promenade Plaza', address: 'Portofino Street, Lakefront Boulevard', estimated_minutes_from_start: 5 },
      { stop_order: 3, stop_name: '🏨 Lakeside Girls Hostel (Block A & B)', address: 'Lakeside Heights, Warasgaon Shore Road', estimated_minutes_from_start: 11 },
      { stop_order: 4, stop_name: 'Dasve Waterfront & Town Hall', address: 'Dasve Circle, Convention Center Road', estimated_minutes_from_start: 18 },
      { stop_order: 5, stop_name: 'Christ University Lavasa Academic Hub', address: 'Christ University Main Academic Block & Library', estimated_minutes_from_start: 24 },
      { stop_order: 6, stop_name: '🏨 Banyan Tree Boys Hostel (North Wing)', address: 'Banyan Tree Residency, North Hill Road', estimated_minutes_from_start: 30 },
      { stop_order: 7, stop_name: '🏨 Hillside Scholars Hostel (Gate 2)', address: 'Hillside Heights Hostel Complex, Ridge Way', estimated_minutes_from_start: 36 },
      { stop_order: 8, stop_name: '🏨 Valley View International Hostel', address: 'Valley View Residency & Scholars Block, Upper Dasve', estimated_minutes_from_start: 43 }
    ];

    const stopsList = stops.map((s, idx) => {
      const isAssigned = assignedStop && (assignedStop.stop_id === s.stop_id || s.stop_name.includes(assignedStop.stop_name));
      const isHostel = s.stop_name.toLowerCase().includes('hostel');

      return `
        <div style="display:flex; gap:16px; position:relative; padding-bottom:18px;">
          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="width:28px; height:28px; border-radius:50%; background:${isAssigned ? '#10b981' : (isHostel ? '#f59e0b' : '#0f172a')}; color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; z-index:2; box-shadow:0 2px 6px rgba(0,0,0,0.15);">
              ${s.stop_order || idx + 1}
            </div>
            ${idx < stops.length - 1 ? '<div style="width:2px; height:100%; background:#e2e8f0; position:absolute; top:28px; z-index:1;"></div>' : ''}
          </div>
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h4 style="font-size:14px; font-weight:700; color:#0f172a;">${s.stop_name}</h4>
              <span style="font-size:11.5px; font-weight:700; color:#64748b; background:#f1f5f9; padding:2px 8px; border-radius:99px;">+${s.estimated_minutes_from_start || (idx * 6)}m</span>
            </div>
            <p style="font-size:12px; color:#64748b; margin-top:2px;">${s.address || 'Designated Lavasa Transit Point'}</p>
            ${isHostel ? '<span style="display:inline-block; font-size:10.5px; font-weight:700; color:#92400e; background:#fef3c7; padding:2px 8px; border-radius:99px; margin-top:4px; margin-right:6px;">🏨 Student Hostel Block</span>' : ''}
            ${isAssigned ? '<span style="display:inline-block; font-size:10.5px; font-weight:700; color:#065f46; background:#d1fae5; padding:2px 8px; border-radius:99px; margin-top:4px;">Your Assigned Pickup Point</span>' : ''}
          </div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="modal-overlay" id="routeModalOverlay">
        <div class="modal-card" style="max-width:560px;">
          <div class="modal-header">
            <div>
              <div style="font-size:11px; font-weight:700; color:#f59e0b; text-transform:uppercase; letter-spacing:0.05em;">Lavasa Hill City Route Timetable</div>
              <h3 class="modal-title">${route?.route_name || 'Route 101 - Lavasa Dasve & 4 Hostels Loop'}</h3>
            </div>
            <button class="modal-close-btn" id="closeRouteModalBtn">&times;</button>
          </div>

          <div style="font-size:12.5px; color:#64748b; margin-bottom:18px;">
            Daily circular transit loop serving the 4 student residences, Christ University campus, and Dasve Lakefront.
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
