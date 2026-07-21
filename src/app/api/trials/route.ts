import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// Public booking for a free trial
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, age, parentName, phone, email, preferredDate, preferredTime, experience, notes } = data;

    if (!name || !age || !phone || !email || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const trialRequest = await prisma.trialRequest.create({
      data: {
        name,
        age: parseInt(age),
        parentName: parentName || null,
        phone,
        email,
        preferredDate,
        preferredTime,
        experience,
        notes: notes || null,
        status: "Pending",
      },
    });

    return NextResponse.json({ success: true, trialRequest });
  } catch (error: any) {
    console.error("Free trial API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Fetch all trial requests (Admin / Instructor only)
export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const trials = await prisma.trialRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(trials);
  } catch (error) {
    console.error("Fetch trials API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Update trial status (Admin only)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, status, assignedInstructorId } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const updated = await prisma.trialRequest.update({
      where: { id: parseInt(id) },
      data: {
        status,
        assignedInstructorId: assignedInstructorId ? parseInt(assignedInstructorId) : null,
      },
    });

    return NextResponse.json({ success: true, trialRequest: updated });
  } catch (error) {
    console.error("Update trial API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
