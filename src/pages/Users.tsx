import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Mail, Shield, User as UserIcon, X, Loader2, Eye, EyeOff, Lock, Edit2 } from 'lucide-react';
import { useAppStore, useDataStore } from '../store/useStore';
import { clsx } from 'clsx';

const Users = () => {
  const { user: currentUser } = useAppStore();
  const { users, fetchUsers, addUser, updateUser, deleteUser } = useDataStore() as any;
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    permissions: {
      dashboard: { view: true },
      enquiries: { view: true, edit: false, delete: false, export: false },
      careers: { view: true, edit: false, delete: false, export: false },
      analytics: { view: false, export: false },
      settings: { view: false, edit: false },
      users: { view: false, create: false, edit: false, delete: false }
    }
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

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
      permissions: user.permissions || {
        dashboard: { view: true },
        enquiries: { view: true, edit: user.role === 'admin', delete: user.role === 'admin', export: user.role === 'admin' },
        careers: { view: true, edit: user.role === 'admin', delete: user.role === 'admin', export: user.role === 'admin' },
        analytics: { view: user.role === 'admin', export: user.role === 'admin' },
        settings: { view: user.role === 'admin', edit: user.role === 'admin' },
        users: { view: user.role === 'admin', create: user.role === 'admin', edit: user.role === 'admin', delete: user.role === 'admin' }
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await deleteUser(userId);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!editingUser) {
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
    } else {
        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
    }

    setLoading(true);
    const { confirmPassword, ...payload } = formData;
    
    // If editing and password is empty, don't send it
    if (editingUser && !payload.password) {
        delete (payload as any).password;
    }

    const result = editingUser 
        ? await updateUser(editingUser._id, payload)
        : await addUser(payload);
        
    setLoading(false);
    
    if (result.success) {
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        role: 'user',
        permissions: {
          dashboard: { view: true },
          enquiries: { view: true, edit: false, delete: false, export: false },
          careers: { view: true, edit: false, delete: false, export: false },
          analytics: { view: false, export: false },
          settings: { view: false, edit: false },
          users: { view: false, create: false, edit: false, delete: false }
        }
      });
    } else {
      setError(result.message || 'Failed to process request');
    }
  };

  const handlePermissionChange = (feature: string, action: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [feature]: {
          ...(prev.permissions as any)[feature],
          [action]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-bold tracking-tight">
          Users Management
          <span className="text-[12px] font-normal text-gray-500 ml-2">{users.length} total</span>
        </h1>
        {(currentUser?.role === 'admin' || (currentUser?.permissions as any)?.users?.create) && (
          <button 
            onClick={() => {
              setEditingUser(null);
              setFormData({ 
                name: '', 
                email: '', 
                password: '', 
                confirmPassword: '', 
                role: 'user',
                permissions: {
                  dashboard: { view: true },
                  enquiries: { view: true, edit: false, delete: false, export: false },
                  careers: { view: true, edit: false, delete: false, export: false },
                  analytics: { view: false, export: false },
                  settings: { view: false, edit: false },
                  users: { view: false, create: false, edit: false, delete: false }
                }
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded-lg text-[12px] font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus size={14} /> Create User
          </button>
        )}
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
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
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
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(currentUser?.role === 'admin' || (currentUser?.permissions as any)?.users?.edit) && (
                          <button 
                            onClick={() => handleEdit(user)}
                            className="p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                        {(currentUser?.role === 'admin' || (currentUser?.permissions as any)?.users?.delete) && (
                          <button 
                            onClick={() => handleDelete(user._id)}
                            className="p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal (Create/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <h2 className="text-[16px] font-bold">{editingUser ? 'Edit User' : 'Create New User'}</h2>
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
                    disabled={!!editingUser}
                    type="email" 
                    placeholder="john@example.com"
                    className={clsx(
                      "w-full pl-10 pr-3 py-2 bg-[var(--color-page-bg)] border border-[var(--color-border)] rounded-xl text-[13px] outline-none focus:border-[var(--color-accent)] transition-all",
                      editingUser && "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900/50"
                    )}
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                {editingUser && <p className="text-[9px] text-gray-400 mt-1">Email cannot be changed after creation.</p>}
              </div>

              {!editingUser && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
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
              )}

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

              <div className="space-y-4 pt-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block border-b border-[var(--color-border)] pb-2">IAM User Permissions</label>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(formData.permissions).map(([feature, actions]) => (
                    <div key={feature} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">{feature}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pl-2">
                        {Object.entries(actions as object).map(([action, allowed]) => (
                          <label key={`${feature}-${action}`} className="flex items-center gap-2 cursor-pointer group">
                            <input 
                              type="checkbox"
                              className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent"
                              checked={allowed}
                              onChange={(e) => handlePermissionChange(feature, action, e.target.checked)}
                            />
                            <span className="text-[11px] capitalize text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
                              {action}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
                  {loading ? <Loader2 size={16} className="animate-spin" /> : editingUser ? 'Update User' : 'Create User'}
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
