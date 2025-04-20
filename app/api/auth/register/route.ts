import { dbConnect } from "@/lib/db";
import User from "@/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
  try {
    const { firstName, lastName, email, password } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    await User.create({ firstName, lastName, email, password });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error in register route:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}