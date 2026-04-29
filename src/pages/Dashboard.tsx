import { MessageSquare, Mail, FileText, Users, ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ label, value, delta, up, color, bg, icon: Icon }: any) => (
  <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl p-3.5 relative overflow-hidden transition-colors">
    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">{label}</div>
    <div className="text-2xl font-bold mt-1 mb-0.5 tracking-tighter transition-colors dark:text-[var(--color-text)]" style={{ color }}>{value}</div>
    <div className={`text-[11px] font-medium flex items-center gap-1 ${up ? 'text-green-600' : 'text-red-600'}`}>
      {up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
      {delta}
    </div>
    <div className="absolute right-3.5 top-3.5 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
      <Icon size={16} color={color} />
    </div>
  </div>
);

const Dashboard = () => {
  const activities = [
    { id: 1, type: 'enquiry', text: 'New enquiry from Priya Sharma — "Looking for a CRM solution for 50 users"', time: '2m ago', color: '#3b82f6' },
    { id: 2, type: 'resume', text: 'Resume submitted — Arjun Mehta applied for Senior React Developer', time: '18m ago', color: '#8b5cf6' },
    { id: 3, type: 'client', text: 'Client updated — TechCorp India marked as In Progress by Admin', time: '1h ago', color: '#16a34a' },
    { id: 4, type: 'bulk', text: 'Bulk action — 7 enquiries marked as read', time: '3h ago', color: '#f59e0b' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div>
        <h1 className="text-[18px] font-bold tracking-tight">Good morning, Sajith 👋</h1>
        <p className="text-[12px] text-gray-500 mt-0.5">Here's what's happening today, April 29 2026</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatCard label="Total Enquiries" value="248" delta="14% this week" up color="#1d4ed8" bg="#eff6ff" icon={MessageSquare} />
        <StatCard label="New Messages" value="42" delta="6 today" up color="#7c3aed" bg="#f5f3ff" icon={Mail} />
        <StatCard label="Total Resumes" value="136" delta="8 this week" up color="#0891b2" bg="#ecfeff" icon={FileText} />
        <StatCard label="Active Clients" value="58" delta="2 this month" color="#16a34a" bg="#f0fdf4" icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl p-4 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold">Enquiry Trends</h3>
            <span className="text-[11px] text-gray-500">Last 7 days</span>
          </div>
          <div className="h-24 flex items-end gap-1.5 px-2">
            {[40, 60, 45, 80, 55, 70, 50].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-blue-600 rounded-t-md opacity-80" style={{ height: `${h}%` }} />
                <span className="text-[9px] text-gray-500">{"MTWTFSS"[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl p-4 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold">Application Trends</h3>
            <span className="text-[11px] text-gray-500">Last 7 days</span>
          </div>
          <div className="h-24 flex items-end gap-1.5 px-2">
            {[30, 50, 40, 70, 45, 60, 55].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-purple-600 rounded-t-md opacity-80" style={{ height: `${h}%` }} />
                <span className="text-[9px] text-gray-500">{"MTWTFSS"[i]}</span>
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
          {activities.map(act => (
            <div key={act.id} className="flex items-start gap-3 p-2.5 bg-[var(--color-page-bg)] rounded-lg border border-[var(--color-border)] transition-colors">
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: act.color }} />
              <div className="text-[12px] leading-relaxed flex-1">
                {act.text}
              </div>
              <div className="text-[11px] text-gray-400 shrink-0 mt-0.5">{act.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
