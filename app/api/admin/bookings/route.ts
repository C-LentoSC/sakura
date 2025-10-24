import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import cacheManager from '@/app/lib/cache';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    const cacheKey = 'admin:bookings';

    // Cache-first
    const cachedData = cacheManager.get<any[]>(cacheKey, {
      ttl: 5 * 60 * 1000, // 5 minutes fresh
      staleWhileRevalidate: 30 * 60 * 1000,
    });

    if (cachedData && !cacheManager.isStale(cacheKey)) {
      console.log(`[Cache HIT] ${cacheKey}`);
      return NextResponse.json({ bookings: cachedData, cached: true });
    }

    if (cachedData && cacheManager.isStale(cacheKey)) {
      console.log(`[Cache STALE] ${cacheKey} - revalidating...`);

      if (!cacheManager.isRevalidating(cacheKey)) {
        cacheManager.setRevalidating(cacheKey, true);
        prisma.booking.findMany({ orderBy: { createdAt: 'desc' } })
          .then((fresh) => {
            cacheManager.set(cacheKey, fresh);
            cacheManager.setRevalidating(cacheKey, false);
          })
          .catch(() => cacheManager.setRevalidating(cacheKey, false));
      }

      return NextResponse.json({ bookings: cachedData, cached: true, stale: true });
    }

    console.log(`[Cache MISS] ${cacheKey}`);
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
    cacheManager.set(cacheKey, bookings);

    return NextResponse.json({ bookings, cached: false });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, date, time, name, email, phone = '', notes = '', status = 'pending' } = body || {};
    if (!serviceId || !date || !time || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const booking = await prisma.booking.create({
      data: { serviceId, date, time, name, email, phone, notes, status },
    });

    // Invalidate bookings cache
    cacheManager.invalidatePattern(/^admin:bookings/);
    cacheManager.invalidatePattern(/^my-bookings:/);
    console.log('[Cache INVALIDATED] Bookings cache after CREATE');

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
