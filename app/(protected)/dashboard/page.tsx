import { getCurrentUser } from '@/app/lib/dal';
import Link from 'next/link';
import { logout } from '@/app/(auth)/logout/actions';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="py-12">
      {/* Welcome Section */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary/10 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-sakura text-secondary mb-2">
              Welcome back, {user.name || 'User'}!
            </h1>
            <p className="text-secondary/70">
              Manage your account and bookings from your dashboard
            </p>
          </div>
          <div>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
              user.role === 'ADMIN' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-pink-100 text-pink-700'
            }`}>
              {user.role === 'ADMIN' ? '👑 Admin' : '✨ User'}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-primary/10">
            <p className="text-xs text-secondary/60 mb-1">Email</p>
            <p className="text-sm font-medium text-secondary">{user.email}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-primary/10">
            <p className="text-xs text-secondary/60 mb-1">Account Type</p>
            <p className="text-sm font-medium text-secondary">{user.role}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-primary/10">
            <p className="text-xs text-secondary/60 mb-1">Member Since</p>
            <p className="text-sm font-medium text-secondary">Recently Joined</p>
          </div>
        </div>

        {/* Logout Button */}
        <form action={logout}>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Sign Out
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/profile"
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary/10 hover:shadow-2xl transition-all duration-300 group"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-sakura text-secondary mb-2">Profile</h3>
          <p className="text-sm text-secondary/70">View and edit your profile information</p>
        </Link>

        <Link
          href="/bookings"
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary/10 hover:shadow-2xl transition-all duration-300 group"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-sakura text-secondary mb-2">My Bookings</h3>
          <p className="text-sm text-secondary/70">View your appointment history</p>
        </Link>

        <Link
          href="/services"
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary/10 hover:shadow-2xl transition-all duration-300 group"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-sakura text-secondary mb-2">Book Service</h3>
          <p className="text-sm text-secondary/70">Schedule your next appointment</p>
        </Link>
      </div>

      {/* Admin Link */}
      {user.role === 'ADMIN' && (
        <div className="mt-8">
          <Link
            href="/admin"
            className="block bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-sakura mb-2">Admin Panel</h3>
                <p className="text-white/80">Manage users, bookings, and system settings</p>
              </div>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

