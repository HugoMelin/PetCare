/*
  Warnings:

  - The primary key for the `DewormingSchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `dogId` on the `DewormingSchedule` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `DewormingSchedule` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Dog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Dog` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `NotificationLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `dogId` on the `NotificationLog` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `NotificationLog` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `WeightEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `dogId` on the `WeightEntry` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `WeightEntry` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DewormingSchedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dogId" INTEGER NOT NULL,
    "lastDoseDate" DATETIME NOT NULL,
    "frequencyDays" INTEGER NOT NULL,
    "nextDoseDate" DATETIME NOT NULL,
    CONSTRAINT "DewormingSchedule_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DewormingSchedule" ("dogId", "frequencyDays", "id", "lastDoseDate", "nextDoseDate") SELECT "dogId", "frequencyDays", "id", "lastDoseDate", "nextDoseDate" FROM "DewormingSchedule";
DROP TABLE "DewormingSchedule";
ALTER TABLE "new_DewormingSchedule" RENAME TO "DewormingSchedule";
CREATE TABLE "new_Dog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "birthdate" DATETIME,
    "breed" TEXT
);
INSERT INTO "new_Dog" ("birthdate", "breed", "id", "name") SELECT "birthdate", "breed", "id", "name" FROM "Dog";
DROP TABLE "Dog";
ALTER TABLE "new_Dog" RENAME TO "Dog";
CREATE TABLE "new_NotificationLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "dogId" INTEGER NOT NULL,
    "sendAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotificationLog_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_NotificationLog" ("dogId", "id", "message", "sendAt", "type") SELECT "dogId", "id", "message", "sendAt", "type" FROM "NotificationLog";
DROP TABLE "NotificationLog";
ALTER TABLE "new_NotificationLog" RENAME TO "NotificationLog";
CREATE TABLE "new_WeightEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dogId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "weight" REAL NOT NULL,
    CONSTRAINT "WeightEntry_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WeightEntry" ("date", "dogId", "id", "weight") SELECT "date", "dogId", "id", "weight" FROM "WeightEntry";
DROP TABLE "WeightEntry";
ALTER TABLE "new_WeightEntry" RENAME TO "WeightEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
