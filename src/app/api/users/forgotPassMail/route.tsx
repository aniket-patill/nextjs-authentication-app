import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;
    // console.log("Email received:", email);

    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // console.log("User found:", user);

    const mailResponse = await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id,
    });

    if (!mailResponse) {
      return NextResponse.json(
        { message: "Error sending email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/users/forgotPassMail:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
