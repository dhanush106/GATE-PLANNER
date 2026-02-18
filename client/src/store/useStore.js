import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// WHY: Global state management using Zustand
// Simple, unopinionated, and less boilerplate than Redux
const useStore = create(
  persist(
    (set) => ({
      // Access Code Authentication
      isAuthenticated: false,
      login: (code) => {
        if (code === 'GATE2026') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),

      // Theme (default to dark in this app, but extensible)
      isDarkMode: true,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // User Name (optional, useful for personalization)
      userName: 'Aspirant',
      setUserName: (name) => set({ userName: name }),
    }),
    {
      name: 'gate-prep-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userName: state.userName,
        isDarkMode: state.isDarkMode
      }), // Persist auth, username, and theme
    }
  )
);

export default useStore;
