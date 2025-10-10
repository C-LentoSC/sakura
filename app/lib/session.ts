// Session management using jose for encryption
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { SessionPayload } from '@/types/auth';

// Use NEXTAUTH_SECRET from .env (Next.js convention)
const secretKey = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * Encrypts session payload into a JWT token
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

/**
 * Decrypts and verifies JWT session token
 */
export async function decrypt(session: string | undefined = ''): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Creates a new session cookie
 * @param userId - User ID to store in session
 * @param remember - If true, extends session to 30 days instead of 7
 */
export async function createSession(userId: string, remember: boolean = false): Promise<void> {
  const expiresAt = new Date(Date.now() + (remember ? 30 : 7) * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });
  
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Deletes the session cookie
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

