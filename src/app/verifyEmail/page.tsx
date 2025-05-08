"use client";
import axios from "axios";
import Link from "next/link";
import React,{ use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";


export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    
    const verifyUserEmail= async () =>
    {
        try {
           await axios.post("/api/users/verifyEmail", { token });
           setVerified(true);
           toast.success("Email verified successfully!");
        } catch (error:any) {
            console.log(error.response.data);
            setError(true);
            toast.error("Error verifying email. Please try again later.");
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        if (urlToken) {
            setToken(urlToken || "");
        }
    }, []);

    useEffect(() =>{
        if(token.length>0)
        {
            verifyUserEmail();
        }
    },[token]);

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <Toaster position="bottom-center" />
        {verified ? (
          <div className="bg-black text-white  p-6 rounded shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Email Verified!</h1>
            <p className="mb-4">Your email has been successfully verified.</p>
            <Link href="/login" className="text-blue-500 hover:underline">
              Go to Login
            </Link>
          </div>
        ) : error ? (
          <div className="bg-black text-white  p-6 rounded shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
            <p className="mb-4">
              There was an error verifying your email. Please try again later.
            </p>
          </div>
        ) : !token ? (
          <div className="bg-black text-white  p-6 rounded shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid Token</h1>
            <p className="mb-4">
              You must provide a valid token to verify your email.
            </p>
          </div>
        ) : (
          <div className="bg-black text-white  p-6 rounded shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Verifying...</h1>
            <p>Please wait while we verify your email.</p>
          </div>
        )}
      </div>
    );



}