const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');

router.use(authMiddleware);
router.use(rbacMiddleware(['admin']));

router.get('/overview', adminController.getOverview);
router.get('/students', adminController.getStudents);
router.post('/students', adminController.createStudent);
router.get('/drivers', adminController.getDrivers);
router.get('/buses', adminController.getBuses);
router.post('/buses', adminController.createBus);
router.put('/buses/:id', adminController.updateBus);
router.get('/routes', adminController.getRoutes);
router.get('/stops', adminController.getStops);
router.get('/trips', adminController.getTrips);
router.get('/reports', adminController.getReports);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
