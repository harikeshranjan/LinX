import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { nanoid } from "nanoid";
import Link from "@/models/links";

const CHARACTER_LENGTH = process.env.CHARACTER_LENGTH;

export async function POST(request: NextRequest) {
  try {
    if (!CHARACTER_LENGTH) {
      throw new Error("Please define the CHARACTER_LENGTH environment variable inside .env file");
    }

    const { originalUrl } = await request.json();

    if (!originalUrl) {
      return NextResponse.json({ error: "Paste your URL in the input field" }, { status: 400 });
    }

    await dbConnect();

    let shortenedUrl = "";
    let existingUrl = null;
    const maxTries = 5;
    let tries = 0;

    do {
      shortenedUrl = nanoid(parseInt(CHARACTER_LENGTH, 10));
      existingUrl = await Link.findOne({ shortenedUrl });
      tries++;
    } while (existingUrl && tries < maxTries);

    if (existingUrl) {
      return NextResponse.json({ error: "Failed to create a unique shortened URL" }, { status: 500 });
    }

    const newLink = await Link.create({
      originalUrl,
      shortenedUrl,
    })

    return NextResponse.json({ newLink }, { status: 201 });
  } catch (error) {
    console.error("Error in links route:", error);
    return NextResponse.json({ error: "Failed to created shortened link" }, { status: 500 });
  }
}