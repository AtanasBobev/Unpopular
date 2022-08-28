const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const sgMail = require("@sendgrid/mail");
const user = process.env.emailUser;
const password = process.env.emailPassword;
const sgAPI = process.env.sgAPI;
sgMail.setApiKey(sgAPI);

const transport = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    auth: {
      user: user,
      pass: password,
    },
    name: "unpopularbulgariamain@gmail.com",
    tls: {
      rejectUnauthorized: false,
    },
    secureConnection: false,
  })
);
const sendMail = (subject, text, to, attachments) => {
  const msg = {
    to: to,
    from: "unpopular.bulgaria@gmail.com",
    subject: subject,
    text: text,
    html: text,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent by SendGrid");
    })
    .catch((error) => {
      console.error(error);
    });
};
module.exports = sendMail;
