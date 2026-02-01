// Curriculum and Lessons System
class CurriculumSystem {
    constructor(user) {
        this.user = user;
        this.boards = this.loadBoards();
        this.lessons = this.loadLessons();
        this.userCurriculum = user.curriculum || {
            board: user.board || 'CBSE',
            class: user.class || '8',
            subjects: user.subjects || []
        };
    }

    loadBoards() {
        return {
            'CBSE': {
                name: 'Central Board of Secondary Education',
                logo: '🏫',
                color: '#3b82f6'
            },
            'ICSE': {
                name: 'Indian Certificate of Secondary Education',
                logo: '📘',
                color: '#8b5cf6'
            },
            'State Board': {
                name: 'State Board',
                logo: '🏛️',
                color: '#10b981'
            },
            'Other': {
                name: 'Other Board',
                logo: '📚',
                color: '#f59e0b'
            }
        };
    }

    loadLessons() {
        return {
            'math-8': [
                {
                    id: 'math-8-1',
                    title: 'Rational Numbers',
                    description: 'Understanding fractions, decimals, and rational numbers',
                    duration: '45 min',
                    difficulty: 'beginner',
                    type: 'video',
                    thumbnail: '🧮',
                    xp: 50,
                    completed: false
                },
                {
                    id: 'math-8-2',
                    title: 'Linear Equations',
                    description: 'Solving equations with one variable',
                    duration: '60 min',
                    difficulty: 'intermediate',
                    type: 'interactive',
                    thumbnail: '📈',
                    xp: 75,
                    completed: false
                },
                {
                    id: 'math-8-3',
                    title: 'Understanding Quadrilaterals',
                    description: 'Properties of quadrilaterals and practical applications',
                    duration: '50 min',
                    difficulty: 'beginner',
                    type: 'reading',
                    thumbnail: '📐',
                    xp: 60,
                    completed: false
                }
            ],
            'science-8': [
                {
                    id: 'science-8-1',
                    title: 'Crop Production',
                    description: 'Learn about agricultural practices and crop management',
                    duration: '55 min',
                    difficulty: 'beginner',
                    type: 'video',
                    thumbnail: '🌱',
                    xp: 70,
                    completed: false
                },
                {
                    id: 'science-8-2',
                    title: 'Microorganisms',
                    description: 'Friend and Foe - Understanding microbes',
                    duration: '65 min',
                    difficulty: 'intermediate',
                    type: 'interactive',
                    thumbnail: '🔬',
                    xp: 85,
                    completed: false
                }
            ],
            'english-8': [
                {
                    id: 'english-8-1',
                    title: 'Reading Comprehension',
                    description: 'Improve reading skills with engaging stories',
                    duration: '40 min',
                    difficulty: 'beginner',
                    type: 'reading',
                    thumbnail: '📖',
                    xp: 45,
                    completed: false
                },
                {
                    id: 'english-8-2',
                    title: 'Grammar Basics',
                    description: 'Parts of speech and sentence structure',
                    duration: '50 min',
                    difficulty: 'beginner',
                    type: 'video',
                    thumbnail: '📝',
                    xp: 55,
                    completed: false
                }
            ],
            'agriculture-8': [
                {
                    id: 'agriculture-8-1',
                    title: 'Organic Farming',
                    description: 'Learn sustainable farming practices',
                    duration: '50 min',
                    difficulty: 'beginner',
                    type: 'video',
                    thumbnail: '🌿',
                    xp: 65,
                    completed: false
                },
                {
                    id: 'agriculture-8-2',
                    title: 'Soil Types',
                    description: 'Understanding different soil types and their properties',
                    duration: '45 min',
                    difficulty: 'beginner',
                    type: 'interactive',
                    thumbnail: '🟫',
                    xp: 55,
                    completed: false
                }
            ]
        };
    }

    updateCurriculum(board, studentClass) {
        this.userCurriculum.board = board;
        this.userCurriculum.class = studentClass;
        
        this.user.curriculum = this.userCurriculum;
        this.user.board = board;
        this.user.class = studentClass;

        if (localStorage.getItem('gameEdUser')) {
            localStorage.setItem('gameEdUser', JSON.stringify(this.user));
        }

        return this.userCurriculum;
    }

    getBoardInfo(boardId) {
        return this.boards[boardId] || this.boards['Other'];
    }

    getLessonsForSubject(subject) {
        const studentClass = this.userCurriculum.class || '8';
        const subjectKey = `${subject.toLowerCase()}-${studentClass}`;
        return this.lessons[subjectKey] || [];
    }

    completeLesson(lessonId) {
        let completed = false;
        
        Object.keys(this.lessons).forEach(key => {
            const lessonIndex = this.lessons[key].findIndex(lesson => lesson.id === lessonId);
            if (lessonIndex !== -1) {
                this.lessons[key][lessonIndex].completed = true;
                completed = true;
                
                const xp = this.lessons[key][lessonIndex].xp;
                this.user.xp = (this.user.xp || 0) + xp;
                this.user.totalXP = (this.user.totalXP || 0) + xp;
                
                if (!this.userCurriculum.lessons) {
                    this.userCurriculum.lessons = [];
                }
                
                // Check if lesson already completed
                if (!this.userCurriculum.lessons.some(l => l.id === lessonId)) {
                    this.userCurriculum.lessons.push({
                        id: lessonId,
                        completedAt: new Date().toISOString(),
                        xpEarned: xp
                    });
                }
            }
        });

        if (completed && localStorage.getItem('gameEdUser')) {
            localStorage.setItem('gameEdUser', JSON.stringify(this.user));
        }

        return completed;
    }

    renderCurriculumSection() {
        const board = this.userCurriculum.board;
        const studentClass = this.userCurriculum.class;
        const boardInfo = this.getBoardInfo(board);

        return `
            <div class="curriculum-section">
                <div class="curriculum-header">
                    <div class="board-info">
                        <div class="board-logo" style="background: ${boardInfo.color}">
                            ${boardInfo.logo}
                        </div>
                        <div>
                            <h3>${boardInfo.name}</h3>
                            <p class="class-info">Class ${studentClass}</p>
                        </div>
                    </div>
                    <button class="edit-curriculum-btn">
                        <i data-feather="edit-2"></i> Edit
                    </button>
                </div>
                
                <div class="subjects-grid">
                    ${this.renderSubjectCard('Mathematics', '🧮', '#3b82f6', 65)}
                    ${this.renderSubjectCard('Science', '🔬', '#8b5cf6', 45)}
                    ${this.renderSubjectCard('English', '📚', '#f59e0b', 70)}
                    ${this.renderSubjectCard('Social Studies', '🗺️', '#10b981', 30)}
                    ${this.renderSubjectCard('Computer', '💻', '#ec4899', 55)}
                    ${this.renderSubjectCard('Agriculture', '🚜', '#22c55e', 80)}
                </div>
            </div>
        `;
    }

    renderSubjectCard(subject, icon, color, progress) {
        const lessons = this.getLessonsForSubject(subject);
        const completedLessons = lessons.filter(lesson => lesson.completed).length;
        const totalLessons = lessons.length;
        const actualProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : progress;

        return `
            <div class="subject-card">
                <div class="subject-header">
                    <div class="subject-icon" style="background: ${color}">
                        ${icon}
                    </div>
                    <div class="subject-info">
                        <h4>${subject}</h4>
                        <p>${completedLessons}/${totalLessons} lessons</p>
                    </div>
                </div>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${actualProgress}%; background: ${color}"></div>
                    </div>
                    <span class="progress-text">${actualProgress}%</span>
                </div>
                <button class="view-lessons-btn" data-subject="${subject.toLowerCase()}">
                    View Lessons
                </button>
            </div>
        `;
    }

    renderLessonsModal(subject) {
        const lessons = this.getLessonsForSubject(subject);
        
        if (lessons.length === 0) {
            return `
                <div class="no-lessons">
                    <div class="no-lessons-icon">📚</div>
                    <h3>No Lessons Available</h3>
                    <p>Lessons for ${subject} - Class ${this.userCurriculum.class} will be added soon!</p>
                </div>
            `;
        }

        return lessons.map(lesson => `
            <div class="lesson-item ${lesson.completed ? 'completed' : ''}" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div class="lesson-thumbnail" style="width: 50px; height: 50px; border-radius: 10px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                        ${lesson.thumbnail}
                    </div>
                    <div class="lesson-details">
                        <h4 style="font-weight: 600; margin-bottom: 0.25rem;">${lesson.title}</h4>
                        <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.5rem;">${lesson.description}</p>
                        <div class="lesson-meta" style="display: flex; gap: 1rem; font-size: 0.8rem; color: #94a3b8;">
                            <span><i data-feather="clock"></i> ${lesson.duration}</span>
                            <span><i data-feather="target"></i> ${lesson.difficulty}</span>
                            <span><i data-feather="star"></i> +${lesson.xp} XP</span>
                        </div>
                    </div>
                </div>
                <button class="start-lesson-btn" data-lesson="${lesson.id}" style="background: ${lesson.completed ? '#10b981' : '#3b82f6'}; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; transition: all 0.3s ease;">
                    ${lesson.completed ? 'Completed ✓' : 'Start Lesson'}
                </button>
            </div>
        `).join('');
    }
}

// Export for use in dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CurriculumSystem;
}
