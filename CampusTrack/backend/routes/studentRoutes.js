const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');

// All student routes require auth and student role (or admin viewing on behalf)
router.use(authMiddleware);
router.use(rbacMiddleware(['student', 'admin']));

router.get('/profile', studentController.getProfile);
router.get('/assignment', studentController.getAssignment);
router.get('/bus', studentController.getBusLocation);
router.get('/bus/:busId/location', studentController.getBusLocation);
router.get('/trip', studentController.getTrip);
router.get('/route/:routeId', studentController.getRouteDetails);
router.get('/notifications', studentController.getNotifications);

module.exports = router;
