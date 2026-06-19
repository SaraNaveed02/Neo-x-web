-- ============================================================
-- NEXURA DATABASE — phpMyAdmin / MySQL import
-- Import: phpMyAdmin → Import → Choose this file → Go
-- Admin login: username = admin  |  password = admin123
-- ============================================================

CREATE DATABASE IF NOT EXISTS nexura_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nexura_db;

-- Drop old tables (fresh install)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS login_history;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS dashboard_stats;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NULL,
    google_id VARCHAR(255) NULL,
    role ENUM('admin', 'client') DEFAULT 'client',
    is_active TINYINT(1) DEFAULT 1,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- MESSAGES
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- LOGIN HISTORY
CREATE TABLE login_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    email VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    login_type ENUM('client', 'admin') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_login_user (user_id),
    INDEX idx_login_created (created_at),
    CONSTRAINT fk_login_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ACTIVITY LOG
CREATE TABLE activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_type ENUM('signup', 'login', 'message') NOT NULL,
    user_id INT NULL,
    reference_id INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    meta JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_created (created_at),
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DASHBOARD STATS
CREATE TABLE dashboard_stats (
    stat_key VARCHAR(50) PRIMARY KEY,
    stat_value BIGINT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SERVICES
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    icon VARCHAR(255) NULL,
    slug VARCHAR(150) UNIQUE NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SETTINGS
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NULL,
    setting_group VARCHAR(50) DEFAULT 'general',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ADMIN USER (username: admin | password: admin123)
INSERT INTO users (username, name, email, password, role) VALUES
('admin', 'Admin', 'admin@example.com', '$2y$10$j.UiuQW5Clh66L/pEg35b.nnlEB004LvobhhzIr4ZozF.35NRBpbK', 'admin');

-- SITE SETTINGS
INSERT INTO settings (setting_key, setting_value, setting_group) VALUES
('site_name', 'Nexura', 'general'),
('site_tagline', 'Premium Software Agency', 'general'),
('contact_email', 'hello@nexura-agency.com', 'contact'),
('contact_phone', '+1 (555) 010-0100', 'contact'),
('contact_address', '2211 Innovation Way, San Francisco, CA', 'contact'),
('contact_response_time', 'Within 1 business day', 'contact'),
('social_linkedin', 'https://linkedin.com/company/nexura', 'social'),
('social_twitter', 'https://twitter.com/nexura', 'social'),
('maintenance_mode', '0', 'system');

-- DASHBOARD STATS
INSERT INTO dashboard_stats (stat_key, stat_value) VALUES
('total_users', 1),
('total_messages', 0),
('total_logins', 0);

-- SAMPLE SERVICES
INSERT INTO services (name, description, icon, slug) VALUES
('Web Applications', 'Design-driven web platforms that scale.', 'fa-code', 'web'),
('Mobile Products', 'Native and cross-platform mobile apps.', 'fa-mobile-alt', 'mobile'),
('AI & Automation', 'Intelligent workflow solutions.', 'fa-robot', 'ai'),
('Cloud Engineering', 'DevOps and cloud infrastructure.', 'fa-cloud', 'cloud');

-- DONE
SELECT 'Database ready! Admin: admin / admin123' AS status;
