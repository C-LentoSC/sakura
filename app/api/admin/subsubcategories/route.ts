import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { verifySession } from '@/app/lib/dal';
import { z } from 'zod';

const SubSubCategorySchema = z.object({
  slug: z.string().min(1),
  nameKey: z.string().min(1),
  subCategoryId: z.string().min(1),
  order: z.number().int().min(0).optional(),
});

// GET /api/admin/subsubcategories - List all sub-sub-categories
export async function GET(request: NextRequest) {
  try {
    const { isAuth } = await verifySession();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subCategoryId = searchParams.get('subCategoryId');

    const where = subCategoryId ? { subCategoryId } : {};

    const subSubCategories = await prisma.serviceSubSubCategory.findMany({
      where,
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            services: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(subSubCategories);
  } catch (error) {
    console.error('Error fetching sub-sub-categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sub-sub-categories' },
      { status: 500 }
    );
  }
}

// POST /api/admin/subsubcategories - Create new sub-sub-category
export async function POST(request: NextRequest) {
  try {
    const { isAuth } = await verifySession();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = SubSubCategorySchema.parse(body);

    // Check if slug already exists for this sub-category
    const existing = await prisma.serviceSubSubCategory.findFirst({
      where: {
        slug: validatedData.slug,
        subCategoryId: validatedData.subCategoryId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Sub-sub-category with this slug already exists in this sub-category' },
        { status: 400 }
      );
    }

    const subSubCategory = await prisma.serviceSubSubCategory.create({
      data: validatedData,
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            services: true,
          },
        },
      },
    });

    return NextResponse.json(subSubCategory, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating sub-sub-category:', error);
    return NextResponse.json(
      { error: 'Failed to create sub-sub-category' },
      { status: 500 }
    );
  }
}
