import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import LearningTopic from "@/lib/models/LearningTopic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const topic = await LearningTopic.findOne({ _id: params.id, userId: session.userId });
    if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

    const body = await req.json();

    if (body.title !== undefined) topic.title = body.title;
    if (body.subtopics !== undefined) topic.subtopics = body.subtopics;
    if (body.status !== undefined) topic.status = body.status;
    if (body.confidence !== undefined) topic.confidence = body.confidence;
    if (body.notes !== undefined) topic.notes = body.notes;
    if (body.resources !== undefined) topic.resources = body.resources;
    if (body.markStudied) topic.lastStudiedDate = new Date();
    if (body.nextRevisionDate !== undefined) topic.nextRevisionDate = body.nextRevisionDate;

    await topic.save();
    return NextResponse.json({ success: true, topic });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update learning topic" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    await LearningTopic.findOneAndDelete({ _id: params.id, userId: session.userId });
    return NextResponse.json({ success: true, message: "Topic deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete learning topic" }, { status: 500 });
  }
}

