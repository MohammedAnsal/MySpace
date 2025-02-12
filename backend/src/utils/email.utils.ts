import nodemailer from "nodemailer";

export const sendOtpMail = async (
  email: string,
  matter: string,
  otp: string
) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD, 
    },
  });

  let mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Verify Your Email to Complete The Process on MySpace",
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #FFFFFF; background-color: #BB956B; padding: 10px; text-align: center;">
        Welcome to MySpace!
        </h1>
        <p style="font-size: 16px;">
          Please enter the OTP to verify your email and complete your process of <strong>${matter}</strong>:
        </p>
        <div style="text-align: center;">
         <h3 style=" padding: 25px; display: inline-block; border: 2px solid #BB956B; border-radius: 8px;">
        Verification: ${otp}
        </h3>
        <p style="color:#f8b878">Expires after 90 sec</p>
        </div>
        <p style="font-size: 14px;">Thank you for joining us!</p>
        <p style="font-size: 14px;">
        Best regards,<br>MySpace Team
        </p>
        </div> `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
