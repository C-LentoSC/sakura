// Data Access Layer - Centralized authorization logic
import 'server-only';
import { cookies } from 'next/headers';
import { decrypt } from './session';
import prisma from './prisma';
import { cache } from 'react';
import type { AuthSession, Role } from '@/types/auth';

/**
 * Verifies the current session and returns user data
 * Cached to avoid multiple DB calls in the same request
 */
export const verifySession = cache(async (): Promise<AuthSession> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return { isAuth: false, userId: null, user: null };
  }

  // Check if user still exists in database (auto-logout if deleted)
  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  if (!user) {
    return { isAuth: false, userId: null, user: null };
  }

  return {
    isAuth: true,
    userId: user.id,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
    },
  };
});

/**
 * Checks if the current user has the required role
 */
export async function hasRole(requiredRole: Role): Promise<boolean> {
  const { user } = await verifySession();
  return user?.role === requiredRole;
}

/**
 * Gets the current user or throws an error
 * Use this in protected routes that require authentication
 */
export async function getCurrentUser() {
  const { user } = await verifySession();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

