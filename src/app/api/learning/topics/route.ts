import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import LearningTopic from "@/lib/models/LearningTopic";
import {
  DEFAULT_DEVELOPMENT_TOPICS,
  DEFAULT_CORE_CS_TOPICS,
  DEFAULT_SYSTEM_DESIGN_TOPICS,
} from "@/lib/seedData";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query: Record<string, any> = { userId: session.userId };
    if (category && category !== "ALL") query.category = category;

    let topics = await LearningTopic.find(query).sort({ order: 1, createdAt: 1 });

    // Auto-seed user default learning topics if empty
    if (topics.length === 0 && (!category || category === "ALL")) {
      const allDefaults = [
        ...DEFAULT_DEVELOPMENT_TOPICS,
        ...DEFAULT_CORE_CS_TOPICS,
        ...DEFAULT_SYSTEM_DESIGN_TOPICS,
      ];
      for (const t of allDefaults) {
        await LearningTopic.updateOne(
          { userId: session.userId, title: t.title },
          {
            $set: {
              ...t,
              userId: session.userId,
              trackName: t.category,
              status: t.confidence === "INTERVIEW_READY" ? "COMPLETED" : "IN_PROGRESS",
            },
          },
          { upsert: true }
        );
      }
      topics = await LearningTopic.find(query).sort({ order: 1, createdAt: 1 });
    }

    return NextResponse.json({ topics });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch learning topics" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const { title, category, subtopics, confidence, notes, resources } = body;

    if (!title || !category) {
      return NextResponse.json({ error: "Title and Category are required" }, { status: 400 });
    }

    const topic = await LearningTopic.create({
      userId: session.userId,
      trackName: category,
      category,
      title,
      subtopics: subtopics || [],
      confidence: confidence || "BEGINNER",
      status: "IN_PROGRESS",
      notes: notes || "",
      resources: resources || [],
      lastStudiedDate: new Date(),
    });

    return NextResponse.json({ success: true, topic }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create topic" }, { status: 500 });
  }
}

