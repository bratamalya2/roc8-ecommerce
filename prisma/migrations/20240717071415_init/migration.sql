/*
  Warnings:

  - The primary key for the `CategoriesOfUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,categoryId]` on the table `CategoriesOfUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Categories_name_key";

-- AlterTable
ALTER TABLE "CategoriesOfUser" DROP CONSTRAINT "CategoriesOfUser_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "CategoriesOfUser_userId_categoryId_key" ON "CategoriesOfUser"("userId", "categoryId");
