import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import CustomLink from "@/models/custom-links";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // counting total number of custom links of the user
    const count = await CustomLink.countDocuments({ userId: session.user.id }).lean();

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error('Error fetching custom links count:', error);
    return NextResponse.json({ error: 'Failed to fetch custom links count' }, { status: 500 });
  }
}