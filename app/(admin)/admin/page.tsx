import { getCurrentUser } from '@/app/lib/dal';
import prisma from '@/app/lib/prisma';
import Link from 'next/link';

export default async function AdminPage() {
  const currentUser = await getCurrentUser();
  
  // Fetch all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          sessions: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch bookings count
  const bookingsCount = await prisma.booking.count();

  return (
    <div className="py-12">
      {/* Admin Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-sakura text-secondary mb-2">
              👑 Admin Panel
            </h1>
            <p className="text-secondary/70">
              Manage users, bookings, and system settings
            </p>
          </div>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
            Logged in as Admin
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Total Users</h3>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-4xl font-sakura">{users.length}</p>
          <p className="text-xs mt-1 text-purple-100">Registered users</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Total Bookings</h3>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-4xl font-sakura">{bookingsCount}</p>
          <p className="text-xs mt-1 text-pink-100">All time bookings</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Active Sessions</h3>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-sakura">
            {users.reduce((sum, user) => sum + user._count.sessions, 0)}
          </p>
          <p className="text-xs mt-1 text-amber-100">Active user sessions</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary/10">
        <h2 className="text-2xl font-sakura text-secondary mb-6">User Management</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-primary/20">
                <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">Sessions</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-primary/10 hover:bg-pink-50/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary">{user.name || 'User'}</p>
                        {user.id === currentUser.id && (
                          <span className="text-xs text-primary">(You)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-secondary/70">{user.email}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-pink-100 text-pink-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-secondary/70">{user._count.sessions}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-secondary/70">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary/60">No users found</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary/10">
          <h3 className="text-xl font-sakura text-secondary mb-4">System Settings</h3>
          <p className="text-sm text-secondary/70 mb-4">
            Configure system-wide settings and preferences
          </p>
          <button
            disabled
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-semibold cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary/10">
          <h3 className="text-xl font-sakura text-secondary mb-4">Reports & Analytics</h3>
          <p className="text-sm text-secondary/70 mb-4">
            View detailed reports and analytics data
          </p>
          <button
            disabled
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-semibold cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}

