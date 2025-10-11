import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { hasRole } from '@/app/lib/dal';

// PUT /api/admin/services/[id] - Update service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const isAdmin = await hasRole('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      nameKey,
      descKey,
      price,
      duration,
      image,
      categoryId,
      subCategoryId,
      subSubCategoryId,
      order,
      isActive,
    } = body;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        nameKey,
        descKey,
        price: price ? parseFloat(price) : undefined,
        duration,
        image,
        categoryId,
        subCategoryId: subCategoryId || null,
        subSubCategoryId: subSubCategoryId || null,
        order: order !== undefined ? parseInt(order) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
      include: {
        category: true,
        subCategory: true,
        subSubCategory: true,
      },
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/services/[id] - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const isAdmin = await hasRole('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
