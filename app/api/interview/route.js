import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path if needed

// GET /api/interviews
export async function GET() {
  try {
    const interviews = await prisma.interview.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        feedback: {
          select: { id: true }
        },
        user: {
          select: { name: true, email: true, id: true }
        }
      }
    });
    // Map feedback to just count for frontend UX
    const interviewsWithFeedbackCount = interviews.map(i => ({
      ...i,
      feedbackCount: i.feedback?.length ?? 0,
    }));
    return NextResponse.json(interviewsWithFeedbackCount, { status: 200 });
  } catch (e) {
    console.error("GET /api/interviews error", e);
    return NextResponse.json({ error: "Failed to fetch interviews." }, { status: 500 });
  }
}

