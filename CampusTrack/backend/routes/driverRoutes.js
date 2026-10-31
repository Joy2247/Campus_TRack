const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');
const validateGpsMiddleware = require('../middleware/validateGpsMiddleware');

router.use(authMiddleware);
router.use(rbacMiddleware(['driver', 'admin']));

router.get('/profile', driverController.getProfile);
router.get('/assigned-trip', driverController.getAssignedTrip);
router.post('/trips/start', driverController.startTrip);
router.post('/trips/:tripId/pause', driverController.pauseTrip);
router.post('/trips/:tripId/resume', driverController.resumeTrip);
router.post('/trips/:tripId/end', driverController.endTrip);
router.post('/location', validateGpsMiddleware, driverController.updateLocation);
router.post('/issue', driverController.reportIssue);

module.exports = router;
