import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/dal';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { isAuth, user } = await verifySession();
    if (!isAuth || !user) {
      return NextResponse.json({ isAuth: false, user: null }, { status: 200 });
    }
    return NextResponse.json({ isAuth: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ isAuth: false, user: null }, { status: 200 });
  }
}
