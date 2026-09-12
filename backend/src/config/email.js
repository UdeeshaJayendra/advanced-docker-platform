const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "mailpit",
  port: Number(process.env.SMTP_PORT || 1025),
  secure: false
});

const sendTestEmail = async () => {
  const info = await transporter.sendMail({
    from: "TaskFlow <noreply@taskflow.local>",
    to: "developer@taskflow.local",
    subject: "TaskFlow Test Email",
    text: "This is a test email from the TaskFlow backend through Mailpit."
  });

  console.log(`Test email sent: ${info.messageId}`);

  return info;
};

module.exports = {
  sendTestEmail
};