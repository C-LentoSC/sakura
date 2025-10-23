import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌸 Starting Sakura Saloon database seeding...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.product.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceSubSubCategory.deleteMany();
  await prisma.serviceSubCategory.deleteMany();
  await prisma.serviceCategory.deleteMany();

  // Level 1: Main Categories/Packages
  console.log('📦 Creating main categories (Level 1)...');
  
  const headSpaCategory = await prisma.serviceCategory.create({
    data: {
      slug: 'head-spa',
      nameKey: 'services.mainCategories.headSpa',
      order: 1,
    },
  });

  const beautyCategory = await prisma.serviceCategory.create({
    data: {
      slug: 'beauty',
      nameKey: 'services.mainCategories.beauty',
      order: 2,
    },
  });

  // Level 2: Sub-Categories
  console.log('🏷️ Creating sub-categories (Level 2)...');

  // Head-Spa Sub-Categories
  const headSpaBeauty = await prisma.serviceSubCategory.create({
    data: {
      slug: 'beauty',
      nameKey: 'services.subCategories.beauty',
      categoryId: headSpaCategory.id,
      order: 1,
    },
  });

  const headSpaRelaxation = await prisma.serviceSubCategory.create({
    data: {
      slug: 'relaxation',
      nameKey: 'services.subCategories.relaxation',
      categoryId: headSpaCategory.id,
      order: 2,
    },
  });

  await prisma.serviceSubCategory.create({
    data: {
      slug: 'therapy',
      nameKey: 'services.subCategories.therapy',
      categoryId: headSpaCategory.id,
      order: 3,
    },
  });

  // Beauty Sub-Categories
  await prisma.serviceSubCategory.create({
    data: {
      slug: 'headspa',
      nameKey: 'services.subCategories.headSpa',
      categoryId: beautyCategory.id,
      order: 1,
    },
  });

  const beautyNails = await prisma.serviceSubCategory.create({
    data: {
      slug: 'nails',
      nameKey: 'services.subCategories.nails',
      categoryId: beautyCategory.id,
      order: 2,
    },
  });

  const beautyBrows = await prisma.serviceSubCategory.create({
    data: {
      slug: 'brows',
      nameKey: 'services.subCategories.brows',
      categoryId: beautyCategory.id,
      order: 3,
    },
  });

  const beautyLashes = await prisma.serviceSubCategory.create({
    data: {
      slug: 'lashes',
      nameKey: 'services.subCategories.lashes',
      categoryId: beautyCategory.id,
      order: 4,
    },
  });

  // Level 3: Sub-Sub-Categories
  console.log('🎯 Creating sub-sub-categories (Level 3)...');

  // Relaxation Sub-Sub-Categories
  const aromatherapy = await prisma.serviceSubSubCategory.create({
    data: {
      slug: 'aromatherapy',
      nameKey: 'services.subSubCategories.aromatherapy',
      subCategoryId: headSpaRelaxation.id,
      order: 1,
    },
  });

  const deepRelaxation = await prisma.serviceSubSubCategory.create({
    data: {
      slug: 'deep-relaxation',
      nameKey: 'services.subSubCategories.deepRelaxation',
      subCategoryId: headSpaRelaxation.id,
      order: 2,
    },
  });

  // Nails Sub-Sub-Categories
  const manicure = await prisma.serviceSubSubCategory.create({
    data: {
      slug: 'manicure',
      nameKey: 'services.subSubCategories.manicure',
      subCategoryId: beautyNails.id,
      order: 1,
    },
  });

  await prisma.serviceSubSubCategory.create({
    data: {
      slug: 'pedicure',
      nameKey: 'services.subSubCategories.pedicure',
      subCategoryId: beautyNails.id,
      order: 2,
    },
  });

  await prisma.serviceSubSubCategory.create({
    data: {
      slug: 'acrylic',
      nameKey: 'services.subSubCategories.acrylic',
      subCategoryId: beautyNails.id,
      order: 3,
    },
  });

  const gelNails = await prisma.serviceSubSubCategory.create({
    data: {
      slug: 'gel',
      nameKey: 'services.subSubCategories.gel',
      subCategoryId: beautyNails.id,
      order: 4,
    },
  });

  // Lashes Sub-Sub-Categories
  const classicLashes = await prisma.serviceSubSubCategory.create({
    data: {
      slug: 'classic',
      nameKey: 'services.subSubCategories.classic',
      subCategoryId: beautyLashes.id,
      order: 1,
    },
  });

  const volumeLashes = await prisma.serviceSubSubCategory.create({
    data: {
      slug: 'volume',
      nameKey: 'services.subSubCategories.volume',
      subCategoryId: beautyLashes.id,
      order: 2,
    },
  });

  // Brows Sub-Sub-Categories
  const browShaping = await prisma.serviceSubSubCategory.create({
    data: {
      slug: 'shaping',
      nameKey: 'services.subSubCategories.shaping',
      subCategoryId: beautyBrows.id,
      order: 1,
    },
  });

  const browTinting = await prisma.serviceSubSubCategory.create({
    data: {
      slug: 'tinting',
      nameKey: 'services.subSubCategories.tinting',
      subCategoryId: beautyBrows.id,
      order: 2,
    },
  });

  // Services
  console.log('💆 Creating services...');

  // Head-Spa > Beauty Services
  await prisma.service.create({
    data: {
      nameKey: 'services.items.backFacial.name',
      descKey: 'services.items.backFacial.description',
      price: 89,
      duration: '40 min',
      image: '/packages/1.jpg',
      categoryId: headSpaCategory.id,
      subCategoryId: headSpaBeauty.id,
      order: 1,
    },
  });

  await prisma.service.create({
    data: {
      nameKey: 'services.items.faceRejuvenation.name',
      descKey: 'services.items.faceRejuvenation.description',
      price: 110,
      duration: '75 min',
      image: '/packages/2.jpg',
      categoryId: headSpaCategory.id,
      subCategoryId: headSpaBeauty.id,
      order: 2,
    },
  });

  // Head-Spa > Relaxation > Aromatherapy Services
  await prisma.service.create({
    data: {
      nameKey: 'services.items.aromatherapySession.name',
      descKey: 'services.items.aromatherapySession.description',
      price: 130,
      duration: '90 min',
      image: '/packages/3.jpg',
      categoryId: headSpaCategory.id,
      subCategoryId: headSpaRelaxation.id,
      subSubCategoryId: aromatherapy.id,
      order: 1,
    },
  });

  // Head-Spa > Relaxation > Deep Relaxation Services
  await prisma.service.create({
    data: {
      nameKey: 'services.items.zenHeadSpa.name',
      descKey: 'services.items.zenHeadSpa.description',
      price: 95,
      duration: '75 min',
      image: '/packages/4.jpg',
      categoryId: headSpaCategory.id,
      subCategoryId: headSpaRelaxation.id,
      subSubCategoryId: deepRelaxation.id,
      order: 1,
    },
  });

  // Beauty > Nails > Manicure Services
  await prisma.service.create({
    data: {
      nameKey: 'services.items.classicManicure.name',
      descKey: 'services.items.classicManicure.description',
      price: 45,
      duration: '45 min',
      image: '/packages/5.jpg',
      categoryId: beautyCategory.id,
      subCategoryId: beautyNails.id,
      subSubCategoryId: manicure.id,
      order: 1,
    },
  });

  await prisma.service.create({
    data: {
      nameKey: 'services.items.luxuryManicure.name',
      descKey: 'services.items.luxuryManicure.description',
      price: 65,
      duration: '60 min',
      image: '/packages/6.jpg',
      categoryId: beautyCategory.id,
      subCategoryId: beautyNails.id,
      subSubCategoryId: manicure.id,
      order: 2,
    },
  });

  // Beauty > Nails > Gel Services
  await prisma.service.create({
    data: {
      nameKey: 'services.items.gelNails.name',
      descKey: 'services.items.gelNails.description',
      price: 55,
      duration: '60 min',
      image: '/packages/7.jpg',
      categoryId: beautyCategory.id,
      subCategoryId: beautyNails.id,
      subSubCategoryId: gelNails.id,
      order: 1,
    },
  });

  // Beauty > Lashes > Classic Services
  await prisma.service.create({
    data: {
      nameKey: 'services.items.classicLashes.name',
      descKey: 'services.items.classicLashes.description',
      price: 80,
      duration: '120 min',
      image: '/packages/8.jpg',
      categoryId: beautyCategory.id,
      subCategoryId: beautyLashes.id,
      subSubCategoryId: classicLashes.id,
      order: 1,
    },
  });

  // Beauty > Lashes > Volume Services
  await prisma.service.create({
    data: {
      nameKey: 'services.items.volumeLashes.name',
      descKey: 'services.items.volumeLashes.description',
      price: 120,
      duration: '150 min',
      image: '/packages/9.jpg',
      categoryId: beautyCategory.id,
      subCategoryId: beautyLashes.id,
      subSubCategoryId: volumeLashes.id,
      order: 1,
    },
  });

  // Beauty > Brows > Shaping Services
  await prisma.service.create({
    data: {
      nameKey: 'services.items.browShaping.name',
      descKey: 'services.items.browShaping.description',
      price: 35,
      duration: '30 min',
      image: '/services-images/beauty-nails.jpg',
      categoryId: beautyCategory.id,
      subCategoryId: beautyBrows.id,
      subSubCategoryId: browShaping.id,
      order: 1,
    },
  });

  // Beauty > Brows > Tinting Services
  await prisma.service.create({
    data: {
      nameKey: 'services.items.browTinting.name',
      descKey: 'services.items.browTinting.description',
      price: 40,
      duration: '45 min',
      image: '/services-images/head-spa.jpg',
      categoryId: beautyCategory.id,
      subCategoryId: beautyBrows.id,
      subSubCategoryId: browTinting.id,
      order: 1,
    },
  });

  // Products
  console.log('🛍️ Creating products...');

  const products = [
    {
      nameEn: 'Japanese Hair Serum',
      nameJa: '日本式ヘアセラム',
      category: 'Hair Care',
      descEn: 'Premium Japanese hair serum for silky smooth hair',
      descJa: 'シルクのように滑らかな髪のためのプレミアム日本式ヘアセラム',
      price: 1299,
      originalPrice: 1599,
      image: '/services-images/head-spa.jpg',
      inStock: true,
      badge: 'Bestseller',
      badgeType: 'Bestseller',
    },
    {
      nameEn: 'Sakura Scalp Treatment Oil',
      nameJa: '桜スカルプトリートメントオイル',
      category: 'Hair Care',
      descEn: 'Nourishing scalp oil with cherry blossom extract',
      descJa: '桜エキス配合の栄養豊富な頭皮オイル',
      price: 999,
      originalPrice: null,
      image: '/services-images/head-spa2.jpg',
      inStock: true,
      badge: 'New',
      badgeType: 'New',
    },
    {
      nameEn: 'Luxury Nail Care Kit',
      nameJa: 'ラグジュアリーネイルケアキット',
      category: 'Nail Care',
      descEn: 'Complete professional nail care kit',
      descJa: '完全なプロフェッショナルネイルケアキット',
      price: 1499,
      originalPrice: 1899,
      image: '/services-images/nails.jpg',
      inStock: true,
      badge: 'Sale',
      badgeType: 'Sale',
    },
    {
      nameEn: 'Premium Gel Polish Set',
      nameJa: 'プレミアムジェルポリッシュセット',
      category: 'Nail Care',
      descEn: '12-piece gel polish collection',
      descJa: '12ピースジェルポリッシュコレクション',
      price: 1799,
      originalPrice: null,
      image: '/services-images/beauty-nails.jpg',
      inStock: true,
      badge: null,
      badgeType: null,
    },
    {
      nameEn: 'Lash Growth Serum',
      nameJa: 'まつげ育成セラム',
      category: 'Beauty',
      descEn: 'Advanced formula for longer, fuller lashes',
      descJa: 'より長く、より豊かなまつげのための高度な処方',
      price: 1599,
      originalPrice: 1999,
      image: '/services-images/head-spa.jpg',
      inStock: true,
      badge: 'Bestseller',
      badgeType: 'Bestseller',
    },
    {
      nameEn: 'Eyebrow Styling Kit',
      nameJa: 'アイブロウスタイリングキット',
      category: 'Beauty',
      descEn: 'Professional eyebrow grooming essentials',
      descJa: 'プロフェッショナルな眉毛グルーミングエッセンシャル',
      price: 899,
      originalPrice: null,
      image: '/services-images/nails.jpg',
      inStock: true,
      badge: null,
      badgeType: null,
    },
    {
      nameEn: 'Aromatherapy Essential Oils',
      nameJa: 'アロマセラピーエッセンシャルオイル',
      category: 'Wellness',
      descEn: 'Set of 6 premium essential oils',
      descJa: 'プレミアムエッセンシャルオイル6本セット',
      price: 1199,
      originalPrice: 1499,
      image: '/services-images/head-spa2.jpg',
      inStock: true,
      badge: 'Popular',
      badgeType: 'Popular',
    },
    {
      nameEn: 'Silk Hair Mask',
      nameJa: 'シルクヘアマスク',
      category: 'Hair Care',
      descEn: 'Deep conditioning silk protein mask',
      descJa: 'ディープコンディショニングシルクプロテインマスク',
      price: 799,
      originalPrice: null,
      image: '/services-images/beauty-nails.jpg',
      inStock: false,
      badge: 'Out of Stock',
      badgeType: 'Out of Stock',
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`   • ${await prisma.serviceCategory.count()} main categories`);
  console.log(`   • ${await prisma.serviceSubCategory.count()} sub-categories`);
  console.log(`   • ${await prisma.serviceSubSubCategory.count()} sub-sub-categories`);
  console.log(`   • ${await prisma.service.count()} services`);
  console.log(`   • ${await prisma.product.count()} products`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });