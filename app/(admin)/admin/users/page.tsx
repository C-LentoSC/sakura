import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/dal';

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();
  
  // Fetch all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            User Management
          </h1>
          <p className="text-gray-600 text-sm">
            View and manage all registered users
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-sm shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{users.length} Total Users</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-sm shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900">
                  User
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900 hidden sm:table-cell">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900">
                  Role
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900 hidden md:table-cell">
                  Sessions
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900 hidden lg:table-cell">
                  Joined
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-sm flex items-center justify-center text-white text-sm font-medium flex-shrink-0 shadow-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 sm:hidden truncate">
                          {user.email}
                        </p>
                        {user.id === currentUser.id && (
                          <span className="text-xs text-blue-600 font-medium">(You)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                    <p className="text-sm text-gray-600 truncate max-w-xs">
                      {user.email}
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium shadow-sm ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-50 text-purple-700' 
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600">
                      {user._count.sessions}
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                    <p className="text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <button
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      disabled={user.id === currentUser.id}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-sm p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
              <p className="text-sm text-gray-500">Administrators</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.role === 'USER').length}
              </p>
              <p className="text-sm text-gray-500">Regular Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {users.reduce((sum, user) => sum + user._count.sessions, 0)}
              </p>
              <p className="text-sm text-gray-500">Active Sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

