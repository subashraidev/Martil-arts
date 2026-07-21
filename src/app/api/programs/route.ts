import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(programs);
  } catch (error) {
    console.error("Fetch programs API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
