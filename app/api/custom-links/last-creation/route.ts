import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import CustomLink from "@/models/custom-links";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "Just now";
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const latestLink = await CustomLink.findOne<{ createdAt: Date }>({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .select("createdAt")
      .lean();

    if (!latestLink || !latestLink.createdAt) {
      return NextResponse.json({ message: "No links created yet" }, { status: 200 });
    }

    const timeAgo = getTimeAgo(latestLink.createdAt);

    return NextResponse.json({ lastCreated: timeAgo }, { status: 200 });
  } catch (error) {
    console.error("Error fetching last creation:", error);
    return NextResponse.json({ error: "Failed to fetch last creation" }, { status: 500 });
  }
}
