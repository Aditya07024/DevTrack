import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Revision from "@/lib/models/Revision";
import DsaProblem from "@/lib/models/DsaProblem";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const revision = await Revision.findOne({ _id: params.id, userId: session.userId });
    if (!revision) return NextResponse.json({ error: "Revision item not found" }, { status: 404 });

    const body = await req.json();
    const { action, scheduledDate, outcome, notes } = body;

    const todayStr = new Date().toISOString().split("T")[0];

    if (action === "COMPLETE") {
      revision.status = "COMPLETED";
      revision.completedDate = todayStr;
      revision.outcome = outcome || "RESOLVED_EASILY";
      revision.notes = notes || "";
      await revision.save();

      // Check if we need to schedule the next iteration (3d -> 7d -> 21d)
      let nextInterval = 0;
      let nextIteration = revision.iteration + 1;
      if (revision.intervalDays === 3) nextInterval = 7;
      else if (revision.intervalDays === 7) nextInterval = 21;

      if (nextInterval > 0) {
        const nextDate = new Date(Date.now() + nextInterval * 86400000).toISOString().split("T")[0];
        await Revision.create({
          userId: session.userId,
          problemId: revision.problemId,
          problemTitle: revision.problemTitle,
          topicName: revision.topicName,
          difficulty: revision.difficulty,
          intervalDays: nextInterval,
          iteration: nextIteration,
          scheduledDate: nextDate,
          status: "PENDING",
        });

        await DsaProblem.findByIdAndUpdate(revision.problemId, {
          $inc: { revisionCount: 1 },
          nextRevisionDate: nextDate,
        });
      }

      return NextResponse.json({ success: true, message: "Revision completed", revision });
    }

    if (action === "RESCHEDULE") {
      if (!scheduledDate) {
        return NextResponse.json({ error: "New scheduledDate required" }, { status: 400 });
      }
      revision.scheduledDate = scheduledDate;
      revision.status = "PENDING";
      await revision.save();

      await DsaProblem.findByIdAndUpdate(revision.problemId, {
        nextRevisionDate: scheduledDate,
      });

      return NextResponse.json({ success: true, message: "Revision rescheduled", revision });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update revision" }, { status: 500 });
  }
}

