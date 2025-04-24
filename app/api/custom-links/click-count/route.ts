import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import CustomLink from "@/models/custom-links";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const totalClicks = await CustomLink.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, totalClicks: { $sum: "$clicks" } } }
    ])

    const totalClickCount = totalClicks.length > 0 ? totalClicks[0].totalClicks : 0;
    return NextResponse.json({ totalClicks: totalClickCount }, { status: 200 });
  } catch (error) {
    console.error('Error fetching click count:', error);
    return NextResponse.json({ error: 'Failed to fetch click count' }, { status: 500 });
  }
}