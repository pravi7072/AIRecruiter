import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return Response.json({ error: "Token is required" }, { status: 400 });
    }

    // Optional: quick validation if using UUIDs
    if (token.length < 10) {
      return Response.json({ error: "Invalid token format" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { verifyToken: token } });

    if (!user) {
      return Response.json(
        { error: "Invalid or expired token" },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { email: user.email },
      data: {
        emailVerified: new Date(),
        verifyToken: null,
      },
    });

    return Response.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return Response.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
