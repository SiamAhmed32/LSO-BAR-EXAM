import transport from "@/lib/nodemailer";
import { generateOTP, storeOTP } from "./otp";

interface OrderItem {
  examTitle: string | null;
  price: number;
}

interface OrderData {
  id: string;
  totalAmount: number;
  billingName: string;
  billingEmail: string;
  billingAddress?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingPostcode?: string | null;
  billingCountry?: string | null;
  createdAt: Date;
  orderItems: OrderItem[];
  user?: {
    name: string;
    email: string;
  };
}

/**
 * Send OTP email to user
 */
export async function sendOTPEmail(email: string, name?: string): Promise<string> {
  const otp = generateOTP();
  
  // Store OTP in Redis
  await storeOTP(email, otp);
  
  const mailOptions = {
    from: process.env.APP_EMAIL || "lsobarexamteam@gmail.com",
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

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(order: OrderData): Promise<void> {
  // Check if email is configured
  if (!process.env.APP_PASSWORD) {
    console.warn("⚠️ APP_PASSWORD not set - cannot send emails");
    return;
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsHtml = order.orderItems.map((item, index) => `
    <tr style="border-bottom: 1px solid #e0e0e0;">
      <td style="padding: 12px; text-align: left;">${index + 1}</td>
      <td style="padding: 12px; text-align: left;">${item.examTitle || 'Exam'}</td>
      <td style="padding: 12px; text-align: right;">$${item.price.toFixed(2)} CAD</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.APP_EMAIL || "lsobarexamteam@gmail.com",
    to: order.billingEmail,
    subject: `Order Confirmation - Order #${order.id.substring(0, 8)}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #e0e0e0;">
            <h1 style="color: #2c3e50; margin-top: 0;">LSO Bar Exam Platform</h1>
            <h2 style="color: #27ae60;">Order Confirmation</h2>
            <p>Hello ${order.billingName},</p>
            <p>Thank you for your purchase! Your order has been confirmed and processed successfully.</p>
            
            <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #e0e0e0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Order Details</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Order Date:</strong> ${orderDate}</p>
              <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)} CAD</p>
            </div>

            <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #e0e0e0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Items Purchased</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f8f9fa; border-bottom: 2px solid #e0e0e0;">
                    <th style="padding: 12px; text-align: left;">#</th>
                    <th style="padding: 12px; text-align: left;">Exam</th>
                    <th style="padding: 12px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f8f9fa; border-top: 2px solid #e0e0e0; font-weight: bold;">
                    <td colspan="2" style="padding: 12px; text-align: right;">Total:</td>
                    <td style="padding: 12px; text-align: right;">$${order.totalAmount.toFixed(2)} CAD</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #27ae60;">
              <p style="margin: 0; color: #2c3e50;"><strong>What's Next?</strong></p>
              <p style="margin: 10px 0 0 0; color: #2c3e50;">Your purchased exams are now available in your account. You can access them by logging into your account and navigating to the Practice section.</p>
            </div>

            <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #e0e0e0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Billing Information</h3>
              <p><strong>Name:</strong> ${order.billingName}</p>
              <p><strong>Email:</strong> ${order.billingEmail}</p>
              ${order.billingAddress ? `<p><strong>Address:</strong> ${order.billingAddress}</p>` : ''}
              ${order.billingCity ? `<p><strong>City:</strong> ${order.billingCity}</p>` : ''}
              ${order.billingState ? `<p><strong>State/Province:</strong> ${order.billingState}</p>` : ''}
              ${order.billingPostcode ? `<p><strong>Postal Code:</strong> ${order.billingPostcode}</p>` : ''}
              ${order.billingCountry ? `<p><strong>Country:</strong> ${order.billingCountry}</p>` : ''}
            </div>

            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #95a5a6; font-size: 12px; text-align: center; margin: 0;">
              This is an automated confirmation email. If you have any questions, please contact us at <a href="mailto:lsobarexamteam@gmail.com" style="color: #3498db;">lsobarexamteam@gmail.com</a> or call us at <a href="tel:+14169919912" style="color: #3498db;">(416) 991-9912</a>.
            </p>
            <p style="color: #95a5a6; font-size: 12px; text-align: center; margin: 10px 0 0 0;">
              &copy; ${new Date().getFullYear()} LSO Bar Exam. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      LSO Bar Exam Platform - Order Confirmation
      
      Hello ${order.billingName},
      
      Thank you for your purchase! Your order has been confirmed and processed successfully.
      
      Order Details:
      Order ID: ${order.id}
      Order Date: ${orderDate}
      Total Amount: $${order.totalAmount.toFixed(2)} CAD
      
      Items Purchased:
      ${order.orderItems.map((item, index) => `${index + 1}. ${item.examTitle || 'Exam'} - $${item.price.toFixed(2)} CAD`).join('\n')}
      
      Total: $${order.totalAmount.toFixed(2)} CAD
      
      What's Next?
      Your purchased exams are now available in your account. You can access them by logging into your account and navigating to the Practice section.
      
      Billing Information:
      Name: ${order.billingName}
      Email: ${order.billingEmail}
      ${order.billingAddress ? `Address: ${order.billingAddress}` : ''}
      ${order.billingCity ? `City: ${order.billingCity}` : ''}
      ${order.billingState ? `State/Province: ${order.billingState}` : ''}
      ${order.billingPostcode ? `Postal Code: ${order.billingPostcode}` : ''}
      ${order.billingCountry ? `Country: ${order.billingCountry}` : ''}
      
      If you have any questions, please contact us at lsobarexamteam@gmail.com or call us at (416) 991-9912.
      
      © ${new Date().getFullYear()} LSO Bar Exam. All rights reserved.
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${order.billingEmail}`);
  } catch (error: any) {
    console.error("❌ Error sending order confirmation email:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      response: error?.response,
    });
    // Don't throw - we don't want to fail the webhook if email fails
  }
}

/**
 * Send new order notification email to admin
 */
export async function sendAdminOrderNotificationEmail(order: OrderData): Promise<void> {
  // Check if email is configured
  if (!process.env.APP_PASSWORD) {
    console.warn("⚠️ APP_PASSWORD not set - cannot send emails");
    return;
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsHtml = order.orderItems.map((item, index) => `
    <tr style="border-bottom: 1px solid #e0e0e0;">
      <td style="padding: 12px; text-align: left;">${index + 1}</td>
      <td style="padding: 12px; text-align: left;">${item.examTitle || 'Exam'}</td>
      <td style="padding: 12px; text-align: right;">$${item.price.toFixed(2)} CAD</td>
    </tr>
  `).join('');

  const adminEmail = process.env.APP_EMAIL || "lsobarexamteam@gmail.com";

  const mailOptions = {
    from: process.env.APP_EMAIL || "lsobarexamteam@gmail.com",
    to: adminEmail,
    subject: `🆕 New Order Received - Order #${order.id.substring(0, 8)} - $${order.totalAmount.toFixed(2)}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Order Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #e0e0e0;">
            <h1 style="color: #2c3e50; margin-top: 0;">LSO Bar Exam Platform</h1>
            <h2 style="color: #e74c3c;">New Order Notification</h2>
            <p>You have received a new order!</p>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404;"><strong>Order ID:</strong> ${order.id}</p>
              <p style="margin: 10px 0 0 0; color: #856404;"><strong>Order Date:</strong> ${orderDate}</p>
              <p style="margin: 10px 0 0 0; color: #856404;"><strong>Total Amount:</strong> <span style="font-size: 18px; font-weight: bold; color: #e74c3c;">$${order.totalAmount.toFixed(2)} CAD</span></p>
            </div>

            <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #e0e0e0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Customer Information</h3>
              <p><strong>Name:</strong> ${order.billingName}</p>
              <p><strong>Email:</strong> <a href="mailto:${order.billingEmail}" style="color: #3498db;">${order.billingEmail}</a></p>
              ${order.user ? `<p><strong>Account Email:</strong> <a href="mailto:${order.user.email}" style="color: #3498db;">${order.user.email}</a></p>` : ''}
              ${order.user ? `<p><strong>Account Name:</strong> ${order.user.name}</p>` : ''}
            </div>

            <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #e0e0e0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f8f9fa; border-bottom: 2px solid #e0e0e0;">
                    <th style="padding: 12px; text-align: left;">#</th>
                    <th style="padding: 12px; text-align: left;">Exam</th>
                    <th style="padding: 12px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f8f9fa; border-top: 2px solid #e0e0e0; font-weight: bold;">
                    <td colspan="2" style="padding: 12px; text-align: right;">Total:</td>
                    <td style="padding: 12px; text-align: right;">$${order.totalAmount.toFixed(2)} CAD</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #e0e0e0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Billing Information</h3>
              ${order.billingAddress ? `<p><strong>Address:</strong> ${order.billingAddress}</p>` : ''}
              ${order.billingCity ? `<p><strong>City:</strong> ${order.billingCity}</p>` : ''}
              ${order.billingState ? `<p><strong>State/Province:</strong> ${order.billingState}</p>` : ''}
              ${order.billingPostcode ? `<p><strong>Postal Code:</strong> ${order.billingPostcode}</p>` : ''}
              ${order.billingCountry ? `<p><strong>Country:</strong> ${order.billingCountry}</p>` : ''}
            </div>

            <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #17a2b8;">
              <p style="margin: 0; color: #0c5460;"><strong>Action Required:</strong></p>
              <p style="margin: 10px 0 0 0; color: #0c5460;">Please review this order in the admin dashboard. The customer has been automatically sent a confirmation email.</p>
            </div>

            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #95a5a6; font-size: 12px; text-align: center; margin: 0;">
              This is an automated notification from the LSO Bar Exam Platform.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      LSO Bar Exam Platform - New Order Notification
      
      You have received a new order!
      
      Order ID: ${order.id}
      Order Date: ${orderDate}
      Total Amount: $${order.totalAmount.toFixed(2)} CAD
      
      Customer Information:
      Name: ${order.billingName}
      Email: ${order.billingEmail}
      ${order.user ? `Account Email: ${order.user.email}` : ''}
      ${order.user ? `Account Name: ${order.user.name}` : ''}
      
      Order Items:
      ${order.orderItems.map((item, index) => `${index + 1}. ${item.examTitle || 'Exam'} - $${item.price.toFixed(2)} CAD`).join('\n')}
      
      Total: $${order.totalAmount.toFixed(2)} CAD
      
      Billing Information:
      ${order.billingAddress ? `Address: ${order.billingAddress}` : ''}
      ${order.billingCity ? `City: ${order.billingCity}` : ''}
      ${order.billingState ? `State/Province: ${order.billingState}` : ''}
      ${order.billingPostcode ? `Postal Code: ${order.billingPostcode}` : ''}
      ${order.billingCountry ? `Country: ${order.billingCountry}` : ''}
      
      Action Required: Please review this order in the admin dashboard. The customer has been automatically sent a confirmation email.
      
      This is an automated notification from the LSO Bar Exam Platform.
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`✅ Admin order notification email sent to ${adminEmail}`);
  } catch (error: any) {
    console.error("❌ Error sending admin order notification email:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      response: error?.response,
    });
    // Don't throw - we don't want to fail the webhook if email fails
  }
}

/**
 * Send payment failure alert email to admin
 */
export async function sendPaymentFailureAlertEmail(order: OrderData, failureReason?: string): Promise<void> {
  // Check if email is configured
  if (!process.env.APP_PASSWORD) {
    console.warn("⚠️ APP_PASSWORD not set - cannot send emails");
    return;
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const adminEmail = process.env.APP_EMAIL || "lsobarexamteam@gmail.com";

  const mailOptions = {
    from: process.env.APP_EMAIL || "lsobarexamteam@gmail.com",
    to: adminEmail,
    subject: `⚠️ Payment Failed - Order #${order.id.substring(0, 8)} - $${order.totalAmount.toFixed(2)}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Failure Alert</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #e0e0e0;">
            <h1 style="color: #2c3e50; margin-top: 0;">LSO Bar Exam Platform</h1>
            <h2 style="color: #e74c3c;">⚠️ Payment Failure Alert</h2>
            <p>A payment has failed for the following order:</p>
            
            <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <p style="margin: 0; color: #721c24;"><strong>Order ID:</strong> ${order.id}</p>
              <p style="margin: 10px 0 0 0; color: #721c24;"><strong>Order Date:</strong> ${orderDate}</p>
              <p style="margin: 10px 0 0 0; color: #721c24;"><strong>Amount:</strong> <span style="font-size: 18px; font-weight: bold; color: #e74c3c;">$${order.totalAmount.toFixed(2)} CAD</span></p>
              ${failureReason ? `<p style="margin: 10px 0 0 0; color: #721c24;"><strong>Failure Reason:</strong> ${failureReason}</p>` : ''}
            </div>

            <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #e0e0e0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Customer Information</h3>
              <p><strong>Name:</strong> ${order.billingName}</p>
              <p><strong>Email:</strong> <a href="mailto:${order.billingEmail}" style="color: #3498db;">${order.billingEmail}</a></p>
              ${order.user ? `<p><strong>Account Email:</strong> <a href="mailto:${order.user.email}" style="color: #3498db;">${order.user.email}</a></p>` : ''}
              ${order.user ? `<p><strong>Account Name:</strong> ${order.user.name}</p>` : ''}
            </div>

            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404;"><strong>Action Required:</strong></p>
              <p style="margin: 10px 0 0 0; color: #856404;">Please review this order and consider reaching out to the customer to assist with the payment issue. The order status has been updated to FAILED in the system.</p>
            </div>

            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #95a5a6; font-size: 12px; text-align: center; margin: 0;">
              This is an automated alert from the LSO Bar Exam Platform.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      LSO Bar Exam Platform - Payment Failure Alert
      
      A payment has failed for the following order:
      
      Order ID: ${order.id}
      Order Date: ${orderDate}
      Amount: $${order.totalAmount.toFixed(2)} CAD
      ${failureReason ? `Failure Reason: ${failureReason}` : ''}
      
      Customer Information:
      Name: ${order.billingName}
      Email: ${order.billingEmail}
      ${order.user ? `Account Email: ${order.user.email}` : ''}
      ${order.user ? `Account Name: ${order.user.name}` : ''}
      
      Action Required: Please review this order and consider reaching out to the customer to assist with the payment issue. The order status has been updated to FAILED in the system.
      
      This is an automated alert from the LSO Bar Exam Platform.
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`✅ Payment failure alert email sent to ${adminEmail}`);
  } catch (error: any) {
    console.error("❌ Error sending payment failure alert email:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      response: error?.response,
    });
    // Don't throw - we don't want to fail the webhook if email fails
  }
}

