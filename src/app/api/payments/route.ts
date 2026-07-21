import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// Fetch payments (Admin sees all, Student sees own)
export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "STUDENT") {
      const payments = await prisma.payment.findMany({
        where: { userId: session.userId },
        orderBy: { date: "desc" },
      });
      return NextResponse.json(payments);
    }

    if (session.role === "ADMIN") {
      const payments = await prisma.payment.findMany({
        include: {
          user: { include: { profile: true } },
        },
        orderBy: { date: "desc" },
      });
      return NextResponse.json(payments);
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Fetch payments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Log a payment (Admin only or Stripe simulation)
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, amount, method, description } = await req.json();

    if (!email || !amount || !method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Resolve user by email
    const targetUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User email not found" }, { status: 404 });
    }

    // In a real system, you would verify Stripe transaction or restrict to Admin
    if (session.role !== "ADMIN" && session.userId !== targetUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const year = new Date().getFullYear();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `TKD-${year}-${randNum}`;

    const newPayment = await prisma.payment.create({
      data: {
        userId: targetUser.id,
        amount: parseFloat(amount),
        date: new Date().toISOString().split("T")[0],
        method,
        status: "Paid",
        invoiceNumber,
        description: description || "Monthly Tuition Fee",
      },
    });

    return NextResponse.json({ success: true, payment: newPayment });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
