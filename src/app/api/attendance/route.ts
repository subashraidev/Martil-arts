import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// Fetch attendance logs
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date"); // YYYY-MM-DD
    const classId = searchParams.get("classId");
    const profileId = searchParams.get("profileId");

    const query: any = {};
    if (date) query.date = date;
    if (classId) query.classId = parseInt(classId);
    if (profileId) {
      // Students can only view their own attendance
      const profId = parseInt(profileId);
      if (session.role === "STUDENT") {
        const studentProfile = await prisma.profile.findUnique({
          where: { userId: session.userId },
        });
        if (!studentProfile || studentProfile.id !== profId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
      query.profileId = profId;
    } else {
      // Non-students must specify a search parameter or have admin access
      if (session.role === "STUDENT") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const logs = await prisma.attendance.findMany({
      where: query,
      include: {
        profile: true,
        class: { include: { program: true } },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Fetch attendance error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Mark attendance (Self check-in via QR or Instructor manual submit)
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Case 1: Student Self Check-in (simulated QR code scan)
    if (session.role === "STUDENT") {
      const { classId } = body;
      if (!classId) {
        return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
      }

      const profile = await prisma.profile.findUnique({
        where: { userId: session.userId },
      });

      if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 400 });
      }

      const today = new Date().toISOString().split("T")[0];

      // Check if already checked in today for this class
      const existing = await prisma.attendance.findFirst({
        where: {
          profileId: profile.id,
          classId: parseInt(classId),
          date: today,
        },
      });

      if (existing) {
        return NextResponse.json({
          success: true,
          message: "You are already checked in for this class!",
          alreadyCheckedIn: true,
          attendance: existing,
        });
      }

      const attendance = await prisma.attendance.create({
        data: {
          profileId: profile.id,
          classId: parseInt(classId),
          date: today,
          status: "Present",
        },
      });

      return NextResponse.json({ success: true, message: "Checked in successfully!", attendance });
    }

    // Case 2: Instructor/Admin bulk check-in sheet
    if (session.role === "INSTRUCTOR" || session.role === "ADMIN") {
      const { classId, date, records } = body; // records: [{ profileId: number, status: 'Present'|'Absent'|'Late' }]

      if (!classId || !date || !records || !Array.isArray(records)) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const results = [];
      for (const record of records) {
        // Upsert attendance for each student on this date for this class
        const attendance = await prisma.attendance.findFirst({
          where: {
            classId: parseInt(classId),
            profileId: parseInt(record.profileId),
            date: date,
          },
        });

        if (attendance) {
          const updated = await prisma.attendance.update({
            where: { id: attendance.id },
            data: { status: record.status },
          });
          results.push(updated);
        } else {
          const created = await prisma.attendance.create({
            data: {
              classId: parseInt(classId),
              profileId: parseInt(record.profileId),
              date: date,
              status: record.status,
            },
          });
          results.push(created);
        }
      }

      return NextResponse.json({ success: true, count: results.length });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Mark attendance error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
