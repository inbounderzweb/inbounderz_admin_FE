import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
  role: string;
  permissions?: {
    dashboard: { view: boolean };
    enquiries: { view: boolean; edit: boolean; delete: boolean; export: boolean };
    careers: { view: boolean; edit: boolean; delete: boolean; export: boolean };
    analytics: { view: boolean; export: boolean };
    settings: { view: boolean; edit: boolean };
    users: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  };
}

const BASE_URL = 'http://localhost:3000';

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
  navigation: any[];
  login: (credentials: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (data: any) => Promise<{ success: boolean; message?: string }>;
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
      navigation: [],

      login: async (credentials) => {
        try {
          const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            credentials: 'include'
          });
          const data = await response.json();
          if (data.success) {
            set({ 
              user: data.user || data.data, 
              isAuthenticated: true, 
              navigation: data.navigation || [],
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
          await fetch(`${BASE_URL}/auth/logout`, { 
            method: 'POST',
            credentials: 'include'
          });
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          // Always clear state locally regardless of server success
          set({ user: null, isAuthenticated: false, navigation: [], activePage: 'login' });
        }
      },

      checkAuth: async () => {
        set({ isAuthLoading: true });
        try {
          const response = await fetch(`${BASE_URL}/auth/me`, {
            credentials: 'include'
          });
          
          if (response.status === 401) {
             set({ user: null, isAuthenticated: false, navigation: [], activePage: 'login' });
             return;
          }

          const data = await response.json();
          if (data.success) {
            set({ 
              user: data.user || data.data, 
              isAuthenticated: true,
              navigation: data.navigation || []
            });
          } else {
            set({ user: null, isAuthenticated: false, navigation: [], activePage: 'login' });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false, navigation: [], activePage: 'login' });
        } finally {
          set({ isAuthLoading: false });
        }
      },

      forgotPassword: async (email: string) => {
        try {
          const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            credentials: 'include'
          });
          const data = await response.json();
          return data;
        } catch (error) {
          return { success: false, message: 'Server error' };
        }
      },

      resetPassword: async (resetData: any) => {
        try {
          const response = await fetch(`${BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resetData),
            credentials: 'include'
          });
          const data = await response.json();
          return data;
        } catch (error) {
          return { success: false, message: 'Server error' };
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
  enquiries: [],
  pagination: { total: 0, page: 1, limit: 10, pages: 1 },
  isDataLoading: false,
  unreadEnquiriesCount: 0,
  
  careers: [],
  careersPagination: { total: 0, page: 1, limit: 10, pages: 1 },
  isCareersLoading: false,
  unreadCareersCount: 0,
  
  serverNotifications: [],
  unreadNotificationsCount: 0,
  isNotificationsLoading: false,

  fetchNotifications: async () => {
    set({ isNotificationsLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/notifications`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        set({ 
          serverNotifications: data.data,
          unreadNotificationsCount: data.unreadCount
        });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      set({ isNotificationsLoading: false });
    }
  },

  markNotificationAsRead: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/${id}/read`, { 
        method: 'PATCH',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set((state: any) => ({
          serverNotifications: state.serverNotifications.map((n: any) => 
            n._id === id ? { ...n, isRead: true } : n
          ),
          unreadNotificationsCount: Math.max(0, state.unreadNotificationsCount - 1)
        }));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/read-all`, { 
        method: 'PATCH',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set((state: any) => ({
          serverNotifications: state.serverNotifications.map((n: any) => ({ ...n, isRead: true })),
          unreadNotificationsCount: 0
        }));
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },

  clearAllNotifications: async () => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/clear-all`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set({ 
          serverNotifications: [],
          unreadNotificationsCount: 0
        });
      }
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  },

  markNotificationByReferenceAsRead: async (refId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/read-ref/${refId}`, { 
        method: 'PATCH',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set((state: any) => ({
          serverNotifications: state.serverNotifications.map((n: any) => 
            n.referenceId === refId ? { ...n, isRead: true } : n
          ),
          unreadNotificationsCount: state.serverNotifications.filter((n: any) => 
            n.referenceId === refId && !n.isRead
          ).length > 0 ? Math.max(0, state.unreadNotificationsCount - 1) : state.unreadNotificationsCount
        }));
      }
    } catch (error) {
      console.error('Failed to mark notification by reference as read:', error);
    }
  },

  dashboardStats: null,
  isDashboardLoading: false,

  fetchDashboardStats: async () => {
    set({ isDashboardLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/dashboard/stats`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        set({ dashboardStats: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      set({ isDashboardLoading: false });
    }
  },

  analyticsStats: null,
  isAnalyticsLoading: false,

  fetchAnalyticsStats: async () => {
    set({ isAnalyticsLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/dashboard/analytics`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        set({ analyticsStats: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch analytics stats:', error);
    } finally {
      set({ isAnalyticsLoading: false });
    }
  },

  fetchUnreadCounts: async () => {
    try {
      const [enqRes, carRes] = await Promise.all([
        fetch(`${BASE_URL}/enquiries/unread-count`, { credentials: 'include' }),
        fetch(`${BASE_URL}/careers/unread-count`, { credentials: 'include' })
      ]);
      const [enqData, carData] = await Promise.all([enqRes.json(), carRes.json()]);
      
      if (enqData.success) {
        set({ unreadEnquiriesCount: enqData.count });
      }
      if (carData.success) {
        set({ unreadCareersCount: carData.count });
      }
    } catch (error) {
      console.error('Failed to fetch unread counts:', error);
    }
  },

  clients: [
    { id: 1, name: 'Anil Verma', company: 'TechCorp India', contact: 'anil@techcorp.in', req: 'Custom ERP development', status: 'progress' },
    { id: 2, name: 'Riya Shah', company: 'Innovatech Solutions', contact: 'riya@innovatech.co', req: 'Mobile app for retail chain', status: 'new' },
  ],
  users: [],
  
  fetchEnquiries: async (page = 1, search = '', status = '', limit = 10, dateRange = '', startDate = '', endDate = '') => {
    set({ isDataLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/enquiries?page=${page}&limit=${limit}&search=${search}&status=${status}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set({ 
          enquiries: data.data,
          pagination: data.pagination
        });
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    } finally {
      set({ isDataLoading: false });
    }
  },

  exportEnquiries: async (search = '', status = '', dateRange = '', startDate = '', endDate = '') => {
    try {
      const response = await fetch(`${BASE_URL}/enquiries?isExport=true&search=${search}&status=${status}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success && data.data) {
        if (data.data.length === 0) {
          alert('No data found to export with the current filters.');
          return;
        }

        const headers = ['Name', 'Email', 'Phone', 'Company', 'Designation', 'Industry', 'Message', 'Status', 'Date'];
        const csvRows = [];
        csvRows.push(headers.join(','));
        
        for (const row of data.data) {
          const values = [
            `"${(row.name || '').replace(/"/g, '""')}"`,
            `"${(row.email || '').replace(/"/g, '""')}"`,
            `"${(row.phone || '').replace(/"/g, '""')}"`,
            `"${(row.company || '').replace(/"/g, '""')}"`,
            `"${(row.designation || '').replace(/"/g, '""')}"`,
            `"${(row.industry || '').replace(/"/g, '""')}"`,
            `"${(row.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
            `"${(row.status || '').replace(/"/g, '""')}"`,
            `"${new Date(row.createdAt).toLocaleDateString()}"`
          ];
          csvRows.push(values.join(','));
        }
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `enquiries_export_${new Date().getTime()}.csv`);
        a.click();
      }
    } catch (error) {
      console.error('Failed to export enquiries:', error);
    }
  },

  deleteEnquiry: (id: string) => set((state: any) => ({
    enquiries: state.enquiries.filter((e: any) => e._id !== id)
  })),
  
  markEnquiryRead: (id: string) => set((state: any) => ({
    enquiries: state.enquiries.map((e: any) => e._id === id ? { ...e, status: 'reviewed' } : e)
  })),

  bulkUpdateEnquiryStatus: async (ids: string[], status: string) => {
    try {
      const response = await fetch(`${BASE_URL}/enquiries/bulk-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set((state: any) => ({
          enquiries: state.enquiries.map((e: any) => 
            ids.includes(e._id) ? { ...e, status } : e
          )
        }));
        // Update unread count automatically
        const { fetchUnreadCounts } = useDataStore.getState() as any;
        if (fetchUnreadCounts) fetchUnreadCounts();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Failed to update enquiries:', error);
      return { success: false };
    }
  },

  bulkDeleteEnquiries: async (ids: string[]) => {
    try {
      const response = await fetch(`${BASE_URL}/enquiries/bulk`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set((state: any) => ({
          enquiries: state.enquiries.filter((e: any) => !ids.includes(e._id)),
          pagination: { ...state.pagination, total: state.pagination.total - ids.length }
        }));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Failed to delete enquiries:', error);
      return { success: false };
    }
  },
  fetchCareers: async (page = 1, search = '', status = '', limit = 10, dateRange = '', startDate = '', endDate = '') => {
    set({ isCareersLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/careers?page=${page}&limit=${limit}&search=${search}&status=${status}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set({ 
          careers: data.data,
          careersPagination: data.pagination
        });
      }
    } catch (error) {
      console.error('Failed to fetch careers:', error);
    } finally {
      set({ isCareersLoading: false });
    }
  },

  exportCareers: async (search = '', status = '', dateRange = '', startDate = '', endDate = '') => {
    try {
      const response = await fetch(`${BASE_URL}/careers?isExport=true&search=${search}&status=${status}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success && data.data) {
        if (data.data.length === 0) {
          alert('No data found to export with the current filters.');
          return;
        }

        const headers = ['Email', 'Phone', 'Resume URL', 'Status', 'Date'];
        const csvRows = [];
        csvRows.push(headers.join(','));
        
        for (const row of data.data) {
          const values = [
            `"${(row.email || '').replace(/"/g, '""')}"`,
            `"${(row.phone || '').replace(/"/g, '""')}"`,
            `"${(row.resumeUrl || '').replace(/"/g, '""')}"`,
            `"${(row.status || '').replace(/"/g, '""')}"`,
            `"${new Date(row.createdAt).toLocaleDateString()}"`
          ];
          csvRows.push(values.join(','));
        }
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `careers_export_${new Date().getTime()}.csv`);
        a.click();
      }
    } catch (error) {
      console.error('Failed to export careers:', error);
    }
  },

  bulkUpdateCareerStatus: async (ids: string[], status: string) => {
    try {
      const response = await fetch(`${BASE_URL}/careers/bulk-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set((state: any) => ({
          careers: state.careers.map((e: any) => 
            ids.includes(e._id) ? { ...e, status } : e
          )
        }));
        // Update unread count automatically
        const { fetchUnreadCounts } = useDataStore.getState() as any;
        if (fetchUnreadCounts) fetchUnreadCounts();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Failed to update careers:', error);
      return { success: false };
    }
  },

  bulkDeleteCareers: async (ids: string[]) => {
    try {
      const response = await fetch(`${BASE_URL}/careers/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set((state: any) => ({
          careers: state.careers.filter((e: any) => !ids.includes(e._id)),
          careersPagination: { ...state.careersPagination, total: state.careersPagination.total - ids.length }
        }));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Failed to delete careers:', error);
      return { success: false };
    }
  },
  fetchUsers: async () => {
    try {
      const response = await fetch(`${BASE_URL}/users`  , {
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
      const response = await fetch(`${BASE_URL}/users`, {
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
  },

  updateUser: async (userId: string, userData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set((state: any) => ({
          users: state.users.map((u: any) => u._id === userId ? data.data : u)
        }));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Failed to update user:', error);
      return { success: false, message: 'Server error' };
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        set((state: any) => ({
          users: state.users.filter((u: any) => u._id !== userId)
        }));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Failed to delete user:', error);
      return { success: false, message: 'Server error' };
    }
  }
}));
