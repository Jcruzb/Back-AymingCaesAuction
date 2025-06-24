// controllers/dashboards.controller.js
const User = require('../models/User.model');
const Auction = require('../models/Auction.model');
const Bid = require('../models/Bid.model');
const HttpStatus = require('http-status-codes');
const createError = require('http-errors');

module.exports.getAdminDashboard = async (req, res, next) => {
  try {
    // Total de subastas creadas
    const totalAuctions = await Auction.countDocuments({});

    // Subastas por mes (agrupadas por mes de createdAt)
    const auctionsByMonth = await Auction.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Estadísticas de pujas por subasta:
    // Para cada subasta, contamos las pujas, sumamos los montos y calculamos el máximo bidPrice.
    const bidsPerAuction = await Bid.aggregate([
      {
        $group: {
          _id: "$auction",
          count: { $sum: 1 },
          totalBidAmount: { $sum: "$bidPrice" },
          maxBid: { $max: "$bidPrice" }
        }
      }
    ]);

    res.status(HttpStatus.StatusCodes.OK).json({
      totalAuctions,
      auctionsByMonth,
      bidsPerAuction
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAuctionsByMonthByYear = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const auctionsByMonth = await Auction.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);

    res.status(HttpStatus.StatusCodes.OK).json(auctionsByMonth);
  } catch (err) {
    next(err);
  }
};

module.exports.getUserDashboard = async (req, res, next) => {
    try {
      // Usar el id del usuario para buscar su registro completo
      const userId = req.currentUser.id;
      const user = await User.findById(userId).lean().exec();
      if (!user) {
        return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Usuario no encontrado' });
      }
  
      // Ahora obtenemos la compañía del usuario
      const companyId = user.company;
  
      // Total de pujas realizadas por la compañía del usuario
      const totalBids = await Bid.countDocuments({ company: companyId });
  
      // Calcular los "ganadores" para cada subasta entre las pujas de esa compañía.
      // Se agrupa por subasta y se filtra la puja (o pujas) que tengan el bidPrice máximo.
      const winningBidsAggregation = await Bid.aggregate([
        { $match: { company: companyId } },
        {
          $group: {
            _id: "$auction",
            maxBid: { $max: "$bidPrice" },
            bids: { $push: "$$ROOT" }
          }
        },
        {
          $project: {
            winningBids: {
              $filter: {
                input: "$bids",
                as: "bid",
                cond: { $eq: ["$$bid.bidPrice", "$maxBid"] }
              }
            }
          }
        },
        { $unwind: "$winningBids" },
        { $replaceRoot: { newRoot: "$winningBids" } }
      ]);
      
      const totalWinningBids = winningBidsAggregation.length;
  
      // Ejemplo: monto ganado (dummy) o bien calcularlo a partir de los datos de los proyectos ganadores.
      const montoGanado = 35000;
  
      res.status(HttpStatus.StatusCodes.OK).json({
        totalBids,
        totalWinningBids,
        montoGanado
      });
    } catch (err) {
      next(err);
    }
  };