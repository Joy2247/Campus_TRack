// ==========================================================================
// CampusTrack - Notifications & Announcements Modal
// ==========================================================================

class NotifModalComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(notifications = []) {
    if (!this.container) return;

    const notifs = notifications.length ? notifications : [
      {
        notification_id: 1,
        title: 'Trip 105 Started',
        message: 'Bus 04 departed Westside Transit Center on time. Expected at St. Peter\'s Square in ~7 mins.',
        created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString()
      },
      {
        notification_id: 2,
        title: 'Approaching Your Stop',
        message: 'Bus 04 is currently 2.4 km away from St. Peter\'s Square Stop.',
        created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString()
      },
      {
        notification_id: 3,
        title: 'Campus Weather Advisory',
        message: 'Normal transit schedules are operating smoothly across all active lines.',
        created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      }
    ];

    const items = notifs.map(n => `
      <div style="border-bottom:1px solid #f1f5f9; padding:12px 0; display:flex; gap:12px; align-items:flex-start;">
        <div style="width:32px; height:32px; border-radius:50%; background:#eff6ff; color:#3b82f6; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </div>
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h5 style="font-size:13.5px; font-weight:700; color:#0f172a;">${n.title}</h5>
            <span style="font-size:11px; color:#94a3b8;">${new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p style="font-size:12.5px; color:#475569; margin-top:3px; line-height:1.4;">${n.message}</p>
        </div>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="modal-overlay" id="notifModalOverlay">
        <div class="modal-card" style="max-width:480px;">
          <div class="modal-header">
            <div>
              <div style="font-size:11px; font-weight:700; color:#3b82f6; text-transform:uppercase; letter-spacing:0.05em;">Campus Transit Dispatch</div>
              <h3 class="modal-title">Live Announcements</h3>
            </div>
            <button class="modal-close-btn" id="closeNotifModalBtn">&times;</button>
          </div>

          <div>
            ${items}
          </div>
        </div>
      </div>
    `;

    document.getElementById('closeNotifModalBtn')?.addEventListener('click', () => {
      this.close();
    });
  }

  open(notifs) {
    this.render(notifs);
    document.getElementById('notifModalOverlay')?.classList.add('open');
  }

  close() {
    document.getElementById('notifModalOverlay')?.classList.remove('open');
  }
}

window.NotifModalComponent = NotifModalComponent;
