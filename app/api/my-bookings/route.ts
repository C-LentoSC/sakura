import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifySession } from '@/app/lib/dal';
import cacheManager from '@/app/lib/cache';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    const { isAuth, user } = await verifySession();
    if (!isAuth || !user?.email) {
      return NextResponse.json({ bookings: [] }, { status: 200 });
    }

    const cacheKey = `my-bookings:${user.email}`;

    // Cache-first: Try to get from cache
    const cachedData = cacheManager.get<any[]>(cacheKey, {
      ttl: 5 * 60 * 1000, // 5 minutes fresh (bookings change frequently)
      staleWhileRevalidate: 30 * 60 * 1000, // 30 minutes stale
    });

    // If cache hit and not stale, return immediately
    if (cachedData && !cacheManager.isStale(cacheKey)) {
      console.log(`[Cache HIT] ${cacheKey} - serving fresh data`);
      return NextResponse.json({ bookings: cachedData, cached: true });
    }

    // If cache hit but stale, return stale data and revalidate in background
    if (cachedData && cacheManager.isStale(cacheKey)) {
      console.log(`[Cache STALE] ${cacheKey} - serving stale data, revalidating...`);

      // Start background revalidation
      if (!cacheManager.isRevalidating(cacheKey)) {
        cacheManager.setRevalidating(cacheKey, true);

        prisma.booking.findMany({
          where: { email: user.email },
          orderBy: { createdAt: 'desc' },
        })
          .then((freshBookings) => {
            cacheManager.set(cacheKey, freshBookings);
            console.log(`[Cache REVALIDATED] ${cacheKey}`);
            cacheManager.setRevalidating(cacheKey, false);
          })
          .catch((err) => {
            console.error('Background revalidation failed:', err);
            cacheManager.setRevalidating(cacheKey, false);
          });
      }

      return NextResponse.json({ bookings: cachedData, cached: true, stale: true });
    }

    // Cache miss: Fetch from database
    console.log(`[Cache MISS] ${cacheKey} - fetching from database`);
    const bookings = await prisma.booking.findMany({
      where: { email: user.email },
      orderBy: { createdAt: 'desc' },
    });

    // Store in cache
    cacheManager.set(cacheKey, bookings);

    return NextResponse.json({ bookings, cached: false });
  } catch (error) {
    console.error('Error fetching my bookings:', error);
    return NextResponse.json({ bookings: [] }, { status: 200 });
  }
}
