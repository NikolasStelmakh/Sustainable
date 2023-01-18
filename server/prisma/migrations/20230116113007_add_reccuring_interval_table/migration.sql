/*
  Warnings:

  - You are about to drop the column `recurring_interval` on the `Task` table. All the data in the column will be lost.
  - Added the required column `recurring_interval_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "recurring_interval",
ADD COLUMN     "recurring_interval_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RecurringInterval" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RecurringInterval_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_recurring_interval_id_fkey" FOREIGN KEY ("recurring_interval_id") REFERENCES "RecurringInterval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add default interval data
INSERT INTO "RecurringInterval" (
    id,
    name
)
VALUES
    (
        1,
        'Biweekly'
    ),
    (
        2,
        'Monthly'
    ),
    (
        3,
        'Quarterly'
    ),
    (
        4,
        'Yearly'
    );
