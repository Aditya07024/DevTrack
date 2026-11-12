import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Project from "@/lib/models/Project";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query: Record<string, any> = { userId: session.userId };
    if (category && category !== "ALL") query.category = category;

    const projects = await Project.find(query).sort({ updatedAt: -1 });
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const {
      title,
      description,
      category,
      techStack,
      repoUrl,
      demoUrl,
      startDate,
      endDate,
      status,
      milestones,
      challenges,
      technicalDecisions,
      keyLearnings,
      achievements,
      notes,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 });
    }

    const project = await Project.create({
      userId: session.userId,
      title,
      description: description || "",
      category: category || "PERSONAL",
      techStack: techStack || [],
      repoUrl: repoUrl || "",
      demoUrl: demoUrl || "",
      startDate,
      endDate,
      status: status || "IN_PROGRESS",
      milestones: milestones || [],
      challenges: challenges || [],
      technicalDecisions: technicalDecisions || [],
      keyLearnings: keyLearnings || [],
      achievements: achievements || [],
      notes: notes || "",
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

