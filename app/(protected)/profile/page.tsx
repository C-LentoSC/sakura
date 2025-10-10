import { getCurrentUser } from '@/app/lib/dal';
import Link from 'next/link';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="py-12">
      {/* Page Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-primary hover:text-pink-600 mb-4 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-sakura text-secondary mb-2">Profile</h1>
        <p className="text-secondary/70">View and manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary/10 mb-8">
        {/* Profile Header */}
        <div className="flex items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-pink-400 rounded-full flex items-center justify-center text-white text-3xl font-sakura">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-sakura text-secondary">{user.name || 'User'}</h2>
            <p className="text-secondary/70">{user.email}</p>
            <span className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-semibold ${
              user.role === 'ADMIN' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-pink-100 text-pink-700'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-sakura text-secondary mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-primary/10">
                <label className="block text-xs text-secondary/60 mb-1">Full Name</label>
                <p className="text-sm font-medium text-secondary">{user.name || 'Not set'}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-primary/10">
                <label className="block text-xs text-secondary/60 mb-1">Email Address</label>
                <p className="text-sm font-medium text-secondary">{user.email}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-primary/10">
                <label className="block text-xs text-secondary/60 mb-1">User ID</label>
                <p className="text-sm font-medium text-secondary font-mono">{user.id}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-primary/10">
                <label className="block text-xs text-secondary/60 mb-1">Account Type</label>
                <p className="text-sm font-medium text-secondary">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-sakura text-secondary mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                disabled
                className="p-4 bg-white rounded-lg border-2 border-primary/20 hover:border-primary transition-colors text-left opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-secondary">Edit Profile</p>
                    <p className="text-xs text-secondary/60">Coming soon</p>
                  </div>
                </div>
              </button>
              <button
                disabled
                className="p-4 bg-white rounded-lg border-2 border-primary/20 hover:border-primary transition-colors text-left opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-secondary">Change Password</p>
                    <p className="text-xs text-secondary/60">Coming soon</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-secondary/70">Total Bookings</h3>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-3xl font-sakura text-secondary">0</p>
          <p className="text-xs text-secondary/60 mt-1">No bookings yet</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-secondary/70">Upcoming</h3>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-sakura text-secondary">0</p>
          <p className="text-xs text-secondary/60 mt-1">No upcoming appointments</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-secondary/70">Completed</h3>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-sakura text-secondary">0</p>
          <p className="text-xs text-secondary/60 mt-1">No completed services</p>
        </div>
      </div>
    </div>
  );
}

