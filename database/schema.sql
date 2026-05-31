-- Create GitGauge SaaS Database
CREATE DATABASE IF NOT EXISTS github_analyzer;
USE github_analyzer;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150),
    avatar_url VARCHAR(255),
    bio TEXT,
    location VARCHAR(150),
    public_repos INT DEFAULT 0,
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    followers_following_ratio DECIMAL(10,2) DEFAULT 0.00,
    total_stars INT DEFAULT 0,
    total_forks INT DEFAULT 0,
    top_language VARCHAR(50) DEFAULT 'Unknown',
    most_popular_repo VARCHAR(150),
    account_age_years DECIMAL(5,2) DEFAULT 0.00,
    profile_score INT DEFAULT 0,
    developer_level VARCHAR(20) NOT NULL,
    recent_activity_insights JSON,
    github_created_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_developer_level (developer_level),
    INDEX idx_top_language (top_language),
    INDEX idx_profile_score (profile_score),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Search History Log Table
CREATE TABLE IF NOT EXISTS search_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(255),
    status VARCHAR(20) NOT NULL, -- 'SUCCESS', 'FAILED', 'NOT_FOUND'
    error_message TEXT,
    
    INDEX idx_history_username (username),
    INDEX idx_searched_at (searched_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
