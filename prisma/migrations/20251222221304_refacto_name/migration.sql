/*
  Warnings:

  - You are about to drop the column `dogId` on the `WeightEntry` table. All the data in the column will be lost.
  - You are about to drop the `DewormingSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DogOwners` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `petId` to the `WeightEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
SET @we_fk := (
    SELECT CONSTRAINT_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'WeightEntry'
      AND COLUMN_NAME = 'dogId'
      AND REFERENCED_TABLE_NAME IS NOT NULL
    LIMIT 1
);
SET @we_fk_sql := IF(
    @we_fk IS NULL,
    'SELECT 1',
    CONCAT('ALTER TABLE `WeightEntry` DROP FOREIGN KEY `', @we_fk, '`')
);
PREPARE we_fk_stmt FROM @we_fk_sql;
EXECUTE we_fk_stmt;
DEALLOCATE PREPARE we_fk_stmt;

-- DropIndex
SET @we_idx := (
    SELECT INDEX_NAME
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'WeightEntry'
      AND INDEX_NAME = 'WeightEntry_dogId_fkey'
    LIMIT 1
);
SET @we_idx_sql := IF(
    @we_idx IS NULL,
    'SELECT 1',
    'DROP INDEX `WeightEntry_dogId_fkey` ON `WeightEntry`'
);
PREPARE we_idx_stmt FROM @we_idx_sql;
EXECUTE we_idx_stmt;
DEALLOCATE PREPARE we_idx_stmt;

-- AlterTable
SET @we_has_dogId := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'WeightEntry'
      AND COLUMN_NAME = 'dogId'
);
SET @we_has_petId := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'WeightEntry'
      AND COLUMN_NAME = 'petId'
);
SET @we_alter_sql := CONCAT(
    'ALTER TABLE `WeightEntry` ',
    IF(@we_has_dogId > 0, 'DROP COLUMN `dogId`', ''),
    IF(@we_has_dogId > 0 AND @we_has_petId = 0, ', ', ''),
    IF(@we_has_petId = 0, 'ADD COLUMN `petId` INTEGER NOT NULL', '')
);
SET @we_alter_sql := IF(
    @we_has_dogId = 0 AND @we_has_petId > 0,
    'SELECT 1',
    @we_alter_sql
);
PREPARE we_alter_stmt FROM @we_alter_sql;
EXECUTE we_alter_stmt;
DEALLOCATE PREPARE we_alter_stmt;

-- DropTable
DROP TABLE IF EXISTS `DewormingSchedule`;

-- DropTable
DROP TABLE IF EXISTS `Dog`;

-- DropTable
DROP TABLE IF EXISTS `NotificationLog`;

-- DropTable
DROP TABLE IF EXISTS `_DogOwners`;

-- CreateTable
CREATE TABLE `Pet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'Chien',
    `birthdate` DATETIME(3) NULL,
    `breed` VARCHAR(191) NULL,
    `createdByUserId` VARCHAR(191) NOT NULL,

    INDEX `Pet_createdByUserId_fkey`(`createdByUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `petId` INTEGER NOT NULL,
    `medication` VARCHAR(191) NOT NULL,
    `lastDoseDate` DATETIME(3) NOT NULL,
    `frequencyDays` INTEGER NOT NULL,
    `nextDoseDate` DATETIME(3) NOT NULL,

    INDEX `Medication_petId_fkey`(`petId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicationNotification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `medicationId` INTEGER NOT NULL,
    `sendAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MedicationNotification_medicationId_fkey`(`medicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PetOwners` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PetOwners_AB_unique`(`A`, `B`),
    INDEX `_PetOwners_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `WeightEntry_petId_fkey` ON `WeightEntry`(`petId`);

-- AddForeignKey
ALTER TABLE `Pet` ADD CONSTRAINT `Pet_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeightEntry` ADD CONSTRAINT `WeightEntry_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medication` ADD CONSTRAINT `Medication_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicationNotification` ADD CONSTRAINT `MedicationNotification_medicationId_fkey` FOREIGN KEY (`medicationId`) REFERENCES `Medication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PetOwners` ADD CONSTRAINT `_PetOwners_A_fkey` FOREIGN KEY (`A`) REFERENCES `Pet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PetOwners` ADD CONSTRAINT `_PetOwners_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
