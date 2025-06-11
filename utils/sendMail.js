const nodemailer = require('nodemailer');

const sendMail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS, // Use App Password (not real password)
    }
  });

  const mailOptions = {
    from: '"REAL E-STATE" <yourgmail@gmail.com>',
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
