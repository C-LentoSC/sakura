"use client";

import { useState } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';

export default function ProfileClient() {
  const { language } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({});

  const en = {
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
  } as const;

  const ja = {
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
  } as const;

  const L = (k: keyof typeof en) => (language === 'ja' ? ja[k] : en[k]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    const newErrors: { currentPassword?: string; newPassword?: string; confirmPassword?: string } = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = L('errorRequired');
    }
    if (!newPassword) {
      newErrors.newPassword = L('errorRequired');
    } else if (newPassword.length < 6) {
      newErrors.newPassword = L('errorLength');
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = L('errorRequired');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = L('errorMatch');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
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
    <div className="pt-4 border-t border-primary/10">
      <h3 className="text-base font-sakura text-secondary mb-2">{L('sectionPassword')}</h3>
      <p className="text-xs text-secondary/70 mb-3">{L('sectionPasswordDesc')}</p>

      {message && (
        <div className={`mb-3 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-xs font-medium">{message.text}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-secondary mb-1.5">{L('fieldCurrent')}</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => { setCurrentPassword(e.target.value); if (errors.currentPassword) setErrors(prev => ({ ...prev, currentPassword: undefined })); }}
            placeholder={L('placeholderCurrent')}
            className={`w-full px-3 py-2 rounded-lg border-2 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm ${errors.currentPassword ? 'border-red-300' : 'border-pink-100'}`}
          />
          {errors.currentPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-secondary mb-1.5">{L('fieldNew')}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: undefined })); }}
              placeholder={L('placeholderNew')}
              className={`w-full px-3 py-2 rounded-lg border-2 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm ${errors.newPassword ? 'border-red-300' : 'border-pink-100'}`}
            />
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-1.5">{L('fieldConfirm')}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined })); }}
              placeholder={L('placeholderConfirm')}
              className={`w-full px-3 py-2 rounded-lg border-2 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm ${errors.confirmPassword ? 'border-red-300' : 'border-pink-100'}`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-gradient-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-50 transition-all font-medium inline-flex items-center gap-2 text-sm"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {L('saving')}
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {L('btnUpdate')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
