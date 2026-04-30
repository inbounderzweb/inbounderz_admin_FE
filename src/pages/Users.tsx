import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Mail, Shield, User as UserIcon, X, Loader2, Eye, EyeOff, Lock } from 'lucide-react';
import { useDataStore } from '../store/useStore';
import { clsx } from 'clsx';

const Users = () => {
  const { users, fetchUsers, addUser } = useDataStore() as any;
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((u: any) => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { confirmPassword, ...payload } = formData;
    const result = await addUser(payload);
    setLoading(false);
    
    if (result.success) {
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    } else {
      setError(result.message || 'Failed to create user');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-bold tracking-tight">
          Users Management
          <span className="text-[12px] font-normal text-gray-500 ml-2">{users.length} total</span>
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded-lg text-[12px] font-medium hover:bg-blue-800 transition-colors shadow-sm"
        >
          <Plus size={14} /> Create User
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
          <input 
            type="text" 
            placeholder="Search users by name or email…" 
            className="w-full pl-8 pr-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-sidebar-bg)] text-[12px] outline-none focus:border-[var(--color-accent)] transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[var(--color-page-bg)] border-bottom border-[var(--color-border)]">
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500 text-[13px]">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user._id} className="border-t border-[var(--color-border)] hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)]">
                          <UserIcon size={14} />
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold">{user.name}</p>
                          <p className="text-[11px] text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={clsx(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        user.role === 'admin' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      )}>
                        <Shield size={10} /> {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-[12px]">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Active
                      </span>
                    </td>
                    <td className="p-3 text-[12px] text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <button className="p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <h2 className="text-[16px] font-bold">Create New User</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 text-[11px] font-bold rounded-lg border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    className="w-full pl-10 pr-3 py-2 bg-[var(--color-page-bg)] border border-[var(--color-border)] rounded-xl text-[13px] outline-none focus:border-[var(--color-accent)] transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-3 py-2 bg-[var(--color-page-bg)] border border-[var(--color-border)] rounded-xl text-[13px] outline-none focus:border-[var(--color-accent)] transition-all"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input 
                      required
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 bg-[var(--color-page-bg)] border border-[var(--color-border)] rounded-xl text-[13px] outline-none focus:border-[var(--color-accent)] transition-all"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input 
                      required
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 bg-[var(--color-page-bg)] border border-[var(--color-border)] rounded-xl text-[13px] outline-none focus:border-[var(--color-accent)] transition-all"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Role</label>
                <select 
                  className="w-full px-3 py-2 bg-[var(--color-page-bg)] border border-[var(--color-border)] rounded-xl text-[13px] outline-none focus:border-[var(--color-accent)] transition-all cursor-pointer"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="hr">HR</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[var(--color-border)] text-[13px] font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 py-2 bg-blue-700 text-white rounded-xl text-[13px] font-bold hover:bg-blue-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
