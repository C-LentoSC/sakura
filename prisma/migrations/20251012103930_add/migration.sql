-- AlterTable
ALTER TABLE "Service" ADD COLUMN "descEn" TEXT DEFAULT '';
ALTER TABLE "Service" ADD COLUMN "descJa" TEXT DEFAULT '';
ALTER TABLE "Service" ADD COLUMN "nameEn" TEXT DEFAULT '';
ALTER TABLE "Service" ADD COLUMN "nameJa" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "ServiceCategory" ADD COLUMN "nameEn" TEXT DEFAULT '';
ALTER TABLE "ServiceCategory" ADD COLUMN "nameJa" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "ServiceSubCategory" ADD COLUMN "nameEn" TEXT DEFAULT '';
ALTER TABLE "ServiceSubCategory" ADD COLUMN "nameJa" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "ServiceSubSubCategory" ADD COLUMN "nameEn" TEXT DEFAULT '';
ALTER TABLE "ServiceSubSubCategory" ADD COLUMN "nameJa" TEXT DEFAULT '';
