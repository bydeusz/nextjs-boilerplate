-- Create schemas for WordPress and Next.js app
-- This script runs automatically when MySQL container starts for the first time

-- Create WordPress database (Headless CMS)
CREATE DATABASE IF NOT EXISTS headless_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Next.js app database (Business App)
CREATE DATABASE IF NOT EXISTS business CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions to the app user for both databases
GRANT ALL PRIVILEGES ON headless_cms.* TO 'app_user'@'%';
GRANT ALL PRIVILEGES ON business.* TO 'app_user'@'%';
GRANT ALL PRIVILEGES ON headless_cms.* TO 'app_user'@'localhost';
GRANT ALL PRIVILEGES ON business.* TO 'app_user'@'localhost';

-- Flush privileges to ensure changes take effect
FLUSH PRIVILEGES;

-- Show created databases
SHOW DATABASES;
