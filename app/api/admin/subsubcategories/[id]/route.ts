import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifySession } from '@/app/lib/dal';
import { z } from 'zod';

const SubSubCategoryUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  nameKey: z.string().min(1).optional(),
  subCategoryId: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
});

// PUT /api/admin/subsubcategories/[id] - Update sub-sub-category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { isAuth } = await verifySession();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = SubSubCategoryUpdateSchema.parse(body);

    // Check if sub-sub-category exists
    const existing = await prisma.serviceSubSubCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Sub-sub-category not found' },
        { status: 404 }
      );
    }

    // If updating slug, check for conflicts
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const subCategoryId = validatedData.subCategoryId || existing.subCategoryId;
      const conflict = await prisma.serviceSubSubCategory.findFirst({
        where: {
          slug: validatedData.slug,
          subCategoryId,
          id: { not: id },
        },
      });

      if (conflict) {
        return NextResponse.json(
          { error: 'Sub-sub-category with this slug already exists in this sub-category' },
          { status: 400 }
        );
      }
    }

    const subSubCategory = await prisma.serviceSubSubCategory.update({
      where: { id },
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

    return NextResponse.json(subSubCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating sub-sub-category:', error);
    return NextResponse.json(
      { error: 'Failed to update sub-sub-category' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/subsubcategories/[id] - Delete sub-sub-category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { isAuth } = await verifySession();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if sub-sub-category exists
    const existing = await prisma.serviceSubSubCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            services: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Sub-sub-category not found' },
        { status: 404 }
      );
    }

    // Check if sub-sub-category has services
    if (existing._count.services > 0) {
      return NextResponse.json(
        { error: 'Cannot delete sub-sub-category with existing services' },
        { status: 400 }
      );
    }

    await prisma.serviceSubSubCategory.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Sub-sub-category deleted successfully' });
  } catch (error) {
    console.error('Error deleting sub-sub-category:', error);
    return NextResponse.json(
      { error: 'Failed to delete sub-sub-category' },
      { status: 500 }
    );
  }
}
