-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS tallmap;
USE tallmap;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'USUARIO', 'TALLER') DEFAULT 'USUARIO',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de talleres
CREATE TABLE IF NOT EXISTS Taller (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    direccion VARCHAR(255) NOT NULL,
    latitud FLOAT NOT NULL,
    longitud FLOAT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    horario VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de servicios
CREATE TABLE IF NOT EXISTS Servicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio FLOAT NOT NULL,
    duracion INT NOT NULL,
    tallerId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tallerId) REFERENCES Taller(id) ON DELETE CASCADE
);

-- Crear tabla de citas
CREATE TABLE IF NOT EXISTS Cita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    estado ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA') DEFAULT 'PENDIENTE',
    usuarioId INT NOT NULL,
    tallerId INT NOT NULL,
    servicioId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (tallerId) REFERENCES Taller(id) ON DELETE CASCADE,
    FOREIGN KEY (servicioId) REFERENCES Servicio(id) ON DELETE CASCADE
);

-- Crear tabla de reseñas
CREATE TABLE IF NOT EXISTS Resena (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calificacion INT DEFAULT 5,
    comentario TEXT,
    usuarioId INT NOT NULL,
    tallerId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (tallerId) REFERENCES Taller(id) ON DELETE CASCADE
);

-- Insertar usuarios de ejemplo (todos con contraseña: password123)
INSERT INTO Usuario (email, nombre, password, rol) VALUES 
('admin@tallmap.com', 'Administrador', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.U/BOkNGx1k3L1Pj9qN1pGQJ9QZqGqHy', 'ADMIN'),
('juan.perez@email.com', 'Juan Pérez', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.U/BOkNGx1k3L1Pj9qN1pGQJ9QZqGqHy', 'USUARIO'),
('maria.garcia@email.com', 'María García', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.U/BOkNGx1k3L1Pj9qN1pGQJ9QZqGqHy', 'USUARIO'),
('carlos.lopez@email.com', 'Carlos López', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.U/BOkNGx1k3L1Pj9qN1pGQJ9QZqGqHy', 'USUARIO'),
('ana.martinez@email.com', 'Ana Martínez', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.U/BOkNGx1k3L1Pj9qN1pGQJ9QZqGqHy', 'USUARIO'),
('taller1@express.com', 'Taller Express', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.U/BOkNGx1k3L1Pj9qN1pGQJ9QZqGqHy', 'TALLER'),
('taller2@rapido.com', 'Auto Servicio', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.U/BOkNGx1k3L1Pj9qN1pGQJ9QZqGqHy', 'TALLER');

-- Insertar talleres de ejemplo en Cali
INSERT INTO Taller (nombre, descripcion, direccion, latitud, longitud, telefono, email, horario) VALUES 
('Taller Mecánico Express', 'Servicio completo de mecánica automotriz', 'Calle 15 # 23-45, Cali', 3.4516, -76.5320, '555-0123', 'express@taller.com', 'Lun-Sab 8:00-18:00'),
('Auto Servicio Rápido', 'Especialistas en diagnóstico computarizado', 'Av. 4N # 12-34, Cali', 3.4520, -76.5315, '555-0124', 'rapido@taller.com', 'Lun-Vie 9:00-19:00'),
('Taller El Experto', 'Expertos en motores y transmisiones', 'Calle 5 # 45-67, Cali', 3.4510, -76.5330, '555-0125', 'experto@taller.com', 'Lun-Sab 7:00-20:00'),
('Servicio Automotriz Pro', 'Servicio premium para autos de lujo', 'Av. 6N # 23-45, Cali', 3.4530, -76.5300, '555-0126', 'pro@taller.com', 'Lun-Dom 8:00-22:00'),
('Taller Express 24/7', 'Servicio de emergencia 24 horas', 'Calle 8 # 34-56, Cali', 3.4500, -76.5340, '555-0127', 'express24@taller.com', '24/7');

-- Insertar servicios de ejemplo
INSERT INTO Servicio (nombre, descripcion, precio, duracion, tallerId) VALUES 
('Cambio de aceite', 'Incluye filtro y lubricante premium', 350.00, 60, 1),
('Diagnóstico computarizado', 'Análisis completo del sistema', 500.00, 30, 1),
('Afinación general', 'Servicio completo de afinación', 1200.00, 120, 2),
('Cambio de frenos', 'Incluye pastillas y discos', 800.00, 90, 2),
('Reparación de motor', 'Diagnóstico y reparación completa', 2500.00, 240, 3),
('Cambio de transmisión', 'Incluye fluidos y filtros', 1800.00, 180, 3),
('Lavado premium', 'Lavado interior y exterior', 400.00, 45, 4),
('Pintura y carrocería', 'Servicio completo de pintura', 3000.00, 480, 4),
('Servicio de emergencia', 'Atención inmediata 24/7', 600.00, 60, 5),
('Grúa y auxilio', 'Servicio de grúa y auxilio vial', 450.00, 30, 5);

-- Insertar citas de ejemplo
INSERT INTO Cita (fecha, estado, usuarioId, tallerId, servicioId) VALUES 
('2024-04-01 10:00:00', 'COMPLETADA', 2, 1, 1),
('2024-04-02 14:30:00', 'CONFIRMADA', 3, 2, 3),
('2024-04-03 09:00:00', 'PENDIENTE', 4, 3, 5),
('2024-04-04 11:00:00', 'CONFIRMADA', 5, 4, 7),
('2024-04-05 16:00:00', 'PENDIENTE', 2, 5, 9),
('2024-04-06 13:00:00', 'CANCELADA', 3, 1, 2),
('2024-04-07 15:30:00', 'CONFIRMADA', 4, 2, 4),
('2024-04-08 10:00:00', 'PENDIENTE', 5, 3, 6),
('2024-04-09 12:00:00', 'CONFIRMADA', 2, 4, 8),
('2024-04-10 09:30:00', 'PENDIENTE', 3, 5, 10);

-- Insertar reseñas de ejemplo
INSERT INTO Resena (calificacion, comentario, usuarioId, tallerId) VALUES 
(5, 'Excelente servicio, muy profesionales', 2, 1),
(4, 'Buen servicio pero un poco caro', 3, 2),
(5, 'Muy satisfecho con la atención', 4, 3),
(3, 'El servicio fue regular', 5, 4),
(5, 'Servicio de emergencia muy rápido', 2, 5),
(4, 'Buen taller, volveré', 3, 1),
(5, 'Excelente atención y precios justos', 4, 2),
(4, 'Servicio eficiente y profesional', 5, 3),
(5, 'Muy buena atención al cliente', 2, 4),
(4, 'Buen servicio de emergencia', 3, 5); 