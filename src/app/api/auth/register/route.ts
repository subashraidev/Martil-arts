import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
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
      programId,
      membershipPlan,
      preferredSchedule,
    } = data;

    if (!email || !password || !firstName || !lastName || !dob || !phone) {
      return NextResponse.json(
        { error: "Missing required fields (email, password, name, dob, phone)" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create User, Profile and Enrollment in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          role: "STUDENT",
        },
      });

      // 2. Create Profile
      const parsedAge = age ? parseInt(age) : 0;
      const newProfile = await tx.profile.create({
        data: {
          userId: newUser.id,
          firstName,
          lastName,
          parentName: parentName || null,
          dob,
          age: parsedAge,
          gender,
          phone,
          address,
          emergencyContact,
          medicalInfo: medicalInfo || null,
          currentBelt: "White",
          beltProgressPercentage: 0,
          membershipStatus: "Active",
          membershipType: membershipPlan || "Monthly",
          preferredSchedule: preferredSchedule || null,
        },
      });

      // 3. Create Enrollment if program selected
      if (programId) {
        await tx.enrollment.create({
          data: {
            profileId: newProfile.id,
            programId: parseInt(programId),
            status: "Active",
          },
        });
      }

      // 4. Create an initial BeltProgress entry for White Belt
      await tx.beltProgress.create({
        data: {
          profileId: newProfile.id,
          beltColor: "White",
          level: "Beginner",
          status: "Completed",
          skillsChecked: JSON.stringify(["Stances", "Blocks"]),
          poomsaeForm: "Basic Stances",
          instructorNotes: "Initial registration belt",
          promotedAt: new Date(),
          certificateUrl: `/certificates/cert_${newProfile.id}_White.pdf`,
        },
      });

      // 5. Create a next BeltProgress entry for Yellow Belt (In Progress)
      await tx.beltProgress.create({
        data: {
          profileId: newProfile.id,
          beltColor: "Yellow",
          level: "Beginner",
          status: "In Progress",
          skillsChecked: JSON.stringify([]),
          poomsaeForm: "Taegeuk Il Jang",
        },
      });

      // 6. Create a default payment invoice for registration fee
      const year = new Date().getFullYear();
      const randNum = Math.floor(1000 + Math.random() * 9000);
      await tx.payment.create({
        data: {
          userId: newUser.id,
          amount: 150.0, // base registration fee or month 1
          date: new Date().toISOString().split("T")[0],
          method: "Credit Card",
          status: "Paid",
          invoiceNumber: `TKD-${year}-${randNum}`,
          description: "Initial Registration Fee & Monthly Tuition",
        },
      });

      return {
        ...newUser,
        profile: newProfile,
      };
    });

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
    };

    const token = signToken(payload);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        currentBelt: "White",
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
