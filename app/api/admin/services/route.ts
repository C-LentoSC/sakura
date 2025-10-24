import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { hasRole } from '@/app/lib/dal';
import cacheManager from '@/app/lib/cache';

export const dynamic = 'force-dynamic';

// GET - List all services
export async function GET(request: Request) {
  try {
    // Check admin permission
    const isAdmin = await hasRole('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    const subSubCategory = searchParams.get('subSubCategory');
    const search = searchParams.get('search');

    const where: { 
      categoryId?: string; 
      subCategoryId?: string;
      subSubCategoryId?: string;
    } = {};

    if (category) {
      const cat = await prisma.serviceCategory.findUnique({
        where: { slug: category },
      });
      if (cat) {
        where.categoryId = cat.id;
      }
    }

    if (subCategory) {
      const subCat = await prisma.serviceSubCategory.findFirst({
        where: { slug: subCategory },
      });
      if (subCat) {
        where.subCategoryId = subCat.id;
      }
    }

    if (subSubCategory) {
      const subSubCat = await prisma.serviceSubSubCategory.findFirst({
        where: { slug: subSubCategory },
      });
      if (subSubCat) {
        where.subSubCategoryId = subSubCat.id;
      }
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        category: true,
        subCategory: true,
        subSubCategory: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    let filteredServices = services;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredServices = services.filter(
        (service) =>
          service.nameKey.toLowerCase().includes(searchLower) ||
          service.descKey.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ services: filteredServices });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST - Create new service
export async function POST(request: Request) {
  try {
    const isAdmin = await hasRole('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      nameKey,
      descKey,
      nameEn = '',
      nameJa = '',
      descEn = '',
      descJa = '',
      price,
      duration,
      image,
      categoryId,
      subCategoryId,
      subSubCategoryId,
      order,
      isActive,
    } = body;

    const service = await prisma.service.create({
      data: {
        nameKey,
        descKey,
        nameEn,
        nameJa,
        descEn,
        descJa,
        price: parseFloat(price),
        duration,
        image,
        categoryId,
        subCategoryId: subCategoryId || null,
        subSubCategoryId: subSubCategoryId || null,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        category: true,
        subCategory: true,
        subSubCategory: true,
      },
    });

    // Invalidate all service and category caches
    cacheManager.invalidatePattern(/^services:/);
    cacheManager.invalidatePattern(/^categories:/);
    console.log('[Cache INVALIDATED] All service and category caches after CREATE');

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

// PUT - Update service
export async function PUT(request: Request) {
  try {
    const isAdmin = await hasRole('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body as { id: string; [k: string]: unknown };

    const dataRecord = data as Record<string, unknown>;
    if (typeof dataRecord.price === 'string') {
      dataRecord.price = parseFloat(dataRecord.price);
    }

    const service = await prisma.service.update({
      where: { id },
      data: dataRecord,
      include: {
        category: true,
        subCategory: true,
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

// DELETE - Delete service
export async function DELETE(request: Request) {
  try {
    const isAdmin = await hasRole('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}

