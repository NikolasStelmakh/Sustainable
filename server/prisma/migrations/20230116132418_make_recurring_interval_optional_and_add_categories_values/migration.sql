/*
  Warnings:

  - You are about to drop the column `end_date` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_recurring_interval_id_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "end_date",
ALTER COLUMN "recurring_interval_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_recurring_interval_id_fkey" FOREIGN KEY ("recurring_interval_id") REFERENCES "RecurringInterval"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add default interval data
INSERT INTO "Categorie" (
    id,
    title
)
VALUES
    (
        1,
        'Environment'
    ),
    (
        2,
        'Social'
    ),
    (
        3,
        'Governance'
    );
