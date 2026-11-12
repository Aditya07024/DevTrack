import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
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

    // Find distinct users with pending revisions due today or overdue
    const usersWithRevisions = await Revision.distinct("userId", {
      scheduledDate: { $lte: todayStr },
      status: "PENDING",
    });

    let sent = 0;
    for (const userId of usersWithRevisions) {
      const alreadySent = await Notification.findOne({
        userId,
        type: "DSA_REVISION",
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      });

      if (alreadySent) continue;

      const dueItems = await Revision.find({
        userId,
        scheduledDate: { $lte: todayStr },
        status: "PENDING",
      }).limit(2);

      const count = await Revision.countDocuments({
        userId,
        scheduledDate: { $lte: todayStr },
        status: "PENDING",
      });

      const problemNames = dueItems.map((d) => d.problemTitle).join(", ");
      await sendPushNotificationToUser(
        userId.toString(),
        {
          title: "DSA Spaced Repetition Due",
          body: `You have ${count} DSA problem(s) due for revision today (${problemNames}). Revisit them to reinforce your long-term memory!`,
          url: "/dsa",
          tag: `revision-reminder-${todayStr}`,
        },
        "DSA_REVISION"
      );
      sent++;
    }

    return NextResponse.json({ success: true, notificationsSent: sent, date: todayStr });
  } catch (error: any) {
    console.error("[Cron Revision Error]", error);
    return NextResponse.json({ error: "Revision cron failed" }, { status: 500 });
  }
}
