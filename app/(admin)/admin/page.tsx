import { getCurrentUser } from '@/app/lib/dal';
import prisma from '@/app/lib/prisma';

export default async function AdminDashboardPage() {
  const currentUser = await getCurrentUser();
  
  // Fetch statistics
  const [usersCount, bookingsCount, servicesCount, categoriesCount] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.service.count(),
    prisma.serviceCategory.count(),
  ]);

  // Fetch recent users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  // Fetch recent bookings
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      serviceId: true,
      date: true,
      time: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
       {/* Welcome Header */}
       <div className="bg-white rounded-sm shadow-md p-6">
         <h1 className="text-2xl font-semibold text-gray-900 mb-1">
           Welcome back, {currentUser.name || 'Admin'}
         </h1>
         <p className="text-gray-600 text-sm">
           Here&apos;s what&apos;s happening with your salon today
         </p>
       </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-sm shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-sm shadow-sm">
              +12%
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-1">{usersCount}</h3>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-sm shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-sm shadow-sm">
              +8%
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-1">{bookingsCount}</h3>
          <p className="text-sm text-gray-500">Total Bookings</p>
        </div>

        {/* Total Services */}
        <div className="bg-white rounded-sm shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-sm shadow-sm">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-1">{servicesCount}</h3>
          <p className="text-sm text-gray-500">Service Packages</p>
        </div>

        {/* Total Categories */}
        <div className="bg-white rounded-sm shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded-sm shadow-sm">
              {categoriesCount}
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-1">{categoriesCount}</h3>
          <p className="text-sm text-gray-500">Categories</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-sm shadow-md overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-sm flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-sm border flex-shrink-0 ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No users yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-sm shadow-md overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {booking.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{booking.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {booking.date} at {booking.time}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-sm border flex-shrink-0 ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : booking.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No bookings yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-sm shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            href="/admin/services"
            className="flex flex-col items-center gap-2 p-4 rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900 text-center">Add Service</span>
          </a>

          <a
            href="/admin/categories"
            className="flex flex-col items-center gap-2 p-4 rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900 text-center">Add Category</span>
          </a>

          <a
            href="/admin/bookings"
            className="flex flex-col items-center gap-2 p-4 rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          >
            <div className="w-10 h-10 bg-purple-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900 text-center">View Bookings</span>
          </a>

          <a
            href="/admin/users"
            className="flex flex-col items-center gap-2 p-4 rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900 text-center">Manage Users</span>
          </a>
        </div>
      </div>
    </div>
  );
}
