import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// Helper to get parameters in Next.js App Router route handlers
// In Next.js 15, params is a Promise, so we must await it!
interface RouteParams {
  params: Promise<{ id: string }>;
}

// Fetch single student detail
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = parseInt(id);

    // Students can only view their own profile; admins/instructors can view any
    if (session.role === "STUDENT" && session.userId !== studentId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        profile: {
          include: {
            attendance: {
              include: { class: { include: { program: true } } },
              orderBy: { date: "desc" },
            },
            beltProgressions: {
              orderBy: { id: "asc" },
            },
            enrollments: {
              include: { program: true },
            },
          },
        },
        payments: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!student || student.role !== "STUDENT") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Fetch student details error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Update student details
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = parseInt(id);

    // Students can only edit their own profile; admins can edit any
    if (session.role === "STUDENT" && session.userId !== studentId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const {
      firstName,
      lastName,
      parentName,
      dob,
      age,
      gender,
      phone,
      address,
      emergencyContact,
      medicalInfo,
      currentBelt,
      beltProgressPercentage,
      membershipStatus,
      membershipType,
    } = data;

    // Check if user exists and is a student
    const existing = await prisma.user.findUnique({
      where: { id: studentId },
      include: { profile: true },
    });

    if (!existing || existing.role !== "STUDENT") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Role-based restrictions: Students cannot change their own belt, membership status/type, or progress percentage
    const isStudent = session.role === "STUDENT";
    const updateData: any = {
      firstName,
      lastName,
      parentName: parentName !== undefined ? parentName : existing.profile?.parentName,
      dob,
      age: age ? parseInt(age) : existing.profile?.age,
      gender,
      phone,
      address,
      emergencyContact,
      medicalInfo: medicalInfo !== undefined ? medicalInfo : existing.profile?.medicalInfo,
    };

    if (!isStudent) {
      if (currentBelt !== undefined) updateData.currentBelt = currentBelt;
      if (beltProgressPercentage !== undefined) updateData.beltProgressPercentage = parseInt(beltProgressPercentage);
      if (membershipStatus !== undefined) updateData.membershipStatus = membershipStatus;
      if (membershipType !== undefined) updateData.membershipType = membershipType;
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: studentId },
      data: updateData,
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Update student error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Delete student (ADMIN only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const studentId = parseInt(id);

    // Delete student (cascade will handle profile and enrollments)
    await prisma.user.delete({
      where: { id: studentId },
    });

    return NextResponse.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
