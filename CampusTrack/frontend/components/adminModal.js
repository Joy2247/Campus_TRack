// ==========================================================================
// CampusTrack - Admin Fleet Portal Modal (SRS FR-ADM Compliant)
// ==========================================================================

class AdminModalComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  async render() {
    if (!this.container) return;

    let overview = { stats: { activeBuses: 2, activeTrips: 1, totalStudents: 3, totalDrivers: 2, onTimeRate: '98.4%' } };
    let buses = [];
    let drivers = [];
    let trips = [];

    try {
      overview = await window.apiService.getAdminOverview();
      buses = await window.apiService.getAdminBuses().then(r => r.buses || []);
      drivers = await window.apiService.getAdminDrivers().then(r => r.drivers || []);
      trips = await window.apiService.getAdminTrips().then(r => r.trips || []);
    } catch (e) {
      console.warn('Admin data load using local defaults.');
    }

    const busRows = (buses.length ? buses : [
      { bus_id: 1, bus_label: 'Bus 04 (South Express)', registration_no: 'KA-04-E-2024', capacity: 42, status: 'active', driver_name: 'Rajesh Kumar' },
      { bus_id: 2, bus_label: 'Bus 07 (North Shuttle)', registration_no: 'KA-04-E-5512', capacity: 38, status: 'active', driver_name: 'Michael Chen' },
      { bus_id: 3, bus_label: 'Bus 12 (Tech Park)', registration_no: 'KA-04-E-8830', capacity: 45, status: 'maintenance', driver_name: 'Unassigned' }
    ]).map(b => `
      <tr style="border-bottom:1px solid #f1f5f9; font-size:13px;">
        <td style="padding:10px 12px; font-weight:700; color:#0f172a;">${b.bus_label}</td>
        <td style="padding:10px 12px; color:#64748b;">${b.registration_no}</td>
        <td style="padding:10px 12px;">${b.capacity} seats</td>
        <td style="padding:10px 12px; color:#334155;">${b.driver_name || 'Unassigned'}</td>
        <td style="padding:10px 12px;">
          <span style="display:inline-block; padding:3px 8px; border-radius:99px; font-size:11px; font-weight:700; background:${b.status === 'active' ? '#d1fae5; color:#065f46;' : '#fee2e2; color:#b91c1c;'}">
            ${b.status.toUpperCase()}
          </span>
        </td>
      </tr>
    `).join('');

    this.container.innerHTML = `
      <div class="modal-overlay" id="adminModalOverlay">
        <div class="modal-card" style="max-width:840px;">
          <div class="modal-header">
            <div>
              <div style="font-size:11px; font-weight:700; color:#10b981; text-transform:uppercase; letter-spacing:0.05em;">Transport Administration</div>
              <h3 class="modal-title">Fleet & Operations Dashboard</h3>
            </div>
            <button class="modal-close-btn" id="closeAdminModalBtn">&times;</button>
          </div>

          <!-- KPI Stats Grid -->
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin-bottom:20px;">
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:14px; text-align:center;">
              <div style="font-size:11px; color:#64748b; font-weight:600; text-transform:uppercase;">Active Fleet</div>
              <div style="font-size:22px; font-weight:800; color:#0f172a; margin-top:2px;">${overview.stats?.activeBuses || 2} / 3</div>
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:14px; text-align:center;">
              <div style="font-size:11px; color:#64748b; font-weight:600; text-transform:uppercase;">Trips En Route</div>
              <div style="font-size:22px; font-weight:800; color:#10b981; margin-top:2px;">${overview.stats?.activeTrips || 1}</div>
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:14px; text-align:center;">
              <div style="font-size:11px; color:#64748b; font-weight:600; text-transform:uppercase;">Registered Students</div>
              <div style="font-size:22px; font-weight:800; color:#0f172a; margin-top:2px;">38</div>
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:14px; text-align:center;">
              <div style="font-size:11px; color:#64748b; font-weight:600; text-transform:uppercase;">On-Time Rate</div>
              <div style="font-size:22px; font-weight:800; color:#f59e0b; margin-top:2px;">${overview.stats?.onTimeRate || '98.4%'}</div>
            </div>
          </div>

          <!-- Fleet Management Table -->
          <div style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <h4 style="font-size:15px; font-weight:700; color:#0f172a;">Fleet Vehicles</h4>
              <button id="addNewBusBtn" style="padding:6px 14px; border-radius:99px; border:none; background:#0f172a; color:#fff; font-size:12px; font-weight:600; cursor:pointer;">+ Add Bus</button>
            </div>
            <div style="border:1px solid #e2e8f0; border-radius:14px; overflow:hidden;">
              <table style="width:100%; border-collapse:collapse; text-align:left;">
                <thead style="background:#f8fafc; border-bottom:1px solid #e2e8f0; font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">
                  <tr>
                    <th style="padding:10px 12px;">Bus Label</th>
                    <th style="padding:10px 12px;">Plate No</th>
                    <th style="padding:10px 12px;">Capacity</th>
                    <th style="padding:10px 12px;">Assigned Driver</th>
                    <th style="padding:10px 12px;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${busRows}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Add Bus Form (Toggleable) -->
          <div id="addBusFormContainer" style="display:none; background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:16px; margin-bottom:20px;">
            <h5 style="font-size:13px; font-weight:700; margin-bottom:12px;">Provision New Vehicle</h5>
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
              <input type="text" id="newBusLabel" placeholder="Bus Label (e.g. Bus 15)" style="padding:8px 12px; border-radius:8px; border:1px solid #cbd5e1; font-size:13px;" />
              <input type="text" id="newBusReg" placeholder="Registration (e.g. KA-04-E-9999)" style="padding:8px 12px; border-radius:8px; border:1px solid #cbd5e1; font-size:13px;" />
              <input type="number" id="newBusCapacity" placeholder="Capacity (e.g. 40)" value="40" style="padding:8px 12px; border-radius:8px; border:1px solid #cbd5e1; font-size:13px;" />
            </div>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:12px;">
              <button id="cancelAddBusBtn" style="padding:6px 14px; border-radius:8px; border:1px solid #cbd5e1; background:#fff; font-size:12px; cursor:pointer;">Cancel</button>
              <button id="saveNewBusBtn" style="padding:6px 14px; border-radius:8px; border:none; background:#10b981; color:#fff; font-size:12px; font-weight:700; cursor:pointer;">Save Bus</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const overlay = document.getElementById('adminModalOverlay');
    document.getElementById('closeAdminModalBtn')?.addEventListener('click', () => {
      overlay.classList.remove('open');
    });

    const addBtn = document.getElementById('addNewBusBtn');
    const form = document.getElementById('addBusFormContainer');
    addBtn?.addEventListener('click', () => {
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('cancelAddBusBtn')?.addEventListener('click', () => {
      form.style.display = 'none';
    });

    document.getElementById('saveNewBusBtn')?.addEventListener('click', async () => {
      const bus_label = document.getElementById('newBusLabel')?.value;
      const registration_no = document.getElementById('newBusReg')?.value;
      const capacity = document.getElementById('newBusCapacity')?.value;

      if (!bus_label || !registration_no) {
        window.toast?.error('Please provide both Bus Label and Registration Number.');
        return;
      }

      try {
        await window.apiService.createAdminBus({ bus_label, registration_no, capacity: Number(capacity) });
        window.toast?.success(`Bus '${bus_label}' provisioned successfully.`);
        form.style.display = 'none';
        this.render();
      } catch (err) {
        window.toast?.error(err.message);
      }
    });
  }

  open() {
    this.render().then(() => {
      document.getElementById('adminModalOverlay')?.classList.add('open');
    });
  }

  close() {
    document.getElementById('adminModalOverlay')?.classList.remove('open');
  }
}

window.AdminModalComponent = AdminModalComponent;
