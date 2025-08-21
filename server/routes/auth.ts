import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../database/init';

const router = express.Router();

interface User {
  id: number;
  username: string;
  password_hash: string;
  theme_preference: string;
  created_at: string;
  last_login: string;
}

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = getDatabase();
    
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User;
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
    
    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = getDatabase();
    
    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (username, password_hash, theme_preference) VALUES (?, ?, ?)'
    ).run(username, hashedPassword, 'dark');
    
    // Get created user
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as User;
    
    const { password_hash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check auth status
router.get('/check', (req, res) => {
  // This would normally check a session/JWT
  // For now, just return success if we get here
  res.json({ authenticated: true });
});

// Logout
router.post('/logout', (req, res) => {
  // This would normally clear session/JWT
  res.json({ success: true });
});

export default router;