import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import cacheManager from '@/app/lib/cache';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nameEn,
      nameJa = '',
      category,
      descEn,
      descJa = '',
      price,
      originalPrice,
      image,
      inStock = true,
      badge,
      badgeType,
    } = body || {};

    if (!nameEn || !category || !descEn || !price || !image) {
      return NextResponse.json(
        { error: 'Required fields: nameEn, category, descEn, price, image' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        nameEn,
        nameJa,
        category,
        descEn,
        descJa,
        price: parseInt(price),
        originalPrice: originalPrice ? parseInt(originalPrice) : null,
        image,
        inStock,
        badge: badge || null,
        badgeType: badgeType || null,
      },
    });

    // Invalidate all product caches (both en and ja)
    cacheManager.invalidatePattern(/^products:/);
    console.log('[Cache INVALIDATED] All product caches after CREATE');

    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    console.error('Failed to create product', e);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
