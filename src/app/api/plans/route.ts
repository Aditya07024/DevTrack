import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Plan from "@/lib/models/Plan";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "MONTHLY" | "WEEKLY"

    const query: Record<string, any> = { userId: session.userId };
    if (type) query.type = type;

    const plans = await Plan.find(query).sort({ startDate: -1 });
    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
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
      type,
      year,
      month,
      weekNumber,
      startDate,
      endDate,
      priorities,
      dsaTargetProblems,
      devStudyTargetHours,
      notes,
    } = body;

    if (!title || !type || !startDate || !endDate) {
      return NextResponse.json({ error: "Title, type, start, and end dates required" }, { status: 400 });
    }

    const plan = await Plan.create({
      userId: session.userId,
      title,
      type,
      year: Number(year) || new Date().getFullYear(),
      month: Number(month) || new Date().getMonth() + 1,
      weekNumber: weekNumber ? Number(weekNumber) : undefined,
      startDate,
      endDate,
      priorities: priorities || [],
      dsaTargetProblems: Number(dsaTargetProblems) || 0,
      devStudyTargetHours: Number(devStudyTargetHours) || 0,
      status: "ACTIVE",
      notes: notes || "",
    });

    return NextResponse.json({ success: true, plan }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
