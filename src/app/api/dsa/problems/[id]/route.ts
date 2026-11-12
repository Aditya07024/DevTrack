import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import DsaProblem from "@/lib/models/DsaProblem";
import ProblemAttempt from "@/lib/models/ProblemAttempt";
import Revision from "@/lib/models/Revision";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const problem = await DsaProblem.findOne({ _id: params.id, userId: session.userId });
    if (!problem) return NextResponse.json({ error: "Problem not found" }, { status: 404 });

    const attempts = await ProblemAttempt.find({ problemId: problem._id }).sort({ attemptDate: -1 });
    const revisions = await Revision.find({ problemId: problem._id }).sort({ scheduledDate: 1 });

    return NextResponse.json({ problem, attempts, revisions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch problem" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const problem = await DsaProblem.findOne({ _id: params.id, userId: session.userId });
    if (!problem) return NextResponse.json({ error: "Problem not found" }, { status: 404 });

    const body = await req.json();
    const oldStatus = problem.status;

    if (body.status !== undefined) problem.status = body.status;
    if (body.title !== undefined) problem.title = body.title;
    if (body.topicName !== undefined) problem.topicName = body.topicName;
    if (body.difficulty !== undefined) problem.difficulty = body.difficulty;
    if (body.platform !== undefined) problem.platform = body.platform;
    if (body.url !== undefined) problem.url = body.url;
    if (body.timeComplexity !== undefined) problem.timeComplexity = body.timeComplexity;
    if (body.spaceComplexity !== undefined) problem.spaceComplexity = body.spaceComplexity;
    if (body.approach !== undefined) problem.approach = body.approach;
    if (body.notes !== undefined) problem.notes = body.notes;
    if (body.codeSnippet !== undefined) problem.codeSnippet = body.codeSnippet;

    const isNewlySolved =
      (body.status === "SOLVED_INDEPENDENTLY" || body.status === "SOLVED_WITH_HINTS") &&
      !(oldStatus === "SOLVED_INDEPENDENTLY" || oldStatus === "SOLVED_WITH_HINTS");

    if (isNewlySolved) {
      const now = new Date();
      problem.solvedCount = (problem.solvedCount || 0) + 1;
      if (!problem.firstSolvedDate) problem.firstSolvedDate = now;
      problem.lastAttemptDate = now;
      const nextDate = new Date(now.getTime() + 3 * 86400000).toISOString().split("T")[0];
      problem.nextRevisionDate = nextDate;

      // Schedule revision
      await Revision.create({
        userId: session.userId,
        problemId: problem._id,
        problemTitle: problem.title,
        topicName: problem.topicName,
        difficulty: problem.difficulty,
        intervalDays: 3,
        iteration: 1,
        scheduledDate: nextDate,
        status: "PENDING",
      });
    }

    // Log attempt if specified
    if (body.logAttempt) {
      problem.attemptCount = (problem.attemptCount || 0) + 1;
      problem.lastAttemptDate = new Date();
      await ProblemAttempt.create({
        userId: session.userId,
        problemId: problem._id,
        problemTitle: problem.title,
        timeSpentMinutes: body.timeSpentMinutes || 30,
        outcome: body.attemptOutcome || "INDEPENDENT",
        notes: body.attemptNotes || "",
      });
    }

    await problem.save();
    return NextResponse.json({ success: true, problem });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update problem" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    await DsaProblem.findOneAndDelete({ _id: params.id, userId: session.userId });
    await Revision.deleteMany({ problemId: params.id, userId: session.userId });
    await ProblemAttempt.deleteMany({ problemId: params.id, userId: session.userId });

    return NextResponse.json({ success: true, message: "Problem deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete problem" }, { status: 500 });
  }
}

