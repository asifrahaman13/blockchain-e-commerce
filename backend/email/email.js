import { createTransport } from "nodemailer";

async function SendEmail(email, otp, subject="Verify Your Email Address", text="Your OTP for email verification is") {
  const transporter = createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email, // Use the "email" parameter
    subject: subject,
    text: `${text} ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export default SendEmail;
