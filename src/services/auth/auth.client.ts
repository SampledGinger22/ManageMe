// Frontend auth service - connects to backend API
import type { User } from '../../types/database';

export class AuthService {
  private currentUser: User | null = null;
  private apiUrl = '/api/auth';

  async login(username: string, password: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      this.currentUser = data.user;
      
      // Store in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async register(username: string, password: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data = await response.json();
      this.currentUser = data.user;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/logout`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
    }
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  async updatePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, oldPassword, newPassword }),
      });

      return response.ok;
    } catch (error) {
      console.error('Password update error:', error);
      return false;
    }
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/check-username?username=${username}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Username check error:', error);
      return false;
    }
  }

  async hasAdminUser(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/has-admin`);
      const data = await response.json();
      return data.hasAdmin;
    } catch (error) {
      console.error('Admin check error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();