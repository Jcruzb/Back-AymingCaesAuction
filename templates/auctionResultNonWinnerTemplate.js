// src/templates/auctionResultNonWinnerTemplate.js
module.exports = function generateAuctionResultNonWinnerEmail(user, project, bid) {
    const appHost = process.env.APP_HOST || "http://localhost:3000";
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Resultado de la Subasta</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #fafafa; color: #333; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .detail { margin: 10px 0; font-size: 16px; }
        .footer { margin-top: 20px; text-align: center; font-size: 14px; color: #777; }
        a { text-decoration: none; color: #007bff; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Resultado de la Subasta</div>
        <div class="detail">
          ${user.name}, lamentablemente, tu puja de <strong>${bid.bidPrice.toLocaleString('es-ES')} €/MWh</strong> para el proyecto <strong>${project.title}</strong> no fue la ganadora.
        </div>
        <div class="detail">
          Te animamos a participar en futuras subastas.
        </div>
        <div class="footer">
          <a href="${appHost}/projects/${project._id}">Ver detalles del proyecto</a>
        </div>
      </div>
    </body>
    </html>
    `;
  };