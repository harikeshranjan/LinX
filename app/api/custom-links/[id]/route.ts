import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import CustomLink from "@/models/custom-links";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.pathname.split("/").pop() as string;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const link = await CustomLink.findOneAndUpdate(
      { userId: session.user.id, customLink: id },
      { $inc: { clicks: 1 } },
      { new: true }
    ).lean();

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json(link, { status: 200 });
  } catch (error) {
    console.error("Error fetching custom links:", error);
    return NextResponse.json({ error: "Failed to fetch custom links" }, { status: 500 });
  }
}