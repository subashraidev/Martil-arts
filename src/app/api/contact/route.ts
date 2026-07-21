import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const contactMsg = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || "General Inquiry",
        message,
        status: "Unread",
      },
    });

    return NextResponse.json({ success: true, message: "Message sent successfully!", contactMsg });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Fetch messages (Admin only)
export async function GET() {
  try {
    const session = await prisma.user.findFirst({
      // We check auth in our routing layer, but let's secure it.
      // In a real route, we use getSessionUser, but let's check it.
    });
    // This is handled in Admin Panel API directly, but we can list messages here too.
    return NextResponse.json({ message: "Use admin session authentication" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
