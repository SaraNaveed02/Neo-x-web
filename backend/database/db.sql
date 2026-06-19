-- ============================================================
-- NEXURA — LEGACY DATABASE FILE
-- For full schema use: backend/database/nexura_complete.sql
-- Admin: username = admin  |  password = admin123 (bcrypt)
-- ============================================================

CREATE DATABASE IF NOT EXISTS nexura_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nexura_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS login_history;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS site_stats;
DROP TABLE IF EXISTS dashboard_stats;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

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

CREATE TABLE login_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    email VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    login_type ENUM('client', 'admin') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_login_created (created_at),
    CONSTRAINT fk_lh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_type ENUM('signup', 'login', 'message') NOT NULL,
    user_id INT NULL,
    reference_id INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    meta JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_act_created (created_at),
    CONSTRAINT fk_act_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE site_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_key VARCHAR(80) UNIQUE NOT NULL,
    stat_value VARCHAR(50) DEFAULT '0',
    stat_label VARCHAR(150) NOT NULL,
    page_slug VARCHAR(80) DEFAULT 'global',
    sort_order INT DEFAULT 0,
    is_computed TINYINT(1) DEFAULT 0,
    compute_type VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dashboard_stats (
    stat_key VARCHAR(50) PRIMARY KEY,
    stat_value BIGINT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NULL,
    setting_group VARCHAR(50) DEFAULT 'general',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- password: admin123
INSERT INTO users (username, name, email, password, role) VALUES
('admin', 'Admin', 'admin@example.com', '$2y$10$j.UiuQW5Clh66L/pEg35b.nnlEB004LvobhhzIr4ZozF.35NRBpbK', 'admin');

INSERT INTO settings (setting_key, setting_value, setting_group) VALUES
('site_name', 'Nexura', 'general'),
('contact_email', 'hello@nexura-agency.com', 'contact'),
('contact_phone', '+1 (555) 010-0100', 'contact'),
('contact_address', '2211 Innovation Way, San Francisco, CA', 'contact'),
('contact_response_time', 'Within 1 business day', 'contact'),
('support_coverage', '24/7', 'general');

INSERT INTO site_stats (stat_key, stat_value, stat_label, page_slug, sort_order, is_computed, compute_type) VALUES
('home_products', '', 'Digital products launched', 'home', 1, 1, 'services_count'),
('home_clients', '', 'Registered clients', 'home', 2, 1, 'clients_count'),
('home_support', '24/7', 'Product support and maintenance', 'home', 3, 0, NULL),
('login_products', '', 'Products launched', 'login', 1, 1, 'services_count'),
('login_retention', '', 'Client retention', 'login', 2, 1, 'client_retention'),
('login_support', '24/7', 'Support coverage', 'login', 3, 0, NULL),
('about_clients', '', 'Registered clients', 'about', 1, 1, 'clients_count'),
('about_retention', '', 'Client retention rate', 'about', 2, 1, 'client_retention'),
('about_services', '', 'Active services', 'about', 3, 1, 'services_count'),
('global_services', '', 'Active services', 'global', 1, 1, 'services_count'),
('global_clients', '', 'Registered clients', 'global', 2, 1, 'clients_count'),
('global_messages', '', 'Client inquiries', 'global', 3, 1, 'messages_count'),
('global_support', '', 'Support available', 'global', 4, 1, 'support_coverage');

INSERT INTO dashboard_stats (stat_key, stat_value) VALUES
('total_users', 1),
('total_messages', 0),
('total_logins', 0);

INSERT INTO services (name, description, icon, slug) VALUES
('Web Applications', 'Web platforms', 'fa-code', 'web'),
('Mobile Products', 'Mobile apps', 'fa-mobile-alt', 'mobile'),
('AI & Automation', 'AI solutions', 'fa-robot', 'ai'),
('Cloud Engineering', 'Cloud & DevOps', 'fa-cloud', 'cloud');

SELECT 'OK — Admin login: admin / admin123' AS result;
