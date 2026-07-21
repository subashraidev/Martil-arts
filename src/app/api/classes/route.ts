import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// Fetch all classes
export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        program: true,
        instructor: {
          include: { profile: true },
        },
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    });
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Fetch classes error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Add Class (ADMIN only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, programId, dayOfWeek, startTime, endTime, capacity, instructorId } = await req.json();

    if (!name || !programId || !dayOfWeek || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        programId: parseInt(programId),
        dayOfWeek,
        startTime,
        endTime,
        capacity: capacity ? parseInt(capacity) : 20,
        instructorId: instructorId ? parseInt(instructorId) : null,
      },
    });

    return NextResponse.json({ success: true, class: newClass });
  } catch (error) {
    console.error("Create class error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Edit or delete class (ADMIN only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, name, programId, dayOfWeek, startTime, endTime, capacity, instructorId } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing class ID" }, { status: 400 });
    }

    const updated = await prisma.class.update({
      where: { id: parseInt(id) },
      data: {
        name,
        programId: programId ? parseInt(programId) : undefined,
        dayOfWeek,
        startTime,
        endTime,
        capacity: capacity ? parseInt(capacity) : undefined,
        instructorId: instructorId !== undefined ? (instructorId ? parseInt(instructorId) : null) : undefined,
      },
    });

    return NextResponse.json({ success: true, class: updated });
  } catch (error) {
    console.error("Update class error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing class ID" }, { status: 400 });
    }

    await prisma.class.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: "Class deleted successfully" });
  } catch (error) {
    console.error("Delete class error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
