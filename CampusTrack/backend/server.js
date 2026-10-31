const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const { DEFAULT_PORT } = require('./config/constants');
const { initDB } = require('./config/db');
const { initSocket } = require('./sockets/trackingSocket');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const driverRoutes = require('./routes/driverRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
initSocket(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  if (!req.url.startsWith('/styles') && !req.url.startsWith('/components')) {
    console.log(`[HTTP] ${req.method} ${req.url}`);
  }
  next();
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'CampusTrack',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve Frontend Static Files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Fallback to frontend index for client-side navigation
app.get('*', (req, res) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found.' });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server
const PORT = process.env.PORT || DEFAULT_PORT;

async function bootstrap() {
  await initDB();
  server.listen(PORT, () => {
    console.log('======================================================');
    console.log(` CampusTrack Server running at: http://localhost:${PORT}`);
    console.log(` Real-time WebSockets ready on ws://localhost:${PORT}`);
    console.log(` Frontend accessible at: http://localhost:${PORT}`);
    console.log('======================================================');
  });
}

bootstrap();

module.exports = { app, server };
