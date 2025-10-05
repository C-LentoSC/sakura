import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import prisma from '../../../lib/prisma';

export const runtime = 'nodejs';

const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({ where: { email: credentials.email as string } });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password as string, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name || undefined };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as JWT & { id?: string }).id = (user as { id: string }).id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session as Session & { user: { id?: string } }).user.id = (token as JWT & { id?: string }).id;
      }
      return session;
    },
  },
} satisfies Parameters<typeof NextAuth>[0];

export const { handlers: { GET, POST } } = NextAuth(authConfig);
