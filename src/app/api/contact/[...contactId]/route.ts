import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { ratelimit } from "@/lib/server/ratelimit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
   try {
  const url = new URL(request.url);
  const contactId = url.pathname.split("/").pop();
  if (!contactId) {
    return NextResponse.json(
      { error: "Contact ID is required" },
      { status: 400 }
    );
  }
     if (!contactId) {
       return NextResponse.json(
         { error: "Contact ID is required" },
         { status: 400 }
       );
     }
     const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';
     const { success } = await ratelimit.limit(ip);
     if (!success) {
       return NextResponse.json(
         { error: 'Too many requests', message: 'Please try again later.' },
         { status: 429 }
       );
     }
     const contact = await prisma.contact.findUnique({
       where: { id: contactId },
     });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact retrieved successfully",
        data: { contact },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact GET Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to retrieve contact",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
   try {
     const session = await getSession();
     if (!session || session.role !== "ADMIN") {
       return NextResponse.json(
         { error: "Unauthorized", message: "You are not authorized to access this resource" },
         { status: 401 }
       );
     }
     const url = new URL(request.url);
     const contactId = url.pathname.split("/").pop();
     if (!contactId) {
       return NextResponse.json(
         { error: "Contact ID is required" },
         { status: 400 }
       );
     }
     const { success } = await ratelimit.limit(session.id);
     if (!success) {
       return NextResponse.json(
         { error: 'Too many requests', message: 'Please try again later.' },
         { status: 429 }
       );
     }
     const body = await request.json();
    const { isRead } = body;

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        isRead: isRead ?? true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact status updated successfully",
        data: { contact: updatedContact },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact PATCH Error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Contact not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to update contact status",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
   try {
     const session = await getSession();
     if (!session || session.role !== "ADMIN") {
       return NextResponse.json(
         { error: "Unauthorized", message: "You are not authorized to access this resource" },
         { status: 401 }
       );
     }
     const url = new URL(request.url);
     const contactId = url.pathname.split("/").pop();
     if (!contactId) {
       return NextResponse.json(
         { error: "Contact ID is required" },
         { status: 400 }
       );
     }
     const { success } = await ratelimit.limit(session.id);
     if (!success) {
       return NextResponse.json(
         { error: 'Too many requests', message: 'Please try again later.' },
         { status: 429 }
       );
     }

    await prisma.contact.delete({
      where: { id: contactId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact DELETE Error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Contact not found" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to delete contact",
      },
      { status: 500 }
    );
  }
}
