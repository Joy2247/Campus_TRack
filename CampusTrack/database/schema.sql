-- ======================================================================
-- CampusTrack - College Bus Tracking and Transportation Management System
-- Database Schema (MySQL 8.0+)
-- Version: 1.1 (Lavasa Campus, Hostels & Multi-Bus Fleet Edition)
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
    hostel_name VARCHAR(100),
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

-- 4. Buses Table (Fleet)
CREATE TABLE buses (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    registration_no VARCHAR(50) NOT NULL UNIQUE,
    bus_label VARCHAR(50) NOT NULL,
    capacity INT NOT NULL DEFAULT 40,
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    driver_id INT,
    current_occupancy INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Routes Table
CREATE TABLE routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(150) NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Stops Table (Hostels & Campus Transit Points)
CREATE TABLE stops (
    stop_id INT AUTO_INCREMENT PRIMARY KEY,
    stop_name VARCHAR(150) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(255),
    stop_type ENUM('hostel', 'academic', 'terminal', 'residential') DEFAULT 'hostel',
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
-- Initial Seed Data (Lavasa Campus & Hostels)
-- Default Password: "password123"
-- bcrypt hash: $2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e
-- ======================================================================

-- 1. Insert Users
INSERT INTO users (user_id, name, email, password_hash, role, account_status) VALUES
(1, 'System Administrator', 'admin@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'admin', 'active'),
(2, 'Rajesh Kumar', 'driver@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'driver', 'active'),
(3, 'Michael Chen', 'driver2@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'driver', 'active'),
(4, 'Ramesh Shinde', 'driver3@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'driver', 'active'),
(5, 'Vikram Patil', 'driver4@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'driver', 'active'),
(6, 'Shreyansh Patel', 'student@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'student', 'active'),
(7, 'Emily Watson', 'student2@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'student', 'active'),
(8, 'Alex Turner', 'student3@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'student', 'active'),
(9, 'Priya Sharma', 'student4@campus.edu', '$2a$10$wE9mH60x2tS2fKjUqTz8ueH7iHnsq0Y9hL05rE94B3HhWjB20hR5e', 'student', 'active');

-- 2. Insert Drivers (4 Drivers)
INSERT INTO drivers (driver_id, user_id, license_no, phone, employment_status) VALUES
(1, 2, 'DL-MH-2018-994821', '+91 98221 44550', 'active'),
(2, 3, 'DL-MH-2019-332145', '+91 98222 77881', 'active'),
(3, 4, 'DL-MH-2020-771234', '+91 98223 99002', 'active'),
(4, 5, 'DL-MH-2021-884561', '+91 98224 11223', 'active');

-- 3. Insert Buses (4 Buses)
INSERT INTO buses (bus_id, registration_no, bus_label, capacity, status, driver_id, current_occupancy) VALUES
(1, 'MH-12-CT-2024', 'Bus 04 (Dasve & Hostels Loop)', 42, 'active', 1, 35),
(2, 'MH-12-CT-4088', 'Bus 08 (Lakeview Promenade Express)', 38, 'active', 2, 28),
(3, 'MH-12-CT-6612', 'Bus 12 (Hillside Scholars Shuttle)', 45, 'active', 3, 31),
(4, 'MH-12-CT-9115', 'Bus 15 (Valley View Metro Connector)', 40, 'active', 4, 22);

-- 4. Insert 4 Hostels and Lavasa Campus Landmark Stops
-- Exact geographic coordinates for Lavasa (Dasve Lake, Warasgaon / Christ University Lavasa region)
INSERT INTO stops (stop_id, stop_name, latitude, longitude, address, stop_type) VALUES
(1, 'Lavasa Central Transit Terminal', 18.405500, 73.507800, 'Main Dasve Bus Depot, Lavasa Entry Road', 'terminal'),
(2, 'Portofino Promenade Plaza', 18.404000, 73.503000, 'Portofino Street, Lakefront Boulevard', 'residential'),
(3, 'Lakeside Girls Hostel (Block A & B)', 18.402500, 73.501200, 'Lakeside Heights, Warasgaon Shore Road', 'hostel'),
(4, 'Dasve Waterfront & Town Hall', 18.406500, 73.505500, 'Dasve Circle, Convention Center Road', 'academic'),
(5, 'Christ University Lavasa Academic Hub', 18.411800, 73.507500, 'Christ University Main Academic Block & Library', 'academic'),
(6, 'Banyan Tree Boys Hostel (North Wing)', 18.409500, 73.511500, 'Banyan Tree Residency, North Hill Road', 'hostel'),
(7, 'Hillside Scholars Hostel (Gate 2)', 18.415000, 73.515800, 'Hillside Heights Hostel Complex, Ridge Way', 'hostel'),
(8, 'Valley View International Hostel', 18.418500, 73.519500, 'Valley View Residency & Scholars Block, Upper Dasve', 'hostel');

-- 5. Insert Routes (Lavasa Transit Network)
INSERT INTO routes (route_id, route_name, description, status) VALUES
(1, 'Route 101 - Lavasa Dasve & 4 Hostels Loop', 'Connecting Central Terminal, Portofino, Lakeside Girls Hostel, Christ University Hub, Banyan Tree Boys Hostel, Hillside Hostel, and Valley View Hostel.', 'active'),
(2, 'Route 202 - Hillside & Academic Hub Express', 'Fast-track morning service between Hillside Hostels and Christ University Academic Hub.', 'active');

-- 6. Insert Route Stops for Route 101 (Ordered Sequence through Lavasa)
INSERT INTO route_stops (route_id, stop_id, stop_order, estimated_minutes_from_start) VALUES
(1, 1, 1, 0),   -- Central Terminal
(1, 2, 2, 5),   -- Portofino Plaza
(1, 3, 3, 11),  -- 🏨 Lakeside Girls Hostel
(1, 4, 4, 18),  -- Dasve Waterfront
(1, 5, 5, 24),  -- Christ University Academic Hub
(1, 6, 6, 30),  -- 🏨 Banyan Tree Boys Hostel
(1, 7, 7, 36),  -- 🏨 Hillside Scholars Hostel
(1, 8, 8, 43);  -- 🏨 Valley View International Hostel

-- 7. Insert Students (Residing in the Hostels)
INSERT INTO students (student_id, user_id, roll_no, department, year_of_study, phone, hostel_name) VALUES
(1, 6, 'CS-2024-042', 'Computer Science & AI', 3, '+91 98765 43210', 'Banyan Tree Boys Hostel (North Wing)'),
(2, 7, 'ME-2024-118', 'Data Analytics', 2, '+91 98765 43211', 'Lakeside Girls Hostel (Block A & B)'),
(3, 8, 'EE-2024-089', 'Business Analytics', 4, '+91 98765 43212', 'Hillside Scholars Hostel (Gate 2)'),
(4, 9, 'IT-2024-205', 'Information Technology', 1, '+91 98765 43213', 'Valley View International Hostel');

-- 8. Student Assignments to Buses & Hostel Stops
INSERT INTO student_assignments (assignment_id, student_id, bus_id, stop_id, effective_from, status) VALUES
(1, 1, 1, 6, '2026-08-01', 'active'), -- Shreyansh -> Bus 04 at Banyan Tree Boys Hostel
(2, 2, 1, 3, '2026-08-01', 'active'), -- Emily -> Bus 04 at Lakeside Girls Hostel
(3, 3, 1, 7, '2026-08-01', 'active'), -- Alex -> Bus 04 at Hillside Scholars Hostel
(4, 4, 1, 8, '2026-08-01', 'active'); -- Priya -> Bus 04 at Valley View Hostel

-- 9. Active Trip on Lavasa Route 101 for Bus 04
INSERT INTO trips (trip_id, bus_id, driver_id, route_id, status, scheduled_start, actual_start, notes) VALUES
(105, 1, 1, 1, 'Active', '2026-10-31 08:00:00', '2026-10-31 08:05:12', 'Lavasa Morning Hostel Pickup Run - Active');

-- 10. Initial GPS Location in Lavasa (near Christ University / Dasve)
INSERT INTO bus_locations (trip_id, latitude, longitude, accuracy, speed, heading, device_timestamp) VALUES
(105, 18.407500, 73.506500, 3.8, 32.0, 42.0, NOW());

-- 11. Initial Notifications
INSERT INTO notifications (user_id, trip_id, title, message) VALUES
(6, 105, 'Hostel Pickup Trip Started', 'Bus 04 (Dasve & Hostels Loop) has departed Lavasa Central Terminal. Arriving at Banyan Tree Boys Hostel in ~15 mins.'),
(7, 105, 'Bus Approaching Lakeside Hostel', 'Bus 04 is currently approaching Lakeside Girls Hostel Stop (Block A & B).'),
(8, 105, 'Morning Run Active', 'Bus 04 is on schedule along the Lavasa Ridge corridor.');

-- 12. Audit Log
INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, metadata) VALUES
(1, 'LAVASA_CAMPUS_PROVISIONED', 'SYSTEM', '1', '{"campus": "Lavasa Smart City", "hostels": 4, "buses": 4}');
