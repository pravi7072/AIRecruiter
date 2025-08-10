import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { jobPosition, jobDiscription, interviewDuration, questions, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    // Fetch user to check credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.credits <= 0) {
      return NextResponse.json(
        { success: false, error: "Insufficient credits" },
        { status: 403 }
      );
    }

    // Perform interview creation and credit deduction in a transaction
    const [interview, updatedUser] = await prisma.$transaction([
      prisma.interview.create({
        data: {
          title: jobPosition,
          description: jobDiscription,
          duration: interviewDuration,
          questions,
          user: {
            connect: { id: userId },
          },
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          credits: { decrement: 1 }, // Deduct 1 credit
        },
      }),
    ]);

    return NextResponse.json({ success: true, interview, remainingCredits: updatedUser.credits });
  } catch (error) {
    console.error("Error saving interview:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
