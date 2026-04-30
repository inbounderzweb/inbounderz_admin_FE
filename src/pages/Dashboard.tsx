import React, { useEffect } from 'react';
import { MessageSquare, Mail, FileText, Users, ArrowUp, ArrowDown, Loader2, Bell, BarChart3, Clock, Zap, AlertTriangle, TrendingUp, Target, Globe, MousePointer2 } from 'lucide-react';
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

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
      case 'BarChart3': return BarChart3;
      case 'Clock': return Clock;
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
  const priority = dashboardStats?.priorityInsights || {};
  const leadSources = dashboardStats?.leadSources || [];
  const leadTypes = dashboardStats?.leadTypes || { new: 0, returning: 0 };
  const enquiryTrends = dashboardStats?.trends?.enquiry || [];
  const careerTrends = dashboardStats?.trends?.career || [];
  const recentActivity = dashboardStats?.recentActivity || [];

  // Map trends to last 7 days
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
    <div className="space-y-4 animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-[18px] font-bold tracking-tight">{getGreeting()} 👋</h1>
          <p className="text-[12px] text-gray-500 mt-0.5">Decision Dashboard — {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <button 
          onClick={() => fetchDashboardStats()}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Zap size={14} /> Refresh Data
        </button>
      </div>

      {/* Priority Insights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-200 dark:border-red-900/30 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
            <Zap size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Urgent Attention</div>
            <div className="text-[14px] font-bold dark:text-white">{priority.newLeadsLastHour} new leads in last 1hr</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Delayed Response</div>
            <div className="text-[14px] font-bold dark:text-white">{priority.delayedLeads} leads waiting &gt; 3 hrs</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Avg. Response Time</div>
            <div className="text-[14px] font-bold dark:text-white">{priority.avgResponseTime} hrs across all leads</div>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {stats.map((stat: any, i: number) => (
          <StatCard 
            key={i}
            label={stat.label} 
            value={stat.value} 
            delta={stat.trend === 'neutral' ? 'Targeted' : `${stat.change}% this week`} 
            up={stat.trend === 'up' ? true : stat.trend === 'down' ? false : 'neutral'} 
            color={['#1d4ed8', '#059669', '#7c3aed', '#16a34a'][i]} 
            bg={['#eff6ff', '#ecfdf5', '#f5f3ff', '#f0fdf4'][i]} 
            icon={getIcon(stat.icon)} 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Trends Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl p-4 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" />
              <h3 className="text-[13px] font-bold">Inbound Traffic Trends</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span> Enquiries
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span> Resumes
              </div>
            </div>
          </div>
          <div className="h-32 flex items-end gap-3 px-2">
            {last7Days.map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div className="w-full flex flex-col-reverse items-end h-full gap-0.5">
                  <div 
                    className="w-full bg-purple-600 rounded-sm transition-all duration-500 opacity-60 hover:opacity-100" 
                    style={{ height: `${(careerChartData[i] / (maxEnq + maxCar)) * 100}%`, minHeight: careerChartData[i] > 0 ? '4px' : '0' }} 
                  />
                  <div 
                    className="w-full bg-blue-600 rounded-sm transition-all duration-500 opacity-80 hover:opacity-100" 
                    style={{ height: `${(enquiryChartData[i] / (maxEnq + maxCar)) * 100}%`, minHeight: enquiryChartData[i] > 0 ? '4px' : '0' }} 
                  />
                </div>
                <span className="text-[9px] text-gray-400">{"SMTWTFS"[(new Date(last7Days[i]).getDay())]}</span>
                <div className="absolute bottom-full mb-2 px-3 py-1.5 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl whitespace-nowrap">
                  <div className="font-bold border-b border-white/10 pb-1 mb-1">{last7Days[i]}</div>
                  <div>Enquiries: {enquiryChartData[i]}</div>
                  <div>Resumes: {careerChartData[i]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Source Analytics (1/3 width) */}
        <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl p-4 transition-colors">
          <div className="flex items-center gap-2 mb-6">
            <Target size={16} className="text-red-500" />
            <h3 className="text-[13px] font-bold">Top Lead Sources</h3>
          </div>
          <div className="space-y-4">
            {leadSources.map((source: any, i: number) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="capitalize text-gray-600 dark:text-gray-400">{source.source}</span>
                  <span className="text-gray-900 dark:text-white">{source.percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={clsx(
                      "h-full transition-all duration-1000",
                      ['bg-blue-600', 'bg-green-600', 'bg-amber-500', 'bg-purple-600'][i % 4]
                    )}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {leadSources.length === 0 && <div className="text-[11px] text-gray-500 text-center py-4">No UTM data tracked yet</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* New vs Returning */}
        <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl p-4 transition-colors">
          <div className="flex items-center gap-2 mb-6">
            <Users size={16} className="text-green-500" />
            <h3 className="text-[13px] font-bold">Lead Intent Analysis</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--color-page-bg)] p-4 rounded-xl border border-[var(--color-border)] text-center">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">New Leads</div>
              <div className="text-2xl font-bold text-blue-600">{leadTypes.new}</div>
              <div className="text-[10px] text-gray-400 mt-1">First-time visitors</div>
            </div>
            <div className="bg-[var(--color-page-bg)] p-4 rounded-xl border border-[var(--color-border)] text-center">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Returning</div>
              <div className="text-2xl font-bold text-green-600">{leadTypes.returning}</div>
              <div className="text-[10px] text-gray-400 mt-1">High-intent users</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl p-4 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-amber-500" />
              <h3 className="text-[13px] font-bold">Latest Pulse</h3>
            </div>
            <span className="text-[11px] text-gray-500">Live feed</span>
          </div>
          <div className="space-y-2">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs bg-[var(--color-page-bg)] rounded-lg">
                Steady as she goes. No new alerts.
              </div>
            ) : (
              recentActivity.map((act: any) => (
                <div key={act.id} className="flex items-start gap-3 p-2.5 bg-[var(--color-page-bg)] rounded-lg border border-[var(--color-border)] transition-colors hover:border-blue-200 dark:hover:border-blue-900/30">
                  <div className={clsx(
                    "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                    act.type === 'enquiry' ? "bg-blue-500" :
                    act.type === 'career' ? "bg-purple-500" : "bg-green-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-gray-900 dark:text-white truncate">{act.title}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{act.description}</div>
                  </div>
                  <div className="text-[10px] text-gray-400 shrink-0 mt-0.5">{formatTime(act.time)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
