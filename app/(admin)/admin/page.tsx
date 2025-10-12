import { getCurrentUser } from '@/app/lib/dal';
import prisma from '@/app/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const currentUser = await getCurrentUser();
  
  // Fetch comprehensive statistics
  const [
    usersCount, 
    bookingsCount, 
    servicesCount, 
    categoriesCount, 
    activeServices,
    adminCount,
    todayBookings
  ] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.service.count(),
    prisma.serviceCategory.count(),
    prisma.service.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.booking.count({ 
      where: { 
        createdAt: { 
          gte: new Date(new Date().setHours(0, 0, 0, 0)) 
        } 
      } 
    }),
  ]);

  // Fetch booking statistics
  const [pendingBookings, bookedBookings, canceledBookings] = await Promise.all([
    prisma.booking.count({ where: { status: 'pending' } }),
    prisma.booking.count({ where: { status: { in: ['booked', 'confirmed'] } } }),
    prisma.booking.count({ where: { status: { in: ['canceled', 'cancelled'] } } }),
  ]);

  // Calculate percentages
  const activeServicePercent = servicesCount > 0 ? Math.round((activeServices / servicesCount) * 100) : 0;
  const adminPercent = usersCount > 0 ? Math.round((adminCount / usersCount) * 100) : 0;

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
    take: 6,
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
    <div className="space-y-5">
       {/* Welcome Header */}
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-2xl font-bold text-gray-900">
             Dashboard Overview
           </h1>
           <p className="text-sm text-gray-500 mt-1">
             Welcome back, {currentUser.name || 'Admin'}! Here&apos;s what&apos;s happening today.
           </p>
         </div>
         <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-sm shadow-sm border border-gray-200">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-sm font-medium text-gray-700">Live</span>
         </div>
       </div>

      {/* Top Stats Cards - 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users Card */}
        <Link href="/admin/users">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-sm p-5 shadow-md hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-sm flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-white/80">Total</div>
                <div className="text-2xl font-bold text-white">{usersCount}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-white">
              <span className="text-sm font-medium">Users</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-sm">+{adminPercent}% Admin</span>
            </div>
          </div>
        </Link>

        {/* Total Bookings Card */}
        <Link href="/admin/bookings">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-sm p-5 shadow-md hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-sm flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-white/80">Total</div>
                <div className="text-2xl font-bold text-white">{bookingsCount}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-white">
              <span className="text-sm font-medium">Bookings</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-sm">+{todayBookings} Today</span>
            </div>
          </div>
        </Link>

        {/* Services Card */}
        <Link href="/admin/services">
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-sm p-5 shadow-md hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-sm flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-white/80">Active</div>
                <div className="text-2xl font-bold text-white">{activeServices}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-white">
              <span className="text-sm font-medium">Services</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-sm">{activeServicePercent}%</span>
            </div>
          </div>
        </Link>

        {/* Categories Card */}
        <Link href="/admin/categories">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-sm p-5 shadow-md hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-sm flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-white/80">Total</div>
                <div className="text-2xl font-bold text-white">{categoriesCount}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-white">
              <span className="text-sm font-medium">Categories</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-sm">Active</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Booking Statistics & Quick Actions - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Booking Statistics - Compact 3 Cards */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex gap-3">
            {/* Pending */}
            <div className="flex-1 bg-white rounded-sm p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-amber-100 rounded-sm flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-gray-900">{pendingBookings}</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-amber-500" style={{width: `${bookingsCount > 0 ? (pendingBookings/bookingsCount*100) : 0}%`}}></div>
              </div>
            </div>

            {/* Confirmed */}
            <div className="flex-1 bg-white rounded-sm p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-pink-100 rounded-sm flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-gray-900">{bookedBookings}</div>
                  <div className="text-xs text-gray-500">Confirmed</div>
                </div>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-pink-500" style={{width: `${bookingsCount > 0 ? (bookedBookings/bookingsCount*100) : 0}%`}}></div>
              </div>
            </div>

            {/* Canceled */}
            <div className="flex-1 bg-white rounded-sm p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-rose-100 rounded-sm flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-gray-900">{canceledBookings}</div>
                  <div className="text-xs text-gray-500">Canceled</div>
                </div>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-rose-500" style={{width: `${bookingsCount > 0 ? (canceledBookings/bookingsCount*100) : 0}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Takes remaining space */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/admin/services"
              className="flex flex-col items-center gap-2 p-3 rounded-sm bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 transition-all"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-sm flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center">Add Service</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex flex-col items-center gap-2 p-3 rounded-sm bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border border-rose-200 transition-all"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-pink-500 rounded-sm flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center">Add Category</span>
            </Link>

            <Link
              href="/admin/bookings"
              className="flex flex-col items-center gap-2 p-3 rounded-sm bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 transition-all"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-sm flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center">View Bookings</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex flex-col items-center gap-2 p-3 rounded-sm bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border border-purple-200 transition-all"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-500 rounded-sm flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center">Manage Users</span>
            </Link>
        </div>
      </div>

      {/* Recent Activity - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Users */}
        <div className="bg-white rounded-sm shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-100 rounded-sm flex items-center justify-center">
                  <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                Recent Users
              </h2>
              <Link href="/admin/users" className="text-xs font-medium text-pink-600 hover:text-pink-700 transition-colors">
                View All →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user.id} className="p-4 hover:bg-pink-50/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-md">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-pink-100 text-pink-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                No users yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-sm shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-sm flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Recent Bookings
              </h2>
              <Link href="/admin/bookings" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                View All →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="p-4 hover:bg-purple-50/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {booking.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{booking.email}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {booking.date} at {booking.time}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
                      booking.status === 'booked' || booking.status === 'confirmed'
                        ? 'bg-pink-100 text-pink-700'
                        : booking.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                No bookings yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
