 'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { useAdminUsers } from '@/app/hooks/useAdminUsers';

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'USER';
  emailVerified: Date | null;
  createdAt: string;
  _count: { sessions: number };
};

export default function AdminUsersPage() {
  const { language } = useLanguage();
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    let mounted = true;
    fetch('/api/me')
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const id = data?.user?.id;
        if (id) setCurrentUserId(id);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);
  const { users, isLoading, refetch } = useAdminUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [form, setForm] = useState<{ id?: string; email: string; name: string; role: 'ADMIN' | 'USER' }>(
    { email: '', name: '', role: 'USER' }
  );

  const en = {
    title: 'User Management',
    subtitle: 'View and manage all registered users',
    total: 'Total Users',
    new: '+ New',
    thUser: 'User',
    thEmail: 'Email',
    thRole: 'Role',
    thSessions: 'Sessions',
    thJoined: 'Joined',
    thActions: 'Actions',
    you: '(You)',
    edit: 'Edit',
    delete: 'Delete',
    noUsers: 'No users found',
    admins: 'Administrators',
    regular: 'Regular Users',
    activeSessions: 'Active Sessions',
    modalCreate: 'Create User',
    modalEdit: 'Edit User',
    fieldEmail: 'Email',
    fieldName: 'Name',
    fieldRole: 'Role',
    fieldPassword: 'Password',
    placeholderEmail: 'email@example.com',
    placeholderName: 'Full name',
    placeholderPassword: 'Set a password',
    btnCancel: 'Cancel',
    btnCreate: 'Create',
    btnUpdate: 'Update',
    saving: 'Saving...',
    confirmDeleteTitle: 'Delete User',
    confirmDeleteText: 'Are you sure you want to delete this user? This action cannot be undone.',
    btnKeep: 'Keep',
    btnDelete: 'Delete',
  } as const;
  const ja = {
    title: 'ユーザー管理',
    subtitle: '登録ユーザーの確認と管理',
    total: '総ユーザー数',
    new: '+ 新規',
    thUser: 'ユーザー',
    thEmail: 'メール',
    thRole: '権限',
    thSessions: 'セッション',
    thJoined: '参加日',
    thActions: '操作',
    you: '（あなた）',
    edit: '編集',
    delete: '削除',
    noUsers: 'ユーザーが見つかりません',
    admins: '管理者',
    regular: '一般ユーザー',
    activeSessions: 'アクティブセッション',
    modalCreate: 'ユーザーを作成',
    modalEdit: 'ユーザーを編集',
    fieldEmail: 'メール',
    fieldName: '氏名',
    fieldRole: '権限',
    fieldPassword: 'パスワード',
    placeholderEmail: 'email@example.com',
    placeholderName: '氏名',
    placeholderPassword: 'パスワードを設定',
    btnCancel: 'キャンセル',
    btnCreate: '作成',
    btnUpdate: '更新',
    saving: '保存中…',
    confirmDeleteTitle: 'ユーザー削除',
    confirmDeleteText: 'このユーザーを削除してもよろしいですか？この操作は取り消せません。',
    btnKeep: '保持',
    btnDelete: '削除',
  } as const;
  const L = (k: keyof typeof en) => (language === 'ja' ? ja[k] : en[k]);

  const list = users as UserRow[];
  const adminCount = list.filter(u => u.role === 'ADMIN').length;
  const userCount = list.filter(u => u.role === 'USER').length;
  const sessionTotal = list.reduce((sum, u) => sum + (u._count?.sessions || 0), 0);

  const openCreate = () => {
    setEditing(null);
    setForm({ email: '', name: '', role: 'USER' });
    setIsModalOpen(true);
  };
  const openEdit = (u: UserRow) => {
    setEditing(u);
    setForm({ id: u.id, email: u.email, name: u.name || '', role: u.role });
    setIsModalOpen(true);
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { ...form };
    const isEditing = !!editing;
    const editingUser = editing;
    
    // Close modal immediately for instant feedback
    setIsModalOpen(false);
    setSaving(true);
    
    try {
      if (isEditing && editingUser) {
        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, name: formData.name, role: formData.role }),
        });
        if (!res.ok) throw new Error('update failed');
      } else {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, name: formData.name, role: formData.role }),
        });
        if (!res.ok) throw new Error('create failed');
      }
      // Refetch to get fresh data
      await refetch();
    } catch {
      alert('Failed to save user');
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!deletingId) return;
    const idToDelete = deletingId;
    
    // Close modal immediately for instant feedback
    setDeletingId(null);
    
    try {
      const res = await fetch(`/api/admin/users/${idToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete failed');
      // Refetch to get fresh data
      await refetch();
    } catch {
      alert('Failed to delete user');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <p className="text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">{L('title')}</h1>
          <p className="text-gray-600 text-sm">{L('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-lg shadow-sm border border-pink-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{list.length} {L('total')}</span>
          <button onClick={openCreate} className="ml-3 px-3 py-1.5 bg-gradient-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all">{L('new')}</button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-sm shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900">{L('thUser')}</th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900 hidden sm:table-cell">{L('thEmail')}</th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900">{L('thRole')}</th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900 hidden md:table-cell">{L('thSessions')}</th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900 hidden lg:table-cell">{L('thJoined')}</th>
                <th className="px-4 sm:px-6 py-3 text-right text-sm font-medium text-gray-900">{L('thActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center text-white text-sm font-medium flex-shrink-0 shadow-md">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 sm:hidden truncate">{user.email}</p>
                        {user.id === currentUserId && (
                          <span className="text-xs text-blue-600 font-medium">{L('you')}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                    <p className="text-sm text-gray-600 truncate max-w-xs">{user.email}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium shadow-sm ${
                      user.role === 'ADMIN' ? 'bg-secondary/10 text-secondary' : 'bg-primary/20 text-primary'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600">{user._count.sessions}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                    <p className="text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right space-x-1">
                    <button onClick={() => openEdit(user)} className="text-sm text-primary hover:text-primary/80 hover:bg-primary/10 px-3 py-1.5 rounded-lg font-medium transition-colors" disabled={user.id === currentUserId}>
                      {L('edit')}
                    </button>
                    <button onClick={() => user.id !== currentUserId && setDeletingId(user.id)} className="text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg font-medium transition-colors" disabled={user.id === currentUserId}>
                      {L('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {list.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">{L('noUsers')}</p>
          </div>
        )}
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-sm p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{adminCount}</p>
              <p className="text-sm text-gray-500">{L('admins')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{userCount}</p>
              <p className="text-sm text-gray-500">{L('regular')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{sessionTotal}</p>
              <p className="text-sm text-gray-500">{L('activeSessions')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editing ? L('modalEdit') : L('modalCreate')}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{L('fieldEmail')}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={L('placeholderEmail')}
                  className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{L('fieldName')}</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={L('placeholderName')}
                  className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{L('fieldRole')}</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as 'ADMIN' | 'USER' })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-secondary bg-accent/50 rounded-lg hover:bg-accent transition-colors"
                >
                  {L('btnCancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-50 transition-all"
                >
                  {saving ? L('saving') : (editing ? L('btnUpdate') : L('btnCreate'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{L('confirmDeleteTitle')}</h2>
            <p className="text-sm text-gray-600 mb-6">{L('confirmDeleteText')}</p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 text-secondary bg-accent/50 rounded-lg hover:bg-accent transition-colors"
              >
                {L('btnKeep')}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                {L('btnDelete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
