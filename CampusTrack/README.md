# 🚌 CampusTrack

> **College Bus Tracking and Transportation Management System**  
> *SRS-Compliant Real-Time Transit Platform for College Campuses*

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.8-black.svg)](https://socket.io/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-blue.svg)](https://mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)]()

---

## 🌟 Overview

**CampusTrack** is an enterprise-grade, web-based college transportation tracking and fleet management system built to solve student transit uncertainty, driver route communication, and administrative oversight. 

It provides real-time GPS tracking of campus buses directly from the driver’s smartphone browser (no expensive proprietary GPS hardware required), distributes live coordinates with sub-second latency via **Socket.IO**, and renders an ultra-modern, Apple-inspired dashboard interface matching contemporary neo-morphic / frosted-glass UI standards.

---

## 📸 Modern Dashboard UI Architecture

CampusTrack features an avant-garde user interface designed around high-craft visual aesthetics:

- **Soft Sage/Mint Gradient Backdrop**: Subtle diffused pastel palette calibrated for optimal contrast and eye comfort.
- **Left Floating Dock Sidebar**: Minimalist navigation pill featuring Live Map, Driver Console, Route Progression, Announcements, Fleet Manager, and Quick Persona Switcher.
- **Top Search & Filter Pill Bar**: Fast omni-search, route filter, shift filter, pickup stop selector, and live heartbeat status indicator (`Live GPS: Synced` vs `Stale (>30s)` vs `Offline`).
- **Interactive Vector Map Canvas**: Custom pastel carto tile engine with glowing amber stop markers, route polylines, animated heading-oriented bus marker, and pulsating radar wave beacon.
- **Floating Dark HUD Capsule**: 3-capsule telemetry badge displaying **Bus ID**, **ETA & Assigned Stop**, and **Cruising Speed**.
- **Bottom 3-Card Deck**:
  1. **Pickup Stop & Telemetry Card**: Assigned stop address, heart favorite, and 3 rounded metric tiles (*Arrival ETA*, *Distance Away*, *GPS Accuracy*).
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
│   │   ├── sidebar.js             # Left floating dock sidebar
│   │   ├── topbar.js              # Filter & search pill bar with live heartbeat
│   │   ├── mapView.js             # Interactive map, markers & floating HUD
│   │   ├── bottomCards.js         # 3 bottom cards (Stop, Vehicle, Radial Gauge)
│   │   ├── driverModal.js         # Touch-friendly driver trip controls & GPS toggle
│   │   ├── adminModal.js          # Admin fleet manager & provisioning
│   │   ├── routeModal.js          # Ordered stops & route timetable
│   │   ├── notifModal.js          # Campus transit broadcasts & alerts
│   │   ├── sosModal.js            # Emergency SOS hotline & alert trigger
│   │   ├── reportsModal.js        # Performance reports & audit logs
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

### Prerequisites
- **Node.js**: v18.x or newer
- **npm**: v9.x or newer
- *(Optional)* **MySQL**: 8.0+ (CampusTrack includes an auto-fallback embedded store so you can test immediately even without MySQL installed!)

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

## 👥 Pre-Configured Test Accounts

For effortless evaluation, the application includes pre-configured personas with password **`password123`**:

| Persona | Email | Role | Features Accessible |
|---|---|---|---|
| **Student (Shreyansh)** | `student@campus.edu` | `student` | Live Bus 04 tracking, dynamic ETA to St. Peter's Square, route progression, seat occupancy gauge, proximity alerts. |
| **Driver (Rajesh Kumar)** | `driver@campus.edu` | `driver` | Start/Pause/Resume/Complete Trip, Browser Geolocation tracking, Route Simulator, Delay reporting. |
| **Transport Administrator** | `admin@campus.edu` | `admin` | Fleet overview, bus and driver management, route stop configurations, audit log and transport reports. |

> 💡 **Tip:** You can switch between all 3 personas instantly at any time using the **top bar role pills** or by clicking the user avatar in the bottom-left dock!

---

## 🗄️ Database Schema & Relational Model

The database schema in `database/schema.sql` complies with IEEE and project SRS requirements:

```
+-----------+       1:1       +-----------+
|   users   | <-------------> | students  |
+-----------+                 +-----------+
      ^                             |
      | 1:1                         | 1:M
+-----------+                 +---------------------+
|  drivers  |                 | student_assignments |
+-----------+                 +---------------------+
      | 1:M                                 |
      v                                     v
+-----------+       1:M       +-----------+ | M:1
|   trips   | <-------------- |   buses   | <---+
+-----------+                 +-----------+
      | 1:M                         |
      v                             v
+---------------+             +-----------+
| bus_locations |             |  routes   |
+---------------+             +-----------+
                                    | 1:M
                                    v
                              +-------------+       M:1       +-----------+
                              | route_stops | --------------> |   stops   |
                              +-------------+                 +-----------+
```

### Key Tables:
1. `users`: Unified identity and hashed credentials (`student`, `driver`, `admin`).
2. `students` & `drivers`: Role-specific attributes (roll number, department, license number).
3. `buses`: Fleet inventory (registration number, seating capacity, operational status).
4. `routes` & `stops`: Ordered geographic bus stops with latitude and longitude coordinates.
5. `route_stops`: Defines ordered sequence and expected travel duration between stops.
6. `student_assignments`: Maps students to their authorized bus and designated pickup stop.
7. `trips`: Journey lifecycle records (`Scheduled`, `Active`, `Paused`, `Completed`, `Cancelled`).
8. `bus_locations`: Time-series GPS updates (latitude, longitude, speed, heading, accuracy, timestamps).
9. `notifications`: Push and broadcast messages with read state.
10. `audit_logs`: Traceability log for administrative security and compliance.

---

## 📡 REST API Reference

All protected endpoints require an `Authorization: Bearer <JWT>` header.

### Authentication
- `POST /api/auth/login` — Authenticate user and issue JWT token.
- `GET /api/auth/me` — Retrieve active profile.
- `POST /api/auth/logout` — Terminate session.

### Student Portal
- `GET /api/student/assignment` — Fetch student's assigned bus, route, and stop.
- `GET /api/student/bus` — Get latest live GPS location and ETA.
- `GET /api/student/trip` — Active trip status for assigned bus.
- `GET /api/student/route/:routeId` — Ordered stops and timetable.
- `GET /api/student/notifications` — Student notifications list.

### Driver Portal
- `GET /api/driver/assigned-trip` — Get driver's active or upcoming journey.
- `POST /api/driver/trips/start` — Start scheduled trip and begin GPS transmission.
- `POST /api/driver/trips/:tripId/pause` — Pause trip.
- `POST /api/driver/trips/:tripId/resume` — Resume trip.
- `POST /api/driver/trips/:tripId/end` — Conclude trip.
- `POST /api/driver/location` — Transmit validated GPS coordinates.
- `POST /api/driver/issue` — Report traffic delay or vehicle breakdown.

### Admin Portal
- `GET /api/admin/overview` — High-level fleet metrics.
- `GET /api/admin/buses` & `POST /api/admin/buses` — Fleet management.
- `GET /api/admin/drivers` — Driver roster.
- `GET /api/admin/routes` — Routes and stop configurations.
- `GET /api/admin/reports` — Transport reliability and GPS uptime analytics.
- `GET /api/admin/audit-logs` — Security and administrative action trail.

---

## 🔄 Real-Time Socket.IO Protocol

CampusTrack uses trip-specific rooms (`trip_${tripId}`) to ensure students only receive telemetry for their authorized bus:

| Event | Direction | Payload Details |
|---|---|---|
| `join_trip` | Client ➔ Server | `{ tripId }` — Joins room; server returns latest cached location immediately. |
| `bus_location` | Driver ➔ Server | `{ tripId, latitude, longitude, speed, heading, accuracy, deviceTimestamp }`. |
| `location_update` | Server ➔ Room | Validated coordinates broadcast to all connected students. |
| `trip_started` | Server ➔ Room | Dispatched when driver commences transit. |
| `trip_paused` | Server ➔ Room | Dispatched when vehicle holds position or stops. |
| `trip_resumed` | Server ➔ Room | Dispatched when vehicle resumes travel. |
| `trip_completed` | Server ➔ Room | Concludes transit room session. |
| `trip_alert` | Server ➔ Room | Driver breakdown or traffic delay alert. |

---

## 🔒 Security & Data Integrity Highlights

1. **Role-Based Access Control (RBAC)**: Enforced at both REST controller and WebSocket handshake layers. Students cannot subscribe to unauthorized bus rooms.
2. **Input & GPS Sanitization**: Coordinate bounds validator ensures latitude `[-90, 90]` and longitude `[-180, 180]`.
3. **Password Security**: Bcrypt one-way hashing with salt rounds. Plaintext passwords are never stored.
4. **Stale GPS Detection**: Automatic 30-second heartbeat threshold identifies lost phone signals and alerts passengers without fabricating positions.

---

## 🏆 Authors & Academic Credits

- Developed for **CampusTrack College Transportation Management**.
- Built with high adherence to IEEE 29148 requirements specifications and modern UI design principles.
