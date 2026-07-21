import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Fetch all instructors
export async function GET() {
  try {
    const instructors = await prisma.user.findMany({
      where: { role: "INSTRUCTOR" },
      include: { profile: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(instructors);
  } catch (error) {
    console.error("Fetch instructors error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Add instructor (ADMIN only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { email, password, firstName, lastName, dob, age, gender, phone, address, emergencyContact, currentBelt } = await req.json();

    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const instructor = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          role: "INSTRUCTOR",
        },
      });

      const newProfile = await tx.profile.create({
        data: {
          userId: newUser.id,
          firstName,
          lastName,
          dob: dob || "1990-01-01",
          age: age ? parseInt(age) : 30,
          gender: gender || "Male",
          phone,
          address: address || "",
          emergencyContact: emergencyContact || "",
          currentBelt: currentBelt || "Black (1st Dan)",
          membershipStatus: "Active",
          membershipType: "Monthly",
        },
      });

      return { ...newUser, profile: newProfile };
    });

    return NextResponse.json({ success: true, instructor });
  } catch (error) {
    console.error("Create instructor error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
