/*
  Warnings:

  - Added the required column `medication` to the `DewormingSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DewormingSchedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dogId" INTEGER NOT NULL,
    "medication" TEXT NOT NULL,
    "lastDoseDate" DATETIME NOT NULL,
    "frequencyDays" INTEGER NOT NULL,
    "nextDoseDate" DATETIME NOT NULL,
    CONSTRAINT "DewormingSchedule_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DewormingSchedule" ("dogId", "frequencyDays", "id", "lastDoseDate", "nextDoseDate") SELECT "dogId", "frequencyDays", "id", "lastDoseDate", "nextDoseDate" FROM "DewormingSchedule";
DROP TABLE "DewormingSchedule";
ALTER TABLE "new_DewormingSchedule" RENAME TO "DewormingSchedule";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
