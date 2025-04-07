/*
  Warnings:

  - You are about to drop the column `servicioId` on the `cita` table. All the data in the column will be lost.
  - You are about to drop the column `duracion` on the `servicio` table. All the data in the column will be lost.
  - You are about to alter the column `rol` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.
  - Added the required column `descripcion` to the `Cita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoServicio` to the `Cita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehiculoId` to the `Cita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Taller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cita` DROP FOREIGN KEY `Cita_servicioId_fkey`;

-- AlterTable
ALTER TABLE `cita` DROP COLUMN `servicioId`,
    ADD COLUMN `descripcion` VARCHAR(191) NOT NULL,
    ADD COLUMN `tipoServicio` ENUM('MANTENIMIENTO', 'REPARACION', 'DIAGNOSTICO', 'OTRO') NOT NULL,
    ADD COLUMN `vehiculoId` INTEGER NOT NULL,
    MODIFY `estado` ENUM('PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA') NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE `resena` ADD COLUMN `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ALTER COLUMN `calificacion` DROP DEFAULT,
    MODIFY `comentario` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `servicio` DROP COLUMN `duracion`,
    MODIFY `descripcion` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `taller` ADD COLUMN `tipo` ENUM('AUTOS', 'MOTOS', 'AMBOS') NOT NULL,
    MODIFY `descripcion` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `telefono` VARCHAR(191) NOT NULL,
    MODIFY `rol` ENUM('ADMIN', 'CLIENTE') NOT NULL DEFAULT 'CLIENTE';

-- CreateTable
CREATE TABLE `Vehiculo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `marca` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `anio` INTEGER NOT NULL,
    `cilindraje` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `placa` VARCHAR(191) NULL,
    `usuarioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Foto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `tallerId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Foto` ADD CONSTRAINT `Foto_tallerId_fkey` FOREIGN KEY (`tallerId`) REFERENCES `Taller`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
