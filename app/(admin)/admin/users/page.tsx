import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/dal';
import UsersClient from './UsersClient';

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();

  // Fetch all users (real data)
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { sessions: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Pass to client for language-aware UI and stat cards
  return <UsersClient users={users.map(u => ({ ...u, createdAt: u.createdAt.toISOString() }))} currentUserId={currentUser.id} />;
}

