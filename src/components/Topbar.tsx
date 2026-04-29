import { Search, Bell, MessageSquare, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { clsx } from 'clsx';

const Topbar = () => {
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <header className="h-[52px] bg-[var(--color-sidebar-bg)] border-b border-[var(--color-border)] flex items-center gap-2.5 px-4 shrink-0 transition-colors">
      <div className="flex-1 max-w-[320px] relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
        <input 
          type="text" 
          placeholder="Search enquiries, resumes, clients…" 
          className="w-full pl-8 pr-2.5 py-1.5 border border-black/10 rounded-lg bg-[#f4f3ef] text-[12px] outline-none focus:border-blue-700"
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

        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 relative">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
        </button>

        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100">
          <MessageSquare size={16} />
        </button>

        <div className="w-[0.5px] h-5 bg-black/10 mx-1" />

        <div className="w-7.5 h-7.5 bg-blue-700 rounded-full flex items-center justify-center text-[11px] font-semibold text-white cursor-pointer shrink-0">
          SA
        </div>
      </div>
    </header>
  );
};

export default Topbar;
