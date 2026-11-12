import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Revision from "@/lib/models/Revision";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const todayStr = new Date().toISOString().split("T")[0];

    const dueToday = await Revision.find({
      userId: session.userId,
      scheduledDate: todayStr,
      status: "PENDING",
    }).sort({ difficulty: -1 });

    const overdue = await Revision.find({
      userId: session.userId,
      scheduledDate: { $lt: todayStr },
      status: "PENDING",
    }).sort({ scheduledDate: 1 });

    const upcoming = await Revision.find({
      userId: session.userId,
      scheduledDate: { $gt: todayStr },
      status: "PENDING",
    }).sort({ scheduledDate: 1 });

    const completed = await Revision.find({
      userId: session.userId,
      status: "COMPLETED",
    })
      .sort({ updatedAt: -1 })
      .limit(30);

    return NextResponse.json({
      dueToday,
      overdue,
      upcoming,
      completed,
      stats: {
        totalDue: dueToday.length + overdue.length,
        dueTodayCount: dueToday.length,
        overdueCount: overdue.length,
        upcomingCount: upcoming.length,
        completedCount: completed.length,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch revision queue" }, { status: 500 });
  }
}

