-- ======================================================================
-- CampusTrack - College Bus Tracking and Transportation Management System
-- Database Schema (MySQL 8.0+)
-- Version: 1.0 (SRS Compliant)
-- ======================================================================

CREATE DATABASE IF NOT EXISTS campus_track CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campus_track;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS bus_locations;
DROP TABLE IF EXISTS student_assignments;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS route_stops;
DROP TABLE IF EXISTS stops;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS buses;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'driver', 'admin') NOT NULL,
    account_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. Students Profile Table
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    roll_no VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    year_of_study INT DEFAULT 1,
    phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Drivers Profile Table
CREATE TABLE drivers (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    license_no VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    employment_status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Buses Table
CREATE TABLE buses (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    registration_no VARCHAR(50) NOT NULL UNIQUE,
    bus_label VARCHAR(50) NOT NULL,
    capacity INT NOT NULL DEFAULT 40,
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Routes Table
CREATE TABLE routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(150) NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Stops Table
CREATE TABLE stops (
    stop_id INT AUTO_INCREMENT PRIMARY KEY,
    stop_name VARCHAR(150) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(255),
    INDEX idx_stop_lat_lng (latitude, longitude)
) ENGINE=InnoDB;

-- 7. Route Stops (Ordered Sequence)
CREATE TABLE route_stops (
    route_id INT NOT NULL,
    stop_id INT NOT NULL,
    stop_order INT NOT NULL,
    estimated_minutes_from_start INT DEFAULT 0,
    PRIMARY KEY (route_id, stop_id),
    UNIQUE KEY uk_route_stop_order (route_id, stop_order),
    FOREIGN KEY (route_id) REFERENCES routes(route_id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES stops(stop_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Student Assignments
CREATE TABLE student_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    bus_id INT NOT NULL,
    stop_id INT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES stops(stop_id) ON DELETE CASCADE,
    INDEX idx_assignment_student (student_id),
    INDEX idx_assignment_bus (bus_id)
) ENGINE=InnoDB;

-- 9. Trips Table
CREATE TABLE trips (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    driver_id INT NOT NULL,
    route_id INT NOT NULL,
    status ENUM('Scheduled', 'Active', 'Paused', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    scheduled_start DATETIME NOT NULL,
    actual_start DATETIME,
    actual_end DATETIME,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(route_id) ON DELETE CASCADE,
    INDEX idx_trip_bus_status (bus_id, status),
    INDEX idx_trip_driver_status (driver_id, status)
) ENGINE=InnoDB;

-- 10. Bus Locations (GPS History & Real-Time)
CREATE TABLE bus_locations (
    location_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(6, 2) DEFAULT 0.0,
    speed DECIMAL(6, 2) DEFAULT 0.0,
    heading DECIMAL(5, 2) DEFAULT 0.0,
    device_timestamp DATETIME NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    INDEX idx_bus_loc_trip (trip_id, received_at DESC)
) ENGINE=InnoDB;

-- 11. Notifications Table
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trip_id INT,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE SET NULL,
    INDEX idx_notif_user (user_id, is_read)
) ENGINE=InnoDB;

-- 12. Audit Logs Table
CREATE TABLE audit_logs (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,
    FOREIGN KEY (actor_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_audit_actor (actor_user_id),
    INDEX idx_audit_time (created_at DESC)
) ENGINE=InnoDB;

-- ======================================================================
-- Initial Seed Data (Default Passwords: "password123")
-- bcrypt hash for "password123":
-- $2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e
-- ======================================================================

-- 1. Insert Users
INSERT INTO users (user_id, name, email, password_hash, role, account_status) VALUES
(1, 'System Administrator', 'admin@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'admin', 'active'),
(2, 'Rajesh Kumar', 'driver@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'driver', 'active'),
(3, 'Michael Chen', 'driver2@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'driver', 'active'),
(4, 'Shreyansh Patel', 'student@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'student', 'active'),
(5, 'Emily Watson', 'student2@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'student', 'active'),
(6, 'Alex Turner', 'student3@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'student', 'active');

-- 2. Insert Students
INSERT INTO students (student_id, user_id, roll_no, department, year_of_study, phone) VALUES
(1, 4, 'CS-2024-042', 'Computer Science & Engineering', 3, '+1 (555) 234-5678'),
(2, 5, 'ME-2024-118', 'Mechanical Engineering', 2, '+1 (555) 345-6789'),
(3, 6, 'EE-2024-089', 'Electrical Engineering', 4, '+1 (555) 456-7890');

-- 3. Insert Drivers
INSERT INTO drivers (driver_id, user_id, license_no, phone, employment_status) VALUES
(1, 2, 'DL-KA-2018-994821', '+1 (555) 890-1234', 'active'),
(2, 3, 'DL-KA-2019-332145', '+1 (555) 901-2345', 'active');

-- 4. Insert Buses
INSERT INTO buses (bus_id, registration_no, bus_label, capacity, status) VALUES
(1, 'KA-04-E-2024', 'Bus 04 (South Express)', 42, 'active'),
(2, 'KA-04-E-5512', 'Bus 07 (North Metro Shuttle)', 38, 'active'),
(3, 'KA-04-E-8830', 'Bus 12 (Tech Park Shuttle)', 45, 'active');

-- 5. Insert Routes
INSERT INTO routes (route_id, route_name, description, status) VALUES
(1, 'Route 105 - West Campus to Main Terminal', 'Daily morning pickup and evening drop connecting Westside, St. Peter Square, and Main University Hub.', 'active'),
(2, 'Route 202 - North Valley & Metro Hub', 'Fast-track express line connecting North Metro terminal, Tech Park, and East Campus.', 'active');

-- 6. Insert Stops (Realistic Coordinates)
INSERT INTO stops (stop_id, stop_name, latitude, longitude, address) VALUES
(1, 'Westside Transit Center', 18.520430, 73.856743, 'Bay 4, Westside Bus Depot'),
(2, 'St. Peter\'s Square Stop', 18.528350, 73.864210, 'Opposite City Library, 789 College Blvd'),
(3, 'Greenwood Highlands', 18.535620, 73.871150, 'Greenwood Gate 2, Ring Road'),
(4, 'South Campus Junction', 18.542890, 73.878540, 'Near South Gate Overpass'),
(5, 'University Engineering Annex', 18.548900, 73.886320, 'Building B Drop-off Point'),
(6, 'Main Campus Central Terminal', 18.553200, 73.893450, 'University Central Oval Terminal');

-- 7. Route Stops Sequence
INSERT INTO route_stops (route_id, stop_id, stop_order, estimated_minutes_from_start) VALUES
(1, 1, 1, 0),
(1, 2, 2, 8),
(1, 3, 3, 16),
(1, 4, 4, 25),
(1, 5, 5, 33),
(1, 6, 6, 42);

-- 8. Student Assignments
INSERT INTO student_assignments (assignment_id, student_id, bus_id, stop_id, effective_from, status) VALUES
(1, 1, 1, 2, '2026-08-01', 'active'), -- Shreyansh assigned to Bus 04 at St. Peter's Square
(2, 2, 1, 3, '2026-08-01', 'active'), -- Emily assigned to Bus 04 at Greenwood Highlands
(3, 3, 1, 4, '2026-08-01', 'active'); -- Alex assigned to Bus 04 at South Campus Junction

-- 9. Active Trip for Testing
INSERT INTO trips (trip_id, bus_id, driver_id, route_id, status, scheduled_start, actual_start, notes) VALUES
(105, 1, 1, 1, 'Active', '2026-10-31 08:00:00', '2026-10-31 08:05:12', 'Morning Pickup Run - On Schedule');

-- 10. Initial GPS Location for Active Trip
INSERT INTO bus_locations (trip_id, latitude, longitude, accuracy, speed, heading, device_timestamp) VALUES
(105, 18.524100, 73.860100, 4.2, 34.5, 58.0, NOW());

-- 11. Initial Notifications
INSERT INTO notifications (user_id, trip_id, title, message) VALUES
(4, 105, 'Trip Started', 'Bus 04 has started Route 105 (Morning Pickup). Expected at St. Peter\'s Square in ~8 mins.'),
(5, 105, 'Trip Started', 'Bus 04 has departed from Westside Transit Center.'),
(6, 105, 'Trip Started', 'Bus 04 is currently en-route.');

-- 12. Initial Audit Logs
INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, metadata) VALUES
(1, 'SYSTEM_INITIALIZATION', 'SYSTEM', '1', '{"version": "1.0", "message": "CampusTrack seed configuration complete."}');
