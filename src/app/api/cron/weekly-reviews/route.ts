import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserSettings from "@/lib/models/UserSettings";
import { sendPushNotificationToUser } from "@/lib/webpush";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const cronSecret = process.env.CRON_SECRET || "devtrack-cron-secret-123";
    const providedSecret = searchParams.get("key") || (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);

    if (process.env.NODE_ENV === "production" && providedSecret !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    await connectToDatabase();
    const settingsList = await UserSettings.find({
      "notificationPreferences.weeklyReviewEnabled": true,
    });

    let sent = 0;
    for (const setting of settingsList) {
      await sendPushNotificationToUser(
        setting.userId.toString(),
        {
          title: "Weekly Review & Retrospective",
          body: "Take 10 minutes to review this week's DSA solves, study hours, and set priorities for next week.",
          url: "/reviews",
          tag: `weekly-review-${new Date().toISOString().split("T")[0]}`,
        },
        "WEEKLY_REVIEW"
      );
      sent++;
    }

    return NextResponse.json({ success: true, notificationsSent: sent });
  } catch (error: any) {
    console.error("[Cron Weekly Review Error]", error);
    return NextResponse.json({ error: "Weekly review cron failed" }, { status: 500 });
  }
}
