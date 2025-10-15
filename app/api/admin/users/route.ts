import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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
    return NextResponse.json({ users });
  } catch (e) {
    console.error('Failed to fetch users', e);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name = '', password, role = 'USER' } = body || {};
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    // Auto-generate password if not provided
    const finalPassword = password || Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    const hashed = await bcrypt.hash(finalPassword, 12);
    const user = await prisma.user.create({
      data: { email, name, password: hashed, role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { sessions: true } },
      },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    console.error('Failed to create user', e);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
