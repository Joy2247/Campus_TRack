// ==========================================================================
// CampusTrack - Authentication & Role Switcher Modal
// ==========================================================================

class LoginModalComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(currentUser = null) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="modal-overlay" id="loginModalOverlay">
        <div class="modal-card" style="max-width:480px;">
          <div class="modal-header">
            <div>
              <div style="font-size:11px; font-weight:700; color:#0f172a; text-transform:uppercase; letter-spacing:0.05em;">Access Control</div>
              <h3 class="modal-title">${currentUser ? 'Account & Profiles' : 'Sign in to CampusTrack'}</h3>
            </div>
            <button class="modal-close-btn" id="closeLoginModalBtn">&times;</button>
          </div>

          ${currentUser ? `
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin-bottom:20px;">
              <div style="font-size:12px; color:#64748b; font-weight:600; text-transform:uppercase;">Currently Signed In</div>
              <div style="font-size:18px; font-weight:700; color:#0f172a; margin-top:3px;">${currentUser.name}</div>
              <div style="font-size:13px; color:#64748b;">${currentUser.email} • <span style="text-transform:capitalize; font-weight:700; color:#3b82f6;">${currentUser.role}</span></div>
              <button id="logoutBtn" style="margin-top:14px; padding:8px 16px; border-radius:99px; border:1px solid #cbd5e1; background:#ffffff; color:#ef4444; font-size:12px; font-weight:700; cursor:pointer;">
                Sign Out
              </button>
            </div>
          ` : ''}

          <!-- Quick 1-Click Persona Logins (Super convenient for testing!) -->
          <div style="margin-bottom:20px;">
            <div style="font-size:11.5px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:10px; letter-spacing:0.04em;">
              Quick Instant Demo Sign-in:
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <button class="quick-login-btn" data-email="student@campus.edu" style="padding:12px 16px; border-radius:14px; border:1px solid #e2e8f0; background:#ffffff; text-align:left; cursor:pointer; display:flex; align-items:center; justify-content:space-between; transition:all 0.18s;">
                <div>
                  <div style="font-weight:700; font-size:13.5px; color:#0f172a;">👨‍🎓 Shreyansh Patel (Student)</div>
                  <div style="font-size:11.5px; color:#64748b;">CS-2024-042 • Assigned to Bus 04, Stop #2</div>
                </div>
                <span style="font-size:11px; font-weight:700; color:#3b82f6; background:#eff6ff; padding:4px 8px; border-radius:99px;">Switch</span>
              </button>

              <button class="quick-login-btn" data-email="driver@campus.edu" style="padding:12px 16px; border-radius:14px; border:1px solid #e2e8f0; background:#ffffff; text-align:left; cursor:pointer; display:flex; align-items:center; justify-content:space-between; transition:all 0.18s;">
                <div>
                  <div style="font-weight:700; font-size:13.5px; color:#0f172a;">🚌 Rajesh Kumar (Bus Driver)</div>
                  <div style="font-size:11.5px; color:#64748b;">Bus 04 (South Express) • Active Trip #105</div>
                </div>
                <span style="font-size:11px; font-weight:700; color:#10b981; background:#ecfdf5; padding:4px 8px; border-radius:99px;">Switch</span>
              </button>

              <button class="quick-login-btn" data-email="admin@campus.edu" style="padding:12px 16px; border-radius:14px; border:1px solid #e2e8f0; background:#ffffff; text-align:left; cursor:pointer; display:flex; align-items:center; justify-content:space-between; transition:all 0.18s;">
                <div>
                  <div style="font-weight:700; font-size:13.5px; color:#0f172a;">🛡️ Transport Administrator</div>
                  <div style="font-size:11.5px; color:#64748b;">Full Fleet & Schedule Operations</div>
                </div>
                <span style="font-size:11px; font-weight:700; color:#0f172a; background:#f1f5f9; padding:4px 8px; border-radius:99px;">Switch</span>
              </button>
            </div>
          </div>

          <!-- Manual Login Form -->
          <form id="manualLoginForm" style="border-top:1px solid #f1f5f9; padding-top:16px;">
            <div style="font-size:12px; font-weight:700; color:#334155; margin-bottom:10px;">Or enter account credentials:</div>
            <div style="margin-bottom:12px;">
              <input type="email" id="loginEmailInput" placeholder="name@campus.edu" style="width:100%; padding:10px 14px; border-radius:10px; border:1px solid #cbd5e1; font-size:13px; outline:none;" required />
            </div>
            <div style="margin-bottom:16px;">
              <input type="password" id="loginPassInput" placeholder="Password (default: password123)" value="password123" style="width:100%; padding:10px 14px; border-radius:10px; border:1px solid #cbd5e1; font-size:13px; outline:none;" required />
            </div>
            <button type="submit" style="width:100%; padding:12px; border-radius:12px; border:none; background:#0f172a; color:#ffffff; font-weight:700; font-size:13.5px; cursor:pointer;">
              Sign In
            </button>
          </form>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const overlay = document.getElementById('loginModalOverlay');
    document.getElementById('closeLoginModalBtn')?.addEventListener('click', () => {
      overlay.classList.remove('open');
    });

    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
      await window.apiService.logout();
      window.toast?.info('Signed out.');
      this.close();
      window.location.reload();
    });

    // Quick login buttons
    this.container.querySelectorAll('.quick-login-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email');
        try {
          const res = await window.apiService.login(email, 'password123');
          window.toast?.success(`Switched account to ${res.user.name}`);
          this.close();
          window.app?.onUserLoggedIn(res.user);
        } catch (err) {
          window.toast?.error(err.message);
        }
      });
    });

    // Manual login form submit
    document.getElementById('manualLoginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmailInput').value;
      const pass = document.getElementById('loginPassInput').value;
      try {
        const res = await window.apiService.login(email, pass);
        window.toast?.success(`Welcome back, ${res.user.name}`);
        this.close();
        window.app?.onUserLoggedIn(res.user);
      } catch (err) {
        window.toast?.error(err.message);
      }
    });
  }

  open() {
    this.render(window.app?.currentUser);
    document.getElementById('loginModalOverlay')?.classList.add('open');
  }

  close() {
    document.getElementById('loginModalOverlay')?.classList.remove('open');
  }
}

window.LoginModalComponent = LoginModalComponent;
