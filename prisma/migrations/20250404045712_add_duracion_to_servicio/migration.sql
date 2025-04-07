/*
  Warnings:

  - Added the required column `duracion` to the `Servicio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicio` ADD COLUMN `duracion` INTEGER NOT NULL;
