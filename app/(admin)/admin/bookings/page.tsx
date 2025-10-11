import prisma from '@/app/lib/prisma';

export default async function AdminBookingsPage() {
  // Fetch all bookings
  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate stats
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Bookings Management
          </h1>
          <p className="text-gray-600 text-sm">
            View and manage all service bookings
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-sm shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{bookings.length} Total Bookings</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-sm p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{confirmedCount}</p>
              <p className="text-sm text-gray-500">Confirmed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{completedCount}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-sm shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900 hidden md:table-cell">
                  Service
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900">
                  Date & Time
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900 hidden lg:table-cell">
                  Contact
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.name}
                      </p>
                      <p className="text-xs text-gray-500 md:hidden">
                        {booking.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600 truncate max-w-xs">
                      {booking.serviceId}
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.date}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.time}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                    <div>
                      <p className="text-sm text-gray-600">{booking.email}</p>
                      <p className="text-xs text-gray-500">{booking.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium shadow-sm ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-50 text-green-700'
                        : booking.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700'
                        : booking.status === 'completed'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-gray-50 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bookings.length === 0 && (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
}

