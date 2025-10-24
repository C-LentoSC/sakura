import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import cacheManager from '@/app/lib/cache';

/**
 * On-demand revalidation endpoint
 * Used to manually trigger revalidation after CRUD operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, cacheKey } = body;

    // Revalidate Next.js cache
    if (path) {
      revalidatePath(path);
      console.log(`[ISR] Revalidated path: ${path}`);
    }

    // Invalidate server cache
    if (cacheKey) {
      if (cacheKey === '*') {
        cacheManager.clear();
        console.log('[Cache] Cleared all cache');
      } else {
        cacheManager.invalidate(cacheKey);
        console.log(`[Cache] Invalidated: ${cacheKey}`);
      }
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json(
      { error: 'Error revalidating' },
      { status: 500 }
    );
  }
}
