import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import DsaTopic from "@/lib/models/DsaTopic";
import DsaProblem from "@/lib/models/DsaProblem";
import { DEFAULT_DSA_TOPICS } from "@/lib/seedData";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    await connectToDatabase();

    let topics = await DsaTopic.find({
      $or: [{ userId: null }, ...(session ? [{ userId: session.userId }] : [])],
    }).sort({ order: 1 });

    // If no topics exist in DB yet, seed defaults on the fly
    if (topics.length === 0) {
      for (const t of DEFAULT_DSA_TOPICS) {
        await DsaTopic.updateOne({ slug: t.slug }, { $set: t }, { upsert: true });
      }
      topics = await DsaTopic.find({}).sort({ order: 1 });
    }

    // Attach user problem counts if authenticated
    let topicsWithCount = topics;
    if (session) {
      const counts = await DsaProblem.aggregate([
        { $match: { userId: session.userId } },
        { $group: { _id: "$topicName", total: { $sum: 1 }, solved: { $sum: { $cond: [{ $in: ["$status", ["SOLVED_INDEPENDENTLY", "SOLVED_WITH_HINTS"]] }, 1, 0] } } } },
      ]);
      const countMap = new Map(counts.map((c) => [c._id, c]));

      topicsWithCount = topics.map((top) => {
        const c = countMap.get(top.name);
        return {
          ...top.toObject(),
          totalProblems: c?.total || 0,
          solvedProblems: c?.solved || 0,
        };
      }) as any;
    }

    return NextResponse.json({ topics: topicsWithCount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch DSA topics" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { name, category, description } = await req.json();
    if (!name) return NextResponse.json({ error: "Topic name required" }, { status: 400 });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const topic = await DsaTopic.create({
      userId: session.userId,
      name,
      slug,
      category: category || "DATA_STRUCTURE",
      description: description || "",
      isCustom: true,
      order: 100,
    });

    return NextResponse.json({ success: true, topic }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create custom topic" }, { status: 500 });
  }
}
