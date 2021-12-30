const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "unpopular.noreply@gmail.com",
    pass: "RobertZein2704$",
  },
});
const sendMail = (subject, text, to, attachments) => {
  transporter.sendMail(
    {
      from: "Unpopular.bg",
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
};
module.exports = sendMail;
