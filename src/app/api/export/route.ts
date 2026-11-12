import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Task from "@/lib/models/Task";
import DsaProblem from "@/lib/models/DsaProblem";
import ProblemAttempt from "@/lib/models/ProblemAttempt";
import Revision from "@/lib/models/Revision";
import LearningTopic from "@/lib/models/LearningTopic";
import Project from "@/lib/models/Project";
import JobApplication from "@/lib/models/JobApplication";
import Interview from "@/lib/models/Interview";
import InterviewQuestion from "@/lib/models/InterviewQuestion";
import Goal from "@/lib/models/Goal";
import Plan from "@/lib/models/Plan";
import WeeklyReview from "@/lib/models/WeeklyReview";
import Resource from "@/lib/models/Resource";
import Note from "@/lib/models/Note";
import StudySession from "@/lib/models/StudySession";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const userId = session.userId;

    const [
      tasks,
      dsaProblems,
      attempts,
      revisions,
      learningTopics,
      projects,
      applications,
      interviews,
      questions,
      goals,
      plans,
      reviews,
      resources,
      notes,
      studySessions,
    ] = await Promise.all([
      Task.find({ userId }).lean(),
      DsaProblem.find({ userId }).lean(),
      ProblemAttempt.find({ userId }).lean(),
      Revision.find({ userId }).lean(),
      LearningTopic.find({ userId }).lean(),
      Project.find({ userId }).lean(),
      JobApplication.find({ userId }).lean(),
      Interview.find({ userId }).lean(),
      InterviewQuestion.find({ userId }).lean(),
      Goal.find({ userId }).lean(),
      Plan.find({ userId }).lean(),
      WeeklyReview.find({ userId }).lean(),
      Resource.find({ userId }).lean(),
      Note.find({ userId }).lean(),
      StudySession.find({ userId }).lean(),
    ]);

    const exportPayload = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      user: {
        id: session.userId,
        name: session.name,
        email: session.email,
      },
      data: {
        tasks,
        dsaProblems,
        attempts,
        revisions,
        learningTopics,
        projects,
        applications,
        interviews,
        questions,
        goals,
        plans,
        reviews,
        resources,
        notes,
        studySessions,
      },
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="devtrack-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
