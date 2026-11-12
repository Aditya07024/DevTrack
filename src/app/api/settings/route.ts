import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import UserSettings from "@/lib/models/UserSettings";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    let settings = await UserSettings.findOne({ userId: session.userId });
    if (!settings) {
      settings = await UserSettings.create({
        userId: session.userId,
        targetRole: "Full-Stack Software Engineer",
        timezone: "Asia/Kolkata",
        preferredCurrency: "USD",
      });
    }

    const user = await User.findById(session.userId).select("-password");

    return NextResponse.json({ settings, user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();

    let settings = await UserSettings.findOne({ userId: session.userId });
    if (!settings) {
      settings = new UserSettings({ userId: session.userId });
    }

    if (body.targetRole !== undefined) settings.targetRole = body.targetRole;
    if (body.targetCompanyCategory !== undefined) settings.targetCompanyCategory = body.targetCompanyCategory;
    if (body.careerGoalSummary !== undefined) settings.careerGoalSummary = body.careerGoalSummary;
    if (body.dailyStudyHoursTarget !== undefined) settings.dailyStudyHoursTarget = Number(body.dailyStudyHoursTarget);
    if (body.workingDays !== undefined) settings.workingDays = body.workingDays;
    if (body.timezone !== undefined) settings.timezone = body.timezone;
    if (body.preferredCurrency !== undefined) settings.preferredCurrency = body.preferredCurrency;
    if (body.notificationPreferences !== undefined) {
      settings.notificationPreferences = {
        ...settings.notificationPreferences,
        ...body.notificationPreferences,
      };
    }
    if (body.revisionIntervals !== undefined) settings.revisionIntervals = body.revisionIntervals;

    await settings.save();

    if (body.name) {
      await User.findByIdAndUpdate(session.userId, { name: body.name });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

