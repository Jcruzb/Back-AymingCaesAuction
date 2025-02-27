const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', userController.register);
router.get('/me', authMiddleware.isAuthenticated, userController.me);
router.get('/users', authMiddleware.isAuthenticated, userController.getUsers);
router.get('/', authMiddleware.isAuthenticated, userController.getUsersNameAndEmail);
router.get('/:id/activate', userController.activate);
router.get('/:id', authMiddleware.isAuthenticated, userController.getUser);
router.put('/:id', authMiddleware.isAuthenticated, userController.editUser);
router.delete('/:id', authMiddleware.isAuthenticated, userController.deleteUser);

module.exports = router;