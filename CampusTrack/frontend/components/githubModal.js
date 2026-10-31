// ==========================================================================
// CampusTrack - GitHub Repository Modal Component
// ==========================================================================

class GithubModalComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.repoUrl = localStorage.getItem('campustrack_github_repo') || 'https://github.com/your-username/CampusTrack';
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="modal-overlay" id="githubModalOverlay">
        <div class="modal-card" style="max-width:580px;">
          <div class="modal-header">
            <div style="display:flex; align-items:center; gap:10px;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#0f172a">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <div>
                <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.05em;">Source Control & Open Source</div>
                <h3 class="modal-title">GitHub Repository</h3>
              </div>
            </div>
            <button class="modal-close-btn" id="closeGithubModalBtn">&times;</button>
          </div>

          <!-- Repo Card -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:18px; margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <span style="font-size:11px; font-weight:700; background:#e2e8f0; color:#334155; padding:2px 8px; border-radius:99px;">Public Repository</span>
                <h4 style="font-size:17px; font-weight:800; color:#0f172a; margin-top:6px;">CampusTrack / CollegeBusTracking</h4>
                <p style="font-size:12.5px; color:#64748b; margin-top:3px;">
                  SRS-compliant real-time college bus tracking and transportation management system with Lavasa campus & 4-hostel loop.
                </p>
              </div>
            </div>

            <div style="display:flex; gap:16px; margin-top:14px; font-size:12px; color:#475569;">
              <span>⭐ <strong>MIT</strong> License</span>
              <span>🌳 Branch: <strong>main</strong></span>
              <span>📦 <strong>Node.js + Socket.IO + MySQL</strong></span>
            </div>
          </div>

          <!-- Repository URL Link -->
          <div style="margin-bottom:20px;">
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:6px;">Repository URL:</label>
            <div style="display:flex; gap:8px;">
              <input type="text" id="githubRepoUrlInput" value="${this.repoUrl}" style="flex:1; padding:10px 14px; border-radius:10px; border:1px solid #cbd5e1; font-size:13px; font-family:monospace; outline:none;" />
              <button id="saveGithubRepoBtn" style="padding:10px 16px; border-radius:10px; border:none; background:#0f172a; color:#fff; font-size:12px; font-weight:700; cursor:pointer;">
                Save
              </button>
            </div>
          </div>

          <!-- Quick Terminal Push Instructions -->
          <div style="background:#0f1416; color:#f8fafc; border-radius:14px; padding:16px; margin-bottom:20px; font-family:monospace; font-size:12px; line-height:1.6;">
            <div style="color:#94a3b8; font-size:11px; margin-bottom:6px;"># Push this repository to your GitHub:</div>
            <div style="color:#34d399;">git remote add origin ${this.repoUrl}.git</div>
            <div style="color:#38bdf8;">git branch -M main</div>
            <div style="color:#fbbf24;">git push -u origin main</div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button id="copyGitCommandsBtn" style="padding:10px 16px; border-radius:10px; border:1px solid #cbd5e1; background:#ffffff; font-size:12px; font-weight:600; cursor:pointer;">
              📋 Copy Git Push Commands
            </button>
            <a href="${this.repoUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:none; padding:10px 20px; border-radius:10px; background:#0f172a; color:#ffffff; font-size:12px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
              <span>Open on GitHub</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const overlay = document.getElementById('githubModalOverlay');
    document.getElementById('closeGithubModalBtn')?.addEventListener('click', () => {
      overlay.classList.remove('open');
    });

    document.getElementById('saveGithubRepoBtn')?.addEventListener('click', () => {
      const input = document.getElementById('githubRepoUrlInput');
      if (input) {
        this.repoUrl = input.value.trim();
        localStorage.setItem('campustrack_github_repo', this.repoUrl);
        window.toast?.success('GitHub repository URL updated.');
        this.render();
      }
    });

    document.getElementById('copyGitCommandsBtn')?.addEventListener('click', () => {
      const cmds = `git remote add origin ${this.repoUrl}.git\ngit branch -M main\ngit push -u origin main`;
      navigator.clipboard?.writeText(cmds);
      window.toast?.success('Git push commands copied to clipboard!');
    });
  }

  open() {
    this.render();
    document.getElementById('githubModalOverlay')?.classList.add('open');
  }

  close() {
    document.getElementById('githubModalOverlay')?.classList.remove('open');
  }
}

window.GithubModalComponent = GithubModalComponent;
