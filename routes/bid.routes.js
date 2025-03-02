const router = require('express').Router();
const bidController = require('../controllers/bid.controller')
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.isAuthenticated, bidController.createBid);
router.get('/', authMiddleware.isAuthenticated, bidController.getBids)
router.get('/:id', authMiddleware.isAuthenticated, bidController.getBid)
router.put('/:id', authMiddleware.isAuthenticated, bidController.editBid)


module.exports = router;
