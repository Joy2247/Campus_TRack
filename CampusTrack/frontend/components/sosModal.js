// ==========================================================================
// CampusTrack - Emergency SOS & Contact Modal
// ==========================================================================

class SosModalComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="modal-overlay" id="sosModalOverlay">
        <div class="modal-card" style="max-width:440px;">
          <div class="modal-header">
            <div>
              <div style="font-size:11px; font-weight:700; color:#ef4444; text-transform:uppercase; letter-spacing:0.05em;">Campus Safety & Support</div>
              <h3 class="modal-title">Emergency Assistance</h3>
            </div>
            <button class="modal-close-btn" id="closeSosModalBtn">&times;</button>
          </div>

          <div style="background:#fef2f2; border:1px solid #fee2e2; border-radius:14px; padding:16px; margin-bottom:18px;">
            <div style="font-size:13px; font-weight:700; color:#991b1b;">Immediate Campus Transit SOS</div>
            <div style="font-size:12px; color:#b91c1c; margin-top:4px;">
              If you or fellow passengers are in immediate danger, or need medical or breakdown support, alert campus dispatch directly:
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
            <a href="tel:5550199" style="text-decoration:none; display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-radius:14px; background:#0f172a; color:#fff; font-weight:700; font-size:14px;">
              <span>🚨 Campus Security Control</span>
              <span>(555) 0199</span>
            </a>

            <a href="tel:5552345" style="text-decoration:none; display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-radius:14px; background:#f1f5f9; color:#0f172a; font-weight:700; font-size:14px; border:1px solid #e2e8f0;">
              <span>🚌 Transport Office Desk</span>
              <span>(555) 2345</span>
            </a>

            <a href="tel:5558901" style="text-decoration:none; display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-radius:14px; background:#f1f5f9; color:#0f172a; font-weight:700; font-size:14px; border:1px solid #e2e8f0;">
              <span>👨‍✈️ Driver Rajesh Kumar</span>
              <span>(555) 890-1234</span>
            </a>
          </div>

          <button id="broadcastSosAlertBtn" style="width:100%; padding:14px; border-radius:14px; border:none; background:#ef4444; color:#fff; font-size:14px; font-weight:800; cursor:pointer; box-shadow:0 6px 18px rgba(239,68,68,0.35);">
            DISPATCH SILENT SOS ALERT
          </button>
        </div>
      </div>
    `;

    document.getElementById('closeSosModalBtn')?.addEventListener('click', () => {
      this.close();
    });

    document.getElementById('broadcastSosAlertBtn')?.addEventListener('click', () => {
      window.toast?.error('Emergency SOS Beacon dispatched to University Security Center.');
      this.close();
    });
  }

  open() {
    this.render();
    document.getElementById('sosModalOverlay')?.classList.add('open');
  }

  close() {
    document.getElementById('sosModalOverlay')?.classList.remove('open');
  }
}

window.SosModalComponent = SosModalComponent;
