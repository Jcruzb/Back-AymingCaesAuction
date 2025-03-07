const router = require('express').Router();
const auctionController = require('../controllers/auction.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.isAuthenticated, auctionController.createAuction);
router.get('/', authMiddleware.isAuthenticated, auctionController.getAuctions);
router.get('/:id', authMiddleware.isAuthenticated, auctionController.getAuction);
router.put('/:id', authMiddleware.isAuthenticated, auctionController.updateAuction);
router.get('/detail/:id', authMiddleware.isAuthenticated, auctionController.getAuctionDetail);

// Endpoint para cerrar la subasta (cambiar el estado a 'closed')
router.put('/:id/close', authMiddleware.isAuthenticated, auctionController.closeAuction);

// Endpoint para marcar como notificados los resultados de la subasta
router.put('/:id/notify', authMiddleware.isAuthenticated, auctionController.notifyResults);

//Endpoint para lanzar la subasta
router.put('/:id/launch', authMiddleware.isAuthenticated, auctionController.launchAuction)

module.exports = router;