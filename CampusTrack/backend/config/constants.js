module.exports = {
  ROLES: {
    STUDENT: 'student',
    DRIVER: 'driver',
    ADMIN: 'admin'
  },
  TRIP_STATUS: {
    SCHEDULED: 'Scheduled',
    ACTIVE: 'Active',
    PAUSED: 'Paused',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
  },
  STALE_GPS_THRESHOLD_SECONDS: 30, // SRS FR-RT-007
  PROXIMITY_ALERT_METERS: 1000,    // 1 km alert radius
  DEFAULT_UPDATE_INTERVAL_MS: 5000,
  DEFAULT_PORT: 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'campustrack_super_secure_jwt_secret_2026_key',
  JWT_EXPIRES_IN: '24h'
};
