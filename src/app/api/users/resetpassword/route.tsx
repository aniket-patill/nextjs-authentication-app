import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token,password} = reqBody;
        // console.log("Token received:", token);

        const user = await User.findOneAndUpdate({
          forgotPasswordToken: token,
          forgotPasswordExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        // console.log("User found:", user);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save();
        return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
    } catch (error:any) {
        console.error("Error in POST /api/users/resetPassword:", error);
        return NextResponse.json({ message: "error reseting password in server" }, { status: 500 });
    }
}