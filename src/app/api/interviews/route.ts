import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Interview from "@/lib/models/Interview";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("applicationId");

    const query: Record<string, any> = { userId: session.userId };
    if (applicationId) query.applicationId = applicationId;

    const interviews = await Interview.find(query).sort({ scheduledDate: 1 });
    return NextResponse.json({ interviews });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const {
      applicationId,
      company,
      role,
      roundName,
      roundType,
      scheduledDate,
      scheduledTime,
      interviewerInfo,
      questions,
      topicsTested,
      feedback,
      outcome,
      nextSteps,
    } = body;

    if (!company || !roundName || !scheduledDate) {
      return NextResponse.json({ error: "Company, round name, and date are required" }, { status: 400 });
    }

    const interview = await Interview.create({
      userId: session.userId,
      applicationId,
      company,
      role: role || "Software Engineer",
      roundName,
      roundType: roundType || "TECHNICAL_DSA",
      scheduledDate,
      scheduledTime: scheduledTime || "15:00",
      status: "SCHEDULED",
      interviewerInfo: interviewerInfo || "",
      questions: questions || [],
      topicsTested: topicsTested || [],
      feedback: feedback || "",
      outcome: outcome || "PENDING",
      nextSteps: nextSteps || "",
    });

    return NextResponse.json({ success: true, interview }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 });
  }
}
