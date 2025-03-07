const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboards.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Proteger con autenticación
router.get('/admin', authMiddleware.isAuthenticated, dashboardController.getAdminDashboard);
router.get('/user', authMiddleware.isAuthenticated, dashboardController.getUserDashboard);

module.exports = router;