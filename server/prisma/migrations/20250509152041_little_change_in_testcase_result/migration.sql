/*
  Warnings:

  - You are about to drop the column `stdOut` on the `TestCaseResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TestCaseResult" DROP COLUMN "stdOut",
ADD COLUMN     "stdout" TEXT;
