export type ServiceCategoryId = 'head-spa' | 'nails' | 'lashes' | 'brows';

export type ServiceSubCategoryId =
  | 'all'
  | 'beauty'
  | 'relaxation'
  | 'therapy'
  | 'manicure'
  | 'pedicure'
  | 'acrylic'
  | 'gel'
  | 'sns'
  | 'classic'
  | 'volume'
  | 'hybrid'
  | 'shaping'
  | 'tinting'
  | 'microblading';

export interface ServiceCategory {
  id: ServiceCategoryId;
  nameKey: string;
}

export interface ServiceSubCategory {
  id: ServiceSubCategoryId;
  nameKey: string;
}

export interface ServiceItem {
  id: number;
  mainCategory: ServiceCategoryId;
  subCategory: Exclude<ServiceSubCategoryId, 'all'>;
  nameKey: string;
  descKey: string;
  price: number;
  duration: string;
  image: string;
}

export const SERVICE_MAIN_CATEGORIES: ServiceCategory[] = [
  { id: 'head-spa', nameKey: 'services.mainCategories.headSpa' },
  { id: 'nails', nameKey: 'services.mainCategories.nails' },
  { id: 'lashes', nameKey: 'services.mainCategories.lashes' },
  { id: 'brows', nameKey: 'services.mainCategories.brows' },
];

export const SERVICE_SUB_CATEGORIES: Record<ServiceCategoryId, ServiceSubCategory[]> = {
  'head-spa': [
    { id: 'all', nameKey: 'services.subCategories.all' },
    { id: 'beauty', nameKey: 'services.subCategories.beauty' },
    { id: 'relaxation', nameKey: 'services.subCategories.relaxation' },
    { id: 'therapy', nameKey: 'services.subCategories.therapy' },
  ],
  nails: [
    { id: 'all', nameKey: 'services.subCategories.all' },
    { id: 'manicure', nameKey: 'services.subCategories.manicure' },
    { id: 'pedicure', nameKey: 'services.subCategories.pedicure' },
    { id: 'acrylic', nameKey: 'services.subCategories.acrylic' },
    { id: 'gel', nameKey: 'services.subCategories.gel' },
    { id: 'sns', nameKey: 'services.subCategories.sns' },
  ],
  lashes: [
    { id: 'all', nameKey: 'services.subCategories.all' },
    { id: 'classic', nameKey: 'services.subCategories.classic' },
    { id: 'volume', nameKey: 'services.subCategories.volume' },
    { id: 'hybrid', nameKey: 'services.subCategories.hybrid' },
  ],
  brows: [
    { id: 'all', nameKey: 'services.subCategories.all' },
    { id: 'shaping', nameKey: 'services.subCategories.shaping' },
    { id: 'tinting', nameKey: 'services.subCategories.tinting' },
    { id: 'microblading', nameKey: 'services.subCategories.microblading' },
  ],
};

export const SERVICES_DATA: ServiceItem[] = [
  // Head Spa - Beauty & Relaxation
  {
    id: 1,
    mainCategory: 'head-spa',
    subCategory: 'beauty',
    nameKey: 'services.items.backFacial.name',
    descKey: 'services.items.backFacial.description',
    price: 89,
    duration: '60 min',
    image: '/packages/1.jpg',
  },
  {
    id: 2,
    mainCategory: 'head-spa',
    subCategory: 'beauty',
    nameKey: 'services.items.faceRejuvenation.name',
    descKey: 'services.items.faceRejuvenation.description',
    price: 110,
    duration: '75 min',
    image: '/packages/2.jpg',
  },
  {
    id: 3,
    mainCategory: 'head-spa',
    subCategory: 'relaxation',
    nameKey: 'services.items.traditionalMassage.name',
    descKey: 'services.items.traditionalMassage.description',
    price: 120,
    duration: '90 min',
    image: '/packages/3.jpg',
  },
  {
    id: 4,
    mainCategory: 'head-spa',
    subCategory: 'relaxation',
    nameKey: 'services.items.aromatherapy.name',
    descKey: 'services.items.aromatherapy.description',
    price: 130,
    duration: '90 min',
    image: '/packages/4.jpg',
  },
  {
    id: 5,
    mainCategory: 'head-spa',
    subCategory: 'therapy',
    nameKey: 'services.items.imperialRetreat.name',
    descKey: 'services.items.imperialRetreat.description',
    price: 160,
    duration: '120 min',
    image: '/packages/5.jpg',
  },
  {
    id: 6,
    mainCategory: 'head-spa',
    subCategory: 'beauty',
    nameKey: 'services.items.zenHeadSpa.name',
    descKey: 'services.items.zenHeadSpa.description',
    price: 95,
    duration: '75 min',
    image: '/packages/6.jpg',
  },
  {
    id: 7,
    mainCategory: 'head-spa',
    subCategory: 'therapy',
    nameKey: 'services.items.sakuraSteam.name',
    descKey: 'services.items.sakuraSteam.description',
    price: 99,
    duration: '70 min',
    image: '/packages/7.jpg',
  },
  {
    id: 8,
    mainCategory: 'head-spa',
    subCategory: 'relaxation',
    nameKey: 'services.items.crystalScalpMassage.name',
    descKey: 'services.items.crystalScalpMassage.description',
    price: 135,
    duration: '85 min',
    image: '/packages/8.jpg',
  },
  {
    id: 9,
    mainCategory: 'head-spa',
    subCategory: 'beauty',
    nameKey: 'services.items.silkHeadTreatment.name',
    descKey: 'services.items.silkHeadTreatment.description',
    price: 125,
    duration: '80 min',
    image: '/packages/9.jpg',
  },
  {
    id: 10,
    mainCategory: 'head-spa',
    subCategory: 'relaxation',
    nameKey: 'services.items.midnightCalm.name',
    descKey: 'services.items.midnightCalm.description',
    price: 90,
    duration: '60 min',
    image: '/packages/1.jpg',
  },
  {
    id: 11,
    mainCategory: 'head-spa',
    subCategory: 'therapy',
    nameKey: 'services.items.forestBreeze.name',
    descKey: 'services.items.forestBreeze.description',
    price: 115,
    duration: '75 min',
    image: '/packages/2.jpg',
  },
  {
    id: 12,
    mainCategory: 'head-spa',
    subCategory: 'therapy',
    nameKey: 'services.items.serenityStone.name',
    descKey: 'services.items.serenityStone.description',
    price: 140,
    duration: '90 min',
    image: '/packages/3.jpg',
  },
  {
    id: 13,
    mainCategory: 'head-spa',
    subCategory: 'relaxation',
    nameKey: 'services.items.kansoTherapy.name',
    descKey: 'services.items.kansoTherapy.description',
    price: 105,
    duration: '65 min',
    image: '/packages/4.jpg',
  },
  {
    id: 14,
    mainCategory: 'head-spa',
    subCategory: 'beauty',
    nameKey: 'services.items.reviveEnergy.name',
    descKey: 'services.items.reviveEnergy.description',
    price: 85,
    duration: '55 min',
    image: '/packages/5.jpg',
  },
  {
    id: 15,
    mainCategory: 'head-spa',
    subCategory: 'therapy',
    nameKey: 'services.items.samuraiFocus.name',
    descKey: 'services.items.samuraiFocus.description',
    price: 118,
    duration: '70 min',
    image: '/packages/6.jpg',
  },
  {
    id: 16,
    mainCategory: 'head-spa',
    subCategory: 'relaxation',
    nameKey: 'services.items.deepSleepRitual.name',
    descKey: 'services.items.deepSleepRitual.description',
    price: 150,
    duration: '100 min',
    image: '/packages/7.jpg',
  },
  {
    id: 17,
    mainCategory: 'head-spa',
    subCategory: 'beauty',
    nameKey: 'services.items.blossomScalpPolish.name',
    descKey: 'services.items.blossomScalpPolish.description',
    price: 92,
    duration: '60 min',
    image: '/packages/8.jpg',
  },
  {
    id: 18,
    mainCategory: 'head-spa',
    subCategory: 'therapy',
    nameKey: 'services.items.shizukuHydration.name',
    descKey: 'services.items.shizukuHydration.description',
    price: 132,
    duration: '80 min',
    image: '/packages/9.jpg',
  },
  {
    id: 19,
    mainCategory: 'head-spa',
    subCategory: 'relaxation',
    nameKey: 'services.items.teawareInfusion.name',
    descKey: 'services.items.teawareInfusion.description',
    price: 108,
    duration: '75 min',
    image: '/packages/1.jpg',
  },
  {
    id: 20,
    mainCategory: 'head-spa',
    subCategory: 'beauty',
    nameKey: 'services.items.auroraHeadLuminance.name',
    descKey: 'services.items.auroraHeadLuminance.description',
    price: 145,
    duration: '95 min',
    image: '/packages/2.jpg',
  },
  // Nails
  {
    id: 21,
    mainCategory: 'nails',
    subCategory: 'manicure',
    nameKey: 'services.items.classicManicure.name',
    descKey: 'services.items.classicManicure.description',
    price: 45,
    duration: '45 min',
    image: '/packages/5.jpg',
  },
  {
    id: 22,
    mainCategory: 'nails',
    subCategory: 'gel',
    nameKey: 'services.items.gelManicure.name',
    descKey: 'services.items.gelManicure.description',
    price: 65,
    duration: '60 min',
    image: '/packages/6.jpg',
  },
  {
    id: 23,
    mainCategory: 'nails',
    subCategory: 'acrylic',
    nameKey: 'services.items.acrylicSet.name',
    descKey: 'services.items.acrylicSet.description',
    price: 85,
    duration: '90 min',
    image: '/packages/7.jpg',
  },
  // Lashes
  {
    id: 24,
    mainCategory: 'lashes',
    subCategory: 'classic',
    nameKey: 'services.items.classicLashes.name',
    descKey: 'services.items.classicLashes.description',
    price: 150,
    duration: '120 min',
    image: '/packages/8.jpg',
  },
  {
    id: 25,
    mainCategory: 'lashes',
    subCategory: 'volume',
    nameKey: 'services.items.volumeLashes.name',
    descKey: 'services.items.volumeLashes.description',
    price: 180,
    duration: '150 min',
    image: '/packages/9.jpg',
  },
  // Brows
  {
    id: 26,
    mainCategory: 'brows',
    subCategory: 'shaping',
    nameKey: 'services.items.browShaping.name',
    descKey: 'services.items.browShaping.description',
    price: 45,
    duration: '30 min',
    image: '/packages/1.jpg',
  },
];
