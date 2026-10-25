/*
  Warnings:

  - The primary key for the `org_members` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "org_members" DROP CONSTRAINT "org_members_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "org_members_pkey" PRIMARY KEY ("id");
