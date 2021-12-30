const nodemailer = require("nodemailer");

const sendMail = (subject, text, to, attachments) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bobevatanas2704@gmail.com",
        pass: "Atanasko",
      },
    });
    transporter.sendMail(
      {
        from: "Unpopular",
        to: to,
        subject: subject,
        text: text,
        attachments: attachments,
      },
      function (error, info) {
        if (error) {
          console.log(error);
          return false;
        } else {
          console.log("Email sent: " + info.response);
          return true;
        }
      }
    );
  } catch (err) {
    console.log(err);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "unpopular.noreply@gmail.com",
        pass: "RobertZein2704$",
      },
    });
    transporter.sendMail(
      {
        from: "Unpopular",
        to: to,
        subject: subject,
        text: text,
        attachments: attachments,
      },
      function (error, info) {
        if (error) {
          console.log(error);
          return false;
        } else {
          console.log("Email sent: " + info.response);
          return true;
        }
      }
    );
  }
};
module.exports = sendMail;
