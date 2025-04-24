import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import CustomLink from "@/models/custom-links";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const result = await CustomLink.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: "$clicks" },
          totalLinks: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          averageClicks: {
            $cond: [
              { $eq: ["$totalLinks", 0] },
              0,
              { $divide: ["$totalClicks", "$totalLinks"] }
            ]
          }
        }
      }
    ]);

    const averageClicks = result.length > 0 ? result[0].averageClicks : 0;

    return NextResponse.json({ averageClicks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching average clicks:', error);
    return NextResponse.json({ error: 'Failed to fetch average clicks' }, { status: 500 });
  }
}
