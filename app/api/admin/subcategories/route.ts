import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { hasRole } from '@/app/lib/dal';

export const dynamic = 'force-dynamic';

// GET - List all sub-categories
export async function GET(request: Request) {
  try {
    const isAdmin = await hasRole('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const where = categoryId ? { categoryId } : {};

    const subCategories = await prisma.serviceSubCategory.findMany({
      where,
      include: {
        category: true,
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

    return NextResponse.json({ subCategories });
  } catch (error) {
    console.error('Error fetching sub-categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sub-categories' },
      { status: 500 }
    );
  }
}

// POST - Create new sub-category
export async function POST(request: Request) {
  try {
    const isAdmin = await hasRole('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { slug, nameKey, categoryId, order, nameEn = '', nameJa = '' } = body;

    const subCategory = await prisma.serviceSubCategory.create({
      data: {
        slug,
        nameKey,
        nameEn,
        nameJa,
        categoryId,
        order: order || 0,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ subCategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating sub-category:', error);
    return NextResponse.json(
      { error: 'Failed to create sub-category' },
      { status: 500 }
    );
  }
}

// PUT - Update sub-category
export async function PUT(request: Request) {
  try {
    const isAdmin = await hasRole('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, nameEn, nameJa, ...rest } = body as { id: string; nameEn?: string; nameJa?: string; [k: string]: unknown };

    const subCategory = await prisma.serviceSubCategory.update({
      where: { id },
      data: {
        ...rest,
        ...(typeof nameEn !== 'undefined' ? { nameEn } : {}),
        ...(typeof nameJa !== 'undefined' ? { nameJa } : {}),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ subCategory });
  } catch (error) {
    console.error('Error updating sub-category:', error);
    return NextResponse.json(
      { error: 'Failed to update sub-category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete sub-category
export async function DELETE(request: Request) {
  try {
    const isAdmin = await hasRole('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Sub-category ID required' },
        { status: 400 }
      );
    }

    await prisma.serviceSubCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sub-category:', error);
    return NextResponse.json(
      { error: 'Failed to delete sub-category' },
      { status: 500 }
    );
  }
}

