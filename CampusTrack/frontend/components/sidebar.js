// ==========================================================================
// CampusTrack - Dock Sidebar Component (with GitHub Integration)
// ==========================================================================

class SidebarComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(user = null, activeTab = 'home') {
    if (!this.container) return;

    const initial = user && user.name ? user.name.charAt(0).toUpperCase() : 'C';

    this.container.innerHTML = `
      <div class="dock-top-group">
        <!-- 4-Dot Brand Icon -->
        <div class="brand-badge" id="brandLogoBtn" title="CampusTrack System">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="3.2" fill="#0f172a"/>
            <circle cx="12" cy="19" r="3.2" fill="#0f172a"/>
            <circle cx="5" cy="12" r="3.2" fill="#0f172a"/>
            <circle cx="19" cy="12" r="3.2" fill="#0f172a"/>
          </svg>
        </div>
      </div>

      <div class="dock-nav-group">
        <!-- Home / Tracking Map -->
        <button class="nav-icon-btn ${activeTab === 'home' ? 'active' : ''}" id="navHomeBtn" title="Live Tracking Map">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>

        <!-- Driver Console Action -->
        <button class="nav-icon-btn ${activeTab === 'driver' ? 'active' : ''}" id="navDriverBtn" title="Driver Trip Console">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </button>

        <!-- Route & Schedule -->
        <button class="nav-icon-btn ${activeTab === 'routes' ? 'active' : ''}" id="navScheduleBtn" title="Route Stops & Schedule">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </button>

        <!-- Notifications / Announcements -->
        <button class="nav-icon-btn ${activeTab === 'notifs' ? 'active' : ''}" id="navNotifBtn" title="Trip Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="badge-dot"></span>
        </button>
      </div>

      <div class="dock-bottom-group">
        <!-- Admin Fleet Manager -->
        <button class="nav-icon-btn ${activeTab === 'admin' ? 'active' : ''}" id="navAdminBtn" title="Admin Fleet Portal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </button>

        <!-- System Reports / Analytics -->
        <button class="nav-icon-btn" id="navReportsBtn" title="Transport Analytics & Reports">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
        </button>

        <!-- GitHub Repository Button -->
        <button class="nav-icon-btn" id="navGithubBtn" title="GitHub Repository & Source">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </button>

        <!-- User Profile Avatar -->
        <button class="user-avatar-btn" id="userProfileBtn" title="Switch Account / Sign Out">
          ${initial}
        </button>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    document.getElementById('navHomeBtn')?.addEventListener('click', () => {
      window.app?.navigate('home');
    });

    document.getElementById('navDriverBtn')?.addEventListener('click', () => {
      window.app?.openDriverModal();
    });

    document.getElementById('navScheduleBtn')?.addEventListener('click', () => {
      window.app?.openRouteModal();
    });

    document.getElementById('navNotifBtn')?.addEventListener('click', () => {
      window.app?.openNotificationsModal();
    });

    document.getElementById('navAdminBtn')?.addEventListener('click', () => {
      window.app?.openAdminModal();
    });

    document.getElementById('navReportsBtn')?.addEventListener('click', () => {
      window.app?.openReportsModal();
    });

    document.getElementById('navGithubBtn')?.addEventListener('click', () => {
      window.app?.openGithubModal();
    });

    document.getElementById('userProfileBtn')?.addEventListener('click', () => {
      window.app?.openLoginModal();
    });
  }
}

window.SidebarComponent = SidebarComponent;
