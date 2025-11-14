/*
  Warnings:

  - Added the required column `updatedAt` to the `payment_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_transactions" ADD COLUMN     "gatewayResponse" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'AGUARDANDO';
