import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Project from "@/lib/models/Project";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const project = await Project.findOne({ _id: params.id, userId: session.userId });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const project = await Project.findOne({ _id: params.id, userId: session.userId });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const body = await req.json();

    if (body.title !== undefined) project.title = body.title;
    if (body.description !== undefined) project.description = body.description;
    if (body.category !== undefined) project.category = body.category;
    if (body.techStack !== undefined) project.techStack = body.techStack;
    if (body.repoUrl !== undefined) project.repoUrl = body.repoUrl;
    if (body.demoUrl !== undefined) project.demoUrl = body.demoUrl;
    if (body.startDate !== undefined) project.startDate = body.startDate;
    if (body.endDate !== undefined) project.endDate = body.endDate;
    if (body.status !== undefined) project.status = body.status;
    if (body.milestones !== undefined) project.milestones = body.milestones;
    if (body.challenges !== undefined) project.challenges = body.challenges;
    if (body.technicalDecisions !== undefined) project.technicalDecisions = body.technicalDecisions;
    if (body.keyLearnings !== undefined) project.keyLearnings = body.keyLearnings;
    if (body.achievements !== undefined) project.achievements = body.achievements;
    if (body.notes !== undefined) project.notes = body.notes;

    await project.save();
    return NextResponse.json({ success: true, project });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    await Project.findOneAndDelete({ _id: params.id, userId: session.userId });
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

