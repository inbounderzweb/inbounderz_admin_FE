import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Mail, Phone, Eye, Check, X, Trash2, Loader2, FileText } from 'lucide-react';
import { useAppStore, useDataStore } from '../store/useStore';
import clsx from 'clsx';

const Careers = () => {
  const { user } = useAppStore();
  const {
    careers,
    careersPagination: pagination,
    isCareersLoading: isDataLoading,
    fetchCareers,
    exportCareers,
    bulkUpdateCareerStatus,
    bulkDeleteCareers,
    markNotificationByReferenceAsRead
  } = useDataStore() as any;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewCareer, setViewCareer] = useState<any | null>(null);

  // Initial fetch
  useEffect(() => {
    fetchCareers(1, '', '', 10, '', '', '');
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCareers(1, searchTerm, statusFilter, limit, dateFilter, customStartDate, customEndDate);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, limit, dateFilter, customStartDate, customEndDate]);

  const handlePageChange = (page: number) => {
    fetchCareers(page, searchTerm, statusFilter, limit, dateFilter, customStartDate, customEndDate);
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(careers.map((c: any) => c._id));
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
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-['Syne']">Careers</h1>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search careers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] outline-none w-48 transition-colors"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-8 pr-6 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] outline-none appearance-none cursor-pointer transition-colors"
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

          {(user?.role === 'admin' || (user?.permissions as any)?.careers?.edit) && (
            <>
              <button
                onClick={async () => {
                  await bulkUpdateCareerStatus(selectedIds, 'reviewed');
                  setSelectedIds([]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] font-medium hover:bg-[var(--color-page-bg)] disabled:opacity-50 transition-colors"
                disabled={selectedIds.length === 0}
              >
                <Check size={14} /> Mark Read
              </button>

              <button
                onClick={async () => {
                  await bulkUpdateCareerStatus(selectedIds, 'selected');
                  setSelectedIds([]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-green-200 dark:border-green-900/30 rounded-lg bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-[12px] font-medium hover:bg-green-100 dark:hover:bg-green-900/20 disabled:opacity-50 transition-colors"
                disabled={selectedIds.length === 0}
              >
                <Check size={14} /> Mark Selected
              </button>

              <button
                onClick={async () => {
                  await bulkUpdateCareerStatus(selectedIds, 'unselected');
                  setSelectedIds([]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-700/50 rounded-lg bg-gray-50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-400 text-[12px] font-medium hover:bg-gray-100 dark:hover:bg-gray-800/50 disabled:opacity-50 transition-colors"
                disabled={selectedIds.length === 0}
              >
                <X size={14} /> Mark Unselected
              </button>
            </>
          )}

          {(user?.role === 'admin' || (user?.permissions as any)?.careers?.delete) && (
            <button
              onClick={async () => {
                if (window.confirm(`Are you sure you want to delete ${selectedIds.length} applications?`)) {
                  await bulkDeleteCareers(selectedIds);
                  setSelectedIds([]);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-100 dark:border-red-900/30 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 text-[12px] font-medium hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors"
              disabled={selectedIds.length === 0}
            >
              <Trash2 size={14} /> Delete
            </button>
          )}

          {(user?.role === 'admin' || (user?.permissions as any)?.careers?.export) && (
            <button
              onClick={() => exportCareers(searchTerm, statusFilter, dateFilter, customStartDate, customEndDate)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] font-medium hover:bg-[var(--color-page-bg)] transition-colors"
            >
              <Download size={14} /> Export
            </button>
          )}
        </div>
      </div>

      <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm transition-colors relative">
        {isDataLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-gray-50/50 dark:bg-white/5 text-gray-500 font-medium">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                    checked={careers.length > 0 && selectedIds.length === careers.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Resume</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {careers.length === 0 && !isDataLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No careers found matching your criteria.
                  </td>
                </tr>
              ) : (
                careers.map((c: any) => (
                  <tr
                    key={c._id}
                    className={clsx(
                      "border-b border-[var(--color-border)] group transition-colors",
                      c.status === 'new' ? "bg-blue-50/10 dark:bg-blue-900/5" :
                        c.status === 'selected' ? "bg-green-100 dark:bg-green-900/20" :
                          "hover:bg-gray-50/50 dark:hover:bg-white/5"
                    )}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                        checked={selectedIds.includes(c._id)}
                        onChange={() => toggleSelect(c._id)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400 shrink-0" />
                        <span className="font-semibold">
                          {c.email}
                        </span>
                        {c.status === 'new' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} />
                        {c.ccode} {c.phone}
                      </div>
                    </td>
                    <td className="p-3">
                      <a href={c.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline">
                        <FileText size={14} /> Resume
                      </a>
                    </td>
                    <td className="p-3">
                      <span className={clsx(
                        "text-[10px] font-bold tracking-wider uppercase",
                        c.status === 'new' ? "text-blue-600 dark:text-blue-400" :
                          c.status === 'selected' ? "text-green-600 dark:text-green-400" :
                            c.status === 'unselected' ? "text-gray-500 dark:text-gray-500" :
                              "text-yellow-600 dark:text-yellow-400"
                      )}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 text-[12px]">
                      {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={async () => {
                            setViewCareer(c);
                            await markNotificationByReferenceAsRead(c._id);
                            if (c.status === 'new') {
                              await bulkUpdateCareerStatus([c._id], 'reviewed');
                            }
                          }}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        {(user?.role === 'admin' || (user?.permissions as any)?.careers?.edit) && (
                          <>
                            <button
                              onClick={() => bulkUpdateCareerStatus([c._id], 'reviewed')}
                              className="p-1.5 text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                              title="Mark Reviewed"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => bulkUpdateCareerStatus([c._id], 'selected')}
                              className="p-1.5 text-gray-500 hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 rounded-lg transition-colors"
                              title="Mark Selected"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => bulkUpdateCareerStatus([c._id], 'unselected')}
                              className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                              title="Mark Unselected"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        {/* {(user?.role === 'admin' || (user?.permissions as any)?.careers?.delete) && (
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this application?')) {
                                bulkDeleteCareers([c._id]);
                              }
                            }}
                            className="p-1.5 text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )} */}
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this application?')) {
                              bulkDeleteCareers([c._id]);
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
              Showing {careers.length} of {pagination.total} entries
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
      {viewCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Career Application Details</h2>
              <button
                onClick={() => setViewCareer(null)}
                className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Contact</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{viewCareer.email}</p>
                  <p className="text-xs text-gray-500">{viewCareer.ccode} {viewCareer.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 uppercase">{viewCareer.status}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {new Date(viewCareer.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Resume</label>
                  <div className="mt-1">
                    <a href={viewCareer.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                      <Download size={14} /> Download Resume
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2 bg-gray-50 dark:bg-gray-900/50">
              <button
                onClick={() => setViewCareer(null)}
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

export default Careers;
