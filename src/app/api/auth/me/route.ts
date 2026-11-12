import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import User from "@/lib/models/User";
import UserSettings from "@/lib/models/UserSettings";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(session.userId).select("-password");
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const settings = await UserSettings.findOne({ userId: user._id });

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      settings,
    });
  } catch (error: any) {
    console.error("[Me Error]", error);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}

