const nodemailer = require("nodemailer");
const email = process.env.EMAIL_ACCOUNT;
const password = process.env.EMAIL_PASSWORD;

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

module.exports.sendValidationEmail = (user) => {
    console.log("user ID is: " + user.id);
    transporter
        .sendMail({
            from: `"Ayming" <${email}>`,
            to: user.email,
            subject: "Ayming",
            html: `
        <h1>Bienvenido a Ayming</h1>`,
        })
        .then(() => {
            console.log(`email sent to ${user.email}`);
        })
        .catch((err) => {
            console.error("error sending mail", err);
        });
};

