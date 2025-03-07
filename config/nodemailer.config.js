// mailerAuctionNotification.js

const nodemailer = require("nodemailer");
const email = process.env.EMAIL_ACCOUNT;
const password = process.env.EMAIL_PASSWORD;
const generateAuctionNotificationEmail = require("../templates/auctionNotificationTemplate");
const generateBidNotificationEmail = require("../templates/auctionBidNotificationTemplate");
const generateAuctionClosedNotificationEmail = require("../templates/auctionClosedNotificationTemplate");
const generateAuctionResultWinnerEmail = require("../templates/auctionResultWinnerTemplate");
const generateAuctionResultTieEmail = require("../templates/auctionResultTieTemplate");
const generateAuctionResultNonWinnerEmail = require("../templates/auctionResultNonWinnerTemplate");


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: email,
        pass: password,
    },
});

// Registrar eventos del transportador
transporter.on("error", (err) => {
    console.error("Error en el transporte:", err);
});
transporter.on("sent", (info) => {
    console.log("Correo electrónico enviado:", info.response);
});

// Importamos la plantilla de notificación de subasta


module.exports.sendAuctionNotificationEmail = (user, project) => {
    const htmlContent = generateAuctionNotificationEmail(user, project);
    transporter
        .sendMail({
            from: `"Ayming" <${email}>`,
            to: user.email,
            subject: "Un proyecto ha sido lanzado a subasta",
            html: htmlContent,
        })
        .then(() => {
            console.log(`Email de notificación de subasta enviado a ${user.email}`);
        })
        .catch((err) => {
            console.error("Error al enviar email de notificación de subasta:", err);
        });
};

module.exports.sendBidNotificationEmail = (bid) => {
    const htmlContent = generateBidNotificationEmail(bid);
    return transporter.sendMail({
      from: `"Ayming" <${email}>`,
      to: bid.client.email, // Ahora bid.client.email está definido tras el populate
      subject: "Detalles de tu Puja en la Subasta",
      html: htmlContent,
    })
    .then(info => {
      console.log(`Email de puja enviado a ${bid.client.email}`);
      return info;
    });
  };

  module.exports.sendAuctionClosedNotificationEmail = (user, project) => {
    const htmlContent = generateAuctionClosedNotificationEmail(user, project);
    return transporter
      .sendMail({
        from: `"Ayming" <${email}>`,
        to: user.email,
        subject: "Subasta Cerrada – Próximos Resultados",
        html: htmlContent,
      })
      .then((info) => {
        console.log(`Email de subasta cerrada enviado a ${user.email}`);
        return info;
      });
  };

  module.exports.sendAuctionResultWinnerEmail = (user, project, bid) => {
    const htmlContent = generateAuctionResultWinnerEmail(user, project, bid);
    return transporter.sendMail({
        from: `"Ayming" <${email}>`,
        to: user.email,
        subject: "¡Felicidades! Ganaste la subasta",
        html: htmlContent,
    }).then(info => {
        console.log(`Email ganador enviado a ${user.email}`);
        return info;
    });
};

module.exports.sendAuctionResultTieEmail = (user, project, bid) => {
    const htmlContent = generateAuctionResultTieEmail(user, project, bid);
    return transporter.sendMail({
        from: `"Ayming" <${email}>`,
        to: user.email,
        subject: "Empate en la subasta",
        html: htmlContent,
    }).then(info => {
        console.log(`Email de empate enviado a ${user.email}`);
        return info;
    });
};

module.exports.sendAuctionResultNonWinnerEmail = (user, project, bid) => {
    const htmlContent = generateAuctionResultNonWinnerEmail(user, project, bid);
    return transporter.sendMail({
        from: `"Ayming" <${email}>`,
        to: user.email,
        subject: "Resultado de la subasta",
        html: htmlContent,
    }).then(info => {
        console.log(`Email no ganador enviado a ${user.email}`);
        return info;
    });
};
