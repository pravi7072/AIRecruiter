import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name, picture } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = uuidv4();

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        image: picture || null,
        emailVerified: null,
        verifyToken,
        // verifyTokenExpires: new Date(Date.now() + 60 * 60 * 1000) // optional
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify?token=${verifyToken}`;

    try {
      await transporter.sendMail({
        from: `"Smart App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your email",
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for signing up. Please verify your email address by clicking the link below:</p>
          <a href="${verifyUrl}" style="color: blue;">Verify Email</a>
          <p>If you didn't sign up, you can ignore this email.</p>
        `,
      });
    } catch (mailError) {
      console.error("Email sending failed:", mailError);
      return Response.json(
        { error: "User created but failed to send verification email." },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "Verification email sent." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}