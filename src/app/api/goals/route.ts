import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Goal from "@/lib/models/Goal";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const query: Record<string, any> = { userId: session.userId };
    if (year) query.targetYear = Number(year);
    if (month) query.targetMonth = Number(month);

    const goals = await Goal.find(query).sort({ targetYear: -1, targetMonth: -1 });
    return NextResponse.json({ goals });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const { title, description, category, targetMonth, targetYear, targetCount, metricLabel, keyResults } = body;

    if (!title || !targetMonth || !targetYear) {
      return NextResponse.json({ error: "Title, month, and year are required" }, { status: 400 });
    }

    const goal = await Goal.create({
      userId: session.userId,
      title,
      description: description || "",
      category: category || "DSA",
      targetMonth: Number(targetMonth),
      targetYear: Number(targetYear),
      targetCount: Number(targetCount) || 10,
      currentCount: 0,
      metricLabel: metricLabel || "items",
      status: "IN_PROGRESS",
      keyResults: keyResults || [],
    });

    return NextResponse.json({ success: true, goal }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}
