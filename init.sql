CREATE DATABASE IF NOT EXISTS contactos_db;
USE contactos_db;

CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    direccion TEXT,
    foto_url VARCHAR(255) DEFAULT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de prueba
INSERT INTO contactos (nombre, apellido, telefono, email, direccion) VALUES 
('Juan', 'Pérez', '555-1234', 'juan.perez@example.com', 'Calle Falsa 123'),
('María', 'Gómez', '555-5678', 'maria.gomez@example.com', 'Avenida Siempreviva 742'),
('Carlos', 'López', '555-8765', 'carlos.lopez@example.com', 'Boulevard de los Sueños 99');
