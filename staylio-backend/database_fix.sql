-- Database fix for the 'name' column issue
-- Run this script in your MySQL database to resolve the error

USE staylio_db;

-- Option 1: If the 'name' column should exist, make it nullable or add a default value
ALTER TABLE users MODIFY COLUMN name VARCHAR(255) NULL;

-- OR add a default value
-- ALTER TABLE users MODIFY COLUMN name VARCHAR(255) DEFAULT '';

-- Option 2: If the 'name' column should not exist, drop it
-- ALTER TABLE users DROP COLUMN name;

-- Option 3: If you want to start fresh, drop and recreate the table
-- (WARNING: This will delete all existing data)
-- DROP TABLE IF EXISTS users;

-- Verify the table structure
DESCRIBE users;

-- Check if there are any existing records
SELECT COUNT(*) FROM users;