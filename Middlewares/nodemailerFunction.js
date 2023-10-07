import nodemailer from 'nodemailer';
export const transporter = nodemailer.createTransport({
    // Configuration options for your email service
    service: 'gmail',
    auth: {
      user: process.env.SENDING_MAIL,
      pass: process.env.SENDING_MAIL_PASSWORD,
    },
  });
 
