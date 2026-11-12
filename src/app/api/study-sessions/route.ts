import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import StudySession from "@/lib/models/StudySession";
import Task from "@/lib/models/Task";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const sessions = await StudySession.find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .limit(30);

    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch study sessions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const { title, category, durationMinutes, taskId, notes } = body;

    const studySession = await StudySession.create({
      userId: session.userId,
      title: title || "Focused Study Session",
      category: category || "DSA",
      durationMinutes: durationMinutes || 25,
      date: new Date().toISOString().split("T")[0],
      startTime: new Date(Date.now() - (durationMinutes || 25) * 60000),
      endTime: new Date(),
      taskId,
      notes,
    });

    // If taskId is provided, increment task actualMinutes
    if (taskId) {
      await Task.findOneAndUpdate(
        { _id: taskId, userId: session.userId },
        { $inc: { actualMinutes: durationMinutes || 25 } }
      );
    }

    return NextResponse.json({ success: true, session: studySession }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to log study session" }, { status: 500 });
  }
}

