const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  // Configuration options for your email service
  service: "gmail",
  auth: {
    user: process.env.SENDING_MAIL,
    pass: process.env.SENDING_MAIL_PASSWORD,
  },
});

module.exports = transporter;
