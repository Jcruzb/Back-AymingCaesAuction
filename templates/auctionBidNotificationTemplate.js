// src/templates/auctionBidNotificationTemplate.js

module.exports = function generateBidNotificationEmail(bid) {
    // Se espera que bid tenga los siguientes campos:
    // bid.bidPrice, bid.createdAt, bid.client.name
    const createdAtFormatted = new Date(bid.createdAt).toLocaleString();
    
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Detalles de tu Puja</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          margin: 0;
          padding: 20px;
          background-color: #fafafa;
        }
        .container {
          background-color: #f5f5f5;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }
        .detail {
          margin: 10px 0;
          font-size: 16px;
        }
        .detail strong {
          display: inline-block;
          width: 160px;
        }
        .footer {
          margin-top: 20px;
          font-size: 14px;
          text-align: center;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Tu Puja</div>
        <div class="detail">
          <strong>Monto Ofrecido:</strong> ${bid.bidPrice} €/MWh
        </div>
        <div class="detail">
          <strong>Fecha de Creación:</strong> ${createdAtFormatted}
        </div>
        <div class="detail">
          <strong>Realizada por:</strong> ${bid.client.name}
        </div>
        <div class="footer">
          Este correo confirma la recepción de tu puja. Si deseas modificar o desistir de la misma, comunícate con tu contacto en la empresa antes de que finalice la subasta.
        </div>
      </div>
    </body>
    </html>
    `;
  };