-- ==========================================
-- StayLio Database Seed Data
-- ==========================================
-- This file is automatically executed by Spring Boot on startup
-- because spring.jpa.defer-datasource-initialization=true is set.

-- ==========================================
-- 1. Seed Admin User
-- ==========================================
INSERT INTO admins (name, email, phone, password, created_at, updated_at)
VALUES (
    'Admin User',
    'admin@staylio.com',
    '+1234567890',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', -- SHA-256 for 'admin123'
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE 
    password = VALUES(password),
    updated_at = NOW();

-- ==========================================
-- 2. Seed Guest User
-- ==========================================
-- Values adapted to match User.java entity requirements (firstName, lastName, etc.)
INSERT INTO users (first_name, last_name, name, email, password, phone, created_at, updated_at, is_email_verified)
VALUES (
    'Guest',
    'User',
    'Guest User',
    'guest@staylio.com',
    '$2a$10$dummyHashForGuestUser',
    '+00000000000',
    NOW(),
    NOW(),
    1
)
ON DUPLICATE KEY UPDATE name = VALUES(name);
