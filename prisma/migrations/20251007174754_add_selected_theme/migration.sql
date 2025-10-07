/*
  Warnings:

  - You are about to drop the column `endedAt` on the `PomodoroSession` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `PomodoroSession` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `PomodoroSession` table. All the data in the column will be lost.
  - You are about to drop the `_PomodoroSessionToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `PomodoroSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."PomodoroSession" DROP CONSTRAINT "PomodoroSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tag" DROP CONSTRAINT "Tag_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PomodoroSessionToTag" DROP CONSTRAINT "_PomodoroSessionToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PomodoroSessionToTag" DROP CONSTRAINT "_PomodoroSessionToTag_B_fkey";

-- DropIndex
DROP INDEX "public"."Tag_userId_name_key";

-- AlterTable
ALTER TABLE "public"."PomodoroSession" DROP COLUMN "endedAt",
DROP COLUMN "name",
DROP COLUMN "startedAt",
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "expectedCycles" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."UserProfile" ADD COLUMN     "selectedTheme" TEXT NOT NULL DEFAULT 'midnight';

-- DropTable
DROP TABLE "public"."_PomodoroSessionToTag";

-- CreateTable
CREATE TABLE "public"."_PomodoroTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PomodoroTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PomodoroTags_B_index" ON "public"."_PomodoroTags"("B");

-- AddForeignKey
ALTER TABLE "public"."PomodoroSession" ADD CONSTRAINT "PomodoroSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PomodoroTags" ADD CONSTRAINT "_PomodoroTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PomodoroSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PomodoroTags" ADD CONSTRAINT "_PomodoroTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
