import { getCurrentUser } from '@/app/lib/dal';
import ProfileClient from './ProfileClient';
import Link from 'next/link';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="py-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-sakura text-secondary mb-1">Profile</h1>
          <p className="text-sm text-secondary/70">Manage your account</p>
        </div>
        {user.role === 'ADMIN' && (
          <Link 
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-primary/10 mb-4">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-primary/10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-sakura shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-sakura text-secondary truncate">{user.name || 'User'}</h2>
            <p className="text-sm text-secondary/70 truncate">{user.email}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-semibold ${
              user.role === 'ADMIN' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-pink-100 text-pink-700'
            }`}>
              {user.role}
            </span>
          </div>
          
          {/* Quick Stats - Mobile */}
          <div className="grid grid-cols-3 gap-2 sm:hidden">
            <div className="text-center p-2 bg-pink-50 rounded-lg">
              <p className="text-lg font-sakura text-secondary">0</p>
              <p className="text-xs text-secondary/60">Total</p>
            </div>
            <div className="text-center p-2 bg-pink-50 rounded-lg">
              <p className="text-lg font-sakura text-secondary">0</p>
              <p className="text-xs text-secondary/60">Upcoming</p>
            </div>
            <div className="text-center p-2 bg-pink-50 rounded-lg">
              <p className="text-lg font-sakura text-secondary">0</p>
              <p className="text-xs text-secondary/60">Done</p>
            </div>
          </div>
        </div>

        {/* Account Information Grid */}
        <div className="mb-6">
          <h3 className="text-base font-sakura text-secondary mb-3">Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-primary/10">
              <label className="block text-xs text-secondary/60 mb-0.5">Full Name</label>
              <p className="text-sm font-medium text-secondary truncate">{user.name || 'Not set'}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-primary/10">
              <label className="block text-xs text-secondary/60 mb-0.5">Email</label>
              <p className="text-sm font-medium text-secondary truncate">{user.email}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-primary/10">
              <label className="block text-xs text-secondary/60 mb-0.5">User ID</label>
              <p className="text-xs font-medium text-secondary font-mono truncate">{user.id}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-primary/10">
              <label className="block text-xs text-secondary/60 mb-0.5">Role</label>
              <p className="text-sm font-medium text-secondary">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <ProfileClient />
      </div>

      {/* Statistics - Desktop Only */}
      <div className="hidden sm:grid grid-cols-3 gap-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-primary/10">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-semibold text-secondary/70">Total Bookings</h3>
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-2xl font-sakura text-secondary">0</p>
          <p className="text-xs text-secondary/60 mt-0.5">No bookings yet</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-primary/10">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-semibold text-secondary/70">Upcoming</h3>
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-sakura text-secondary">0</p>
          <p className="text-xs text-secondary/60 mt-0.5">No appointments</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-primary/10">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-semibold text-secondary/70">Completed</h3>
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-sakura text-secondary">0</p>
          <p className="text-xs text-secondary/60 mt-0.5">No services</p>
        </div>
      </div>
    </div>
  );
}

