/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "adminId" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_slug_key" ON "Room"("slug");
