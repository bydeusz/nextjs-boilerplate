/*
  Warnings:

  - You are about to drop the column `OrganisationId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_OrganisationId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "OrganisationId",
ADD COLUMN     "organisationId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
