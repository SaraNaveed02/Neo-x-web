-- ============================================================
-- NEXURA — COMPLETE DATABASE SCHEMA (Production-ready)
-- File: backend/database/nexura_complete.sql
--
-- Import: phpMyAdmin OR http://localhost/time/backend/install.php
-- Default admin: username = admin  |  password = admin123 (bcrypt hash)
-- ============================================================

CREATE DATABASE IF NOT EXISTS nexura_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE nexura_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS mail_messages;
DROP TABLE IF EXISTS microsoft_connections;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS login_history;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS site_stats;
DROP TABLE IF EXISTS dashboard_stats;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- USERS (authentication + roles)
-- password column stores bcrypt hash ONLY (never plain text)
-- ------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NULL COMMENT 'bcrypt hash',
    role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    google_id VARCHAR(255) NULL,
    github_id VARCHAR(255) NULL,
    facebook_id VARCHAR(255) NULL,
    instagram_id VARCHAR(255) NULL,
    linkedin_id VARCHAR(255) NULL,
    avatar_url VARCHAR(500) NULL,
    auth_provider VARCHAR(30) NULL DEFAULT 'email',
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_users_email (email),
    UNIQUE KEY uq_users_username (username),
    INDEX idx_users_role (role),
    INDEX idx_users_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- USER SESSIONS (server-side session tracking)
-- ------------------------------------------------------------
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_session_token (session_token),
    INDEX idx_session_user (user_id),
    INDEX idx_session_expires (expires_at),
    CONSTRAINT fk_sessions_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- CONTACT MESSAGES
-- ------------------------------------------------------------
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_messages_read (is_read),
    INDEX idx_messages_created (created_at),
    INDEX idx_messages_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- LOGIN HISTORY (audit trail)
-- ------------------------------------------------------------
CREATE TABLE login_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    email VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    login_type ENUM('client', 'admin') NOT NULL DEFAULT 'client',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_login_user (user_id),
    INDEX idx_login_created (created_at),
    INDEX idx_login_email (email),
    CONSTRAINT fk_login_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- ACTIVITY LOG
-- ------------------------------------------------------------
CREATE TABLE activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_type ENUM('signup', 'login', 'message', 'logout') NOT NULL,
    user_id INT NULL,
    reference_id INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    meta JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_user (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_activity_created (created_at),
    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- SITE / DASHBOARD STATS
-- ------------------------------------------------------------
CREATE TABLE site_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_key VARCHAR(80) NOT NULL,
    stat_value VARCHAR(50) NOT NULL DEFAULT '0',
    stat_label VARCHAR(150) NOT NULL,
    page_slug VARCHAR(80) NOT NULL DEFAULT 'global',
    sort_order INT NOT NULL DEFAULT 0,
    is_computed TINYINT(1) NOT NULL DEFAULT 0,
    compute_type VARCHAR(50) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_site_stats_key (stat_key),
    INDEX idx_site_stats_page (page_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE dashboard_stats (
    stat_key VARCHAR(50) NOT NULL PRIMARY KEY,
    stat_value BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- SERVICES
-- ------------------------------------------------------------
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    icon VARCHAR(255) NULL,
    slug VARCHAR(150) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_services_slug (slug),
    INDEX idx_services_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- APP SETTINGS (key-value)
-- ------------------------------------------------------------
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT NULL,
    setting_group VARCHAR(50) NOT NULL DEFAULT 'general',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_settings_key (setting_key),
    INDEX idx_settings_group (setting_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- MICROSOFT 365 OAUTH (encrypted tokens)
-- ------------------------------------------------------------
CREATE TABLE microsoft_connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    microsoft_user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NULL,
    access_token_enc TEXT NOT NULL,
    refresh_token_enc TEXT NULL,
    token_expires_at DATETIME NULL,
    scopes TEXT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_sync_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_ms_user (user_id),
    INDEX idx_ms_email (email),
    CONSTRAINT fk_ms_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE mail_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    connection_id INT NOT NULL,
    graph_message_id VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NULL,
    from_name VARCHAR(255) NULL,
    from_email VARCHAR(255) NULL,
    to_recipients TEXT NULL,
    body_preview TEXT NULL,
    body_html MEDIUMTEXT NULL,
    body_text MEDIUMTEXT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    has_attachments TINYINT(1) NOT NULL DEFAULT 0,
    received_at DATETIME NULL,
    synced_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_graph_msg (connection_id, graph_message_id),
    INDEX idx_mail_received (received_at),
    INDEX idx_mail_connection (connection_id),
    CONSTRAINT fk_mail_connection
        FOREIGN KEY (connection_id) REFERENCES microsoft_connections(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default admin (password: admin123) — bcrypt hash via PHP password_hash()
INSERT INTO users (username, name, email, password, role, is_active, auth_provider) VALUES
(
    'admin',
    'Admin',
    'admin@example.com',
    '$2y$10$j.UiuQW5Clh66L/pEg35b.nnlEB004LvobhhzIr4ZozF.35NRBpbK',
    'admin',
    1,
    'email'
);

INSERT INTO settings (setting_key, setting_value, setting_group) VALUES
('site_name', 'NEXURA', 'general'),
('site_tagline', 'Web Development & Digital Marketing', 'general'),
('contact_email', 'supportneoxweb@gmail.com', 'contact'),
('contact_phone', '+92 314 0666734', 'contact'),
('contact_address', 'Lahore, Pakistan', 'contact'),
('contact_response_time', 'Within 1 business day', 'contact'),
('maintenance_mode', '0', 'system'),
('support_coverage', '24/7', 'general');

INSERT INTO dashboard_stats (stat_key, stat_value) VALUES
('total_users', 1),
('total_messages', 0),
('total_logins', 0);

INSERT INTO services (name, description, icon, slug, is_active) VALUES
('Web Development', 'Custom websites and web apps', 'fa-code', 'web-development', 1),
('SEO', 'Search engine optimization', 'fa-search', 'seo', 1),
('Digital Marketing', 'Social media and paid ads', 'fa-bullhorn', 'digital-marketing', 1),
('Graphic Design', 'Branding and creative design', 'fa-palette', 'graphic-design', 1);

INSERT INTO site_stats (stat_key, stat_value, stat_label, page_slug, sort_order, is_computed, compute_type) VALUES
('home_clients', '0', 'Registered clients', 'home', 1, 1, 'clients_count'),
('home_services', '0', 'Active services', 'home', 2, 1, 'services_count'),
('global_support', '24/7', 'Support available', 'global', 1, 0, NULL);

SELECT 'Database installed successfully. Admin login: admin / admin123' AS installation_status;
