const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "mailpit",
  port: Number(process.env.SMTP_PORT || 1025),
  secure: false,
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000
});

const sendJobEmail = async (job) => {
  const info = await transporter.sendMail({
    from: "TaskFlow Worker <worker@taskflow.local>",
    to: "developer@taskflow.local",
    subject: "TaskFlow Background Job Completed",
    text: `TaskFlow worker completed a background job.\n\nJob:\n${JSON.stringify(job, null, 2)}`
  });

  console.log(`Job completion email sent: ${info.messageId}`);
};

module.exports = {
  sendJobEmail
};
