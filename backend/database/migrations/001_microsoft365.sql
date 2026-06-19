-- Microsoft 365 OAuth integration tables
-- Run via: http://localhost/time/backend/database/setup.php

CREATE TABLE IF NOT EXISTS microsoft_connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    microsoft_user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NULL,
    access_token_enc TEXT NOT NULL,
    refresh_token_enc TEXT NULL,
    token_expires_at DATETIME NULL,
    scopes TEXT NULL,
    is_active TINYINT(1) DEFAULT 1,
    last_sync_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_ms_user (user_id),
    INDEX idx_ms_email (email)
);

CREATE TABLE IF NOT EXISTS mail_messages (
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
    is_read TINYINT(1) DEFAULT 0,
    has_attachments TINYINT(1) DEFAULT 0,
    received_at DATETIME NULL,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_graph_msg (connection_id, graph_message_id),
    INDEX idx_mail_received (received_at),
    INDEX idx_mail_connection (connection_id)
);
