import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { email, name, role, password } = body || {};

    const data: { email?: string; name?: string; role?: 'ADMIN' | 'USER'; password?: string } = {};
    if (typeof email === 'string') data.email = email;
    if (typeof name === 'string') data.name = name;
    if (role === 'ADMIN' || role === 'USER') data.role = role;
    if (typeof password === 'string' && password.trim().length > 0) {
      data.password = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
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
    return NextResponse.json({ user });
  } catch (e) {
    console.error('Failed to update user', e);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Failed to delete user', e);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
