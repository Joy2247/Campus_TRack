// ==========================================================================
// CampusTrack - Digital Boarding Pass & QR Code Verification Modal
// ==========================================================================

class BoardingPassModalComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(user = null, bus = null, stop = null) {
    if (!this.container) return;

    const studentName = user?.name || 'Shreyansh Patel';
    const rollNo = user?.profile?.roll_no || 'CS-2024-042';
    const busLabel = bus?.bus_label || 'Bus 04 (Dasve & Hostels Loop)';
    const busReg = bus?.registration_no || 'MH-12-CT-2024';
    const hostelStop = stop?.stop_name || 'Banyan Tree Boys Hostel (North Wing)';
    const seatNo = 'Seat #14';
    const dateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    this.container.innerHTML = `
      <div class="modal-overlay" id="boardingPassModalOverlay">
        <div class="modal-card" style="max-width:440px; padding:0; background:transparent; box-shadow:none; border:none;">
          <!-- Ticket Pass Container -->
          <div style="background:#ffffff; border-radius:28px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.35); border:1px solid rgba(226,232,240,0.9);">
            <!-- Ticket Header -->
            <div style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:24px 24px 20px 24px; position:relative;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:18px;">🚌</span>
                  <span style="font-weight:800; font-size:14px; letter-spacing:0.04em;">CAMPUSTRACK BOARDING PASS</span>
                </div>
                <button class="modal-close-btn" id="closePassModalBtn" style="background:rgba(255,255,255,0.15); color:#fff;">&times;</button>
              </div>

              <div style="margin-top:16px;">
                <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; font-weight:600;">Authorized Student Commuter</div>
                <div style="font-size:20px; font-weight:800; color:#fff; margin-top:2px;">${studentName}</div>
                <div style="font-size:12px; color:#cbd5e1;">Roll No: ${rollNo} • Dept: Computer Science</div>
              </div>
            </div>

            <!-- Perforated Cutout Line -->
            <div style="position:relative; height:20px; background:#ffffff; display:flex; align-items:center; justify-content:space-between;">
              <div style="width:20px; height:20px; background:#0f172a; border-radius:50%; margin-left:-10px;"></div>
              <div style="flex:1; border-bottom:2px dashed #e2e8f0; margin:0 8px;"></div>
              <div style="width:20px; height:20px; background:#0f172a; border-radius:50%; margin-right:-10px;"></div>
            </div>

            <!-- Ticket Body -->
            <div style="padding:16px 24px 24px 24px; background:#ffffff;">
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:18px;">
                <div>
                  <div style="font-size:10.5px; font-weight:600; color:#64748b; text-transform:uppercase;">Assigned Bus</div>
                  <div style="font-size:14px; font-weight:700; color:#0f172a; margin-top:2px;">${busLabel.split(' (')[0]}</div>
                  <div style="font-size:11px; color:#64748b;">${busReg}</div>
                </div>
                <div>
                  <div style="font-size:10.5px; font-weight:600; color:#64748b; text-transform:uppercase;">Seat / Category</div>
                  <div style="font-size:14px; font-weight:700; color:#10b981; margin-top:2px;">${seatNo}</div>
                  <div style="font-size:11px; color:#64748b;">Hostel Resident</div>
                </div>
                <div style="grid-column:span 2;">
                  <div style="font-size:10.5px; font-weight:600; color:#64748b; text-transform:uppercase;">Designated Boarding Point</div>
                  <div style="font-size:14px; font-weight:700; color:#0f172a; margin-top:2px;">${hostelStop}</div>
                  <div style="font-size:11px; color:#64748b;">Lavasa Dasve Lake & Hostels Corridor</div>
                </div>
              </div>

              <!-- Animated SVG Simulated QR Code -->
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:18px; text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <svg width="140" height="140" viewBox="0 0 100 100" style="margin-bottom:8px;">
                  <rect width="100" height="100" fill="#ffffff" rx="8" />
                  <!-- Corner Anchors -->
                  <rect x="10" y="10" width="24" height="24" fill="#0f172a" rx="4" />
                  <rect x="14" y="14" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="18" y="18" width="8" height="8" fill="#0f172a" rx="1" />

                  <rect x="66" y="10" width="24" height="24" fill="#0f172a" rx="4" />
                  <rect x="70" y="14" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="74" y="18" width="8" height="8" fill="#0f172a" rx="1" />

                  <rect x="10" y="66" width="24" height="24" fill="#0f172a" rx="4" />
                  <rect x="14" y="70" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="18" y="74" width="8" height="8" fill="#0f172a" rx="1" />

                  <!-- Pseudo QR Code Data Blocks -->
                  <rect x="38" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="16" width="6" height="6" fill="#0f172a" />
                  <rect x="56" y="22" width="6" height="6" fill="#0f172a" />
                  <rect x="38" y="38" width="12" height="12" fill="#0f172a" rx="2" />
                  <rect x="54" y="38" width="8" height="6" fill="#0f172a" />
                  <rect x="66" y="46" width="8" height="8" fill="#0f172a" />
                  <rect x="14" y="44" width="8" height="8" fill="#0f172a" />
                  <rect x="26" y="52" width="6" height="6" fill="#0f172a" />
                  <rect x="38" y="60" width="8" height="6" fill="#0f172a" />
                  <rect x="50" y="68" width="8" height="8" fill="#0f172a" />
                  <rect x="64" y="74" width="12" height="12" fill="#0f172a" rx="2" />
                  <rect x="80" y="66" width="6" height="6" fill="#0f172a" />
                  <circle cx="50" cy="50" r="4" fill="#f59e0b" />
                </svg>

                <div style="font-size:11px; font-weight:700; color:#0f172a; letter-spacing:0.04em;">DIGITAL BOARDING PASS VALID</div>
                <div style="font-size:10px; color:#64748b; margin-top:2px;">Scan at bus entrance • Valid for ${dateStr}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('closePassModalBtn')?.addEventListener('click', () => {
      this.close();
    });
  }

  open(user, bus, stop) {
    this.render(user, bus, stop);
    document.getElementById('boardingPassModalOverlay')?.classList.add('open');
  }

  close() {
    document.getElementById('boardingPassModalOverlay')?.classList.remove('open');
  }
}

window.BoardingPassModalComponent = BoardingPassModalComponent;
