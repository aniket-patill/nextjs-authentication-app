"use client";
import axios from "axios";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function forgotPassMail() {
    const [email,setEmail] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    const [isSent,setIsSent] = useState(false);

    const router = useRouter();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!email){
            toast.error("Please enter your email address");
            return;
        }
        try {
            const response = await axios.post("/api/users/forgotPassMail", {email})
            setIsLoading(true);
            if(response.status === 200){
                setIsSent(true);
                toast.success(response.data.message);
            }
        } catch (error:any) {
            toast.error(error.response?.data?.message || "Error sending email");
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <Toaster position="bottom-center" />
            <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
            <form onSubmit={handleSubmit} className="bg-black text-white p-6 rounded shadow-md w-full max-w-sm">
                <input
                    type="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <button type="submit" className={`w-full p-2 hover:bg-blue-600 bg-blue-500 text-white rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
            {isSent && (
                <div className="mt-4 text-green-500">
                    A reset link has been sent to your email address.
                </div>
            )}
        </div>
    );
}