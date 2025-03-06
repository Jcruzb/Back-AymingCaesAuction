// auctionNotificationTemplate.js

module.exports = function generateAuctionNotificationEmail(user, project) {
    const appHost = process.env.APP_HOST;
    return `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h1>¡Un proyecto ha sido lanzado a subasta!</h1>
        <p><strong>Título:</strong> ${project.title}</p>
        <p><strong>Tipo de proyecto:</strong> ${project.projectType}</p>
        ${project.projectType === 'Estandarizado'
          ? `<p><strong>Proyecto estandarizado:</strong> ${project.standardizedProject}</p>`
          : ''}
        <p><strong>Ahorro generado:</strong> ${project.savingsGenerated}</p>
        <p>
          <a href="${appHost}/projects/${project._id}" 
             style="display: inline-block; padding: 10px 20px; background-color: #007bff; 
                    color: #fff; text-decoration: none; border-radius: 5px;">
            Ver Detalle
          </a>
        </p>
      </div>
    `;
  };
  