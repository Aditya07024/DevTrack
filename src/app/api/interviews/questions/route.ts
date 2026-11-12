import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import InterviewQuestion from "@/lib/models/InterviewQuestion";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const weakOnly = searchParams.get("weakOnly");

    const query: Record<string, any> = { userId: session.userId };
    if (category && category !== "ALL") query.category = category;
    if (weakOnly === "true") query.isWeakTopic = true;

    const questions = await InterviewQuestion.find(query).sort({ updatedAt: -1 });
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch question bank" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const {
      question,
      category,
      company,
      round,
      difficulty,
      answerNotes,
      keyPoints,
      confidence,
      isWeakTopic,
      followUpRevisionDate,
    } = body;

    if (!question || !category) {
      return NextResponse.json({ error: "Question and category are required" }, { status: 400 });
    }

    const item = await InterviewQuestion.create({
      userId: session.userId,
      question,
      category,
      company: company || "",
      round: round || "",
      difficulty: difficulty || "MEDIUM",
      answerNotes: answerNotes || "",
      keyPoints: keyPoints || [],
      confidence: confidence || "SOMEWHAT_CONFIDENT",
      isWeakTopic: Boolean(isWeakTopic),
      followUpRevisionDate,
      timesPracticed: 1,
    });

    return NextResponse.json({ success: true, question: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add question" }, { status: 500 });
  }
}
