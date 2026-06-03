-- ==============================================================================
-- 1. LIMPIEZA PREVIA (Respeta el orden de las llaves foráneas para no dar error)
-- ==============================================================================
DROP TABLE IF EXISTS `button_logs`;
DROP TABLE IF EXISTS `counter_logs`;
DROP TABLE IF EXISTS `button_box_1`;
DROP TABLE IF EXISTS `counters_1`;
DROP TABLE IF EXISTS `bathrooms`;
DROP TABLE IF EXISTS `levels`;
DROP TABLE IF EXISTS `sedes`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `clients`;

-- ==============================================================================
-- 2. CREACIÓN DE TABLAS PRINCIPALES (Jerarquía Superior)
-- ==============================================================================

CREATE TABLE `clients` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nit` int DEFAULT NULL,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) DEFAULT NULL,
    `address` varchar(255) DEFAULT NULL,
    `lat` float DEFAULT NULL,
    `lon` float DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `client_id` int NOT NULL,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    `role` enum('nubeware_admin', 'client_admin', 'supervisor') NOT NULL,
    `is_active` tinyint(1) DEFAULT '1',
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`),
    KEY `client_id` (`client_id`),
    CONSTRAINT `users_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `staff` (
    `id` int NOT NULL AUTO_INCREMENT,
    `client_id` int NOT NULL,
    `name` varchar(255) NOT NULL,
    `role` varchar(100) NOT NULL,
    `is_active` tinyint(1) DEFAULT '1',
    PRIMARY KEY (`id`),
    KEY `client_id` (`client_id`),
    CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sedes` (
    `id` int NOT NULL AUTO_INCREMENT,
    `client_id` int NOT NULL,
    `name` varchar(255) NOT NULL,
    `address` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `client_id` (`client_id`),
    CONSTRAINT `sedes_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==============================================================================
-- 3. CREACIÓN DE INFRAESTRUCTURA FÍSICA (Edificios y Baños)
-- ==============================================================================

CREATE TABLE `levels` (
    `id` int NOT NULL AUTO_INCREMENT,
    `sede_id` int NOT NULL,
    `name` varchar(100) NOT NULL,
    `floor` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `sede_id` (`sede_id`),
    CONSTRAINT `levels_ibfk_1` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `bathrooms` (
    `id` int NOT NULL AUTO_INCREMENT,
    `level_id` int NOT NULL,
    `gender` enum('men', 'women', 'mixed', 'disabled') NOT NULL,
    `description` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `level_id` (`level_id`),
    CONSTRAINT `bathrooms_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==============================================================================
-- 4. REGISTRO DE DISPOSITIVOS IoT
-- ==============================================================================

CREATE TABLE `button_box_1` (
    `serie` int NOT NULL,
    `bathroom_id` int NOT NULL,
    `install_time` datetime NOT NULL,
    PRIMARY KEY (`serie`),
    KEY `bathroom_id` (`bathroom_id`),
    CONSTRAINT `button_box_1_ibfk_1` FOREIGN KEY (`bathroom_id`) REFERENCES `bathrooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `counters_1` (
    `serie` int NOT NULL,
    `bathroom_id` int NOT NULL,
    `install_time` datetime NOT NULL,
    PRIMARY KEY (`serie`),
    KEY `bathroom_id` (`bathroom_id`),
    CONSTRAINT `counters_1_ibfk_1` FOREIGN KEY (`bathroom_id`) REFERENCES `bathrooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==============================================================================
-- 5. TABLAS DE MÉTRICAS Y LOGS SEPARADOS
-- ==============================================================================

CREATE TABLE `button_logs` (
    `id` int NOT NULL AUTO_INCREMENT,
    `button_box_serie` int NOT NULL,
    `letter` varchar(255) NOT NULL,
    `label` varchar(255) NOT NULL,
    `create_time` datetime NOT NULL,
    PRIMARY KEY (`id`),
    KEY `ix_botonera_serie` (`button_box_serie`),
    CONSTRAINT `button_logs_ibfk_1` FOREIGN KEY (`button_box_serie`) REFERENCES `button_box_1` (`serie`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `counter_logs` (
    `id` int NOT NULL AUTO_INCREMENT,
    `create_time` datetime DEFAULT NULL,
    `counter_serie` int DEFAULT NULL,
    `amount` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `counter_serie` (`counter_serie`),
    CONSTRAINT `counter_logs_ibfk_1` FOREIGN KEY (`counter_serie`) REFERENCES `counters_1` (`serie`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;