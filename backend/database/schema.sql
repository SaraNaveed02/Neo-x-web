/*
    FILE: database/schema.sql
    PURPOSE: Nexura complete application schema
*/

CREATE DATABASE IF NOT EXISTS nexura_db;
USE nexura_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NULL,
    google_id VARCHAR(255) NULL,
    role ENUM('admin', 'client') DEFAULT 'client',
    is_active TINYINT(1) DEFAULT 1,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS login_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    email VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    login_type ENUM('client', 'admin') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_login_user (user_id),
    INDEX idx_login_created (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_type ENUM('signup', 'login', 'message') NOT NULL,
    user_id INT NULL,
    reference_id INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    meta JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_created (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS dashboard_stats (
    stat_key VARCHAR(50) PRIMARY KEY,
    stat_value BIGINT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    icon VARCHAR(255) NULL,
    slug VARCHAR(150) UNIQUE NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NULL,
    setting_group VARCHAR(50) DEFAULT 'general',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password, role)
VALUES (
    'Admin User',
    'admin@example.com',
    '$2y$10$3VHCLNmObzvMyZJK07k4vuzyNIFKVQseJUaIsfSmkTjSRo5jdSXJ.',
    'admin'
)
ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role);

INSERT INTO settings (setting_key, setting_value, setting_group) VALUES
('site_name', 'Nexura', 'general'),
('site_tagline', 'Premium Software Agency', 'general'),
('contact_email', 'hello@nexura-agency.com', 'contact'),
('contact_phone', '+1 (555) 010-0100', 'contact'),
('contact_address', '2211 Innovation Way, San Francisco, CA', 'contact'),
('contact_response_time', 'Within 1 business day', 'contact'),
('social_linkedin', 'https://linkedin.com/company/nexura', 'social'),
('social_twitter', 'https://twitter.com/nexura', 'social'),
('maintenance_mode', '0', 'system')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

INSERT INTO dashboard_stats (stat_key, stat_value) VALUES
('total_users', 0),
('total_messages', 0),
('total_logins', 0)
ON DUPLICATE KEY UPDATE stat_key = VALUES(stat_key);
