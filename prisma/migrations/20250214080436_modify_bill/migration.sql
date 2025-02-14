/*
  Warnings:

  - You are about to drop the column `units` on the `Bill` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "units",
ADD COLUMN     "quantity" INTEGER NOT NULL;
