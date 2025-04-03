/*
  Warnings:

  - You are about to drop the column `showVAT` on the `InvoiceStyles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InvoiceStyles" DROP COLUMN "showVAT",
ADD COLUMN     "taxType" TEXT NOT NULL DEFAULT 'Tax';
