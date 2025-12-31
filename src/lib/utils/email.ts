import transport from "@/lib/nodemailer";
import { generateOTP, storeOTP } from "./otp";

/**
 * Send OTP email to user
 */
export async function sendOTPEmail(email: string, name?: string): Promise<string> {
  const otp = generateOTP();
  
  // Store OTP in Redis
  await storeOTP(email, otp);
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || "sr.sohan088@gmail.com",
    to: email,
    subject: "Your Login OTP - LSO Bar Exam",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login OTP</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #e0e0e0;">
            <h1 style="color: #2c3e50; margin-top: 0;">LSO Bar Exam Platform</h1>
            <h2 style="color: #34495e;">Your Login Verification Code</h2>
            <p>Hello ${name || "User"},</p>
            <p>You have requested to login to your account. Please use the following One-Time Password (OTP) to complete your login:</p>
            <div style="background-color: #ffffff; border: 2px dashed #3498db; border-radius: 5px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #3498db; font-size: 36px; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #7f8c8d; font-size: 14px;">
              <strong>Important:</strong>
            </p>
            <ul style="color: #7f8c8d; font-size: 14px;">
              <li>This OTP is valid for 10 minutes only</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this code, please ignore this email</li>
            </ul>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #95a5a6; font-size: 12px; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      LSO Bar Exam Platform - Login Verification Code
      
      Hello ${name || "User"},
      
      You have requested to login to your account. Please use the following One-Time Password (OTP) to complete your login:
      
      ${otp}
      
      Important:
      - This OTP is valid for 10 minutes only
      - Do not share this code with anyone
      - If you didn't request this code, please ignore this email
      
      This is an automated email. Please do not reply to this message.
    `,
  };
  
  try {
    await transport.sendMail(mailOptions);
    // In development, return OTP for testing. In production, return empty string
    return process.env.NODE_ENV === "development" ? otp : "";
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}

