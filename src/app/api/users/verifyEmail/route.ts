import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connectDB();


export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {token} = reqBody;
    // console.log("Token received:", token);

    const user = await User.findOneAndUpdate({verifyToken:token,
        verifyTokenExpiry:{$gt:Date.now()}
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // console.log("User found:", user);
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();
    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });

  } catch (error:any) {
    console.error("Error in POST /api/users/verifyEmail:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}