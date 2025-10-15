"use client";

import { useState } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';

type UserInfo = {
  id: string;
  email: string;
  name: string | null;
};

export default function SettingsClient({ user }: { user: UserInfo }) {
  const { language } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const en = {
    title: 'Account Settings',
    subtitle: 'Manage your account preferences and security',
    sectionPassword: 'Change Password',
    sectionPasswordDesc: 'Update your password to keep your account secure',
    fieldCurrent: 'Current Password',
    fieldNew: 'New Password',
    fieldConfirm: 'Confirm New Password',
    placeholderCurrent: 'Enter current password',
    placeholderNew: 'Enter new password (min 6 characters)',
    placeholderConfirm: 'Re-enter new password',
    btnUpdate: 'Update Password',
    saving: 'Updating...',
    successMsg: 'Password updated successfully!',
    errorMatch: 'New passwords do not match',
    errorLength: 'New password must be at least 6 characters',
    errorRequired: 'All fields are required',
    accountInfo: 'Account Information',
    labelEmail: 'Email',
    labelName: 'Name',
  } as const;

  const ja = {
    title: 'アカウント設定',
    subtitle: 'アカウントの設定とセキュリティを管理',
    sectionPassword: 'パスワード変更',
    sectionPasswordDesc: 'アカウントを安全に保つためにパスワードを更新してください',
    fieldCurrent: '現在のパスワード',
    fieldNew: '新しいパスワード',
    fieldConfirm: '新しいパスワード（確認）',
    placeholderCurrent: '現在のパスワードを入力',
    placeholderNew: '新しいパスワードを入力（6文字以上）',
    placeholderConfirm: '新しいパスワードを再入力',
    btnUpdate: 'パスワードを更新',
    saving: '更新中…',
    successMsg: 'パスワードが正常に更新されました！',
    errorMatch: '新しいパスワードが一致しません',
    errorLength: '新しいパスワードは6文字以上である必要があります',
    errorRequired: 'すべてのフィールドが必須です',
    accountInfo: 'アカウント情報',
    labelEmail: 'メール',
    labelName: '氏名',
  } as const;

  const L = (k: keyof typeof en) => (language === 'ja' ? ja[k] : en[k]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: L('errorRequired') });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: L('errorLength') });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: L('errorMatch') });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update password' });
      } else {
        setMessage({ type: 'success', text: L('successMsg') });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Password update error:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-sm shadow-md p-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">{L('title')}</h1>
          <p className="text-gray-600 text-sm">{L('subtitle')}</p>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-sm shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{L('accountInfo')}</h2>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-gray-700 w-20">{L('labelEmail')}:</span>
            <span className="text-gray-600">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-gray-700 w-20">{L('labelName')}:</span>
            <span className="text-gray-600">{user.name || '—'}</span>
          </div>
        </div>
      </div>

      {/* Password Change Card */}
      <div className="bg-white rounded-sm shadow-md p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{L('sectionPassword')}</h2>
            <p className="text-sm text-gray-500">{L('sectionPasswordDesc')}</p>
          </div>
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">{L('fieldCurrent')}</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={L('placeholderCurrent')}
              className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{L('fieldNew')}</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={L('placeholderNew')}
                className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{L('fieldConfirm')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={L('placeholderConfirm')}
                className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-50 transition-all font-medium inline-flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {L('saving')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {L('btnUpdate')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
