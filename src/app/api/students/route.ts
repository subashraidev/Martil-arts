import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Fetch all students (ADMIN or INSTRUCTOR only)
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const belt = searchParams.get("belt") || "";
    const status = searchParams.get("status") || "";

    // Build filter query
    const whereClause: any = {
      role: "STUDENT",
    };

    if (belt) {
      whereClause.profile = {
        ...whereClause.profile,
        currentBelt: belt,
      };
    }

    if (status) {
      whereClause.profile = {
        ...whereClause.profile,
        membershipStatus: status,
      };
    }

    if (search) {
      whereClause.OR = [
        { email: { contains: search } },
        {
          profile: {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { parentName: { contains: search } },
              { phone: { contains: search } },
            ],
          },
        },
      ];
    }

    const students = await prisma.user.findMany({
      where: whereClause,
      include: {
        profile: {
          include: { enrollments: true }
        },
        payments: {
          orderBy: { date: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Fetch students API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Create a student manually (ADMIN only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    const {
      email,
      password,
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
      membershipStatus,
      membershipType,
      programId,
    } = data;

    if (!email || !password || !firstName || !lastName || !dob || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          role: "STUDENT",
        },
      });

      const newProfile = await tx.profile.create({
        data: {
          userId: newUser.id,
          firstName,
          lastName,
          parentName: parentName || null,
          dob,
          age: age ? parseInt(age) : 0,
          gender,
          phone,
          address,
          emergencyContact,
          medicalInfo: medicalInfo || null,
          currentBelt: currentBelt || "White",
          membershipStatus: membershipStatus || "Active",
          membershipType: membershipType || "Monthly",
        },
      });

      if (programId) {
        await tx.enrollment.create({
          data: {
            profileId: newProfile.id,
            programId: parseInt(programId),
            status: "Active",
          },
        });
      }

      // Add a belt progress record for the current belt
      await tx.beltProgress.create({
        data: {
          profileId: newProfile.id,
          beltColor: currentBelt || "White",
          level: currentBelt && ["Green", "Blue", "Purple"].includes(currentBelt) ? "Intermediate" 
                 : currentBelt && ["Brown", "Red"].includes(currentBelt) ? "Advanced"
                 : currentBelt && currentBelt.includes("Black") ? "Black Belt" : "Beginner",
          status: "Completed",
          skillsChecked: JSON.stringify(["All"]),
          poomsaeForm: "Basic Curriculum",
          promotedAt: new Date(),
        },
      });

      return { ...newUser, profile: newProfile };
    });

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Create student API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
