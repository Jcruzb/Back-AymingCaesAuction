module.exports = (user, auctions) => {
    return `
      <h2>Hola ${user.name},</h2>
      <p>Este es tu resumen diario de subastas:</p>
      <ul>
        ${auctions.map(a => `
          <li>
            Proyecto: <strong>${a.project}</strong><br>
            Tu puja: ${a.myBid} €/MWh<br>
            ${a.wasOutbid ? '<strong style="color:red">¡Tu puja fue superada!</strong>' : 'Tu puja sigue siendo la mejor'}
          </li>
        `).join('')}
      </ul>
      <p>Revisa tus proyectos y mejora tu oferta si es necesario.</p>
      <p>Equipo Ayming</p>
    `;
  };
  