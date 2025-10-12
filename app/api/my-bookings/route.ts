import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifySession } from '@/app/lib/dal';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { isAuth, user } = await verifySession();
    if (!isAuth || !user?.email) {
      return NextResponse.json({ bookings: [] }, { status: 200 });
    }

    const bookings = await prisma.booking.findMany({
      where: { email: user.email },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching my bookings:', error);
    return NextResponse.json({ bookings: [] }, { status: 200 });
  }
}
