module.exports = (user, project, bid) => {
    return `
      <h2>¡Hola ${user.name}!</h2>
      <p>La subasta del proyecto <strong>${project.title}</strong> finaliza hoy.</p>
      <p>Tu mejor oferta fue: ${bid.bidPrice} €/MWh</p>
      <p style="color:red;"><strong>Pero ha sido superada.</strong></p>
      <p>¡Aún estás a tiempo de mejorarla!</p>
      <p>Equipo Ayming</p>
    `;
  };
  