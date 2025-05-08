import {getDataFromToken} from "@/helpers/getDatafromToken";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import  User  from "@/models/userModel";

connectDB();

export async function GET(request: NextRequest){
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({ _id: userId })
        .select("-password")

        return NextResponse.json({
            success: true,
            message: "User fetched successfully",
            status: 200,
            data: user
        })
    }catch (error:any) {
        return NextResponse.json({
            success: false,
            message: error.message,
            status: 500
        })
    }
}