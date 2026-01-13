/**
 * Custom hook for admin users management with direct fetch (no caching)
 */

import { useState, useEffect, useCallback } from 'react';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: Date | null;
  createdAt: string;
  _count?: {
    sessions: number;
  };
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      setUsers(data.users || []);
      setError(undefined);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update user role
  const updateUserRole = useCallback(async (id: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      
      if (!res.ok) throw new Error('Failed to update user');
      
      // Refetch to get fresh data
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }, [fetchUsers]);

  // Delete user
  const deleteUser = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete user');
      
      // Refetch to get fresh data
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }, [fetchUsers]);

  // Update user
  const updateUser = useCallback(async (id: string, userData: Partial<AdminUser>) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!res.ok) throw new Error('Failed to update user');
      
      // Refetch to get fresh data
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, [fetchUsers]);

  return {
    users,
    error,
    isLoading,
    isValidating: false,
    refetch: fetchUsers,
    // CRUD helpers
    updateUserRole,
    deleteUser,
    updateUser,
  };
}
