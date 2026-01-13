import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await req.json();
    const {
      nameEn,
      nameJa,
      category,
      descEn,
      descJa,
      price,
      originalPrice,
      image,
      inStock,
      badge,
      badgeType,
    } = body || {};

    const data: {
      nameEn?: string;
      nameJa?: string;
      category?: string;
      descEn?: string;
      descJa?: string;
      price?: number;
      originalPrice?: number | null;
      image?: string;
      inStock?: boolean;
      badge?: string | null;
      badgeType?: string | null;
    } = {};

    if (nameEn) data.nameEn = nameEn;
    if (typeof nameJa === 'string') data.nameJa = nameJa;
    if (category) data.category = category;
    if (descEn) data.descEn = descEn;
    if (typeof descJa === 'string') data.descJa = descJa;
    if (price) data.price = parseInt(price);
    if (originalPrice !== undefined) {
      data.originalPrice = originalPrice ? parseInt(originalPrice) : null;
    }
    if (image) data.image = image;
    if (typeof inStock === 'boolean') data.inStock = inStock;
    if (badge !== undefined) data.badge = badge || null;
    if (badgeType !== undefined) data.badgeType = badgeType || null;

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return NextResponse.json({ product });
  } catch (e) {
    console.error('Failed to update product', e);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Failed to delete product', e);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
