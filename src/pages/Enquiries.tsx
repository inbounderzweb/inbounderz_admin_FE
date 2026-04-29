import React, { useState } from 'react';
import { Search, Filter, Calendar, Check, Trash2, Download, Eye } from 'lucide-react';
import { useDataStore } from '../store/useStore';
import { clsx } from 'clsx';

const Enquiries = () => {
  const { enquiries, markEnquiryRead, deleteEnquiry } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredEnquiries = enquiries.filter((e: any) => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredEnquiries.map((enq: any) => enq.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-bold tracking-tight">
          Enquiries 
          <span className="text-[12px] font-normal text-gray-500 ml-2">{enquiries.length} total</span>
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
          <input 
            type="text" 
            placeholder="Search enquiries…" 
            className="w-full pl-8 pr-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] outline-none focus:border-[var(--color-accent)] transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select className="px-2.5 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] outline-none cursor-pointer transition-colors">
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
        </select>

        <div className="relative">
          <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
          <input type="date" className="pl-8 pr-2.5 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] outline-none transition-colors" />
        </div>

        <button 
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] font-medium hover:bg-[var(--color-page-bg)] disabled:opacity-50 transition-colors"
          disabled={selectedIds.length === 0}
        >
          <Check size={14} /> Mark Read
        </button>

        <button 
          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-100 dark:border-red-900/30 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 text-[12px] font-medium hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors"
          disabled={selectedIds.length === 0}
        >
          <Trash2 size={14} /> Delete
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] font-medium hover:bg-[var(--color-page-bg)] transition-colors">
          <Download size={14} /> Export
        </button>
      </div>

      <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[var(--color-page-bg)] border-bottom border-[var(--color-border)]">
                <th className="p-3 w-10">
                  <input 
                    type="checkbox" 
                    className="accent-blue-700 w-3.5 h-3.5 cursor-pointer" 
                    onChange={toggleSelectAll}
                    checked={selectedIds.length === filteredEnquiries.length && filteredEnquiries.length > 0}
                  />
                </th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[30%]">Message</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((enq: any) => (
                <tr 
                  key={enq.id} 
                  className={clsx(
                    "border-t border-[var(--color-border)] transition-colors group",
                    enq.unread ? "font-semibold bg-blue-50/20 dark:bg-blue-900/10" : "hover:bg-gray-50/50 dark:hover:bg-white/5"
                  )}
                >
                  <td className="p-3">
                    <input 
                      type="checkbox" 
                      className="accent-blue-700 w-3.5 h-3.5 cursor-pointer" 
                      checked={selectedIds.includes(enq.id)}
                      onChange={() => toggleSelect(enq.id)}
                    />
                  </td>
                  <td className="p-3 text-[12px]">
                    <div className="flex items-center gap-2">
                      {enq.unread && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                      {enq.name}
                    </div>
                  </td>
                  <td className="p-3 text-[12px] text-gray-500">{enq.email}</td>
                  <td className="p-3 text-[12px] text-gray-500">{enq.phone}</td>
                  <td className="p-3 text-[12px] text-gray-500 max-w-0">
                    <p className="truncate">{enq.msg}</p>
                  </td>
                  <td className="p-3 text-[12px] text-gray-500">{enq.date}</td>
                  <td className="p-3 text-[12px]">
                    <span className={clsx(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                      enq.status === 'new' ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                    )}>
                      {enq.status.charAt(0).toUpperCase() + enq.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => markEnquiryRead(enq.id)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        title="Mark as Read"
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        onClick={() => deleteEnquiry(enq.id)}
                        className="p-1.5 text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-3 border-t border-[var(--color-border)] flex items-center justify-end gap-1 bg-gray-50/30 transition-colors">
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-sidebar-bg)] text-[12px] hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 transition-colors">‹</button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md bg-blue-700 text-white text-[12px]">1</button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-sidebar-bg)] text-[12px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">2</button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-sidebar-bg)] text-[12px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">3</button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-sidebar-bg)] text-[12px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">›</button>
        </div>
      </div>
    </div>
  );
};

export default Enquiries;
