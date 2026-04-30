import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, MessageSquare, Moon, Sun, X, Check, Mail, FileText, AlertTriangle, User, BarChart3, Clock, ExternalLink } from 'lucide-react';
import { useAppStore, useDataStore } from '../store/useStore';
import { clsx } from 'clsx';

const Topbar = () => {
  const { darkMode, toggleDarkMode, setActivePage, user } = useAppStore();
  const { 
    serverNotifications, 
    unreadNotificationsCount, 
    fetchNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    clearAllNotifications,
    isNotificationsLoading 
  } = useDataStore() as any;

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Filter notifications to only show unread or most recent
  // But if the user marks as read, they expect it to be "handled" and removed from the priority list
  const activeNotifications = serverNotifications.filter((n: any) => !n.isRead);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
    return date.toLocaleDateString();
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'enquiry': return <Mail size={14} className="text-blue-500" />;
      case 'career': return <FileText size={14} className="text-purple-500" />;
      case 'system': return <AlertTriangle size={14} className="text-red-500" />;
      case 'user': return <User size={14} className="text-green-500" />;
      default: return <Bell size={14} className="text-gray-500" />;
    }
  };

  return (
    <header className="h-[52px] bg-[var(--color-sidebar-bg)] border-b border-[var(--color-border)] flex items-center gap-2.5 px-4 shrink-0 transition-colors z-40">
      <div className="flex-1 max-w-[320px] relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
        <input 
          type="text" 
          placeholder="Search enquiries, resumes, clients…" 
          className="w-full pl-8 pr-2.5 py-1.5 border border-black/10 rounded-lg bg-[#f4f3ef] dark:bg-white/5 dark:border-white/10 dark:text-white text-[12px] outline-none focus:border-blue-700"
        />
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <button 
          onClick={toggleDarkMode}
          className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 px-2 py-1 rounded-lg"
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          <div className={clsx(
            "w-7 h-4 rounded-full relative transition-colors",
            darkMode ? "bg-blue-600" : "bg-black/10"
          )}>
            <div className={clsx(
              "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
              darkMode ? "left-3.5" : "left-0.5"
            )} />
          </div>
        </button>

        <div className="w-[0.5px] h-5 bg-black/10 mx-1" />

        {/* Notifications Bell */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 relative transition-colors",
              isNotifOpen && "bg-gray-100 dark:bg-white/5"
            )}
          >
            <Bell size={16} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-sidebar-bg)]" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[480px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-[var(--color-border)] flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm dark:text-white">Notifications</h3>
                  {unreadNotificationsCount > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadNotificationsCount} New
                    </span>
                  )}
                </div>
                <button 
                  onClick={markAllNotificationsAsRead}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                >
                  Mark all as read
                </button>
              </div>

              <div className="overflow-y-auto custom-scrollbar">
                {activeNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell size={18} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-xs font-medium">No pending notifications</p>
                    <p className="text-gray-400 text-[10px] mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  activeNotifications.map((notif: any) => (
                    <div 
                      key={notif._id}
                      className={clsx(
                        "p-3 border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative",
                        !notif.isRead && "bg-blue-50/30 dark:bg-blue-900/10"
                      )}
                    >
                      <div className="flex gap-3">
                        <div className={clsx(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          notif.type === 'enquiry' && "bg-blue-100 dark:bg-blue-900/30",
                          notif.type === 'career' && "bg-purple-100 dark:bg-purple-900/30",
                          notif.type === 'system' && "bg-red-100 dark:bg-red-900/30",
                          notif.type === 'user' && "bg-green-100 dark:bg-green-900/30"
                        )}>
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <h4 className={clsx(
                              "text-[12px] font-bold truncate",
                              notif.isRead ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"
                            )}>
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                              <Clock size={10} />
                              {formatTime(notif.createdAt)}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {notif.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {notif.link && (
                              <button 
                                onClick={() => {
                                  markNotificationAsRead(notif._id);
                                  setActivePage(notif.link);
                                  setIsNotifOpen(false);
                                }}
                                className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700"
                              >
                                <ExternalLink size={10} />
                                View Details
                              </button>
                            )}
                            {!notif.isRead && (
                              <button 
                                onClick={() => markNotificationAsRead(notif._id)}
                                className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600"
                              >
                                <Check size={10} />
                                Mark Read
                              </button>
                            )}
                          </div>
                        </div>
                        {!notif.isRead && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                             <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {serverNotifications.length > 0 && (
                <div className="p-2 bg-gray-50 dark:bg-white/5 border-t border-[var(--color-border)] text-center">
                  <button 
                    onClick={() => {
                      clearAllNotifications();
                      setIsNotifOpen(false);
                    }}
                    className="text-[10px] font-bold text-gray-500 hover:text-red-600 uppercase tracking-widest transition-colors"
                  >
                    Clear All Notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <MessageSquare size={16} />
        </button>

        <div className="w-[0.5px] h-5 bg-black/10 mx-1" />

        <div className="flex items-center gap-2 px-1">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] font-bold text-gray-900 dark:text-white leading-tight">
              {user?.name || 'Super Admin'}
            </span>
            <span className="text-[9px] text-gray-500 font-medium capitalize">
              {user?.role || 'User'}
            </span>
          </div>
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-pointer shrink-0 shadow-sm hover:ring-2 hover:ring-blue-100 dark:hover:ring-blue-900/30 transition-all">
            {getInitials(user?.name || 'Super Admin')}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
