import React, { useEffect } from 'react';
import { MessageSquare, Mail, FileText, Users, ArrowUp, ArrowDown, Loader2, Bell } from 'lucide-react';
import { useDataStore } from '../store/useStore';
import { clsx } from 'clsx';

const StatCard = ({ label, value, delta, up, color, bg, icon: Icon }: any) => (
  <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl p-3.5 relative overflow-hidden transition-colors">
    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">{label}</div>
    <div className="text-2xl font-bold mt-1 mb-0.5 tracking-tighter transition-colors dark:text-[var(--color-text)]" style={{ color }}>{value}</div>
    <div className={clsx(
      "text-[11px] font-medium flex items-center gap-1",
      up === 'neutral' ? 'text-gray-500' : up ? 'text-green-600' : 'text-red-600'
    )}>
      {up === 'neutral' ? null : up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
      {delta}
    </div>
    <div className="absolute right-3.5 top-3.5 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
      <Icon size={16} color={color} />
    </div>
  </div>
);

const Dashboard = () => {
  const { fetchDashboardStats, dashboardStats, isDashboardLoading } = useDataStore() as any;

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return MessageSquare;
      case 'Mail': return Mail;
      case 'FileText': return FileText;
      case 'Users': return Users;
      default: return Bell;
    }
  };

  if (isDashboardLoading && !dashboardStats) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const stats = dashboardStats?.stats || [];
  const enquiryTrends = dashboardStats?.trends?.enquiry || [];
  const careerTrends = dashboardStats?.trends?.career || [];
  const recentActivity = dashboardStats?.recentActivity || [];

  // Map trends to last 7 days (including zeros)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const enquiryChartData = last7Days.map(date => {
    const found = enquiryTrends.find((t: any) => t._id === date);
    return found ? found.count : 0;
  });

  const careerChartData = last7Days.map(date => {
    const found = careerTrends.find((t: any) => t._id === date);
    return found ? found.count : 0;
  });

  const maxEnq = Math.max(...enquiryChartData, 1);
  const maxCar = Math.max(...careerChartData, 1);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-[18px] font-bold tracking-tight">Good morning 👋</h1>
          <p className="text-[12px] text-gray-500 mt-0.5">Here's what's happening today, {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <button 
          onClick={() => fetchDashboardStats()}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {stats.map((stat: any, i: number) => (
          <StatCard 
            key={i}
            label={stat.label} 
            value={stat.value} 
            delta={stat.label.includes('TOTAL') ? `${Math.abs(stat.change)}% this week` : `${stat.change} today`} 
            up={stat.trend === 'up' ? true : stat.trend === 'down' ? false : 'neutral'} 
            color={['#1d4ed8', '#7c3aed', '#0891b2', '#16a34a'][i]} 
            bg={['#eff6ff', '#f5f3ff', '#ecfeff', '#f0fdf4'][i]} 
            icon={getIcon(stat.icon)} 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl p-4 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold">Enquiry Trends</h3>
            <span className="text-[11px] text-gray-500">Last 7 days</span>
          </div>
          <div className="h-28 flex items-end gap-2 px-2">
            {enquiryChartData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div 
                  className="w-full bg-blue-600 rounded-t-md transition-all duration-500 hover:opacity-100 opacity-70" 
                  style={{ height: `${(val / maxEnq) * 100}%`, minHeight: val > 0 ? '4px' : '0' }} 
                />
                <span className="text-[9px] text-gray-400">{"SMTWTFS"[(new Date(last7Days[i]).getDay())]}</span>
                <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {val} Enquiries
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl p-4 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold">Application Trends</h3>
            <span className="text-[11px] text-gray-500">Last 7 days</span>
          </div>
          <div className="h-28 flex items-end gap-2 px-2">
            {careerChartData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div 
                  className="w-full bg-purple-600 rounded-t-md transition-all duration-500 hover:opacity-100 opacity-70" 
                  style={{ height: `${(val / maxCar) * 100}%`, minHeight: val > 0 ? '4px' : '0' }} 
                />
                <span className="text-[9px] text-gray-400">{"SMTWTFS"[(new Date(last7Days[i]).getDay())]}</span>
                <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {val} Applications
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl p-4 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-bold">Recent Activity</h3>
          <span className="text-[11px] text-gray-500">Latest updates</span>
        </div>
        <div className="space-y-2">
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs bg-[var(--color-page-bg)] rounded-lg">
              No recent activity found.
            </div>
          ) : (
            recentActivity.map((act: any) => (
              <div key={act.id} className="flex items-start gap-3 p-3 bg-[var(--color-page-bg)] rounded-lg border border-[var(--color-border)] transition-colors hover:border-blue-200 dark:hover:border-blue-900/30">
                <div className={clsx(
                  "w-2 h-2 rounded-full mt-1.5 shrink-0",
                  act.type === 'enquiry' ? "bg-blue-500" :
                  act.type === 'career' ? "bg-purple-500" :
                  act.type === 'system' ? "bg-red-500" : "bg-green-500"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-gray-900 dark:text-white">{act.title}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{act.description}</div>
                </div>
                <div className="text-[10px] text-gray-400 shrink-0 mt-0.5 flex items-center gap-1">
                  {formatTime(act.time)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
