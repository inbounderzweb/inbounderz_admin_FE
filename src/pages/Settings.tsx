import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Moon, Sun, Bell, Shield, Mail, Lock, Save, Globe, Palette } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { clsx } from 'clsx';

const Settings = () => {
  const { darkMode, toggleDarkMode, user } = useAppStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-[20px] font-bold tracking-tight dark:text-white font-['Syne']">System Settings</h1>
        <p className="text-[12px] text-gray-500 mt-1">Manage your account preferences and system configuration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-2xl p-6 transition-colors">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-[var(--color-border)]">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold dark:text-white">{user?.email}</h3>
                  <p className="text-sm text-gray-500 capitalize">{user?.role} Account</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Admin User"
                    className="w-full px-4 py-2.5 bg-[var(--color-page-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-blue-600 transition-colors dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      value={user?.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-page-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none opacity-60 cursor-not-allowed dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-md font-bold dark:text-white">Theme Preference</h3>
                <p className="text-sm text-gray-500">Choose between light and dark mode for your dashboard.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => darkMode && toggleDarkMode()}
                    className={clsx(
                      "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                      !darkMode ? "border-blue-600 bg-blue-50 dark:bg-blue-900/10" : "border-[var(--color-border)] hover:border-gray-300"
                    )}
                  >
                    <Sun size={24} className={!darkMode ? "text-blue-600" : "text-gray-400"} />
                    <span className={clsx("text-sm font-bold", !darkMode ? "text-blue-600" : "text-gray-500")}>Light Mode</span>
                  </button>
                  <button 
                    onClick={() => !darkMode && toggleDarkMode()}
                    className={clsx(
                      "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                      darkMode ? "border-blue-600 bg-blue-50 dark:bg-blue-900/10" : "border-[var(--color-border)] hover:border-gray-700"
                    )}
                  >
                    <Moon size={24} className={darkMode ? "text-blue-600" : "text-gray-400"} />
                    <span className={clsx("text-sm font-bold", darkMode ? "text-blue-600" : "text-gray-500")}>Dark Mode</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-md font-bold dark:text-white">Alert Settings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive daily lead summaries via email.' },
                  { label: 'Push Notifications', desc: 'Real-time desktop alerts for new enquiries.' },
                  { label: 'Sound Alerts', desc: 'Play a subtle chime when a notification arrives.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[var(--color-page-bg)] rounded-xl border border-[var(--color-border)]">
                    <div>
                      <div className="text-sm font-bold dark:text-white">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-md font-bold dark:text-white">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Current Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" underline className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-page-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-blue-600 transition-colors dark:text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">New Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" underline className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-page-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-blue-600 transition-colors dark:text-white" />
                  </div>
                </div>
                <button className="px-6 py-2.5 bg-gray-900 dark:bg-white dark:text-black text-white rounded-xl text-sm font-bold hover:opacity-80 transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
