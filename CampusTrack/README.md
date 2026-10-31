# 🚌 CampusTrack

> **College Bus Tracking and Transportation Management System**  
> *SRS-Compliant Real-Time Transit Platform for College Campuses & Lavasa Hostels*

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.8-black.svg)](https://socket.io/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-blue.svg)](https://mysql.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717.svg?logo=github)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)]()

---

## 🐙 GitHub Repository Setup & Push Guide

To link and push this codebase to your GitHub account:

### 1. Using the GitHub CLI (`gh`):
```bash
# Authenticate with GitHub
gh auth login

# Create a new repository and push current workspace
gh repo create CampusTrack --public --source=. --remote=origin --push
```

### 2. Or Using Standard Git Remote Commands:
```bash
# Add your GitHub repository as origin remote
git remote add origin https://github.com/<your-github-username>/CampusTrack.git

# Set default branch to main
git branch -M main

# Push all files, commits, and branches
git push -u origin main
```

---

## 🌟 Overview

**CampusTrack** is an enterprise-grade, web-based college transportation tracking and fleet management system built to solve student transit uncertainty, driver route communication, and administrative oversight. 

It provides real-time GPS tracking of campus buses directly from the driver’s smartphone browser (no expensive proprietary GPS hardware required), distributes live coordinates with sub-second latency via **Socket.IO**, and renders an ultra-modern, Apple-inspired dashboard interface matching contemporary neo-morphic / frosted-glass UI standards.

---

## 📍 Lavasa Hill City Campus & 4 Student Hostels

CampusTrack includes an interactive transit layout configured around **Lavasa Hill City (Dasve Lake & Christ University Lavasa)**:

### 🏨 The 4 Student Hostels
1. **Lakeside Girls Hostel (Block A & B)** (`18.4025° N, 73.5012° E`)
2. **Banyan Tree Boys Hostel (North Wing)** (`18.4095° N, 73.5115° E`)
3. **Hillside Scholars Hostel (Gate 2)** (`18.4150° N, 73.5158° E`)
4. **Valley View International Hostel** (`18.4185° N, 73.5195° E`)

### 🚌 The 4 Active Fleet Buses
- **Bus 04 (Dasve & Hostels Loop)** — `MH-12-CT-2024` (Driver: Rajesh Kumar, Capacity: 42)
- **Bus 08 (Lakeview Promenade Express)** — `MH-12-CT-4088` (Driver: Michael Chen, Capacity: 38)
- **Bus 12 (Hillside Scholars Shuttle)** — `MH-12-CT-6612` (Driver: Ramesh Shinde, Capacity: 45)
- **Bus 15 (Valley View Metro Connector)** — `MH-12-CT-9115` (Driver: Vikram Patil, Capacity: 40)

---

## 📸 Modern Dashboard UI Architecture

CampusTrack features an avant-garde user interface designed around high-craft visual aesthetics:

- **Soft Sage/Mint Gradient Backdrop**: Subtle diffused pastel palette calibrated for optimal contrast and eye comfort.
- **Left Floating Dock Sidebar**: Minimalist navigation pill featuring Live Map, Driver Console, Route Progression, Announcements, Fleet Manager, GitHub Integration, and Quick Persona Switcher.
- **Top Search & Filter Pill Bar**: Fast omni-search, bus selector, route filter, shift filter, hostel/stop selector, and live heartbeat status indicator (`Live GPS: Synced` vs `Stale (>30s)` vs `Offline`).
- **Interactive Vector Map Canvas**: Custom pastel carto tile engine with glowing amber stop markers, route polylines, animated heading-oriented bus marker, and pulsating radar wave beacon in Lavasa.
- **Floating Dark HUD Capsule**: 3-capsule telemetry badge displaying **Bus ID**, **ETA & Assigned Hostel**, and **Cruising Speed**.
- **Bottom 3-Card Deck**:
  1. **Pickup Stop & Telemetry Card**: Assigned hostel address, heart favorite, and 3 rounded metric tiles (*Arrival ETA*, *Distance Away*, *GPS Accuracy*).
  2. **Vehicle & Driver Hero Media Card**: Architectural campus coach visual with driver badge, registration number, and live status.
  3. **Commuter Network & Radial Arc Gauge**: Overlapping student avatars and a golden semi-circular radial arc gauge indicating seating occupancy.

---

## 📂 Project Structure

```
CampusTrack/
├── frontend/
│   ├── app/
│   │   └── app.js                 # Master orchestrator & state manager
│   ├── components/
│   │   ├── sidebar.js             # Left floating dock sidebar (with GitHub icon)
│   │   ├── topbar.js              # Filter & search pill bar with live heartbeat
│   │   ├── mapView.js             # Interactive map, markers & floating HUD
│   │   ├── bottomCards.js         # 3 bottom cards (Stop, Vehicle, Radial Gauge)
│   │   ├── driverModal.js         # Touch-friendly driver trip controls & GPS toggle
│   │   ├── adminModal.js          # Admin fleet manager & provisioning
│   │   ├── routeModal.js          # Ordered stops & route timetable
│   │   ├── notifModal.js          # Campus transit broadcasts & alerts
│   │   ├── sosModal.js            # Emergency SOS hotline & alert trigger
│   │   ├── reportsModal.js        # Performance reports & audit logs
│   │   ├── githubModal.js         # GitHub repository dialog & quick push commands
│   │   └── toast.js               # Animated notification system
│   ├── pages/
│   │   └── loginModal.js          # Auth modal with 1-click test personas
│   ├── services/
│   │   ├── api.js                 # REST API client
│   │   ├── socket.js              # Real-time Socket.IO client
│   │   └── gpsSimulator.js        # Autonomous transit route simulator & device GPS
│   ├── styles/
│   │   ├── main.css               # Design system, layout & variables
│   │   ├── map.css                # Map canvas, HUD capsule & markers
│   │   └── dashboard.css          # Bottom cards, radial gauge & modals
│   └── index.html                 # HTML5 single-page application entry point
│
├── backend/
│   ├── config/
│   │   ├── constants.js           # Roles, stale thresholds, intervals
│   │   └── db.js                  # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js      # JWT authentication & session verification
│   │   ├── studentController.js   # Student profile, assignment, bus location & ETA
│   │   ├── driverController.js    # Trip start/pause/end & GPS coordinate ingestion
│   │   └── adminController.js     # Bus/Driver/Route CRUD & audit reports
│   ├── middleware/
│   │   ├── authMiddleware.js      # Bearer token verification
│   │   ├── rbacMiddleware.js      # Role-based access control (Student/Driver/Admin)
│   │   └── validateGpsMiddleware.js # Coordinate range & payload sanity validator
│   ├── models/
│   │   └── dbStore.js             # Data access layer with embedded fallback
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth endpoints
│   │   ├── studentRoutes.js       # /api/student endpoints
│   │   ├── driverRoutes.js        # /api/driver endpoints
│   │   └── adminRoutes.js         # /api/admin endpoints
│   ├── sockets/
│   │   └── trackingSocket.js      # Real-time room broadcasts & telemetry sync
│   ├── package.json               # Backend dependencies
│   ├── server.js                  # Express HTTP & Socket.IO server
│   └── .env.example               # Environment variables template
│
├── database/
│   └── schema.sql                 # Complete MySQL 8.0 DDL & initial seed dataset
│
├── package.json                   # Root workspace scripts
└── README.md                      # Comprehensive system documentation
```

---

## ⚡ Quick Start Guide

### Step 1: Install Dependencies
From the `CampusTrack` directory:
```bash
cd CampusTrack/backend
npm install
```

### Step 2: Start the System
```bash
npm start
```
*Or from the root directory:*
```bash
node CampusTrack/backend/server.js
```

### Step 3: Open in Browser
Visit **`http://localhost:5000`** in your browser (Chrome, Edge, Safari, or Firefox).

---

## 👥 Pre-Configured Test Accounts (Password: `password123`)

| Persona | Email | Role | Features Accessible |
|---|---|---|---|
| **Student (Shreyansh)** | `student@campus.edu` | `student` | Assigned to Bus 04 at Banyan Tree Boys Hostel; live map tracking & ETA. |
| **Driver (Rajesh Kumar)** | `driver@campus.edu` | `driver` | Assigned to Bus 04 (Trip 105); trip start/pause/end & GPS tracking. |
| **Transport Administrator** | `admin@campus.edu` | `admin` | Fleet overview, bus and driver management, route stop configurations, audit log and transport reports. |

---

## 🏆 Authors & Academic Credits

- Developed for **CampusTrack College Transportation Management**.
- Built with high adherence to IEEE 29148 requirements specifications and modern UI design principles.
