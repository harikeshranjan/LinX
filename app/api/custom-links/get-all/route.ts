import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import CustomLink from "@/models/custom-links";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // fetching all custom links for the user sorted by newest first
    const customLinks = await CustomLink.find({ userId: session.user.id }).sort({createdAt: -1}).lean();

    if (!customLinks) {
      return NextResponse.json({ error: "No custom links found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Custom links fetched successfully", customLinks }, { status: 200 });
  } catch (error) {
    console.error("Error in custom links route:", error);
    return NextResponse.json({ error: "Failed to fetch custom links" }, { status: 500 });
  }
}