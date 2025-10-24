import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import cacheManager from '@/app/lib/cache';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// Fetch services from database
async function fetchServicesFromDB(params: {
  category?: string | null;
  subCategory?: string | null;
  subSubCategory?: string | null;
}) {
  const { category, subCategory, subSubCategory } = params;

  // Build where clause
  const where: {
    isActive: boolean;
    categoryId?: string;
    subCategoryId?: string;
    subSubCategoryId?: string;
  } = {
    isActive: true,
  };

  if (category) {
    const cat = await prisma.serviceCategory.findUnique({
      where: { slug: category },
    });
    if (cat) {
      where.categoryId = cat.id;
    }
  }

  if (subCategory && subCategory !== 'all') {
    const subCat = await prisma.serviceSubCategory.findFirst({
      where: { slug: subCategory },
    });
    if (subCat) {
      where.subCategoryId = subCat.id;
    }
  }

  if (subSubCategory && subSubCategory !== 'all') {
    const subSubCat = await prisma.serviceSubSubCategory.findFirst({
      where: { slug: subSubCategory },
    });
    if (subSubCat) {
      where.subSubCategoryId = subSubCat.id;
    }
  }

  // Fetch services with relations
  return await prisma.service.findMany({
    where,
    include: {
      category: true,
      subCategory: true,
      subSubCategory: true,
    },
    orderBy: {
      order: 'asc',
    },
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    const subSubCategory = searchParams.get('subSubCategory');
    const search = searchParams.get('search');

    // Create cache key based on query params
    const cacheKey = `services:${category || 'all'}:${subCategory || 'all'}:${subSubCategory || 'all'}`;

    // Cache-first: Try to get from cache
    const cachedData = cacheManager.get<any[]>(cacheKey, {
      ttl: 30 * 60 * 1000, // 30 minutes fresh
      staleWhileRevalidate: 60 * 60 * 1000, // 60 minutes stale-while-revalidate
    });

    // If cache hit and not stale, return immediately
    if (cachedData && !cacheManager.isStale(cacheKey)) {
      console.log(`[Cache HIT] ${cacheKey} - serving fresh data`);

      // Apply search filter if needed (client-side)
      let filteredServices = cachedData;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredServices = cachedData.filter(
          (service: any) =>
            service.nameKey.toLowerCase().includes(searchLower) ||
            service.descKey.toLowerCase().includes(searchLower)
        );
      }

      return NextResponse.json({
        services: filteredServices,
        total: filteredServices.length,
        cached: true,
      });
    }

    // If cache hit but stale, return stale data and revalidate in background
    if (cachedData && cacheManager.isStale(cacheKey)) {
      console.log(`[Cache STALE] ${cacheKey} - serving stale data, revalidating...`);

      // Start background revalidation if not already in progress
      if (!cacheManager.isRevalidating(cacheKey)) {
        cacheManager.setRevalidating(cacheKey, true);

        // Background revalidation (non-blocking)
        fetchServicesFromDB({ category, subCategory, subSubCategory })
          .then((freshServices) => {
            cacheManager.set(cacheKey, freshServices);
            cacheManager.setRevalidating(cacheKey, false);
            console.log(`[Cache REVALIDATED] ${cacheKey}`);
          })
          .catch((err) => {
            console.error('Background revalidation failed:', err);
            cacheManager.setRevalidating(cacheKey, false);
          });
      }

      // Apply search filter if needed (client-side)
      let filteredServices = cachedData;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredServices = cachedData.filter(
          (service: any) =>
            service.nameKey.toLowerCase().includes(searchLower) ||
            service.descKey.toLowerCase().includes(searchLower)
        );
      }

      // Return stale data immediately
      return NextResponse.json({
        services: filteredServices,
        total: filteredServices.length,
        cached: true,
        stale: true,
      });
    }

    // Cache miss: Fetch from database
    console.log(`[Cache MISS] ${cacheKey} - fetching from database`);
    const services = await fetchServicesFromDB({ category, subCategory, subSubCategory });

    // Store in cache
    cacheManager.set(cacheKey, services);

    // Apply search filter if needed (client-side)
    let filteredServices = services;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredServices = services.filter(
        (service) =>
          service.nameKey.toLowerCase().includes(searchLower) ||
          service.descKey.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      services: filteredServices,
      total: filteredServices.length,
      cached: false,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

