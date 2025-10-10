'use server';

import { deleteSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';

/**
 * Logs out the current user by deleting their session
 */
export async function logout() {
  await deleteSession();
  redirect('/login');
}

