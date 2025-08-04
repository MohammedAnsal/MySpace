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

export const sendRentReminderEmail = async (
  email: string,
  recipientName: string,
  hostelName: string,
  isUser: boolean = true
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

  const subject = isUser
    ? "Rent Payment Reminder - MySpace"
    : "Upcoming Rent Payment Notification - MySpace";

  const message = isUser
    ? `Your next rent payment for ${hostelName} is due in one week. Please ensure timely payment to avoid any inconvenience.`
    : `A rent payment for ${hostelName} is due in one week. Please be prepared for the incoming payment.`;

  let mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: subject,
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #FFFFFF; background-color: #BB956B; padding: 10px; text-align: center;">
        MySpace - Rent Reminder
        </h1>
        <p style="font-size: 16px; margin: 20px 0;">
          Dear <strong>${recipientName}</strong>,
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          ${message}
        </p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #BB956B;">
            Hostel: ${hostelName}
          </p>
          <p style="margin: 5px 0 0 0; color: #666;">
            Due Date: ${new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString()}
          </p>
        </div>
        <p style="font-size: 14px; color: #666;">
          Thank you for choosing MySpace!
        </p>
        <p style="font-size: 14px;">
        Best regards,<br>MySpace Team
        </p>
        </div> `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Rent reminder email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending rent reminder email:", error);
  }
};

export const sendStayDurationEmail = async (
  email: string,
  recipientName: string,
  hostelName: string,
  isUser: boolean = true
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

  const subject = isUser
    ? "Stay Duration Ending Soon - MySpace"
    : "Tenant Stay Ending Soon - MySpace";

  const message = isUser
    ? `Your stay at ${hostelName} is ending in one week. Please plan to renew your stay if needed.`
    : `A tenant's stay at ${hostelName} is ending in one week. Please prepare for potential renewal or new tenant.`;

  let mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: subject,
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #FFFFFF; background-color: #BB956B; padding: 10px; text-align: center;">
        MySpace - Stay Duration Reminder
        </h1>
        <p style="font-size: 16px; margin: 20px 0;">
          Dear <strong>${recipientName}</strong>,
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          ${message}
        </p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #BB956B;">
            Hostel: ${hostelName}
          </p>
          <p style="margin: 5px 0 0 0; color: #666;">
            Stay Ends: ${new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString()}
          </p>
        </div>
        <p style="font-size: 14px; color: #666;">
          Thank you for choosing MySpace!
        </p>
        <p style="font-size: 14px;">
        Best regards,<br>MySpace Team
        </p>
        </div> `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Stay duration email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending stay duration email:", error);
  }
};
