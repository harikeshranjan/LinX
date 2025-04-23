import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import CustomLink from "@/models/custom-links";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { originalLink, customLink } = await request.json();

    if (!originalLink || !customLink) {
      return NextResponse.json({ error: "Original link and custom link are required" }, { status: 400 });
    }

    await dbConnect();

    const newLink = await CustomLink.create({
      originalLink,
      customLink,
      userId: session.user.id,
    })

    // sending only the custom link to the client
    // return NextResponse.json({ message: "Custom link created successfully", newLink }, { status: 201 });
    return NextResponse.json({ message: "Custom link created successfully", customLink: newLink.customLink }, { status: 201 });
  } catch (error) {
    console.error("Error in custom links route:", error);
    return NextResponse.json({ error: "Failed to create custom link" }, { status: 500 });
  }
}