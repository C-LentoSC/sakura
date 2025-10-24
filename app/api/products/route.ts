import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import cacheManager from '@/app/lib/cache';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;
// Product listing may vary by request query (lang) - ensure route is dynamic
export const dynamic = 'force-dynamic';

type DbProduct = {
  id: number;
  nameEn: string;
  nameJa: string;
  category: string;
  descEn: string;
  descJa: string;
  price: number;
  originalPrice: number | null;
  image: string;
  inStock: boolean;
  badge: string | null;
  badgeType: string | null;
};

type TransformedProduct = {
  id: number;
  name: string;
  nameEn: string;
  nameJa: string;
  category: string;
  description: string;
  descEn: string;
  descJa: string;
  price: number;
  originalPrice: number | null;
  image: string;
  inStock: boolean;
  badge: string | null;
  badgeType: string | null;
};

// Fetch products from database
async function fetchProductsFromDB(): Promise<DbProduct[]> {
  return await prisma.product.findMany({ orderBy: { createdAt: 'asc' } }) as unknown as DbProduct[];
}

// Transform products based on language
function transformProducts(products: DbProduct[], lang: 'en' | 'ja'): TransformedProduct[] {
  return products.map((p: DbProduct) => ({
    id: p.id,
    name: lang === 'ja' ? (p.nameJa || p.nameEn) : p.nameEn,
    nameEn: p.nameEn,
    nameJa: p.nameJa,
    category: p.category,
    description: lang === 'ja' ? (p.descJa || p.descEn) : p.descEn,
    descEn: p.descEn,
    descJa: p.descJa,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    inStock: p.inStock,
    badge: p.badge,
    badgeType: p.badgeType,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'ja';
    const cacheKey = `products:${lang}`;

    // Cache-first: Try to get from cache
    const cachedData = cacheManager.get<TransformedProduct[]>(cacheKey, {
      ttl: 30 * 60 * 1000, // 30 minutes fresh
      staleWhileRevalidate: 60 * 60 * 1000, // 60 minutes stale-while-revalidate
    });

    // If cache hit and not stale, return immediately
    if (cachedData && !cacheManager.isStale(cacheKey)) {
      console.log(`[Cache HIT] ${cacheKey} - serving fresh data`);
      return NextResponse.json({ products: cachedData, cached: true });
    }

    // If cache hit but stale, return stale data and revalidate in background
    if (cachedData && cacheManager.isStale(cacheKey)) {
      console.log(`[Cache STALE] ${cacheKey} - serving stale data, revalidating...`);

      // Start background revalidation if not already in progress
      if (!cacheManager.isRevalidating(cacheKey)) {
        cacheManager.setRevalidating(cacheKey, true);

        // Background revalidation (non-blocking)
        fetchProductsFromDB()
          .then((freshProducts) => {
            const freshData = transformProducts(freshProducts, lang);
            cacheManager.set(cacheKey, freshData);
            cacheManager.setRevalidating(cacheKey, false);
            console.log(`[Cache REVALIDATED] ${cacheKey}`);
          })
          .catch((err) => {
            console.error('Background revalidation failed:', err);
            cacheManager.setRevalidating(cacheKey, false);
          });
      }

      // Return stale data immediately
      return NextResponse.json({ products: cachedData, cached: true, stale: true });
    }

    // Cache miss: Fetch from database
    console.log(`[Cache MISS] ${cacheKey} - fetching from database`);
    const products = await fetchProductsFromDB();
    const data = transformProducts(products, lang);

    // Store in cache
    cacheManager.set(cacheKey, data);

    return NextResponse.json({ products: data, cached: false });
  } catch (err) {
    console.error('Failed to fetch products', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
