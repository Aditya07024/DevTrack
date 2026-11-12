import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import WeeklyReview from "@/lib/models/WeeklyReview";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const reviews = await WeeklyReview.find({ userId: session.userId }).sort({ year: -1, weekNumber: -1 });
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch weekly reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const {
      year,
      weekNumber,
      startDate,
      endDate,
      tasksCompletedCount,
      tasksMissedCount,
      dsaSolvedCount,
      studyHours,
      strugglesSummary,
      developmentLearnings,
      challengesFaced,
      prioritiesNextWeek,
      selfRating,
      notes,
    } = body;

    // Prevent duplicate review for the same week
    const existing = await WeeklyReview.findOne({
      userId: session.userId,
      year: Number(year),
      weekNumber: Number(weekNumber),
    });

    if (existing) {
      // Update existing review
      Object.assign(existing, {
        tasksCompletedCount: Number(tasksCompletedCount) || 0,
        tasksMissedCount: Number(tasksMissedCount) || 0,
        dsaSolvedCount: Number(dsaSolvedCount) || 0,
        studyHours: Number(studyHours) || 0,
        strugglesSummary: strugglesSummary || "",
        developmentLearnings: developmentLearnings || "",
        challengesFaced: challengesFaced || "",
        prioritiesNextWeek: prioritiesNextWeek || [],
        selfRating: Number(selfRating) || 4,
        notes: notes || "",
      });
      await existing.save();
      return NextResponse.json({ success: true, message: "Review updated", review: existing });
    }

    const review = await WeeklyReview.create({
      userId: session.userId,
      year: Number(year),
      weekNumber: Number(weekNumber),
      startDate,
      endDate,
      tasksCompletedCount: Number(tasksCompletedCount) || 0,
      tasksMissedCount: Number(tasksMissedCount) || 0,
      dsaSolvedCount: Number(dsaSolvedCount) || 0,
      studyHours: Number(studyHours) || 0,
      strugglesSummary: strugglesSummary || "",
      developmentLearnings: developmentLearnings || "",
      challengesFaced: challengesFaced || "",
      prioritiesNextWeek: prioritiesNextWeek || [],
      selfRating: Number(selfRating) || 4,
      notes: notes || "",
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    console.error("[Review Create Error]", error);
    return NextResponse.json({ error: "Failed to save weekly review" }, { status: 500 });
  }
}
