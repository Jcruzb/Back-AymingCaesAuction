const router = require('express').Router();
const standardProjectController = require('../controllers/standarProject.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.isAuthenticated, standardProjectController.createStandardProject);
router.get('/', authMiddleware.isAuthenticated, standardProjectController.getStandardProjects);
router.get('/:id', authMiddleware.isAuthenticated, standardProjectController.getStandardProject);
router.put('/:id', authMiddleware.isAuthenticated, standardProjectController.updateStandardProject);
router.delete('/:id', authMiddleware.isAuthenticated, standardProjectController.deleteStandardProject);

module.exports = router;