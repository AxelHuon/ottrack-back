/*
  Warnings:

  - Made the column `drinkTypeId` on table `Drink` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Drink" ALTER COLUMN "drinkTypeId" SET NOT NULL;
