-- DropForeignKey
ALTER TABLE `Medication` DROP FOREIGN KEY `Medication_petId_fkey`;

-- DropForeignKey
ALTER TABLE `MedicationNotification` DROP FOREIGN KEY `MedicationNotification_medicationId_fkey`;

-- DropForeignKey
ALTER TABLE `WeightEntry` DROP FOREIGN KEY `WeightEntry_petId_fkey`;

-- AlterTable
ALTER TABLE `MedicationNotification` MODIFY `medicationId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `WeightEntry` ADD CONSTRAINT `WeightEntry_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medication` ADD CONSTRAINT `Medication_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicationNotification` ADD CONSTRAINT `MedicationNotification_medicationId_fkey` FOREIGN KEY (`medicationId`) REFERENCES `Medication`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
