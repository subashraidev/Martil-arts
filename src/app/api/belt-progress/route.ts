import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// Fetch belt progress records
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    const query: any = {};
    if (profileId) {
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
      if (session.role === "STUDENT") {
        const studentProfile = await prisma.profile.findUnique({
          where: { userId: session.userId },
        });
        if (!studentProfile) return NextResponse.json([]);
        query.profileId = studentProfile.id;
      }
    }

    const records = await prisma.beltProgress.findMany({
      where: query,
      include: {
        profile: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Fetch belt progress error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Request evaluation (Student) or Create evaluation record (Instructor/Admin)
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { profileId, beltColor, level, poomsaeForm, skillsChecked } = body;

    let targetProfileId = parseInt(profileId);

    if (session.role === "STUDENT") {
      const studentProfile = await prisma.profile.findUnique({
        where: { userId: session.userId },
      });
      if (!studentProfile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 400 });
      }
      targetProfileId = studentProfile.id;
    }

    const record = await prisma.beltProgress.create({
      data: {
        profileId: targetProfileId,
        beltColor,
        level,
        poomsaeForm,
        skillsChecked: typeof skillsChecked === "string" ? skillsChecked : JSON.stringify(skillsChecked || []),
        status: session.role === "STUDENT" ? "Pending Approval" : "In Progress",
      },
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error("Create belt progress error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Evaluate, approve, and promote a student (Instructor/Admin only)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, status, instructorNotes, skillsChecked, sparringRating, boardBreakingRating } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get the current record to find the profile
    const record = await prisma.beltProgress.findUnique({
      where: { id: parseInt(id) },
    });

    if (!record) {
      return NextResponse.json({ error: "Belt progress record not found" }, { status: 404 });
    }

    const updateData: any = {
      status,
      instructorNotes,
    };

    if (skillsChecked) {
      updateData.skillsChecked = typeof skillsChecked === "string" ? skillsChecked : JSON.stringify(skillsChecked);
    }
    if (sparringRating) updateData.sparringRating = sparringRating;
    if (boardBreakingRating) updateData.boardBreakingRating = boardBreakingRating;

    if (status === "Completed") {
      updateData.promotedAt = new Date();
      updateData.certificateUrl = `/certificates/cert_${record.profileId}_${record.beltColor.replace(" ", "_")}.pdf`;
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update the BeltProgress record
      const updatedRecord = await tx.beltProgress.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      // 2. If approved/completed, update the main Profile belt fields
      if (status === "Completed") {
        await tx.profile.update({
          where: { id: record.profileId },
          data: {
            currentBelt: record.beltColor,
            beltProgressPercentage: 0, // reset progress for the new belt
          },
        });

        // 3. Create a next BeltProgress placeholder (In Progress) for the next belt in line!
        // We will do this if there's a logical next belt
        const nextBeltMap: { [key: string]: { belt: string; level: string; form: string } } = {
          "White": { belt: "Yellow", level: "Beginner", form: "Taegeuk Il Jang" },
          "Yellow": { belt: "Orange", level: "Beginner", form: "Taegeuk Ee Jang" },
          "Orange": { belt: "Green", level: "Intermediate", form: "Taegeuk Sam Jang" },
          "Green": { belt: "Blue", level: "Intermediate", form: "Taegeuk Sa Jang" },
          "Blue": { belt: "Purple", level: "Intermediate", form: "Taegeuk Oh Jang" },
          "Purple": { belt: "Brown", level: "Advanced", form: "Taegeuk Yuk Jang" },
          "Brown": { belt: "Red", level: "Advanced", form: "Taegeuk Chil Jang" },
          "Red": { belt: "Red Black", level: "Advanced", form: "Taegeuk Pal Jang" },
          "Red Black": { belt: "Black (1st Dan)", level: "Black Belt", form: "Koryo" },
        };

        const next = nextBeltMap[record.beltColor];
        if (next) {
          // Check if there is already an in-progress record for the next belt
          const existingNext = await tx.beltProgress.findFirst({
            where: {
              profileId: record.profileId,
              beltColor: next.belt,
            },
          });

          if (!existingNext) {
            await tx.beltProgress.create({
              data: {
                profileId: record.profileId,
                beltColor: next.belt,
                level: next.level,
                poomsaeForm: next.form,
                skillsChecked: JSON.stringify([]),
                status: "In Progress",
              },
            });
          }
        }
      }

      return updatedRecord;
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error) {
    console.error("Update belt progress error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
