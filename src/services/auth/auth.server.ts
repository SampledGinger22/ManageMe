// Server-side auth service - for future backend API
import bcrypt from 'bcryptjs';
import { getDatabase } from '../database';
import type { User } from '../../types/database';

export class AuthService {
  private db = getDatabase();

  async login(username: string, password: string): Promise<User | null> {
    try {
      // Get user from database
      const user = this.db.get<User>(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (!user) {
        return null;
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return null;
      }

      // Update last login
      this.db.run(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      );

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async register(username: string, password: string): Promise<User | null> {
    try {
      // Check if user already exists
      const existingUser = this.db.get<User>(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const result = this.db.run(
        'INSERT INTO users (username, password_hash, theme_preference) VALUES (?, ?, ?)',
        [username, hashedPassword, 'dark']
      );

      // Get created user
      const user = this.db.get<User>(
        'SELECT * FROM users WHERE id = ?',
        [result.lastInsertRowid]
      );

      if (!user) {
        throw new Error('Failed to create user');
      }

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async updatePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Get user
      const user = this.db.get<User>(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      if (!user) {
        return false;
      }

      // Verify old password
      const isValid = await bcrypt.compare(oldPassword, user.password_hash);
      if (!isValid) {
        return false;
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      this.db.run(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [hashedPassword, userId]
      );

      return true;
    } catch (error) {
      console.error('Password update error:', error);
      return false;
    }
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const user = this.db.get<{ count: number }>(
      'SELECT COUNT(*) as count FROM users WHERE username = ?',
      [username]
    );
    return user ? user.count > 0 : false;
  }

  async hasAdminUser(): Promise<boolean> {
    const result = this.db.get<{ count: number }>(
      'SELECT COUNT(*) as count FROM users'
    );
    return result ? result.count > 0 : false;
  }
}

export const authService = new AuthService();