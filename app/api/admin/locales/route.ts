import { NextResponse } from 'next/server';
import { hasRole } from '@/app/lib/dal';
import { languages } from '@/app/locales/config';

export const dynamic = 'force-dynamic';

// GET /api/admin/locales - Return available languages (ADMIN only)
export async function GET() {
  try {
    const isAdmin = await hasRole('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ languages });
  } catch {
    return NextResponse.json({ error: 'Failed to load locales' }, { status: 500 });
  }
}

// Optional method stubs to prevent unexpected method usage
export async function POST() {
  const headers: HeadersInit = { Allow: 'GET' };
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers });
}

export async function PUT() {
  const headers: HeadersInit = { Allow: 'GET' };
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers });
}

export async function DELETE() {
  const headers: HeadersInit = { Allow: 'GET' };
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers });
}

