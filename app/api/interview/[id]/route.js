import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/interview/[id]
export async function GET(request, { params }) {
  const id = params.id;


  // Check for missing or invalid ID
  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { success: false, error: "Invalid or missing interview ID" },
      { status: 400 }
    );
  }

  try {
    const interview = await prisma.interview.findUnique({
      where: { id },
    });

    if (!interview) {
      return NextResponse.json(
        { success: false, error: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: interview }, { status: 200 });
  } catch (error) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
