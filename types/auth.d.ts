// TypeScript type definitions for authentication

export type Role = 'USER' | 'ADMIN';

export interface SessionPayload {
  userId: string;
  expiresAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

export interface AuthSession {
  isAuth: boolean;
  userId: string | null;
  user: User | null;
}

export interface FormState {
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    confirmPassword?: string[];
  };
  message?: string;
}

