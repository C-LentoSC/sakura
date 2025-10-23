import { redirect } from 'next/navigation';
import { verifySession, hasRole, getCurrentUser } from '@/app/lib/dal';
import AdminSidebar from './admin/components/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const { isAuth } = await verifySession();

  if (!isAuth) {
    redirect('/login');
  }

  // Check for ADMIN role
  const isAdmin = await hasRole('ADMIN');

  if (!isAdmin) {
    // Redirect non-admins to dashboard
    redirect('/dashboard');
  }

  // Get current user info for sidebar
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar userName={user.name || undefined} userEmail={user.email} />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

