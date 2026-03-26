-- ============================================================
-- BUGEMA UNIVERSITY - DEPARTMENT OF COMPUTING AND INFORMATICS
-- Full Database Schema
-- Run this in phpMyAdmin: create database then import this file
-- ============================================================

CREATE DATABASE IF NOT EXISTS bugema_university;
USE bugema_university;

-- ============================================================
-- 1. ADMINS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. STAFF TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Lecturer',
    department VARCHAR(150) DEFAULT 'Computing and Informatics',
    qualification VARCHAR(200),
    phone VARCHAR(20),
    status ENUM('active','inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. STUDENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reg_number VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    course ENUM('bit','bcs','dse','cwd') NOT NULL,
    year_of_study INT DEFAULT 1,
    study_mode ENUM('full_time','part_time','distance') DEFAULT 'full_time',
    gender ENUM('male','female','other'),
    nationality VARCHAR(100) DEFAULT 'Ugandan',
    date_of_birth DATE,
    status ENUM('active','suspended','graduated') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. REGISTRATIONS TABLE (Applications)
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male','female','other') NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    national_id VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    course ENUM('bit','bcs','dse','cwd') NOT NULL,
    entry_year YEAR NOT NULL,
    study_mode ENUM('full_time','part_time','distance') NOT NULL,
    o_level_school VARCHAR(150) NOT NULL,
    o_level_year YEAR NOT NULL,
    o_level_grade VARCHAR(10) NOT NULL,
    a_level_school VARCHAR(150),
    a_level_year YEAR,
    a_level_grade VARCHAR(10),
    diploma_school VARCHAR(150),
    diploma_year YEAR,
    diploma_grade VARCHAR(10),
    emergency_name VARCHAR(150) NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,
    emergency_relation VARCHAR(80) NOT NULL,
    declaration TINYINT(1) NOT NULL DEFAULT 0,
    status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. CONTACT MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA — Default Accounts
-- All passwords below are: password
-- Hash = password_hash('password', PASSWORD_BCRYPT)
-- ============================================================

-- Admin account
INSERT INTO admins (username, password_hash, full_name, email) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin@bugema.ac.ug')
ON DUPLICATE KEY UPDATE username=username;

-- Staff accounts
-- Password format: Staff@2026 for all staff (different from student 'password')
INSERT INTO staff (staff_id, full_name, email, password_hash, role, qualification, phone) VALUES
('STAFF001', 'Albert Walusimbi',                    'walusimbi@bugema.ac.ug',   '$2y$10$VLuWjBESC6wcEa7lyq0Wk.2VHH4tmg2khLY0P5gShnVERtiEphFQe', 'Lecturer',            'MSc Information Technology',    '+256 700 000001'),
('STAFF002', 'Ssewankambo Erma',                    'ssewankambo@bugema.ac.ug', '$2y$10$VLuWjBESC6wcEa7lyq0Wk.2VHH4tmg2khLY0P5gShnVERtiEphFQe', 'Head of Department',  'MSc Computer Science',          '+256 700 000002'),
('STAFF003', 'Assoc. Prof. Ssali Robert Balagadde', 'ssali@bugema.ac.ug',       '$2y$10$VLuWjBESC6wcEa7lyq0Wk.2VHH4tmg2khLY0P5gShnVERtiEphFQe', 'Associate Professor', 'PhD Computing and Informatics', '+256 700 000003')
ON DUPLICATE KEY UPDATE password_hash='$2y$10$VLuWjBESC6wcEa7lyq0Wk.2VHH4tmg2khLY0P5gShnVERtiEphFQe';

-- Student accounts
INSERT INTO students (reg_number, full_name, email, password_hash, phone, course, year_of_study, gender, nationality) VALUES
('BU/2026/0001', 'Kunar Izzat',      'kunar@bugema.ac.ug',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+256 700 100001', 'bit', 2, 'male',   'Ugandan'),
('BU/2026/0002', 'Aisha Nakamya',    'aisha@bugema.ac.ug',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+256 700 100002', 'bcs', 1, 'female', 'Ugandan'),
('BU/2026/0003', 'David Ssemakula',  'david@bugema.ac.ug',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+256 700 100003', 'dse', 1, 'male',   'Ugandan')
ON DUPLICATE KEY UPDATE reg_number=reg_number;
