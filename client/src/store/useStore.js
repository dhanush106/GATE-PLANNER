import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// WHY: Global state management using Zustand
// Supports two roles: 'owner' (full access) and 'viewer' (read-only, code TEST101)
const useStore = create(
  persist(
    (set) => ({
      // Access Code Authentication
      isAuthenticated: false,
      role: 'owner', // 'owner' | 'viewer'

      login: (code) => {
        if (code === 'GATE2026') {
          set({ isAuthenticated: true, role: 'owner', userName: 'Dhanush' });
          return true;
        }
        if (code === 'TEST101') {
          set({ isAuthenticated: true, role: 'viewer', userName: 'Guest' });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false, role: 'owner', userName: 'Aspirant' }),

      // Theme (default to dark)
      isDarkMode: true,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // User Name
      userName: 'Aspirant',
      setUserName: (name) => set({ userName: name }),
    }),
    {
      name: 'gate-prep-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        role: state.role,
        userName: state.userName,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

export default useStore;
