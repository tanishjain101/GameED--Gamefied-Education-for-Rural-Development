
// Main application JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize feather icons
    if (window.feather) {
        feather.replace();
    }

    // Check authentication status
    checkAuthStatus();

    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .game-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });

    // Console welcome message
    console.log('%c🎮 GameEd Rural 🎮', 
        'color: #22c55e; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #22c55e;');
    console.log('%cGamified Education for Rural Development\nLearn • Play • Grow', 
        'color: #94a3b8; font-size: 14px; font-family: monospace;');

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize stats animation
    animateStats();

    // Setup game buttons
    setupGameButtons();

    // Add parallax effect to hero section
    setupParallax();

    // Setup intersection observer for animations
    setupIntersectionObserver();
});

function checkAuthStatus() {
    const userData = localStorage.getItem('gameEdUser') || sessionStorage.getItem('gameEdUser');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            console.log(`User logged in: ${user.username}`);
            
            // Check if on homepage and redirect to dashboard
            if (window.location.pathname.includes('index.html') || 
                window.location.pathname === '/' || 
                window.location.pathname.endsWith('/')) {
                // Don't redirect if user explicitly wants to stay on homepage
                if (!sessionStorage.getItem('stayOnHomepage')) {
                    window.location.href = 'dashboard.html';
                }
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const suffix = stat.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + suffix;
        }, 30);
    });
}

function setupGameButtons() {
    document.querySelectorAll('.play-game-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const game = this.dataset.game;
            const userData = localStorage.getItem('gameEdUser') || sessionStorage.getItem('gameEdUser');
            
            if (!userData) {
                // Show login prompt
                showLoginPrompt(game);
            } else {
                // Launch game
                launchGame(game);
            }
        });
    });
}

function showLoginPrompt(game) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate__animated animate__fadeIn';
    modal.innerHTML = `
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-md w-full p-8 border border-emerald-700 animate__animated animate__zoomIn">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold">Login Required</h3>
                <button class="close-modal text-slate-400 hover:text-white hover-lift">
                    <i data-feather="x" class="w-6 h-6"></i>
                </button>
            </div>
            <p class="text-slate-300 mb-6">You need to login to play games and track your progress.</p>
            <div class="space-y-4">
                <a href="auth.html?mode=login&redirect=game" 
                   class="block w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium text-center transition-colors hover-lift">
                    Login to Play
                </a>
                <a href="auth.html?mode=signup&redirect=game" 
                   class="block w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium text-center transition-colors hover-lift">
                    Create Free Account
                </a>
                <button class="w-full py-3 bg-transparent border border-slate-600 hover:border-slate-500 rounded-lg font-medium transition-colors close-modal hover-lift" id="stayOnHomepage">
                    Maybe Later
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Initialize icons
    if (window.feather) {
        feather.replace();
    }
    
    // Close modal handlers
    modal.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('animate__fadeOut');
            setTimeout(() => modal.remove(), 300);
        });
    });
    
    // Stay on homepage button
    modal.querySelector('#stayOnHomepage').addEventListener('click', () => {
        sessionStorage.setItem('stayOnHomepage', 'true');
        modal.classList.add('animate__fadeOut');
        setTimeout(() => modal.remove(), 300);
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('animate__fadeOut');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

function launchGame(game) {
    // In a real implementation, this would load the game
    const gameName = game === 'math-quest' ? 'Math Quest' : 'Agri-Sim';
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-emerald-700">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-2xl font-bold">Loading ${gameName}...</h3>
                <button class="close-modal text-slate-400 hover:text-white">
                    <i data-feather="x" class="w-6 h-6"></i>
                </button>
            </div>
            
            <div class="aspect-video bg-slate-900 rounded-lg mb-6 flex items-center justify-center shimmer">
                <div class="text-center">
                    <div class="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full loading-spinner mx-auto mb-4"></div>
                    <p class="text-slate-300">Game loading...</p>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-slate-900/50 p-4 rounded-lg">
                    <div class="flex items-center mb-2">
                        <i data-feather="target" class="w-5 h-5 text-emerald-400 mr-2"></i>
                        <span class="font-medium">Learning Objectives</span>
                    </div>
                    <ul class="text-sm text-slate-300 space-y-1">
                        <li>• Problem-solving skills</li>
                        <li>• Mathematical concepts</li>
                        <li>• Critical thinking</li>
                    </ul>
                </div>
                
                <div class="bg-slate-900/50 p-4 rounded-lg">
                    <div class="flex items-center mb-2">
                        <i data-feather="award" class="w-5 h-5 text-yellow-400 mr-2"></i>
                        <span class="font-medium">Rewards</span>
                    </div>
                    <ul class="text-sm text-slate-300 space-y-1">
                        <li>• 50 XP per level</li>
                        <li>• Achievement badges</li>
                        <li>• Progress tracking</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Initialize icons
    if (window.feather) {
        feather.replace();
    }
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Simulate game loading
    setTimeout(() => {
        const gameArea = modal.querySelector('.aspect-video');
        gameArea.innerHTML = `
            <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900/20 to-blue-900/20 rounded-lg">
                <div class="text-4xl mb-4">🎮</div>
                <h4 class="text-xl font-bold mb-2">${gameName}</h4>
                <p class="text-slate-300 mb-6 text-center">Game would launch here in a real implementation</p>
                <button class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium">
                    Start Playing
                </button>
            </div>
        `;
    }, 2000);
}

function setupParallax() {
    const hero = document.querySelector('h1');
    if (hero && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature cards and game cards
    document.querySelectorAll('.feature-card, .game-card').forEach(card => {
        observer.observe(card);
    });
}

// Utility function for showing notifications
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 animate__animated animate__slideInRight ${
        type === 'success' ? 'bg-emerald-600' :
        type === 'error' ? 'bg-red-600' :
        type === 'warning' ? 'bg-yellow-600' :
        'bg-blue-600'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i data-feather="${
                type === 'success' ? 'check-circle' :
                type === 'error' ? 'alert-circle' :
                type === 'warning' ? 'alert-triangle' :
                'info'
            }" class="w-5 h-5 mr-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    if (window.feather) {
        feather.replace();
    }
    
    // Remove after duration
    setTimeout(() => {
        notification.classList.replace('animate__slideInRight', 'animate__slideOutRight');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Listen for auth changes
document.addEventListener('authChange', function(e) {
    if (e.detail.isLoggedIn) {
        checkAuthStatus();
        showNotification(`Welcome ${e.detail.username}!`, 'success');
    } else {
        showNotification('Logged out successfully', 'info');
        // Clear the stay on homepage flag when logging out
        sessionStorage.removeItem('stayOnHomepage');
    }
});

// Handle offline/online status
window.addEventListener('online', () => {
    showNotification('Back online!', 'success', 2000);
});

window.addEventListener('offline', () => {
    showNotification('You are offline. Some features may be limited.', 'warning', 4000);
});

// Prevent redirect when user explicitly clicks on home link
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.href.includes('index.html')) {
        sessionStorage.setItem('stayOnHomepage', 'true');
    }
});