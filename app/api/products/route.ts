import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'ja';

    // Fetch products directly from database - no caching
    const products = await prisma.product.findMany({ 
      orderBy: { createdAt: 'asc' } 
    });

    // Transform products based on language
    const data = products.map((p) => ({
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

    return NextResponse.json({ products: data });
  } catch (err) {
    console.error('Failed to fetch products', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
