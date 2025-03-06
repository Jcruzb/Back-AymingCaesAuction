const router = require('express').Router();
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.isAuthenticated, projectController.createProject);
router.get('/', authMiddleware.isAuthenticated, projectController.getProjects);
// routes/project.routes.js
router.get('/public', authMiddleware.isAuthenticated, projectController.getProjectsForClient);
router.get('/:id', authMiddleware.isAuthenticated, projectController.getProject);
router.put('/:id', authMiddleware.isAuthenticated, projectController.updateProject);
router.delete('/:id', authMiddleware.isAuthenticated, projectController.deleteProject);
// routes/project.routes.js
router.get('/public/:id', authMiddleware.isAuthenticated, projectController.getProjectForClient);



module.exports = router;