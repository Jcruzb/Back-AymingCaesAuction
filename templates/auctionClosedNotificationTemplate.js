// src/templates/auctionClosedNotificationTemplate.js
module.exports = function generateAuctionClosedNotificationEmail(user, project) {
    const appHost = process.env.APP_HOST || "http://localhost:3000";
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Subasta Cerrada</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #fafafa;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .container {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 5px;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .detail {
          margin: 10px 0;
          font-size: 16px;
        }
        .detail strong {
          display: inline-block;
          width: 180px;
        }
        .footer {
          margin-top: 20px;
          font-size: 14px;
          text-align: center;
          color: #777;
        }
        a {
          text-decoration: none;
          color: #007bff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Subasta Cerrada</div>
        <div class="detail">
          <strong>Proyecto:</strong> ${project.title}
        </div>
        <div class="detail">
          <strong>Tipo de Proyecto:</strong> ${project.projectType}
        </div>
        ${
          project.projectType === "Estandarizado"
            ? `<div class="detail">
                 <strong>Proyecto Estandarizado:</strong> ${project.standardizedProject}
               </div>`
            : ""
        }
        <div class="detail">
          <strong>Ahorro Generado:</strong> ${project.savingsGenerated.toLocaleString("es-ES")} MWh
        </div>
        <div class="detail">
          La subasta se ha cerrado y pronto se comunicarán los resultados.
        </div>
        <div class="footer">
          Gracias por participar en la subasta.<br>
          <a href="${appHost}/projects/${project._id}">Ver Detalle del Proyecto</a>
        </div>
      </div>
    </body>
    </html>
    `;
  };