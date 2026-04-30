import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, Check, Trash2, Download, Eye, Loader2, X, Filter, Mail, Phone, Building } from 'lucide-react';
import { useDataStore } from '../store/useStore';
import { clsx } from 'clsx';

const Enquiries = () => {
  const {
    enquiries,
    pagination,
    isDataLoading,
    fetchEnquiries,
    exportEnquiries,
    bulkUpdateEnquiryStatus,
    bulkDeleteEnquiries,
    markNotificationByReferenceAsRead
  } = useDataStore() as any;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewEnquiry, setViewEnquiry] = useState<any | null>(null);

  // Initial fetch
  useEffect(() => {
    fetchEnquiries(1, '', '', 10, '', '', '');
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEnquiries(1, searchTerm, statusFilter, limit, dateFilter, customStartDate, customEndDate);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, limit, dateFilter, customStartDate, customEndDate]);

  const handlePageChange = (page: number) => {
    fetchEnquiries(page, searchTerm, statusFilter, limit, dateFilter, customStartDate, customEndDate);
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(enquiries.map((enq: any) => enq._id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-bold tracking-tight">
          Enquiries
          <span className="text-[12px] font-normal text-gray-500 ml-2">{pagination.total} total</span>
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search by name, email, or company…"
            className="w-full pl-8 pr-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] outline-none focus:border-[var(--color-accent)] transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
          <select
            className="pl-8 pr-6 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] outline-none appearance-none cursor-pointer transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="selected">Selected</option>
            <option value="unselected">Unselected</option>
          </select>
        </div>

        <select
          className="px-2.5 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] outline-none cursor-pointer transition-colors"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="last_week">Last Week</option>
          <option value="last_month">Last Month</option>
          <option value="3_months">Last 3 Months</option>
          <option value="6_months">Last 6 Months</option>
          <option value="1_year">Last 1 Year</option>
          <option value="custom">Custom Range</option>
        </select>

        {dateFilter === 'custom' && (
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-2.5 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] outline-none transition-colors" 
              title="Start Date"
            />
            <span className="text-gray-500 text-[12px]">to</span>
            <input 
              type="date" 
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-2.5 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] outline-none transition-colors" 
              title="End Date"
            />
          </div>
        )}

        <button
          onClick={async () => {
            await bulkUpdateEnquiryStatus(selectedIds, 'reviewed');
            setSelectedIds([]);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] font-medium hover:bg-[var(--color-page-bg)] disabled:opacity-50 transition-colors"
          disabled={selectedIds.length === 0}
        >
          <Check size={14} /> Mark Read
        </button>

        <button
          onClick={async () => {
            await bulkUpdateEnquiryStatus(selectedIds, 'selected');
            setSelectedIds([]);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-green-200 dark:border-green-900/30 rounded-lg bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-[12px] font-medium hover:bg-green-100 dark:hover:bg-green-900/20 disabled:opacity-50 transition-colors"
          disabled={selectedIds.length === 0}
        >
          <Check size={14} /> Mark Selected
        </button>

        <button
          onClick={async () => {
            await bulkUpdateEnquiryStatus(selectedIds, 'unselected');
            setSelectedIds([]);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-700/50 rounded-lg bg-gray-50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-400 text-[12px] font-medium hover:bg-gray-100 dark:hover:bg-gray-800/50 disabled:opacity-50 transition-colors"
          disabled={selectedIds.length === 0}
        >
          <X size={14} /> Mark Unselected
        </button>

        <button
          onClick={async () => {
            if (window.confirm(`Are you sure you want to delete ${selectedIds.length} enquiries?`)) {
              await bulkDeleteEnquiries(selectedIds);
              setSelectedIds([]);
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-100 dark:border-red-900/30 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 text-[12px] font-medium hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors"
          disabled={selectedIds.length === 0}
        >
          <Trash2 size={14} /> Delete
        </button>

        <button 
          onClick={() => exportEnquiries(searchTerm, statusFilter, dateFilter, customStartDate, customEndDate)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] font-medium hover:bg-[var(--color-page-bg)] transition-colors"
        >
          <Download size={14} /> Export
        </button>
      </div>

      <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm transition-colors relative">
        {isDataLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[var(--color-page-bg)] border-bottom border-[var(--color-border)]">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    className="accent-blue-700 w-3.5 h-3.5 cursor-pointer"
                    onChange={toggleSelectAll}
                    checked={selectedIds.length === enquiries.length && enquiries.length > 0}
                  />
                </th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[25%]">Message</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-500 text-[13px]">
                    {isDataLoading ? 'Loading enquiries...' : 'No enquiries found.'}
                  </td>
                </tr>
              ) : (
                enquiries.map((enq: any) => (
                  <tr
                    key={enq._id}
                    className={clsx(
                      "border-t border-[var(--color-border)] transition-colors group",
                      enq.status === 'new' ? "bg-blue-50/10 dark:bg-blue-900/5" : 
                      enq.status === 'selected' ? "bg-green-100 dark:bg-green-900/20" : 
                      "hover:bg-gray-50/50 dark:hover:bg-white/5"
                    )}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        className="accent-blue-700 w-3.5 h-3.5 cursor-pointer"
                        checked={selectedIds.includes(enq._id)}
                        onChange={() => toggleSelect(enq._id)}
                      />
                    </td>
                    <td className="p-3 text-[12px]">
                      <div className="flex items-center gap-2">
                        {enq.status === 'new' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                        <span className="font-semibold">{enq.name}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tight">{enq.designation || 'Visitor'}</p>
                    </td>
                    <td className="p-3 text-[12px]">
                      <div className="flex items-center gap-1.5 mb-1 text-gray-900 dark:text-white">
                        <Mail size={12} className="text-gray-400" />
                        <span className="font-medium">{enq.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Phone size={12} className="text-gray-400" />
                        <span>{enq.phone}</span>
                      </div>
                    </td>
                    <td className="p-3 text-[12px]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Building size={12} className="text-blue-500" />
                        <span className="font-medium text-blue-600 dark:text-blue-400">{enq.company || 'N/A'}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 pl-4">{enq.industry || 'General'}</p>
                    </td>
                    <td className="p-3 text-[12px] text-gray-500">
                      <p className="line-clamp-2 leading-relaxed" title={enq.message}>{enq.message}</p>
                    </td>
                    <td className="p-3">
                      <span className={clsx(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase",
                        enq.status === 'new' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        enq.status === 'selected' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        enq.status === 'unselected' ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" :
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      )}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-3 text-[12px] text-gray-500">
                      {new Date(enq.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={async () => {
                            setViewEnquiry(enq);
                            await markNotificationByReferenceAsRead(enq._id);
                            if (enq.status === 'new') {
                              await bulkUpdateEnquiryStatus([enq._id], 'reviewed');
                            }
                          }}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors" 
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => bulkUpdateEnquiryStatus([enq._id], 'reviewed')}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                          title="Mark Reviewed"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => bulkUpdateEnquiryStatus([enq._id], 'selected')}
                          className="p-1.5 text-gray-500 hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 rounded-lg transition-colors"
                          title="Mark Selected"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => bulkUpdateEnquiryStatus([enq._id], 'unselected')}
                          className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                          title="Mark Unselected"
                        >
                          <X size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this enquiry?')) {
                              bulkDeleteEnquiries([enq._id]);
                            }
                          }}
                          className="p-1.5 text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3 border-t border-[var(--color-border)] flex items-center justify-between bg-gray-50/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="text-[11px] text-gray-500 font-medium">
              Showing {enquiries.length} of {pagination.total} entries
            </div>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-2 py-1 border border-[var(--color-border)] rounded bg-[var(--color-sidebar-bg)] text-[11px] outline-none cursor-pointer transition-colors"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-sidebar-bg)] text-[12px] hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
            >
              ‹
            </button>

            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={clsx(
                  "w-7 h-7 flex items-center justify-center rounded-md text-[12px] transition-colors",
                  pagination.page === i + 1
                    ? "bg-blue-700 text-white"
                    : "border border-[var(--color-border)] bg-[var(--color-sidebar-bg)] hover:bg-gray-50 dark:hover:bg-white/5"
                )}
              >
                {i + 1}
              </button>
            )).slice(Math.max(0, pagination.page - 2), Math.min(pagination.pages, pagination.page + 1))}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-sidebar-bg)] text-[12px] hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Enquiry Details</h2>
              <button 
                onClick={() => setViewEnquiry(null)}
                className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Name</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{viewEnquiry.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Contact</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{viewEnquiry.email}</p>
                  <p className="text-xs text-gray-500">{viewEnquiry.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Company</label>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">{viewEnquiry.company || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Designation</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{viewEnquiry.designation || 'Visitor'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Industry</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{viewEnquiry.industry || 'General'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 uppercase">{viewEnquiry.status}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {new Date(viewEnquiry.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Message</label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {viewEnquiry.message}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2 bg-gray-50 dark:bg-gray-900/50">
              <button 
                onClick={() => setViewEnquiry(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;
