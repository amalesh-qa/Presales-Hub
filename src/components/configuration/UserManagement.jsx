import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Shield, User as UserIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { addUser, deleteUser } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';

export default function UserManagement({ users = [], onUpdateUsers, currentUser }) {
  const { themeConfig } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddUser = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim()) {
      setError('Please fill out all required user fields.');
      return;
    }

    try {
      setLoading(true);
      const updatedList = addUser({ name, email, role });
      onUpdateUsers(updatedList);
      setName('');
      setEmail('');
      setRole('User');
      setSuccess(`User "${email}" added successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (userId, userEmail) => {
    setError('');
    setSuccess('');
    if (window.confirm(`Are you sure you want to remove user "${userEmail}"?`)) {
      try {
        const updatedList = deleteUser(userId);
        onUpdateUsers(updatedList);
        setSuccess(`User "${userEmail}" deleted successfully.`);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className={`${themeConfig.card} p-6 mb-8 shadow-xl transition-all`}>
      <div className={`flex items-center justify-between mb-6 pb-4 border-b ${themeConfig.tableRowBorder}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            themeConfig.mode === 'light'
              ? 'bg-blue-100 text-blue-700 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
              : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
          }`}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base font-bold ${themeConfig.textPrimary}`}>User Management Module</h2>
            <p className={`text-xs font-medium ${themeConfig.textSecondary}`}>Add, remove, and manage application user access roles</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="text-xs text-rose-300 font-medium">{error}</div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs text-emerald-300 font-medium">{success}</div>
        </div>
      )}

      {/* Section A: Add User Form */}
      <form onSubmit={handleAddUser} className={`p-4 rounded-xl mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end ${
        themeConfig.mode === 'light'
          ? 'bg-slate-100 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]'
          : 'bg-slate-900/80 border border-slate-800'
      }`}>
        <div>
          <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${themeConfig.textSecondary}`}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Smith"
            className={`w-full px-3 py-2 text-xs font-medium ${themeConfig.inputClass}`}
          />
        </div>

        <div>
          <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${themeConfig.textSecondary}`}>
            Work Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. john@company.com"
            className={`w-full px-3 py-2 text-xs font-medium ${themeConfig.inputClass}`}
          />
        </div>

        <div>
          <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${themeConfig.textSecondary}`}>
            User Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={`w-full px-3 py-2 text-xs font-medium ${themeConfig.selectClass}`}
          >
            <option value="User">User (Dashboard Only)</option>
            <option value="Admin">Admin (Full Control)</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${themeConfig.buttonPrimary}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </form>

      {/* Users Table */}
      <div className={`overflow-x-auto rounded-xl border ${themeConfig.tableRowBorder}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${themeConfig.tableHeaderRow} ${themeConfig.tableRowBorder}`}>
              <th className="py-3 px-4">User Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs ${themeConfig.tableRowBorder}`}>
            {users.map((u) => {
              const isSelf = currentUser?.email?.toLowerCase() === u.email?.toLowerCase();
              return (
                <tr key={u.id} className={`${themeConfig.tableRowHover} transition-colors`}>
                  <td className={`py-3.5 px-4 font-bold flex items-center gap-2 ${themeConfig.tableTextPrimary}`}>
                    <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs border ${
                      themeConfig.mode === 'light'
                        ? 'bg-blue-100 text-blue-900 border-2 border-slate-900'
                        : 'bg-slate-800 text-indigo-400 border-slate-700'
                    }`}>
                      {u.name[0]?.toUpperCase()}
                    </div>
                    <span>{u.name}</span>
                    {isSelf && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        themeConfig.mode === 'light'
                          ? 'bg-blue-200 text-blue-900 border border-slate-900 font-bold'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}>You</span>
                    )}
                  </td>
                  <td className={`py-3.5 px-4 font-mono ${themeConfig.tableTextSecondary}`}>
                    {u.email}
                  </td>
                  <td className="py-3.5 px-4">
                    {u.role === 'Admin' ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        themeConfig.mode === 'light'
                          ? 'bg-emerald-100 text-emerald-900 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        themeConfig.mode === 'light'
                          ? 'bg-slate-100 text-slate-800 border-2 border-slate-900'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        <UserIcon className="w-3 h-3" /> Standard User
                      </span>
                    )}
                  </td>
                  <td className={`py-3.5 px-4 font-mono text-[11px] ${themeConfig.textMuted}`}>
                    {u.createdAt || '2026-01-01'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(u.id, u.email)}
                      disabled={isSelf}
                      title={isSelf ? 'You cannot delete yourself' : 'Delete user'}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/20 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
