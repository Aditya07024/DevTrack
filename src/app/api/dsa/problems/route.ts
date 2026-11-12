import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import DsaProblem from "@/lib/models/DsaProblem";
import ProblemAttempt from "@/lib/models/ProblemAttempt";
import Revision from "@/lib/models/Revision";

const problemSchema = z.object({
  title: z.string().min(1, "Problem title is required"),
  topicName: z.string().min(1, "Topic is required"),
  platform: z.enum(["LeetCode", "GeeksforGeeks", "Codeforces", "HackerRank", "NeetCode", "Other"]).default("LeetCode"),
  url: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  status: z.enum([
    "NOT_STARTED",
    "ATTEMPTED",
    "SOLVED_INDEPENDENTLY",
    "SOLVED_WITH_HINTS",
    "SOLUTION_VIEWED",
    "NEEDS_REVISION",
  ]).default("NOT_STARTED"),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
  approach: z.string().optional(),
  notes: z.string().optional(),
  codeSnippet: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic");
    const difficulty = searchParams.get("difficulty");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query: Record<string, any> = { userId: session.userId };
    if (topic && topic !== "All") query.topicName = topic;
    if (difficulty && difficulty !== "All") query.difficulty = difficulty;
    if (status && status !== "All") query.status = status;
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const problems = await DsaProblem.find(query).sort({ updatedAt: -1 });
    return NextResponse.json({ problems });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch DSA problems" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const validation = problemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
    }

    const data = validation.data;
    const isSolved = data.status === "SOLVED_INDEPENDENTLY" || data.status === "SOLVED_WITH_HINTS";
    const now = new Date();
    const nextRevision = isSolved ? new Date(now.getTime() + 3 * 86400000).toISOString().split("T")[0] : undefined;

    const problem = await DsaProblem.create({
      ...data,
      userId: session.userId,
      attemptCount: data.status !== "NOT_STARTED" ? 1 : 0,
      solvedCount: isSolved ? 1 : 0,
      firstSolvedDate: isSolved ? now : undefined,
      lastAttemptDate: data.status !== "NOT_STARTED" ? now : undefined,
      nextRevisionDate: nextRevision,
    });

    // Record attempt if attempted/solved
    if (data.status !== "NOT_STARTED") {
      let outcome: "INDEPENDENT" | "WITH_HINTS" | "SOLUTION_VIEWED" | "FAILED" = "INDEPENDENT";
      if (data.status === "SOLVED_WITH_HINTS") outcome = "WITH_HINTS";
      else if (data.status === "SOLUTION_VIEWED") outcome = "SOLUTION_VIEWED";
      else if (data.status === "ATTEMPTED" || data.status === "NEEDS_REVISION") outcome = "FAILED";

      await ProblemAttempt.create({
        userId: session.userId,
        problemId: problem._id,
        problemTitle: problem.title,
        timeSpentMinutes: 30,
        outcome,
        notes: data.notes,
      });
    }

    // Auto schedule 3-day revision if solved
    if (isSolved) {
      await Revision.create({
        userId: session.userId,
        problemId: problem._id,
        problemTitle: problem.title,
        topicName: problem.topicName,
        difficulty: problem.difficulty,
        intervalDays: 3,
        iteration: 1,
        scheduledDate: nextRevision,
        status: "PENDING",
      });
    }

    return NextResponse.json({ success: true, problem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create DSA problem" }, { status: 500 });
  }
}
