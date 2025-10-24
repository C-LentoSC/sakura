import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import cacheManager from '@/app/lib/cache';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const serviceId = (await context.params).id;
    const cacheKey = `service:${serviceId}`;

    // Cache-first: Try to get from cache
    const cachedData = cacheManager.get<any>(cacheKey, {
      ttl: 30 * 60 * 1000, // 30 minutes fresh
      staleWhileRevalidate: 60 * 60 * 1000, // 60 minutes stale
    });

    // If cache hit and not stale, return immediately
    if (cachedData && !cacheManager.isStale(cacheKey)) {
      console.log(`[Cache HIT] ${cacheKey} - serving fresh data`);
      return NextResponse.json({ ...cachedData, cached: true });
    }

    // If cache hit but stale, return stale data and revalidate in background
    if (cachedData && cacheManager.isStale(cacheKey)) {
      console.log(`[Cache STALE] ${cacheKey} - serving stale data, revalidating...`);

      // Start background revalidation
      if (!cacheManager.isRevalidating(cacheKey)) {
        cacheManager.setRevalidating(cacheKey, true);

        prisma.service.findUnique({
          where: { id: serviceId },
          include: { category: true, subCategory: true, subSubCategory: true },
        })
          .then((freshService) => {
            if (freshService) {
              cacheManager.set(cacheKey, freshService);
              console.log(`[Cache REVALIDATED] ${cacheKey}`);
            }
            cacheManager.setRevalidating(cacheKey, false);
          })
          .catch((err) => {
            console.error('Background revalidation failed:', err);
            cacheManager.setRevalidating(cacheKey, false);
          });
      }

      return NextResponse.json({ ...cachedData, cached: true, stale: true });
    }

    // Cache miss: Fetch from database
    console.log(`[Cache MISS] ${cacheKey} - fetching from database`);
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { category: true, subCategory: true, subSubCategory: true },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Store in cache
    cacheManager.set(cacheKey, service);

    return NextResponse.json({ ...service, cached: false });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}
