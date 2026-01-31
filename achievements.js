
// Achievements System
class AchievementsSystem {
    constructor(user) {
        this.user = user;
        this.achievements = this.loadAchievements();
        this.userAchievements = user.achievements || {};
        this.setupAchievementCategories();
    }

    loadAchievements() {
        // Popular educational games loved by students
        const games = {
            'math-quest': {
                name: 'Math Quest',
                description: 'Adventure game where math skills defeat monsters',
                popularity: 'Loved by 5,000+ students',
                color1: '#3b82f6',
                color2: '#1d4ed8'
            },
            'agri-sim': {
                name: 'Agri-Sim',
                description: 'Farming simulation teaching agriculture',
                popularity: 'Favored by 3,200+ rural students',
                color1: '#10b981',
                color2: '#059669'
            },
            'science-lab': {
                name: 'Science Lab VR',
                description: 'Virtual reality science experiments',
                popularity: 'Most engaging for 4,100+ learners',
                color1: '#8b5cf6',
                color2: '#7c3aed'
            },
            'word-master': {
                name: 'Word Master',
                description: 'Vocabulary building through stories',
                popularity: 'Helped 2,800+ improve language',
                color1: '#f59e0b',
                color2: '#d97706'
            },
            'eco-warrior': {
                name: 'Eco Warrior',
                description: 'Environmental conservation game',
                popularity: 'Inspired 3,500+ to protect nature',
                color1: '#22c55e',
                color2: '#16a34a'
            },
            'history-quest': {
                name: 'History Quest',
                description: 'Time travel through historical events',
                popularity: 'Made history fun for 4,300+ students',
                color1: '#ef4444',
                color2: '#dc2626'
            }
        };

        return {
            // Game Completion Badges
            'first-game': {
                id: 'first-game',
                name: 'First Steps',
                description: 'Complete your first learning game',
                icon: '🏁',
                xp: 50,
                color1: '#fbbf24',
                color2: '#f59e0b',
                category: 'milestone',
                requirement: { type: 'games_played', value: 1 },
                how: 'Play any game once',
                game: 'any'
            },
            'math-master': {
                id: 'math-master',
                name: 'Math Wizard',
                description: 'Master all levels in Math Quest',
                icon: '🧮',
                xp: 150,
                color1: '#3b82f6',
                color2: '#1d4ed8',
                category: 'game',
                requirement: { type: 'game_score', game: 'math-quest', value: 100 },
                how: 'Score 100% in Math Quest',
                game: 'math-quest',
                popularity: games['math-quest'].popularity
            },
            'agri-expert': {
                id: 'agri-expert',
                name: 'Farm Master',
                description: 'Become an expert in Agri-Sim',
                icon: '🚜',
                xp: 200,
                color1: '#10b981',
                color2: '#059669',
                category: 'game',
                requirement: { type: 'game_score', game: 'agri-sim', value: 100 },
                how: 'Complete all farming challenges',
                game: 'agri-sim',
                popularity: games['agri-sim'].popularity
            },
            'science-genius': {
                id: 'science-genius',
                name: 'Mad Scientist',
                description: 'Ace all Science Lab experiments',
                icon: '🔬',
                xp: 175,
                color1: '#8b5cf6',
                color2: '#7c3aed',
                category: 'game',
                requirement: { type: 'game_score', game: 'science-lab', value: 100 },
                how: 'Successfully complete all VR experiments',
                game: 'science-lab',
                popularity: games['science-lab'].popularity
            },
            'word-champion': {
                id: 'word-champion',
                name: 'Vocabulary King',
                description: 'Master all Word Master levels',
                icon: '📚',
                xp: 125,
                color1: '#f59e0b',
                color2: '#d97706',
                category: 'game',
                requirement: { type: 'game_score', game: 'word-master', value: 100 },
                how: 'Learn 500+ words in Word Master',
                game: 'word-master',
                popularity: games['word-master'].popularity
            },

            // Skill Badges
            'fast-learner': {
                id: 'fast-learner',
                name: 'Speed Learner',
                description: 'Complete 5 games in one week',
                icon: '⚡',
                xp: 100,
                color1: '#fbbf24',
                color2: '#eab308',
                category: 'skill',
                requirement: { type: 'games_week', value: 5 },
                how: 'Play 5 different games within 7 days'
            },
            'perfectionist': {
                id: 'perfectionist',
                name: 'Perfect Score',
                description: 'Get 100% score in any 3 games',
                icon: '💯',
                xp: 250,
                color1: '#ec4899',
                color2: '#db2777',
                category: 'skill',
                requirement: { type: 'perfect_scores', value: 3 },
                how: 'Achieve perfect scores in 3 different games'
            },
            'streak-master': {
                id: 'streak-master',
                name: 'Daily Champion',
                description: 'Maintain 30-day learning streak',
                icon: '🔥',
                xp: 300,
                color1: '#ef4444',
                color2: '#dc2626',
                category: 'skill',
                requirement: { type: 'streak', value: 30 },
                how: 'Learn every day for 30 consecutive days'
            },

            // Community Badges
            'helper': {
                id: 'helper',
                name: 'Community Helper',
                description: 'Help 10 other students',
                icon: '🤝',
                xp: 150,
                color1: '#06b6d4',
                color2: '#0891b2',
                category: 'community',
                requirement: { type: 'help_others', value: 10 },
                how: 'Assist other learners in study groups'
            },
            'village-hero': {
                id: 'village-hero',
                name: 'Village Hero',
                description: 'Top scorer in village ranking',
                icon: '🏆',
                xp: 500,
                color1: '#fbbf24',
                color2: '#eab308',
                category: 'community',
                requirement: { type: 'village_rank', value: 1 },
                how: 'Become #1 in your village leaderboard'
            },

            // Special Badges
            'weekend-warrior': {
                id: 'weekend-warrior',
                name: 'Weekend Warrior',
                description: 'Complete games on both weekend days',
                icon: '🎮',
                xp: 75,
                color1: '#8b5cf6',
                color2: '#7c3aed',
                category: 'special',
                requirement: { type: 'weekend_play', value: 2 },
                how: 'Play games on Saturday and Sunday'
            },
            'early-bird': {
                id: 'early-bird',
                name: 'Early Bird',
                description: 'Play before 8 AM',
                icon: '🌅',
                xp: 50,
                color1: '#3b82f6',
                color2: '#1d4ed8',
                category: 'special',
                requirement: { type: 'early_play', value: 1 },
                how: 'Start learning before 8:00 AM'
            },
            'night-owl': {
                id: 'night-owl',
                name: 'Night Owl',
                description: 'Play after 10 PM',
                icon: '🌙',
                xp: 50,
                color1: '#1e293b',
                color2: '#0f172a',
                category: 'special',
                requirement: { type: 'late_play', value: 1 },
                how: 'Learn after 10:00 PM'
            },

            // Level Badges
            'level-5': {
                id: 'level-5',
                name: 'Rising Star',
                description: 'Reach Level 5',
                icon: '⭐',
                xp: 100,
                color1: '#fbbf24',
                color2: '#eab308',
                category: 'level',
                requirement: { type: 'level', value: 5 },
                how: 'Gain enough XP to reach Level 5'
            },
            'level-10': {
                id: 'level-10',
                name: 'Master Learner',
                description: 'Reach Level 10',
                icon: '🌟🌟',
                xp: 250,
                color1: '#fbbf24',
                color2: '#eab308',
                category: 'level',
                requirement: { type: 'level', value: 10 },
                how: 'Gain enough XP to reach Level 10'
            },
            'level-20': {
                id: 'level-20',
                name: 'Grand Master',
                description: 'Reach Level 20',
                icon: '👑',
                xp: 500,
                color1: '#fbbf24',
                color2: '#eab308',
                category: 'level',
                requirement: { type: 'level', value: 20 },
                how: 'Gain enough XP to reach Level 20'
            },

            // Collection Badges
            'game-collector': {
                id: 'game-collector',
                name: 'Game Collector',
                description: 'Play all 6 main games',
                icon: '🎲',
                xp: 200,
                color1: '#ec4899',
                color2: '#db2777',
                category: 'collection',
                requirement: { type: 'unique_games', value: 6 },
                how: 'Try all available learning games'
            },
            'badge-collector': {
                id: 'badge-collector',
                name: 'Trophy Hunter',
                description: 'Earn 10 different badges',
                icon: '🏆',
                xp: 300,
                color1: '#fbbf24',
                color2: '#eab308',
                category: 'collection',
                requirement: { type: 'badges_count', value: 10 },
                how: 'Collect 10 different achievement badges'
            }
        };
    }

    setupAchievementCategories() {
        this.categories = {
            'all': 'All Badges',
            'game': 'Game Mastery',
            'skill': 'Learning Skills',
            'community': 'Community',
            'milestone': 'Milestones',
            'level': 'Level Progress',
            'special': 'Special Events',
            'collection': 'Collections',
            'earned': 'Earned',
            'locked': 'Locked',
            'recent': 'Recently Earned'
        };
    }

    checkAchievements() {
        const earned = [];
        
        Object.values(this.achievements).forEach(achievement => {
            if (!this.userAchievements[achievement.id]) {
                if (this.checkRequirement(achievement.requirement)) {
                    this.unlockAchievement(achievement);
                    earned.push(achievement);
                }
            }
        });

        return earned;
    }

    checkRequirement(requirement) {
        switch (requirement.type) {
            case 'games_played':
                return (this.user.gamesPlayed || 0) >= requirement.value;
            
            case 'game_score':
                const gameProgress = this.user.progress?.[requirement.game] || 0;
                return gameProgress >= requirement.value;
            
            case 'games_week':
                // Simplified: check if played enough games recently
                return (this.user.gamesPlayed || 0) >= requirement.value;
            
            case 'perfect_scores':
                const perfectGames = Object.values(this.user.progress || {}).filter(p => p === 100).length;
                return perfectGames >= requirement.value;
            
            case 'streak':
                return (this.user.streak || 0) >= requirement.value;
            
            case 'help_others':
                return (this.user.helpedOthers || 0) >= requirement.value;
            
            case 'village_rank':
                return (this.user.villageRank || 999) <= requirement.value;
            
            case 'weekend_play':
                return (this.user.weekendPlays || 0) >= requirement.value;
            
            case 'early_play':
                return (this.user.earlyPlays || 0) >= requirement.value;
            
            case 'late_play':
                return (this.user.latePlays || 0) >= requirement.value;
            
            case 'level':
                return (this.user.level || 1) >= requirement.value;
            
            case 'unique_games':
                const playedGames = Object.keys(this.user.progress || {}).length;
                return playedGames >= requirement.value;
            
            case 'badges_count':
                return Object.keys(this.userAchievements).length >= requirement.value;
            
            default:
                return false;
        }
    }

    unlockAchievement(achievement) {
        // Mark as earned
        this.userAchievements[achievement.id] = {
            earned: true,
            date: new Date().toISOString(),
            xpEarned: achievement.xp
        };

        // Add XP to user
        this.user.xp = (this.user.xp || 0) + achievement.xp;

        // Update user data
        this.user.achievements = this.userAchievements;

        // Save to localStorage
        if (localStorage.getItem('gameEdUser')) {
            localStorage.setItem('gameEdUser', JSON.stringify(this.user));
        } else {
            sessionStorage.setItem('gameEdUser', JSON.stringify(this.user));
        }

        // Show notification
        this.showUnlockNotification(achievement);

        return achievement;
    }

    showUnlockNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 z-50 animate__animated animate__slideInRight';
        notification.innerHTML = `
            <div class="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white p-4 rounded-xl shadow-2xl max-w-sm">
                <div class="flex items-center">
                    <div class="text-3xl mr-3">${achievement.icon}</div>
                    <div>
                        <div class="font-bold">Achievement Unlocked! 🎉</div>
                        <div class="text-sm opacity-90">${achievement.name}</div>
                        <div class="text-xs mt-1">+${achievement.xp} XP Earned!</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.replace('animate__slideInRight', 'animate__slideOutRight');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    getEarnedAchievements() {
        return Object.keys(this.userAchievements)
            .filter(id => this.userAchievements[id].earned)
            .map(id => ({
                ...this.achievements[id],
                earned: true,
                earnedDate: this.userAchievements[id].date
            }));
    }

    getLockedAchievements() {
        return Object.values(this.achievements)
            .filter(achievement => !this.userAchievements[achievement.id])
            .map(achievement => ({
                ...achievement,
                earned: false
            }));
    }

    getRecentAchievements(limit = 5) {
        const earned = this.getEarnedAchievements();
        return earned
            .sort((a, b) => new Date(b.earnedDate) - new Date(a.earnedDate))
            .slice(0, limit);
    }

    getAchievementsByCategory(category) {
        if (category === 'all') {
            return Object.values(this.achievements).map(achievement => ({
                ...achievement,
                earned: !!this.userAchievements[achievement.id]
            }));
        } else if (category === 'earned') {
            return this.getEarnedAchievements();
        } else if (category === 'locked') {
            return this.getLockedAchievements();
        } else if (category === 'recent') {
            return this.getRecentAchievements(20);
        } else {
            return Object.values(this.achievements)
                .filter(achievement => achievement.category === category)
                .map(achievement => ({
                    ...achievement,
                    earned: !!this.userAchievements[achievement.id]
                }));
        }
    }

    getProgressPercentage() {
        const total = Object.keys(this.achievements).length;
        const earned = Object.keys(this.userAchievements).length;
        return Math.round((earned / total) * 100);
    }

    renderBadgeGrid(category = 'all') {
        const achievements = this.getAchievementsByCategory(category);
        const earnedCount = this.getEarnedAchievements().length;
        const totalCount = Object.keys(this.achievements).length;
        
        // Update counts
        document.getElementById('earnedCount').textContent = earnedCount;
        document.getElementById('totalCount').textContent = totalCount;
        document.getElementById('achievementProgress').textContent = `${this.getProgressPercentage()}%`;
        document.getElementById('achievementProgressBar').style.width = `${this.getProgressPercentage()}%`;
        
        // Update badges count in stats
        document.getElementById('badgesCount').textContent = earnedCount;
        
        const badgeGrid = document.getElementById('badgeGrid');
        if (!badgeGrid) return;
        
        badgeGrid.innerHTML = achievements.map(achievement => `
            <div class="badge-card ${achievement.earned ? 'earned' : 'locked'} ${achievement.game ? 'has-game' : ''}"
                 data-id="${achievement.id}"
                 data-game="${achievement.game || ''}"
                 style="--badge-color-1: ${achievement.color1}; --badge-color-2: ${achievement.color2}">
                
                ${!achievement.earned ? `
                    <div class="badge-locked">
                        <i data-feather="lock" class="w-6 h-6"></i>
                    </div>
                ` : ''}
                
                <div class="badge-icon ${achievement.earned ? 'unlock-animation' : ''}">
                    ${achievement.icon}
                </div>
                
                <div class="badge-name">${achievement.name}</div>
                <div class="badge-desc">${achievement.description}</div>
                
                <div class="badge-xp">+${achievement.xp} XP</div>
                
                ${achievement.popularity ? `
                    <div class="mt-2 text-xs text-emerald-400">
                        ${achievement.popularity}
                    </div>
                ` : ''}
                
                ${achievement.game ? `
                    <div class="mt-1 text-xs text-blue-400">
                        Play "${achievement.game.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}"
                    </div>
                ` : ''}
            </div>
        `).join('');
        
        // Initialize feather icons for lock symbols
        if (window.feather) {
            feather.replace();
        }
        
        // Add click event listeners
        document.querySelectorAll('.badge-card').forEach(card => {
            card.addEventListener('click', () => {
                const achievementId = card.getAttribute('data-id');
                const achievement = this.achievements[achievementId];
                const earned = this.userAchievements[achievementId];
                
                this.showBadgeDetails(achievement, earned);
            });
        });
    }

    showBadgeDetails(achievement, earnedData) {
        const modal = document.getElementById('badgeModal');
        const content = modal.querySelector('.badge-details-content');
        
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
        document.getElementById('modalBadgeHow').textContent = achievement.how;
        document.getElementById('modalBadgeStatus').textContent = earnedData ? 'Earned' : 'Locked';
        document.getElementById('modalBadgeStatus').style.color = earnedData ? '#10b981' : '#94a3b8';
        document.getElementById('modalBadgeDate').textContent = earnedDate;
        
        // Add game info if available
        const howElement = document.getElementById('modalBadgeHow');
        if (achievement.game && achievement.game !== 'any') {
            const gameName = achievement.game.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            
            if (achievement.popularity) {
                howElement.innerHTML = `
                    ${achievement.how}<br><br>
                    <span class="text-emerald-300">🎮 ${gameName}:</span><br>
                    <span class="text-sm text-slate-300">${achievement.popularity}</span>
                `;
            } else {
                howElement.innerHTML = `
                    ${achievement.how}<br><br>
                    <span class="text-emerald-300">🎮 Play: ${gameName}</span>
                `;
            }
        }
        
        // Show modal
        modal.style.display = 'flex';
        
        // Close modal button
        document.getElementById('closeModal').onclick = () => {
            modal.style.display = 'none';
        };
        
        // Close on outside click
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    setupAchievements() {
        // Check for new achievements
        this.checkAchievements();
        
        // Render initial grid
        this.renderBadgeGrid('all');
        
        // Setup tab switching
        this.setupTabs();
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get tab category
                const category = button.getAttribute('data-tab');
                
                // Render achievements for this category
                this.renderBadgeGrid(category);
            });
        });
    }

    // Simulate earning an achievement (for testing)
    simulateEarnAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (achievement && !this.userAchievements[achievementId]) {
            this.unlockAchievement(achievement);
            this.renderBadgeGrid('all');
            return true;
        }
        return false;
    }
}
