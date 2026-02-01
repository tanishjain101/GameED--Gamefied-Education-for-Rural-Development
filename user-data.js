// User Data Management
class UserData {
    constructor() {
        this.user = this.loadUserData();
        this.quizSystem = new QuizSystem(this.user);
        this.curriculumSystem = new CurriculumSystem(this.user);
        this.achievementsSystem = new AchievementsSystem(this.user);
        this.games = this.loadGames();
    }
    
    loadUserData() {
        const saved = localStorage.getItem('gameEdUser') || sessionStorage.getItem('gameEdUser');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Redirect to login if no user data
        window.location.href = 'auth.html?mode=login&redirect=dashboard';
        return null;
    }
    
    saveUserData() {
        if (this.user) {
            localStorage.setItem('gameEdUser', JSON.stringify(this.user));
        }
    }
    
    // ... rest of the UserData class methods from earlier
    // (You should copy the methods from the embedded version)
}

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserData;
}