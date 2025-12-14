import { Prisma } from "@/generated/prisma/client";
import transport from "@/lib/nodemailer";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { ratelimit } from "@/lib/server/ratelimit";
import { contactValidationSchema } from "@/validation/contact.validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      console.warn("⚠️ Contact API - Rate limit exceeded for IP:", ip);
      return NextResponse.json(
        { error: "Too many requests", message: "Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = contactValidationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: result.error,
          message: "Please check your input and try again",
        },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;

    const contactInfo = await prisma.contact.create({
      data: {
        name,
        email,
        message,
        isRead: false,
      },
    });

    // Send confirmation email to user
    const userEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .footer { background-color: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank you for contacting us!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for reaching out to us through our contact form. We have received your message and will get back to you as soon as possible.</p>
            
            <h3>Your Message:</h3>
            <blockquote style="background-color: white; padding: 15px; border-left: 4px solid #4f46e5; margin: 15px 0;">
              "${message}"
            </blockquote>
            
            <h3>What happens next?</h3>
            <ul>
              <li>Our team will review your message</li>
              <li>We'll respond within 24-48 hours</li>
              <li>For urgent matters, please call our support line</li>
            </ul>
            
            <p><strong>Reference ID:</strong> ${contactInfo.id}</p>
            <p><strong>Submitted:</strong> ${new Date(
              contactInfo.createdAt
            ).toLocaleString()}</p>
          </div>
          <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this email.</p>
            <p>&copy; 2024 LSO BAR EXAM. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send notification email to admin
    const adminEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #fef2f2; }
          .contact-info { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .message-box { background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <h2>You have received a new message from the contact form.</h2>
            
            <div class="contact-info">
              <h3>Contact Information:</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Submitted:</strong> ${new Date(
                contactInfo.createdAt
              ).toLocaleString()}</p>
              <p><strong>Reference ID:</strong> ${contactInfo.id}</p>
            </div>
            
            <div class="message-box">
              <h3>Message:</h3>
              <p>${message.replace(/\n/g, "<br>")}</p>
            </div>
            
            <p><strong>Action Required:</strong> Please respond to this inquiry within 24-48 hours.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send emails with error handling
    const emailPromises = [];

    // Confirmation email to user
    emailPromises.push(
      transport
        .sendMail({
          from: "chayansd5656@gmail.com",
          to: email,
          subject: "Thank you for contacting us - We'll be in touch soon!",
          html: userEmailContent,
        })
        .catch((error) => {
          console.error("Failed to send user confirmation email:", error);
          return null;
        })
    );

    // Notification email to admin
    emailPromises.push(
      transport
        .sendMail({
          from: "noreply@lsbarexam.com",
          to: "chayansd5656@gmail.com",
          subject: `New Contact Form Submission from ${name}`,
          html: adminEmailContent,
        })
        .catch((error) => {
          console.error("Failed to send admin notification email:", error);
          return null;
        })
    );

    // Wait for all emails to be sent (or fail gracefully)
    await Promise.allSettled(emailPromises);

    return NextResponse.json(
      {
        success: true,
        message:
          "Your message has been sent successfully! We'll get back to you soon.",
        data: {
          contactInfo: {
            id: contactInfo.id,
            name: contactInfo.name,
            email: contactInfo.email,
            message: contactInfo.message,
            createdAt: contactInfo.createdAt,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Contact API - Error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: "Duplicate Entry",
            message:
              "This email has already been used for contact. Please try with a different email or wait for our response.",
          },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message:
          "We're sorry, but there was an error processing your request. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// GET all contact for admin
export async function GET(request: NextRequest): Promise<NextResponse> {
  //only admin can access this
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "You are not authorized to access this resource",
      },
      { status: 401 }
    );
  }
  const { success } = await ratelimit.limit(session.id);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests", message: "Please try again later." },
      { status: 429 }
    );
  }
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.contact.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        message: "Contacts retrieved successfully",
        data: {
          contacts,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact GET Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to retrieve contacts",
      },
      { status: 500 }
    );
  }
}
