import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import JobApplication from "@/lib/models/JobApplication";
import Interview from "@/lib/models/Interview";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const application = await JobApplication.findOne({ _id: params.id, userId: session.userId });
    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const interviews = await Interview.find({ applicationId: application._id }).sort({ scheduledDate: 1 });
    return NextResponse.json({ application, interviews });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const application = await JobApplication.findOne({ _id: params.id, userId: session.userId });
    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const body = await req.json();

    if (body.company !== undefined) application.company = body.company;
    if (body.role !== undefined) application.role = body.role;
    if (body.country !== undefined) application.country = body.country;
    if (body.city !== undefined) application.city = body.city;
    if (body.workArrangement !== undefined) application.workArrangement = body.workArrangement;
    if (body.employmentType !== undefined) application.employmentType = body.employmentType;
    if (body.jobUrl !== undefined) application.jobUrl = body.jobUrl;
    if (body.currency !== undefined) application.currency = body.currency;
    if (body.salaryMin !== undefined) application.salaryMin = Number(body.salaryMin);
    if (body.salaryMax !== undefined) application.salaryMax = Number(body.salaryMax);
    if (body.salaryNotes !== undefined) application.salaryNotes = body.salaryNotes;
    if (body.requiredExperience !== undefined) application.requiredExperience = body.requiredExperience;
    if (body.requiredSkills !== undefined) application.requiredSkills = body.requiredSkills;
    if (body.status !== undefined) application.status = body.status;
    if (body.resumeVersion !== undefined) application.resumeVersion = body.resumeVersion;
    if (body.referralName !== undefined) application.referralName = body.referralName;
    if (body.notes !== undefined) application.notes = body.notes;
    if (body.nextStepDate !== undefined) application.nextStepDate = body.nextStepDate;

    await application.save();
    return NextResponse.json({ success: true, application });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    await JobApplication.findOneAndDelete({ _id: params.id, userId: session.userId });
    await Interview.deleteMany({ applicationId: params.id, userId: session.userId });
    return NextResponse.json({ success: true, message: "Application deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}

