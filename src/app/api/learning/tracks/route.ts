import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import LearningTrack from "@/lib/models/LearningTrack";
import { DEFAULT_LEARNING_TRACKS } from "@/lib/seedData";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    let tracks = await LearningTrack.find({}).sort({ order: 1 });

    if (tracks.length === 0) {
      for (const t of DEFAULT_LEARNING_TRACKS) {
        await LearningTrack.updateOne({ slug: t.slug }, { $set: t }, { upsert: true });
      }
      tracks = await LearningTrack.find({}).sort({ order: 1 });
    }

    return NextResponse.json({ tracks });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch learning tracks" }, { status: 500 });
  }
}
