import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import cacheManager from '@/app/lib/cache';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// Fetch categories from database
async function fetchCategoriesFromDB() {
  return await prisma.serviceCategory.findMany({
    include: {
      subCategories: {
        include: {
          subSubCategories: {
            orderBy: {
              order: 'asc',
            },
          },
          _count: {
            select: {
              services: true,
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
      _count: {
        select: {
          services: true,
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });
}

export async function GET() {
  try {
    const cacheKey = 'categories:all';

    // Cache-first: Try to get from cache
    const cachedData = cacheManager.get<Record<string, unknown>[]>(cacheKey, {
      ttl: 30 * 60 * 1000, // 30 minutes fresh
      staleWhileRevalidate: 60 * 60 * 1000, // 60 minutes stale-while-revalidate
    });

    // If cache hit and not stale, return immediately
    if (cachedData && !cacheManager.isStale(cacheKey)) {
      console.log(`[Cache HIT] ${cacheKey} - serving fresh data`);
      return NextResponse.json({ categories: cachedData, cached: true });
    }

    // If cache hit but stale, return stale data and revalidate in background
    if (cachedData && cacheManager.isStale(cacheKey)) {
      console.log(`[Cache STALE] ${cacheKey} - serving stale data, revalidating...`);

      // Start background revalidation if not already in progress
      if (!cacheManager.isRevalidating(cacheKey)) {
        cacheManager.setRevalidating(cacheKey, true);

        // Background revalidation (non-blocking)
        fetchCategoriesFromDB()
          .then((freshCategories) => {
            cacheManager.set(cacheKey, freshCategories);
            cacheManager.setRevalidating(cacheKey, false);
            console.log(`[Cache REVALIDATED] ${cacheKey}`);
          })
          .catch((err) => {
            console.error('Background revalidation failed:', err);
            cacheManager.setRevalidating(cacheKey, false);
          });
      }

      // Return stale data immediately
      return NextResponse.json({ categories: cachedData, cached: true, stale: true });
    }

    // Cache miss: Fetch from database
    console.log(`[Cache MISS] ${cacheKey} - fetching from database`);
    const categories = await fetchCategoriesFromDB();

    // Store in cache
    cacheManager.set(cacheKey, categories);

    return NextResponse.json({ categories, cached: false });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

