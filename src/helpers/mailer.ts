import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async({email,emailType,userId}:any) => {
    try {
      const hashedToken = await bcryptjs.hash(userId.toString(), 10);

      if (emailType === "VERIFY") {
        await User.findByIdAndUpdate(userId, {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000, // 1 hour
        });
      } else if (emailType === "RESET") {
        await User.findByIdAndUpdate(userId, {
          forgotPasswordToken: hashedToken,
          forgotPasswordExpiry: Date.now() + 3600000, // 1 hour
        });
      }

      var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: 'hyperpatil151@gmail.com',
        to: email,
        subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
        html: emailType === "VERIFY"
          ? `
            <p>
              Click <a href="${process.env.DOMAIN}/verifyEmail?token=${hashedToken}">here</a> to verify your email.
              Or copy and paste this link in your browser:<br>
              ${process.env.DOMAIN}/verifyEmail?token=${hashedToken}
            </p>
          `
          : `
            <p>
              Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a> to reset your password.
              Or copy and paste this link in your browser:<br>
              ${process.env.DOMAIN}/resetpassword?token=${hashedToken}
            </p>
          `
      }

      const mailResponse = await transport.sendMail(mailOptions);
        // if (mailResponse) {
        //     console.log("Email sent successfully!");
        // } else {
        //     console.log("Failed to send email.");
        // }
        return mailResponse;

    } catch (error:any) {
        console.log("Error: ",error.message);
    }
}
