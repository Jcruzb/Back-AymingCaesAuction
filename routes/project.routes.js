const router = require('express').Router();
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.isAuthenticated, projectController.createProject);
router.get('/', authMiddleware.isAuthenticated, projectController.getProjects);
router.get('/:id', authMiddleware.isAuthenticated, projectController.getProject);
router.put('/:id', authMiddleware.isAuthenticated, projectController.updateProject);
router.delete('/:id', authMiddleware.isAuthenticated, projectController.deleteProject);

module.exports = router;