/*
  Warnings:

  - Added the required column `drinkTypeId` to the `Drink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drink" ADD COLUMN     "drinkTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "DrinkType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "DrinkType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DrinkType_name_key" ON "DrinkType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DrinkType_slug_key" ON "DrinkType"("slug");

-- AddForeignKey
ALTER TABLE "Drink" ADD CONSTRAINT "Drink_drinkTypeId_fkey" FOREIGN KEY ("drinkTypeId") REFERENCES "DrinkType"("id") ON DELETE CASCADE ON UPDATE CASCADE;


