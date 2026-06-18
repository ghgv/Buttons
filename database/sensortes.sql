-- =====================================================
-- SENSORTES - ESTRUCTURA BASE DE DATOS
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS button_logs;
DROP TABLE IF EXISTS counter_logs;
DROP TABLE IF EXISTS button_box_1;
DROP TABLE IF EXISTS counters_1;
DROP TABLE IF EXISTS bathrooms;
DROP TABLE IF EXISTS levels;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sedes;
DROP TABLE IF EXISTS clients;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- CLIENTES
-- =====================================================

CREATE TABLE clients (
    id INT NOT NULL AUTO_INCREMENT,
    nit INT DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    lat FLOAT DEFAULT NULL,
    lon FLOAT DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- USUARIOS
-- =====================================================

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    client_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('nubeware_admin', 'client_admin', 'supervisor') NOT NULL,
    is_active TINYINT(1) DEFAULT '1',
    PRIMARY KEY (id),
    UNIQUE KEY email (email),
    KEY client_id (client_id),
    CONSTRAINT users_ibfk_1 FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- PERSONAL
-- =====================================================

CREATE TABLE staff (
    id INT NOT NULL AUTO_INCREMENT,
    client_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    is_active TINYINT(1) DEFAULT '1',
    PRIMARY KEY (id),
    KEY client_id (client_id),
    CONSTRAINT staff_ibfk_1 FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- SEDES
-- =====================================================

CREATE TABLE sedes (
    id INT NOT NULL AUTO_INCREMENT,
    client_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY ix_sedes_id (id),
    KEY client_id (client_id),
    CONSTRAINT sedes_ibfk_1 FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- NIVELES
-- =====================================================

CREATE TABLE levels (
    id INT NOT NULL AUTO_INCREMENT,
    sede_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    floor INT NOT NULL,
    PRIMARY KEY (id),
    KEY ix_levels_sede_id (sede_id),
    CONSTRAINT fk_levels_sede FOREIGN KEY (sede_id) REFERENCES sedes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- BAÑOS
-- =====================================================

CREATE TABLE bathrooms (
    id INT NOT NULL AUTO_INCREMENT,
    level_id INT NOT NULL,
    gender ENUM('men', 'women', 'mixed', 'disabled') NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    KEY level_id (level_id),
    CONSTRAINT bathrooms_ibfk_1 FOREIGN KEY (level_id) REFERENCES levels (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- CONTADORES
-- =====================================================

CREATE TABLE counters_1 (
    id INT NOT NULL AUTO_INCREMENT,
    serie INT NOT NULL,
    bathroom_id INT NOT NULL,
    install_time DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_counters_serie (serie),
    KEY bathroom_id (bathroom_id),
    CONSTRAINT counters_1_ibfk_1 FOREIGN KEY (bathroom_id) REFERENCES bathrooms (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE counter_logs (
    id INT NOT NULL AUTO_INCREMENT,
    create_time DATETIME DEFAULT NULL,
    counter_id INT DEFAULT NULL,         
    bathroom_id INT DEFAULT NULL,        
    amount INT DEFAULT NULL,
    PRIMARY KEY (id),
    KEY fk_counter_logs_counter (counter_id),
    KEY ix_counter_logs_bathroom_id (bathroom_id),
   
    CONSTRAINT fk_counter_logs_counter FOREIGN KEY (counter_id) REFERENCES counters_1 (id) ON DELETE SET NULL,
    CONSTRAINT fk_counter_logs_bathroom FOREIGN KEY (bathroom_id) REFERENCES bathrooms (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- BOTONERAS
-- =====================================================

CREATE TABLE button_box_1 (
    id INT NOT NULL AUTO_INCREMENT,
    serie INT NOT NULL,
    bathroom_id INT NOT NULL,
    install_time DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_button_box_serie (serie),
    KEY bathroom_id (bathroom_id),
    CONSTRAINT button_box_1_ibfk_1 FOREIGN KEY (bathroom_id) REFERENCES bathrooms (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE button_logs (
    id INT NOT NULL AUTO_INCREMENT,
    button_box_id INT DEFAULT NULL,      
    bathroom_id INT DEFAULT NULL,        
    letter VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL,
    create_time DATETIME NOT NULL,
    PRIMARY KEY (id),
    KEY ix_button_logs_button_box_id (button_box_id),
    KEY ix_button_logs_bathroom_id (bathroom_id),
    CONSTRAINT fk_button_logs_button_box FOREIGN KEY (button_box_id) REFERENCES button_box_1 (id) ON DELETE SET NULL,
    CONSTRAINT fk_button_logs_bathroom FOREIGN KEY (bathroom_id) REFERENCES bathrooms (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- ALERTAS
-- =====================================================

CREATE TABLE alerts (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) DEFAULT NULL,
    button_box_id INT DEFAULT NULL,     -- Cambiado de serie a ID relacional
    interaction_type VARCHAR(255) DEFAULT NULL,
    status ENUM('pending', 'resolved', 'ignored') DEFAULT NULL,
    create_time DATETIME DEFAULT NULL,
    PRIMARY KEY (id),
    KEY ix_alerts_button_box_id (button_box_id),
    CONSTRAINT fk_alerts_button_box FOREIGN KEY (button_box_id) REFERENCES button_box_1 (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;