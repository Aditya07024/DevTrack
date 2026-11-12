import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import PushSubscription from "@/lib/models/PushSubscription";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { endpoint } = await req.json();

    if (endpoint) {
      await PushSubscription.findOneAndDelete({ endpoint, userId: session.userId });
    } else {
      await PushSubscription.deleteMany({ userId: session.userId });
    }

    return NextResponse.json({ success: true, message: "Push notification unsubscribed" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}

