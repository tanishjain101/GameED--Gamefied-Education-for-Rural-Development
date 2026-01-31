
class CustomHeader extends HTMLElement {
    constructor() {
        super();
        this.isLoggedIn = false;
        this.username = '';
        this.userXP = 0;
        this.userLevel = 1;
    }

    connectedCallback() {
        this.loadUserState();
        this.render();
        this.setupEventListeners();
    }

    loadUserState() {
        // Check if user is logged in
        const savedUser = localStorage.getItem('gameEdUser') || sessionStorage.getItem('gameEdUser');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                this.isLoggedIn = true;
                this.username = userData.username || userData.name || 'Student';
                this.userXP = userData.xp || 0;
                this.userLevel = userData.level || 1;
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.clearUserData();
            }
        }
    }

    clearUserData() {
        localStorage.removeItem('gameEdUser');
        sessionStorage.removeItem('gameEdUser');
        this.isLoggedIn = false;
        this.username = '';
        this.userXP = 0;
        this.userLevel = 1;
    }

    render() {
        // Create shadow DOM
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        this.shadowRoot.innerHTML = `
            <style>
                /* Reset and base styles */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                :host {
                    display: block;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    width: 100%;
                }
                
                /* Header container - FIXED POSITION */
                .header-container {
                    background: linear-gradient(90deg, 
                        rgba(15, 23, 42, 0.98) 0%, 
                        rgba(30, 41, 59, 0.98) 50%, 
                        rgba(6, 78, 59, 0.9) 100%);
                    border-bottom: 1px solid rgba(34, 197, 94, 0.3);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    width: 100%;
                    transition: all 0.3s ease;
                }
                
                /* Add subtle animation on scroll */
                .header-container.scrolled {
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                    border-bottom-color: rgba(34, 197, 94, 0.5);
                }
                
                /* Main header content */
                .header-content {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                /* Logo section */
                .logo-section {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    text-decoration: none !important;
                    transition: transform 0.3s ease;
                }
                
                .logo-section:hover {
                    text-decoration: none !important;
                    transform: translateY(-2px);
                }
                
                .logo-icon {
                    color: #10b981;
                    width: 28px;
                    height: 28px;
                    transition: all 0.3s ease;
                }
                
                .logo-section:hover .logo-icon {
                    color: #34d399;
                    transform: rotate(10deg);
                }
                
                .logo-text {
                    color: white;
                    font-size: 1.5rem;
                    font-weight: 800;
                    text-decoration: none !important;
                    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -0.5px;
                }
                
                /* Desktop navigation */
                .desktop-nav {
                    display: none;
                }
                
                @media (min-width: 768px) {
                    .desktop-nav {
                        display: flex;
                        align-items: center;
                        gap: 2rem;
                    }
                }
                
                /* Navigation links */
                .nav-link {
                    color: #cbd5e1;
                    text-decoration: none;
                    padding: 0.75rem 1.25rem;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .nav-link:before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #10b981, #34d399);
                    border-radius: 3px;
                    transition: width 0.3s ease;
                }
                
                .nav-link:hover {
                    color: white;
                    background: rgba(34, 197, 94, 0.15);
                    transform: translateY(-2px);
                }
                
                .nav-link:hover:before {
                    width: 60%;
                }
                
                .nav-link.active {
                    color: #10b981;
                    background: rgba(34, 197, 94, 0.2);
                }
                
                .nav-link.active:before {
                    width: 60%;
                }
                
                /* Auth buttons container */
                .auth-buttons {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }
                
                /* Button styles */
                .btn {
                    padding: 0.75rem 2rem;
                    border-radius: 0.75rem;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                    border: none;
                    position: relative;
                    overflow: hidden;
                }
                
                .btn:before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }
                
                .btn:hover:before {
                    left: 100%;
                }
                
                .btn-login {
                    background: transparent;
                    color: #10b981;
                    border: 2px solid #10b981;
                }
                
                .btn-login:hover {
                    background: rgba(34, 197, 94, 0.1);
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.25);
                }
                
                .btn-signup {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: 2px solid transparent;
                }
                
                .btn-signup:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
                    border-color: rgba(255, 255, 255, 0.2);
                }
                
                /* User menu (when logged in) */
                .user-menu {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                
                .user-xp {
                    background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1));
                    padding: 0.5rem 1rem;
                    border-radius: 1rem;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border: 1px solid rgba(251, 191, 36, 0.3);
                    color: #fbbf24;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .user-xp:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(251, 191, 36, 0.2);
                }
                
                .user-avatar {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 1.25rem;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .user-avatar:hover {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
                }
                
                .btn-dashboard {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.75rem;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                }
                
                .btn-dashboard:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
                    border-color: rgba(255, 255, 255, 0.2);
                }
                
                .btn-logout {
                    background: rgba(239, 68, 68, 0.1);
                    border: 2px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                    cursor: pointer;
                    padding: 0.75rem;
                    border-radius: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                .btn-logout:hover {
                    background: rgba(239, 68, 68, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(239, 68, 68, 0.2);
                }
                
                /* Mobile menu button */
                .mobile-menu-btn {
                    display: block;
                    background: rgba(34, 197, 94, 0.1);
                    border: 2px solid rgba(34, 197, 94, 0.3);
                    color: #10b981;
                    cursor: pointer;
                    padding: 0.75rem;
                    border-radius: 0.75rem;
                    transition: all 0.3s ease;
                }
                
                @media (min-width: 768px) {
                    .mobile-menu-btn {
                        display: none;
                    }
                }
                
                .mobile-menu-btn:hover {
                    background: rgba(34, 197, 94, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(34, 197, 94, 0.2);
                }
                
                /* Mobile menu */
                .mobile-menu {
                    display: none;
                    position: fixed;
                    top: 70px;
                    left: 0;
                    right: 0;
                    background: rgba(15, 23, 42, 0.98);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    padding: 2rem 1.5rem;
                    border-bottom: 1px solid rgba(34, 197, 94, 0.3);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    z-index: 999;
                    animation: slideDown 0.3s ease-out;
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .mobile-menu.active {
                    display: block;
                }
                
                .mobile-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .mobile-auth-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .mobile-user-menu {
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                /* Icon styles */
                .icon {
                    width: 22px;
                    height: 22px;
                }
                
                /* Ensure no text decoration */
                a {
                    text-decoration: none;
                }
                
                a:hover, a:focus, a:active {
                    text-decoration: none;
                }
                
                /* Body padding to prevent content from hiding behind fixed header */
                body {
                    padding-top: 70px;
                }
            </style>
            
            <div class="header-container" id="headerContainer">
                <div class="header-content">
                    <!-- Logo -->
                    <a href="index.html" class="logo-section">
                        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        <span class="logo-text">GameEd Rural</span>
                    </a>
                    
                    <!-- Desktop Navigation -->
                    <nav class="desktop-nav">
                        <a href="index.html" class="nav-link ${this.isActivePage('index.html')}">Home</a>
                        <a href="index.html#features" class="nav-link">Features</a>
                        <a href="index.html#games" class="nav-link">Games</a>
                        <a href="index.html#impact" class="nav-link">Impact</a>
                        
                        <!-- Auth Buttons or User Menu -->
                        ${this.isLoggedIn ? this.renderUserMenu() : this.renderAuthButtons()}
                    </nav>
                    
                    <!-- Mobile Menu Button -->
                    <button class="mobile-menu-btn" id="mobileMenuBtn">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M3 12h18M3 6h18M3 18h18"></path>
                        </svg>
                    </button>
                </div>
                
                <!-- Mobile Menu -->
                <div class="mobile-menu" id="mobileMenu">
                    <div class="mobile-nav">
                        <a href="index.html" class="nav-link ${this.isActivePage('index.html')}">Home</a>
                        <a href="index.html#features" class="nav-link">Features</a>
                        <a href="index.html#games" class="nav-link">Games</a>
                        <a href="index.html#impact" class="nav-link">Impact</a>
                        
                        ${this.isLoggedIn ? this.renderMobileUserMenu() : this.renderMobileAuthButtons()}
                    </div>
                </div>
            </div>
        `;
        
        this.initializeIcons();
        this.setupScrollEffect();
    }
    
    isActivePage(pageName) {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        // Check if current page matches
        if (currentPath.includes(pageName) || (pageName === 'index.html' && currentPath === '/')) {
            return 'active';
        }
        
        // For hash links, check if we're on the homepage with specific hash
        if (pageName.includes('#') && currentPath.includes('index.html')) {
            const pageHash = pageName.split('#')[1];
            if (currentHash === `#${pageHash}`) {
                return 'active';
            }
        }
        
        return '';
    }

    renderAuthButtons() {
        return `
            <div class="auth-buttons">
                <a href="auth.html?mode=login" class="btn btn-login">Login</a>
                <a href="auth.html?mode=signup" class="btn btn-signup">Sign Up</a>
            </div>
        `;
    }

    renderMobileAuthButtons() {
        return `
            <div class="mobile-auth-buttons">
                <a href="auth.html?mode=login" class="btn btn-login" style="text-align: center;">Login</a>
                <a href="auth.html?mode=signup" class="btn btn-signup" style="text-align: center;">Sign Up</a>
            </div>
        `;
    }

    renderUserMenu() {
        const xpForNextLevel = this.userLevel * 1000;
        const xpProgress = Math.min((this.userXP / xpForNextLevel) * 100, 100);
        const currentPage = window.location.pathname;
        const isDashboard = currentPage.includes('dashboard.html');
        
        return `
            <div class="user-menu">
                <div class="user-xp" title="${this.userXP} XP • Level ${this.userLevel}">
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>${this.userXP.toLocaleString()} XP</span>
                </div>
                
                <div class="user-avatar" title="${this.username} • Level ${this.userLevel}">
                    ${this.username.charAt(0).toUpperCase()}
                </div>
                
                ${isDashboard ? '' : `
                    <a href="dashboard.html" class="btn-dashboard">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                        </svg>
                        Dashboard
                    </a>
                `}
                
                <button class="btn-logout" id="logoutBtn" title="Logout">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </button>
            </div>
        `;
    }

    renderMobileUserMenu() {
        return `
            <div class="mobile-user-menu">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 1rem;">
                    <div class="user-avatar" style="width: 50px; height: 50px; font-size: 1.5rem;">
                        ${this.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style="color: white; font-weight: 700; font-size: 1.1rem;">${this.username}</div>
                        <div style="color: #94a3b8; font-size: 0.875rem; margin-top: 0.25rem;">
                            Level ${this.userLevel} • ${this.userXP.toLocaleString()} XP
                        </div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <a href="dashboard.html" class="btn btn-login" style="text-align: center; padding: 1rem;">
                        Dashboard
                    </a>
                    <button class="btn btn-signup" id="mobileLogoutBtn" style="border: none; padding: 1rem; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                        Logout
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        setTimeout(() => {
            // Mobile menu toggle
            const mobileMenuBtn = this.shadowRoot.getElementById('mobileMenuBtn');
            const mobileMenu = this.shadowRoot.getElementById('mobileMenu');
            
            if (mobileMenuBtn && mobileMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                    const isOpen = mobileMenu.classList.contains('active');
                    if (isOpen) {
                        mobileMenu.classList.remove('active');
                        mobileMenuBtn.style.transform = 'none';
                    } else {
                        mobileMenu.classList.add('active');
                        mobileMenuBtn.style.transform = 'rotate(90deg)';
                    }
                });
                
                // Close mobile menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!this.shadowRoot.contains(e.target) && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        mobileMenuBtn.style.transform = 'none';
                    }
                });
            }

            // Logout buttons
            const logoutBtn = this.shadowRoot.getElementById('logoutBtn');
            const mobileLogoutBtn = this.shadowRoot.getElementById('mobileLogoutBtn');
            
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogout();
                });
            }
            
            if (mobileLogoutBtn) {
                mobileLogoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogout();
                });
            }

            // Close mobile menu when clicking links
            const mobileLinks = this.shadowRoot.querySelectorAll('.mobile-nav .nav-link, .mobile-auth-buttons .btn, .mobile-user-menu .btn');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mobileMenu) {
                        mobileMenu.classList.remove('active');
                        if (mobileMenuBtn) {
                            mobileMenuBtn.style.transform = 'none';
                        }
                    }
                });
            });
        }, 100);
    }

    setupScrollEffect() {
        // Add scroll effect to header
        const headerContainer = this.shadowRoot.getElementById('headerContainer');
        
        if (headerContainer) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    headerContainer.classList.add('scrolled');
                } else {
                    headerContainer.classList.remove('scrolled');
                }
            });
            
            // Initialize based on current scroll position
            if (window.scrollY > 50) {
                headerContainer.classList.add('scrolled');
            }
        }
    }

    handleLogout() {
        this.clearUserData();
        
        // Close mobile menu
        const mobileMenu = this.shadowRoot.getElementById('mobileMenu');
        const mobileMenuBtn = this.shadowRoot.getElementById('mobileMenuBtn');
        
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
        if (mobileMenuBtn) {
            mobileMenuBtn.style.transform = 'none';
        }
        
        // Re-render header
        this.render();
        this.setupEventListeners();
        
        // Dispatch event for main page
        document.dispatchEvent(new CustomEvent('authChange', { 
            detail: { isLoggedIn: false }
        }));
        
        // Redirect to home page
        window.location.href = 'index.html';
    }

    initializeIcons() {
        // We're using inline SVG, so no need for feather icons here
        setTimeout(() => {
            if (window.feather) {
                feather.replace();
            }
        }, 100);
    }
}

customElements.define('custom-header', CustomHeader);
