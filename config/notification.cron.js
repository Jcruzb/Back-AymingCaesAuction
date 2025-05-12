// config/notification.cron.js
const cron = require('node-cron');
const Auction = require('../models/Auction.model');
const Bid = require('../models/Bid.model');
const User = require('../models/User.model');
const { sendDailySummaryEmail, sendFinalDaySuperadaEmail } = require('../config/nodemailer.config');

// Ejecutar cada día a las 8:00
cron.schedule('0 8 * * *', () => {
//ejecutar cada minuto para pruebas
//cron.schedule('* * * * *', () => {
  console.log('[CRON] Enviando notificaciones diarias');

  User.find({ role: { $ne: 'administrador' } })
    .then(users => {
      users.forEach(user => {
        Auction.find({ closed: false })
          .populate({ path: 'project', select: 'title savingsGenerated' })
          .then(auctions => {
            const relevantData = [];

            const promises = auctions.map(auction => {
              return Bid.find({ auction: auction._id, company: user.company })
                .populate('client', 'name email')
                .then(userBids => {
                  if (userBids.length === 0) return;

                  const maxBid = auction.bids.reduce((max, b) => b.bidPrice > max ? b.bidPrice : max, 0);
                  const userBestBid = userBids.reduce((max, b) => b.bidPrice > max.bidPrice ? b : max, userBids[0]);

                  relevantData.push({
                    project: auction.project?.title || 'Proyecto sin nombre',
                    auctionId: auction._id,
                    myBid: userBestBid.bidPrice,
                    wasOutbid: userBestBid.bidPrice < maxBid
                  });
                });
            });

            Promise.all(promises).then(() => {
              if (relevantData.length > 0) {
                sendDailySummaryEmail(user, relevantData);
              }
            });
          });
      });
    });
});

// Ejecutar cada hora
cron.schedule('0 * * * *', () => {
//Ejecutar cada minuto para pruebas
//cron.schedule('* * * * *', () => {
  console.log('[CRON] Verificando notificaciones del último día');
  const now = new Date();

  Auction.find({ closed: false })
    .populate('project')
    .then(auctions => {
      auctions.forEach(auction => {
        const endDate = new Date(auction.createdAt);
        endDate.setDate(endDate.getDate() + auction.durationDays);

        const diffHours = (endDate - now) / (1000 * 60 * 60);

        if (diffHours <= 24 && diffHours > 0) {
          Bid.find({ auction: auction._id })
            .populate('client', 'email name')
            .populate('company')
            .then(bids => {
              const groupedByCompany = {};
              bids.forEach(bid => {
                if (!groupedByCompany[bid.company]) groupedByCompany[bid.company] = [];
                groupedByCompany[bid.company].push(bid);
              });

              const maxBidPrice = bids.reduce((max, b) => b.bidPrice > max ? b.bidPrice : max, 0);

              Object.values(groupedByCompany).forEach(companyBids => {
                const bestBid = companyBids.reduce((max, b) => b.bidPrice > max.bidPrice ? b : max, companyBids[0]);
                if (bestBid.bidPrice < maxBidPrice) {
                  const user = bestBid.client;
                  sendFinalDaySuperadaEmail(user, auction.project, bestBid);
                }
              });
            });
        }
      });
    });
});