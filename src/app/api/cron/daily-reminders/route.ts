import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserSettings from "@/lib/models/UserSettings";
import Task from "@/lib/models/Task";
import Revision from "@/lib/models/Revision";
import Notification from "@/lib/models/Notification";
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
    const todayStr = new Date().toISOString().split("T")[0];

    // Find all users who have daily reminders enabled
    const settingsList = await UserSettings.find({
      "notificationPreferences.dailyReminderEnabled": true,
    });

    let processedCount = 0;
    let pushSentCount = 0;

    for (const setting of settingsList) {
      const userId = setting.userId.toString();

      // Check idempotency: avoid sending duplicate daily reminder on the same calendar day
      const alreadySent = await Notification.findOne({
        userId,
        type: "DAILY_REMINDER",
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      });

      if (alreadySent) {
        continue;
      }

      // Check pending tasks and revisions
      const pendingTasksCount = await Task.countDocuments({
        userId,
        scheduledDate: todayStr,
        status: { $in: ["TODO", "IN_PROGRESS"] },
      });

      const revisionsDueCount = await Revision.countDocuments({
        userId,
        scheduledDate: { $lte: todayStr },
        status: "PENDING",
      });

      if (pendingTasksCount > 0 || revisionsDueCount > 0) {
        const bodyText = `Time for your DevTrack daily review. You have ${pendingTasksCount} pending task${pendingTasksCount === 1 ? "" : "s"} and ${revisionsDueCount} DSA revision${revisionsDueCount === 1 ? "" : "s"} due today.`;

        const res = await sendPushNotificationToUser(
          userId,
          {
            title: "DevTrack Daily Review",
            body: bodyText,
            url: "/my-day",
            tag: `daily-reminder-${todayStr}`,
          },
          "DAILY_REMINDER"
        );

        pushSentCount += res.deliveredPushCount;
        processedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processedUsers: processedCount,
      deliveredPushes: pushSentCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Cron Daily Reminders Error]", error);
    return NextResponse.json({ error: "Cron execution failed" }, { status: 500 });
  }
}
