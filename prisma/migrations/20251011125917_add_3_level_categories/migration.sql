-- CreateTable
CREATE TABLE "ServiceSubSubCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceSubSubCategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "ServiceSubCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "duration" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subCategoryId" TEXT,
    "subSubCategoryId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Service_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "ServiceSubCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Service_subSubCategoryId_fkey" FOREIGN KEY ("subSubCategoryId") REFERENCES "ServiceSubSubCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Service" ("categoryId", "createdAt", "descKey", "duration", "id", "image", "isActive", "nameKey", "order", "price", "subCategoryId", "updatedAt") SELECT "categoryId", "createdAt", "descKey", "duration", "id", "image", "isActive", "nameKey", "order", "price", "subCategoryId", "updatedAt" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE INDEX "Service_categoryId_idx" ON "Service"("categoryId");
CREATE INDEX "Service_subCategoryId_idx" ON "Service"("subCategoryId");
CREATE INDEX "Service_subSubCategoryId_idx" ON "Service"("subSubCategoryId");
CREATE INDEX "Service_isActive_idx" ON "Service"("isActive");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ServiceSubSubCategory_subCategoryId_idx" ON "ServiceSubSubCategory"("subCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceSubSubCategory_subCategoryId_slug_key" ON "ServiceSubSubCategory"("subCategoryId", "slug");
