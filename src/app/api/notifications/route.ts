import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Notification from "@/lib/models/Notification";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const notifications = await Notification.find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({ userId: session.userId, isRead: false });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { notificationId, markAllRead } = await req.json();

    if (markAllRead) {
      await Notification.updateMany({ userId: session.userId }, { $set: { isRead: true } });
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (notificationId) {
      await Notification.findOneAndUpdate(
        { _id: notificationId, userId: session.userId },
        { $set: { isRead: true } }
      );
      return NextResponse.json({ success: true, message: "Notification marked as read" });
    }

    return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}

