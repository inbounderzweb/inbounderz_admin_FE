import { useEffect } from 'react';
import { PieChart, Layers, Globe, Smartphone, Monitor, Loader2, ArrowUpRight } from 'lucide-react';
import { useDataStore } from '../store/useStore';
import { clsx } from 'clsx';

const AnalyticsCard = ({ title, icon: Icon, children, color }: any) => (
  <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl p-5 transition-colors">
    <div className="flex items-center gap-3 mb-6">
      <div className={clsx("p-2 rounded-lg", color)}>
        <Icon size={18} />
      </div>
      <h3 className="text-[14px] font-bold dark:text-white">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const ProgressBar = ({ label, percentage, count, color }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[11px] font-medium">
      <span className="text-gray-600 dark:text-gray-400 truncate pr-2">{label}</span>
      <span className="text-gray-900 dark:text-white whitespace-nowrap">{count} ({percentage}%)</span>
    </div>
    <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
      <div 
        className={clsx("h-full transition-all duration-1000", color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const Analytics = () => {
  const { fetchAnalyticsStats, analyticsStats, isAnalyticsLoading } = useDataStore() as any;

  useEffect(() => {
    fetchAnalyticsStats();
  }, []);

  if (isAnalyticsLoading && !analyticsStats) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const data = analyticsStats || { services: [], industries: [], budgets: [], devices: [] };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight dark:text-white font-['Syne']">Deep Analytics</h1>
          <p className="text-[12px] text-gray-500 mt-1">Granular insights into your inbound traffic and lead profiles.</p>
        </div>
        <button 
          onClick={fetchAnalyticsStats}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <ArrowUpRight size={14} /> Update Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalyticsCard title="Service Popularity" icon={Layers} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          {data.services.map((item: any, i: number) => (
            <ProgressBar 
              key={i} 
              label={item.label} 
              percentage={item.percentage} 
              count={item.count} 
              color="bg-blue-600" 
            />
          ))}
          {data.services.length === 0 && <div className="text-[11px] text-gray-500 text-center py-10">No service data available.</div>}
        </AnalyticsCard>

        <AnalyticsCard title="Industry Breakdown" icon={Globe} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
          {data.industries.map((item: any, i: number) => (
            <ProgressBar 
              key={i} 
              label={item.label} 
              percentage={item.percentage} 
              count={item.count} 
              color="bg-purple-600" 
            />
          ))}
          {data.industries.length === 0 && <div className="text-[11px] text-gray-500 text-center py-10">No industry data available.</div>}
        </AnalyticsCard>

        <AnalyticsCard title="Budget Distribution" icon={PieChart} color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          {data.budgets.map((item: any, i: number) => (
            <ProgressBar 
              key={i} 
              label={item.label} 
              percentage={item.percentage} 
              count={item.count} 
              color="bg-green-600" 
            />
          ))}
          {data.budgets.length === 0 && <div className="text-[11px] text-gray-500 text-center py-10">No budget data available.</div>}
        </AnalyticsCard>

        <AnalyticsCard title="Device & Platform" icon={Smartphone} color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
          <div className="grid grid-cols-2 gap-4">
            {data.devices.map((item: any, i: number) => (
              <div key={i} className="bg-[var(--color-page-bg)] p-6 rounded-xl border border-[var(--color-border)] text-center relative overflow-hidden group">
                <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  {item.label === 'Mobile' ? <Smartphone size={40} /> : <Monitor size={40} />}
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{item.label}</div>
                <div className="text-3xl font-bold dark:text-white">{item.percentage}%</div>
                <div className="text-[11px] text-gray-500 mt-1">{item.count} Sessions</div>
              </div>
            ))}
          </div>
          {data.devices.length === 0 && <div className="text-[11px] text-gray-500 text-center py-10">No device data detected.</div>}
        </AnalyticsCard>
      </div>
    </div>
  );
};

export default Analytics;
