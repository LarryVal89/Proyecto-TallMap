/*
  Warnings:

  - You are about to drop the column `tipoServicio` on the `cita` table. All the data in the column will be lost.
  - You are about to alter the column `rol` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.
  - Added the required column `servicioId` to the `Cita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cita` DROP COLUMN `tipoServicio`,
    ADD COLUMN `servicioId` INTEGER NOT NULL,
    MODIFY `descripcion` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `usuario` MODIFY `rol` ENUM('ADMIN', 'USUARIO', 'TALLER') NOT NULL DEFAULT 'USUARIO',
    MODIFY `telefono` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `Servicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
