import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Resource from "@/lib/models/Resource";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const favoriteOnly = searchParams.get("favoriteOnly");

    const query: Record<string, any> = { userId: session.userId };
    if (category && category !== "ALL") query.category = category;
    if (favoriteOnly === "true") query.isFavorite = true;

    const resources = await Resource.find(query).sort({ isFavorite: -1, createdAt: -1 });
    return NextResponse.json({ resources });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const { title, url, category, tags, description, isFavorite, relatedDsaTopic, relatedLearningTopic, relatedProject } = body;

    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required" }, { status: 400 });
    }

    const resource = await Resource.create({
      userId: session.userId,
      title,
      url,
      category: category || "DSA",
      tags: tags || [],
      description: description || "",
      isFavorite: Boolean(isFavorite),
      relatedDsaTopic: relatedDsaTopic || "",
      relatedLearningTopic: relatedLearningTopic || "",
      relatedProject: relatedProject || "",
    });

    return NextResponse.json({ success: true, resource }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}

