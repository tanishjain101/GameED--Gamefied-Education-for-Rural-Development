// Main dashboard initialization
class DashboardApp {
    constructor() {
        this.userData = new UserData();
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Initialize UI
        this.userData.updateUI();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check for new achievements
        this.userData.achievementsSystem.checkAchievements();
        
        console.log('GameEd Rural Dashboard initialized!');
    }

    setupEventListeners() {
        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (mobileMenuBtn && sidebar && sidebarOverlay) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                sidebarOverlay.classList.toggle('active');
            });
            
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });
        }

        // Achievement tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterBadges(btn.dataset.tab);
            });
        });

        // Play random game
        const playRandomBtn = document.getElementById('playRandomGame');
        if (playRandomBtn) {
            playRandomBtn.addEventListener('click', () => {
                const games = ['math-quest', 'agri-sim', 'science-lab', 'word-master'];
                const randomGame = games[Math.floor(Math.random() * games.length)];
                this.launchGame(randomGame);
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    window.location.href = 'index.html';
                }
            });
        }

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('[class*="modal"]').style.display = 'none';
            });
        });

        // Close modals on outside click
        document.querySelectorAll('.quiz-modal, .badge-details-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (window.innerWidth < 768) {
                        if (sidebar) sidebar.classList.remove('active');
                        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                    }
                }
            });
        });
    }

    filterBadges(filter) {
        const achievements = this.userData.achievementsSystem.getAchievementsByCategory(filter);
        const badgeGrid = document.getElementById('badgeGrid');
        
        if (!badgeGrid) return;
        
        badgeGrid.innerHTML = achievements.map(achievement => 
            this.userData.achievementsSystem.renderAchievementCard(achievement)
        ).join('');
        
        // Reinitialize feather icons
        if (window.feather) {
            feather.replace();
        }
        
        // Add click event listeners
        document.querySelectorAll('.badge-card').forEach(card => {
            card.addEventListener('click', () => {
                const achievementId = card.getAttribute('data-id');
                const achievement = this.userData.achievementsSystem.achievements[achievementId];
                const earnedData = this.userData.achievementsSystem.userAchievements[achievementId];
                this.showBadgeDetails(achievement, earnedData);
            });
        });
    }

    showBadgeDetails(achievement, earnedData) {
        const modal = document.getElementById('badgeModal');
        if (!modal) return;
        
        // Format date
        let earnedDate = 'Not earned yet';
        if (earnedData && earnedData.date) {
            const date = new Date(earnedData.date);
            earnedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        
        // Set content
        document.getElementById('modalBadgeIcon').innerHTML = achievement.icon;
        document.getElementById('modalBadgeIcon').style.background = `linear-gradient(135deg, ${achievement.color1}, ${achievement.color2})`;
        document.getElementById('modalBadgeName').textContent = achievement.name;
        document.getElementById('modalBadgeXP').textContent = `+${achievement.xp} XP`;
        document.getElementById('modalBadgeDesc').textContent = achievement.description;
        document.getElementById('modalBadgeReq').textContent = achievement.description;
        document.getElementById('modalBadgeCategory').textContent = this.userData.achievementsSystem.categories[achievement.category] || achievement.category;
        document.getElementById('modalBadgeGame').textContent = achievement.game ? 
            achievement.game.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'General';
        
        modal.style.display = 'flex';
    }

    launchGame(gameId) {
        alert(`Launching ${gameId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}...\n\nGame functionality would be implemented here.`);
        
        const xpGained = Math.floor(Math.random() * 50) + 25;
        this.userData.addXP(xpGained);
        this.userData.user.gamesPlayed++;
        
        // Update game progress
        if (!this.userData.user.progress) {
            this.userData.user.progress = {};
        }
        if (!this.userData.user.progress[gameId]) {
            this.userData.user.progress[gameId] = 0;
        }
        this.userData.user.progress[gameId] = Math.min(100, (this.userData.user.progress[gameId] || 0) + 10);
        
        // Check for achievements
        this.userData.achievementsSystem.checkAchievements();
        
        this.userData.saveUserData();
        this.userData.updateUI();
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const userData = localStorage.getItem('gameEdUser') || sessionStorage.getItem('gameEdUser');
    if (!userData) {
        // Redirect to login if not logged in
        window.location.href = 'auth.html?mode=login&redirect=dashboard';
        return;
    }
    
    // Initialize the dashboard
    const dashboard = new DashboardApp();
    
    // Make launchGame available globally (for onclick handlers in HTML)
    window.launchGame = (gameId) => dashboard.launchGame(gameId);
});