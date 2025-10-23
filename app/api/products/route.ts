import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'ja';

    const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });

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

    const data = (products as unknown as DbProduct[]).map((p: DbProduct) => ({
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

    return NextResponse.json(
      { products: data },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    console.error('Failed to fetch products', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
