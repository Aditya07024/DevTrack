import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import PushSubscription from "@/lib/models/PushSubscription";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return NextResponse.json({ error: "Invalid subscription payload" }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || "";

    await PushSubscription.updateOne(
      { endpoint },
      {
        $set: {
          userId: session.userId,
          endpoint,
          keys,
          userAgent,
          failCount: 0,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Push notification subscription registered successfully.",
    });
  } catch (error: any) {
    console.error("[Subscribe Error]", error);
    return NextResponse.json({ error: "Failed to store push subscription" }, { status: 500 });
  }
}
