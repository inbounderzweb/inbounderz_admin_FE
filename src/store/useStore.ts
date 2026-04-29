import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
  role: string;
}

interface AppState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  
  activePage: string;
  setActivePage: (page: string) => void;
  
  notifications: any[];
  addNotification: (message: string, type: 'success' | 'error') => void;
  
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (credentials: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      activePage: 'login',
      setActivePage: (page) => set({ activePage: page }),
      
      notifications: [],
      addNotification: (message, type) => set((state) => ({
        notifications: [...state.notifications, { id: Date.now(), message, type }]
      })),

      darkMode: false,
      toggleDarkMode: () => set((state) => {
        const newDarkMode = !state.darkMode;
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { darkMode: newDarkMode };
      }),

      // Auth Implementation
      user: null,
      isAuthenticated: false,
      isAuthLoading: true,

      login: async (credentials) => {
        try {
          const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            credentials: 'include'
          });
          const data = await response.json();
          if (data.success) {
            set({ 
              user: data.data, 
              isAuthenticated: true, 
              activePage: 'dashboard' 
            });
            return { success: true };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: 'Server error' };
        }
      },

      logout: async () => {
        try {
          await fetch('http://localhost:3000/auth/logout', { 
            method: 'POST',
            credentials: 'include'
          });
          set({ user: null, isAuthenticated: false, activePage: 'login' });
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },

      checkAuth: async () => {
        set({ isAuthLoading: true });
        try {
          const response = await fetch('http://localhost:3000/auth/me', {
            credentials: 'include'
          });
          const data = await response.json();
          if (data.success) {
            set({ user: data.data, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isAuthLoading: false });
        }
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        activePage: state.activePage,
        darkMode: state.darkMode
      }),
    }
  )
);

export const useDataStore = create((set) => ({
  enquiries: [
    { id: 1, name: 'Priya Sharma', email: 'priya@startup.io', phone: '+91 98765 43210', msg: 'Looking for a CRM solution for 50 users and integration with Zoho.', date: 'Apr 29', status: 'new', unread: true },
    { id: 2, name: 'Rohan Das', email: 'rohan@techco.in', phone: '+91 87654 32109', msg: 'Need a custom ERP for manufacturing unit with inventory tracking.', date: 'Apr 28', status: 'new', unread: true },
    { id: 3, name: 'Meera Iyer', email: 'meera@designhub.com', phone: '+91 76543 21098', msg: 'Looking for UI/UX redesign of our SaaS product dashboard.', date: 'Apr 28', status: 'reviewed', unread: false },
  ],
  resumes: [
    { id: 1, name: 'Arjun Mehta', role: 'Senior React Developer', exp: '5 years', date: 'Apr 29', status: 'new', unread: true },
    { id: 2, name: 'Sneha Reddy', role: 'Backend Engineer (Node.js)', exp: '3 years', date: 'Apr 29', status: 'new', unread: true },
  ],
  clients: [
    { id: 1, name: 'Anil Verma', company: 'TechCorp India', contact: 'anil@techcorp.in', req: 'Custom ERP development', status: 'progress' },
    { id: 2, name: 'Riya Shah', company: 'Innovatech Solutions', contact: 'riya@innovatech.co', req: 'Mobile app for retail chain', status: 'new' },
  ],
  users: [],
  
  deleteEnquiry: (id: number) => set((state: any) => ({
    enquiries: state.enquiries.filter((e: any) => e.id !== id)
  })),
  markEnquiryRead: (id: number) => set((state: any) => ({
    enquiries: state.enquiries.map((e: any) => e.id === id ? { ...e, unread: false, status: 'reviewed' } : e)
  })),

  fetchUsers: async () => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set({ users: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  addUser: async (userData: any) => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set((state: any) => ({ users: [data.data, ...state.users] }));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      return { success: false, message: 'Network error' };
    }
  }
}));
