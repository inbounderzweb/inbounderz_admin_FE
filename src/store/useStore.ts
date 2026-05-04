import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const BASE_URL = 'https://pbcgzzqh-3000.inc1.devtunnels.ms';
const REQUEST_CACHE_MS = 30000;
const inFlightRequests = new Map<string, Promise<void>>();

const buildQueryKey = (
  resource: string,
  page = 1,
  search = '',
  status = '',
  limit = 10,
  dateRange = '',
  startDate = '',
  endDate = ''
) => [resource, page, search, status, limit, dateRange, startDate, endDate].join('|');

const isFreshCache = (lastKey: string | undefined, lastFetchedAt: number | undefined, key: string) => (
  lastKey === key && typeof lastFetchedAt === 'number' && lastFetchedAt > 0 && Date.now() - lastFetchedAt < REQUEST_CACHE_MS
);

interface Permissions {
  dashboard: { view: boolean };
  enquiries: { view: boolean; edit: boolean; delete: boolean; export: boolean };
  careers: { view: boolean; edit: boolean; delete: boolean; export: boolean };
  analytics: { view: boolean; export: boolean };
  settings: { view: boolean; edit: boolean };
  users: { view: boolean; create: boolean; edit: boolean; delete: boolean };
}

interface User {
  name: string;
  email: string;
  role: string;
  permissions?: Permissions;
}

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface NavigationItem {
  id?: string;
  label?: string;
  path?: string;
  icon?: string;
  children?: NavigationItem[];
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

interface ApiResult {
  success: boolean;
  message?: string;
}

interface AuthResponse extends ApiResult {
  user?: User;
  data?: User;
  navigation?: NavigationItem[];
  devToken?: string;
}

interface ApiResponse<T> extends ApiResult {
  data?: T;
  pagination?: Pagination;
  unreadCount?: number;
  count?: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

type EntryStatus = 'new' | 'reviewed' | 'selected' | 'unselected' | string;

interface Enquiry {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  designation?: string;
  industry?: string;
  message?: string;
  status?: EntryStatus;
  createdAt: string;
}

interface Career {
  _id: string;
  email?: string;
  phone?: string;
  ccode?: string;
  resumeUrl?: string;
  status?: EntryStatus;
  createdAt: string;
}

interface ServerNotification {
  _id: string;
  title?: string;
  description?: string;
  type?: string;
  link?: string;
  referenceId?: string;
  isRead?: boolean;
  createdAt: string;
}

interface Client {
  id: number;
  name: string;
  company: string;
  contact: string;
  req: string;
  status: string;
}

interface UserRecord extends User {
  _id: string;
  createdAt?: string;
}

type DashboardStats = Record<string, unknown>;
type AnalyticsStats = Record<string, unknown>;

interface AppState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  
  activePage: string;
  setActivePage: (page: string) => void;
  
  notifications: Notification[];
  addNotification: (message: string, type: 'success' | 'error') => void;
  
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  navigation: NavigationItem[];
  login: (credentials: LoginCredentials) => Promise<ApiResult>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (data: ResetPasswordData) => Promise<ApiResult>;
}

interface DataState {
  enquiries: Enquiry[];
  pagination: Pagination;
  isDataLoading: boolean;
  lastEnquiriesQuery: string;
  lastEnquiriesFetchedAt: number;
  unreadEnquiriesCount: number;
  careers: Career[];
  careersPagination: Pagination;
  isCareersLoading: boolean;
  lastCareersQuery: string;
  lastCareersFetchedAt: number;
  unreadCareersCount: number;
  serverNotifications: ServerNotification[];
  unreadNotificationsCount: number;
  isNotificationsLoading: boolean;
  notificationsFetchedAt: number;
  fetchNotifications: () => Promise<void> | undefined;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  markNotificationByReferenceAsRead: (refId: string) => Promise<void>;
  dashboardStats: DashboardStats | null;
  isDashboardLoading: boolean;
  dashboardStatsFetchedAt: number;
  fetchDashboardStats: () => Promise<void> | undefined;
  analyticsStats: AnalyticsStats | null;
  isAnalyticsLoading: boolean;
  analyticsStatsFetchedAt: number;
  fetchAnalyticsStats: () => Promise<void> | undefined;
  fetchUnreadCounts: () => Promise<void> | undefined;
  clients: Client[];
  users: UserRecord[];
  fetchEnquiries: (page?: number, search?: string, status?: string, limit?: number, dateRange?: string, startDate?: string, endDate?: string) => Promise<void> | undefined;
  exportEnquiries: (search?: string, status?: string, dateRange?: string, startDate?: string, endDate?: string) => Promise<void>;
  deleteEnquiry: (id: string) => void;
  markEnquiryRead: (id: string) => void;
  bulkUpdateEnquiryStatus: (ids: string[], status: string) => Promise<ApiResult>;
  bulkDeleteEnquiries: (ids: string[]) => Promise<ApiResult>;
  fetchCareers: (page?: number, search?: string, status?: string, limit?: number, dateRange?: string, startDate?: string, endDate?: string) => Promise<void> | undefined;
  exportCareers: (search?: string, status?: string, dateRange?: string, startDate?: string, endDate?: string) => Promise<void>;
  bulkUpdateCareerStatus: (ids: string[], status: string) => Promise<ApiResult>;
  bulkDeleteCareers: (ids: string[]) => Promise<ApiResult>;
  fetchUsers: () => Promise<void>;
  addUser: (userData: Omit<UserRecord, '_id' | 'createdAt'> & { password?: string }) => Promise<ApiResult>;
  updateUser: (userId: string, userData: Partial<Omit<UserRecord, '_id' | 'createdAt'>> & { password?: string }) => Promise<ApiResult>;
  deleteUser: (userId: string) => Promise<ApiResult>;
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
          const data: AuthResponse = await response.json();
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
        } catch {
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

          const data: AuthResponse = await response.json();
          if (data.success) {
            set({ 
              user: data.user || data.data, 
              isAuthenticated: true,
              navigation: data.navigation || []
            });
          } else {
            set({ user: null, isAuthenticated: false, navigation: [], activePage: 'login' });
          }
        } catch {
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
          const data: AuthResponse = await response.json();
          return data;
        } catch {
          return { success: false, message: 'Server error' };
        }
      },

      resetPassword: async (resetData) => {
        try {
          const response = await fetch(`${BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resetData),
            credentials: 'include'
          });
          const data: ApiResult = await response.json();
          return data;
        } catch {
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

export const useDataStore = create<DataState>((set, get) => ({
  enquiries: [],
  pagination: { total: 0, page: 1, limit: 10, pages: 1 },
  isDataLoading: false,
  lastEnquiriesQuery: '',
  lastEnquiriesFetchedAt: 0,
  unreadEnquiriesCount: 0,
  
  careers: [],
  careersPagination: { total: 0, page: 1, limit: 10, pages: 1 },
  isCareersLoading: false,
  lastCareersQuery: '',
  lastCareersFetchedAt: 0,
  unreadCareersCount: 0,
  
  serverNotifications: [],
  unreadNotificationsCount: 0,
  isNotificationsLoading: false,
  notificationsFetchedAt: 0,

  fetchNotifications: async () => {
    const key = 'notifications';
    const state = get();
    if (Date.now() - state.notificationsFetchedAt < REQUEST_CACHE_MS) return;
    if (inFlightRequests.has(key)) return inFlightRequests.get(key);

    const request = (async () => {
      set({ isNotificationsLoading: state.serverNotifications.length === 0 });
      try {
        const response = await fetch(`${BASE_URL}/notifications`, { credentials: 'include' });
        const data: ApiResponse<ServerNotification[]> = await response.json();
        if (data.success) {
          set({ 
            serverNotifications: data.data ?? [],
            unreadNotificationsCount: data.unreadCount ?? 0,
            notificationsFetchedAt: Date.now()
          });
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        set({ isNotificationsLoading: false });
        inFlightRequests.delete(key);
      }
    })();

    inFlightRequests.set(key, request);
    return request;
  },

  markNotificationAsRead: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/${id}/read`, { 
        method: 'PATCH',
        credentials: 'include'
      });
      const data: ApiResult = await response.json();
      if (data.success) {
        set((state) => ({
          serverNotifications: state.serverNotifications.map((n) => 
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
      const data: ApiResult = await response.json();
      if (data.success) {
        set((state) => ({
          serverNotifications: state.serverNotifications.map((n) => ({ ...n, isRead: true })),
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
      const data: ApiResult = await response.json();
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
      const data: ApiResult = await response.json();
      if (data.success) {
        set((state) => ({
          serverNotifications: state.serverNotifications.map((n) => 
            n.referenceId === refId ? { ...n, isRead: true } : n
          ),
          unreadNotificationsCount: state.serverNotifications.filter((n) => 
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
  dashboardStatsFetchedAt: 0,

  fetchDashboardStats: async () => {
    const key = 'dashboard:stats';
    const state = get();
    if (state.dashboardStats && Date.now() - state.dashboardStatsFetchedAt < REQUEST_CACHE_MS) return;
    if (inFlightRequests.has(key)) return inFlightRequests.get(key);

    const request = (async () => {
      set({ isDashboardLoading: !state.dashboardStats });
      try {
        const response = await fetch(`${BASE_URL}/dashboard/stats`, { credentials: 'include' });
        const data: ApiResponse<DashboardStats> = await response.json();
        if (data.success) {
          set({ dashboardStats: data.data ?? null, dashboardStatsFetchedAt: Date.now() });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        set({ isDashboardLoading: false });
        inFlightRequests.delete(key);
      }
    })();

    inFlightRequests.set(key, request);
    return request;
  },

  analyticsStats: null,
  isAnalyticsLoading: false,
  analyticsStatsFetchedAt: 0,

  fetchAnalyticsStats: async () => {
    const key = 'dashboard:analytics';
    const state = get();
    if (state.analyticsStats && Date.now() - state.analyticsStatsFetchedAt < REQUEST_CACHE_MS) return;
    if (inFlightRequests.has(key)) return inFlightRequests.get(key);

    const request = (async () => {
      set({ isAnalyticsLoading: !state.analyticsStats });
      try {
        const response = await fetch(`${BASE_URL}/dashboard/analytics`, { credentials: 'include' });
        const data: ApiResponse<AnalyticsStats> = await response.json();
        if (data.success) {
          set({ analyticsStats: data.data ?? null, analyticsStatsFetchedAt: Date.now() });
        }
      } catch (error) {
        console.error('Failed to fetch analytics stats:', error);
      } finally {
        set({ isAnalyticsLoading: false });
        inFlightRequests.delete(key);
      }
    })();

    inFlightRequests.set(key, request);
    return request;
  },

  fetchUnreadCounts: async () => {
    const key = 'unread-counts';
    if (inFlightRequests.has(key)) return inFlightRequests.get(key);

    const request = (async () => {
      try {
        const [enqRes, carRes] = await Promise.all([
          fetch(`${BASE_URL}/enquiries/unread-count`, { credentials: 'include' }),
          fetch(`${BASE_URL}/careers/unread-count`, { credentials: 'include' })
        ]);
        const [enqData, carData]: [ApiResponse<never>, ApiResponse<never>] = await Promise.all([enqRes.json(), carRes.json()]);
        
        if (enqData.success) {
          set({ unreadEnquiriesCount: enqData.count ?? 0 });
        }
        if (carData.success) {
          set({ unreadCareersCount: carData.count ?? 0 });
        }
      } catch (error) {
        console.error('Failed to fetch unread counts:', error);
      } finally {
        inFlightRequests.delete(key);
      }
    })();

    inFlightRequests.set(key, request);
    return request;
  },

  clients: [
    { id: 1, name: 'Anil Verma', company: 'TechCorp India', contact: 'anil@techcorp.in', req: 'Custom ERP development', status: 'progress' },
    { id: 2, name: 'Riya Shah', company: 'Innovatech Solutions', contact: 'riya@innovatech.co', req: 'Mobile app for retail chain', status: 'new' },
  ],
  users: [],
  
  fetchEnquiries: async (page = 1, search = '', status = '', limit = 10, dateRange = '', startDate = '', endDate = '') => {
    const key = buildQueryKey('enquiries', page, search, status, limit, dateRange, startDate, endDate);
    const state = get();
    if (isFreshCache(state.lastEnquiriesQuery, state.lastEnquiriesFetchedAt, key)) return;
    if (inFlightRequests.has(key)) return inFlightRequests.get(key);

    const request = (async () => {
      set({ isDataLoading: state.enquiries.length === 0 });
      try {
        const response = await fetch(`${BASE_URL}/enquiries?page=${page}&limit=${limit}&search=${search}&status=${status}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`, {
          credentials: 'include'
        });
        const data: ApiResponse<Enquiry[]> = await response.json();
        if (data.success) {
          set({ 
            enquiries: data.data ?? [],
            pagination: data.pagination ?? { total: 0, page, limit, pages: 1 },
            lastEnquiriesQuery: key,
            lastEnquiriesFetchedAt: Date.now()
          });
        }
      } catch (error) {
        console.error('Failed to fetch enquiries:', error);
      } finally {
        set({ isDataLoading: false });
        inFlightRequests.delete(key);
      }
    })();

    inFlightRequests.set(key, request);
    return request;
  },

  exportEnquiries: async (search = '', status = '', dateRange = '', startDate = '', endDate = '') => {
    try {
      const response = await fetch(`${BASE_URL}/enquiries?isExport=true&search=${search}&status=${status}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`, {
        credentials: 'include'
      });
      const data: ApiResponse<Enquiry[]> = await response.json();
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

  deleteEnquiry: (id: string) => set((state) => ({
    enquiries: state.enquiries.filter((e) => e._id !== id)
  })),
  
  markEnquiryRead: (id: string) => set((state) => ({
    enquiries: state.enquiries.map((e) => e._id === id ? { ...e, status: 'reviewed' } : e)
  })),

  bulkUpdateEnquiryStatus: async (ids: string[], status: string) => {
    try {
      const response = await fetch(`${BASE_URL}/enquiries/bulk-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
        credentials: 'include'
      });
      const data: ApiResult = await response.json();
      if (data.success) {
        set((state) => ({
          enquiries: state.enquiries.map((e) => 
            ids.includes(e._id) ? { ...e, status } : e
          )
        }));
        // Update unread count automatically
        const { fetchUnreadCounts } = useDataStore.getState();
        fetchUnreadCounts();
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
      const data: ApiResult = await response.json();
      if (data.success) {
        set((state) => ({
          enquiries: state.enquiries.filter((e) => !ids.includes(e._id)),
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
    const key = buildQueryKey('careers', page, search, status, limit, dateRange, startDate, endDate);
    const state = get();
    if (isFreshCache(state.lastCareersQuery, state.lastCareersFetchedAt, key)) return;
    if (inFlightRequests.has(key)) return inFlightRequests.get(key);

    const request = (async () => {
      set({ isCareersLoading: state.careers.length === 0 });
      try {
        const response = await fetch(`${BASE_URL}/careers?page=${page}&limit=${limit}&search=${search}&status=${status}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`, {
          credentials: 'include'
        });
        const data: ApiResponse<Career[]> = await response.json();
        if (data.success) {
          set({ 
            careers: data.data ?? [],
            careersPagination: data.pagination ?? { total: 0, page, limit, pages: 1 },
            lastCareersQuery: key,
            lastCareersFetchedAt: Date.now()
          });
        }
      } catch (error) {
        console.error('Failed to fetch careers:', error);
      } finally {
        set({ isCareersLoading: false });
        inFlightRequests.delete(key);
      }
    })();

    inFlightRequests.set(key, request);
    return request;
  },

  exportCareers: async (search = '', status = '', dateRange = '', startDate = '', endDate = '') => {
    try {
      const response = await fetch(`${BASE_URL}/careers?isExport=true&search=${search}&status=${status}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`, {
        credentials: 'include'
      });
      const data: ApiResponse<Career[]> = await response.json();
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
      const data: ApiResult = await response.json();
      if (data.success) {
        set((state) => ({
          careers: state.careers.map((e) => 
            ids.includes(e._id) ? { ...e, status } : e
          )
        }));
        // Update unread count automatically
        const { fetchUnreadCounts } = useDataStore.getState();
        fetchUnreadCounts();
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
      const data: ApiResult = await response.json();
      if (data.success) {
        set((state) => ({
          careers: state.careers.filter((e) => !ids.includes(e._id)),
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
      const data: ApiResponse<UserRecord[]> = await response.json();
      if (data.success) {
        set({ users: data.data ?? [] });
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  addUser: async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      const data: ApiResponse<UserRecord> = await response.json();
      if (data.success) {
        set((state) => ({ users: data.data ? [data.data, ...state.users] : state.users }));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      return { success: false, message: 'Network error' };
    }
  },

  updateUser: async (userId: string, userData) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      const data: ApiResponse<UserRecord> = await response.json();
      if (data.success) {
        set((state) => ({
          users: state.users.map((u) => u._id === userId && data.data ? data.data : u)
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
      const data: ApiResult = await response.json();
      if (data.success) {
        set((state) => ({
          users: state.users.filter((u) => u._id !== userId)
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
