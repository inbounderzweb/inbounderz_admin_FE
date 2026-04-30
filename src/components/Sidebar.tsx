import React from 'react';
import {
  LayoutGrid,
  MessageSquare,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { useAppStore, useDataStore } from '../store/useStore';
import { clsx } from 'clsx';
import { useEffect } from 'react';

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar, activePage, setActivePage, logout } = useAppStore();
  const { unreadEnquiriesCount, unreadCareersCount, fetchUnreadCounts } = useDataStore() as any;

  useEffect(() => {
    fetchUnreadCounts();
    // Optional: could set up an interval to poll for updates
    // const interval = setInterval(fetchUnreadCounts, 60000);
    // return () => clearInterval(interval);
  }, [fetchUnreadCounts]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, section: 'Main' },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, section: 'Main', badge: unreadEnquiriesCount > 0 ? unreadEnquiriesCount : null },
    { id: 'careers', label: 'Careers', icon: FileText, section: 'Main', badge: unreadCareersCount > 0 ? unreadCareersCount : null },
    { id: 'clients', label: 'Clients', icon: Users, section: 'Main' },
    { id: 'users', label: 'Users', icon: Users, section: 'Main' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, section: 'Reports' },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'System' },
  ];

  return (
    <aside
      className={clsx(
        "bg-[var(--color-sidebar-bg)] border-r border-[var(--color-border)] flex flex-col transition-all duration-300 z-20 h-screen overflow-hidden",
        sidebarCollapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center gap-3 p-4 border-b border-[var(--color-border)] h-[52px] shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 bg-blue-600 rounded-lg shrink-0 flex items-center justify-center hover:opacity-80 transition-opacity"
          title={sidebarCollapsed ? "Expand Sidebar" : "Nexus Admin"}
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4 fill-white">
            <rect x="1" y="1" width="6" height="6" rx="1.5" /><rect x="9" y="1" width="6" height="6" rx="1.5" /><rect x="1" y="9" width="6" height="6" rx="1.5" /><rect x="9" y="9" width="6" height="6" rx="1.5" />
          </svg>
        </button>

        {!sidebarCollapsed && (
          <>
            <span className="text-sm font-bold whitespace-nowrap overflow-hidden tracking-tight dark:text-white">
              <span className="text-blue-600">Inbounderz</span>
            </span>
            <button
              onClick={toggleSidebar}
              className="ml-auto p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <Menu size={18} />
            </button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        {navItems.map((item, index) => {
          const showSection = !sidebarCollapsed && (index === 0 || item.section !== navItems[index - 1].section);
          return (
            <React.Fragment key={item.id}>
              {showSection && (
                <div className="px-4 py-2 mt-2 text-[10px] font-semibold text-gray-500 tracking-widest uppercase">
                  {item.section}
                </div>
              )}
              <button
                onClick={() => setActivePage(item.id)}
                className={clsx(
                  "flex items-center gap-3 py-2 px-4 mx-2 rounded-lg transition-colors whitespace-nowrap relative group",
                  activePage === item.id ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                )}
              >
                <item.icon size={18} className={clsx(
                  activePage === item.id ? "text-blue-600" : "text-gray-500"
                )} />
                {!sidebarCollapsed && (
                  <>
                    <span className="text-[13px] font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-auto border-t border-[var(--color-border)] p-2">
        <button
          onClick={logout}
          className="flex items-center gap-3 py-2 px-4 mx-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 w-[calc(100%-12px)] transition-colors"
        >
          <LogOut size={18} />
          {!sidebarCollapsed && <span className="text-[13px] font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
