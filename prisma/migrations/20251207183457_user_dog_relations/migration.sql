/*
  Warnings:

  - Added the required column `createdByUserId` to the `Dog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Dog` ADD COLUMN `createdByUserId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `_DogOwners` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DogOwners_AB_unique`(`A`, `B`),
    INDEX `_DogOwners_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Dog_createdByUserId_fkey` ON `Dog`(`createdByUserId`);

-- AddForeignKey
ALTER TABLE `Dog` ADD CONSTRAINT `Dog_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DogOwners` ADD CONSTRAINT `_DogOwners_A_fkey` FOREIGN KEY (`A`) REFERENCES `Dog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DogOwners` ADD CONSTRAINT `_DogOwners_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
