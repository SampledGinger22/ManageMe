import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/database';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  login: (user: User) => void;
  logout: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      theme: 'dark',
      login: (user) => set({ user, isAuthenticated: true, theme: user.theme_preference }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setTheme: (theme) => set((state) => ({
        theme,
        user: state.user ? { ...state.user, theme_preference: theme } : null,
      })),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
      }),
    }
  )
);