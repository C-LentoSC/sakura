import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    const subSubCategory = searchParams.get('subSubCategory');
    const search = searchParams.get('search');

    // Build where clause
    const where: { 
      isActive: boolean; 
      categoryId?: string; 
      subCategoryId?: string;
      subSubCategoryId?: string;
    } = {
      isActive: true,
    };

    if (category) {
      const cat = await prisma.serviceCategory.findUnique({
        where: { slug: category },
      });
      if (cat) {
        where.categoryId = cat.id;
      }
    }

    if (subCategory && subCategory !== 'all') {
      const subCat = await prisma.serviceSubCategory.findFirst({
        where: { slug: subCategory },
      });
      if (subCat) {
        where.subCategoryId = subCat.id;
      }
    }

    if (subSubCategory && subSubCategory !== 'all') {
      const subSubCat = await prisma.serviceSubSubCategory.findFirst({
        where: { slug: subSubCategory },
      });
      if (subSubCat) {
        where.subSubCategoryId = subSubCat.id;
      }
    }

    // Fetch services with relations
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

    // Filter by search if provided (client-side filtering for translation keys)
    let filteredServices = services;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredServices = services.filter(
        (service) =>
          service.nameKey.toLowerCase().includes(searchLower) ||
          service.descKey.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(
      {
        services: filteredServices,
        total: filteredServices.length,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

