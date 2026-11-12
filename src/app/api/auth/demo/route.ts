import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { ensureDefaultDemoUser, signToken } from "@/lib/auth";

export async function POST() {
  try {
    await connectToDatabase();
    const demoUser = await ensureDefaultDemoUser();

    const token = signToken({
      userId: demoUser._id.toString(),
      email: demoUser.email,
      name: demoUser.name,
      role: demoUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: `Logged in as ${demoUser.name} (${demoUser.email})`,
      user: {
        id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
      },
    });

    response.cookies.set("devtrack_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_APP_URL?.includes("localhost"),
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[Demo Login Error]", error);
    return NextResponse.json(
      { error: "Failed to initialize demo session." },
      { status: 500 }
    );
  }
}

