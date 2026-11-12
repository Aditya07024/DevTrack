import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import { sendPushNotificationToUser } from "@/lib/webpush";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const result = await sendPushNotificationToUser(
      session.userId,
      {
        title: "DevTrack Notification Test",
        body: "Web Push & In-App Notification delivery is working seamlessly!",
        url: "/overview",
        tag: "devtrack-test",
      },
      "SYSTEM"
    );

    return NextResponse.json({
      success: true,
      message: `Test notification sent! Delivered to ${result.deliveredPushCount} browser push client(s) and recorded in Notification Center.`,
      result,
    });
  } catch (error: any) {
    console.error("[Test Push Error]", error);
    return NextResponse.json({ error: "Failed to send test push notification" }, { status: 500 });
  }
}
