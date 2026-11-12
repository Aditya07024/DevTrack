import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import JobApplication from "@/lib/models/JobApplication";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const country = searchParams.get("country");
    const workArrangement = searchParams.get("workArrangement");

    const query: Record<string, any> = { userId: session.userId };
    if (status && status !== "ALL") query.status = status;
    if (country && country !== "ALL") query.country = country;
    if (workArrangement && workArrangement !== "ALL") query.workArrangement = workArrangement;

    const applications = await JobApplication.find(query).sort({ applicationDate: -1, updatedAt: -1 });

    // Calculate pipeline funnel stats
    const totalCount = applications.length;
    const appliedCount = applications.filter((a) => a.status === "APPLIED").length;
    const interviewCount = applications.filter((a) =>
      ["ASSESSMENT", "INTERVIEW_SCHEDULED", "TECHNICAL_ROUND", "HR_ROUND"].includes(a.status)
    ).length;
    const offerCount = applications.filter((a) => a.status === "OFFER").length;
    const rejectedCount = applications.filter((a) => a.status === "REJECTED").length;

    return NextResponse.json({
      applications,
      funnel: {
        total: totalCount,
        applied: appliedCount,
        inInterview: interviewCount,
        offers: offerCount,
        rejected: rejectedCount,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch job applications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const {
      company,
      role,
      country,
      city,
      workArrangement,
      employmentType,
      jobUrl,
      currency,
      salaryMin,
      salaryMax,
      salaryNotes,
      requiredExperience,
      requiredSkills,
      applicationDate,
      status,
      resumeVersion,
      referralName,
      notes,
      nextStepDate,
    } = body;

    if (!company || !role) {
      return NextResponse.json({ error: "Company and Role are required" }, { status: 400 });
    }

    const application = await JobApplication.create({
      userId: session.userId,
      company,
      role,
      country: country || "India",
      city: city || "",
      workArrangement: workArrangement || "REMOTE",
      employmentType: employmentType || "FULL_TIME",
      jobUrl: jobUrl || "",
      currency: currency || "USD",
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      salaryNotes: salaryNotes || "",
      requiredExperience: requiredExperience || "",
      requiredSkills: requiredSkills || [],
      applicationDate: applicationDate || new Date().toISOString().split("T")[0],
      status: status || "APPLIED",
      resumeVersion: resumeVersion || "Standard v1",
      referralName: referralName || "",
      notes: notes || "",
      nextStepDate,
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}
