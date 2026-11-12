import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Task from "@/lib/models/Task";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const task = await Task.findOne({ _id: params.id, userId: session.userId });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const body = await req.json();

    // Check for rescheduling
    if (body.scheduledDate && body.scheduledDate !== task.scheduledDate) {
      task.rescheduledFrom = task.scheduledDate;
      if (!task.rescheduleHistory) task.rescheduleHistory = [];
      task.rescheduleHistory.push({
        fromDate: task.scheduledDate,
        toDate: body.scheduledDate,
        reason: body.rescheduleReason || "Rescheduled",
        timestamp: new Date(),
      });
      task.scheduledDate = body.scheduledDate;
    }

    if (body.status !== undefined) {
      task.status = body.status;
      if (body.status === "COMPLETED") {
        task.completedAt = new Date();
      }
    }
    if (body.title !== undefined) task.title = body.title;
    if (body.description !== undefined) task.description = body.description;
    if (body.priority !== undefined) task.priority = body.priority;
    if (body.category !== undefined) task.category = body.category;
    if (body.estimatedMinutes !== undefined) task.estimatedMinutes = body.estimatedMinutes;
    if (body.actualMinutes !== undefined) task.actualMinutes = body.actualMinutes;
    if (body.notes !== undefined) task.notes = body.notes;
    if (body.tags !== undefined) task.tags = body.tags;

    await task.save();
    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const task = await Task.findOneAndDelete({ _id: params.id, userId: session.userId });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Task deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
