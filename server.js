const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'users.json');

// Load users from file
function loadUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
    return [];
}

// Save users to file
function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving users:', error);
        return false;
    }
}

// Routes
app.get('/api/users', (req, res) => {
    const users = loadUsers();
    res.json(users);
});

app.post('/api/register', (req, res) => {
    const { name, email, username, password, region, age } = req.body;
    
    if (!name || !email || !username || !password || !region || !age) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const users = loadUsers();
    
    // Check if user exists
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already registered' });
    }
    
    if (users.some(u => u.username === username)) {
        return res.status(400).json({ error: 'Username already taken' });
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        username,
        password, // In production, hash this!
        region,
        age,
        xp: 100,
        totalXP: 100,
        level: 1,
        badges: ['new-learner'],
        achievements: [],
        progress: {
            math: 0,
            science: 0,
            agriculture: 0,
            language: 0
        },
        joined: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    res.json({ 
        success: true, 
        message: 'Account created successfully',
        user: newUser 
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const users = loadUsers();
    const user = users.find(u => u.email === email || u.username === email);
    
    if (!user) {
        return res.status(404).json({ error: 'Account not found' });
    }
    
    // In production, compare hashed passwords
    if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
        success: true,
        message: 'Login successful',
        user: userWithoutPassword
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});