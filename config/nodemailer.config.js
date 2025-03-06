// mailerAuctionNotification.js

const nodemailer = require("nodemailer");
const email = process.env.EMAIL_ACCOUNT;
const password = process.env.EMAIL_PASSWORD;
const generateAuctionNotificationEmail = require("../templates/auctionNotificationTemplate");

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
            subject: "Tu proyecto ha sido lanzado a subasta",
            html: htmlContent,
        })
        .then(() => {
            console.log(`Email de notificación de subasta enviado a ${user.email}`);
        })
        .catch((err) => {
            console.error("Error al enviar email de notificación de subasta:", err);
        });
};
