"use client";
import axios from "axios";
import Link from "next/link";
import toast,{ Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter()
  const [data, setData] = useState("nothing")


  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/users/me")
      console.log(response.data)
      setData(response.data.data.username)
      toast.success(response.data.message)

    } catch (error:any) {
      console.error("Error fetching user details:", error.message);
      toast.error("Error fetching user details")
    }
  }
    const logout = async () => {
      try {
        const response = await axios.get("/api/users/logout")
        toast.success(response.data.message)
        console.log(response.data.message)
        router.push("/login")
      } catch (error:any) {
        console.error("Logout failed:", error.message);
      }
    }


    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>Profile</h1>
        <hr />
        <p>Profile page</p>
        <h2 className="text-2xl p-3">
          {data === "nothing" ? (
            "Nothing"
          ) : (
            <Link href={`/profile/${data}`}>{data}</Link>
          )}
        </h2>
        <button
          onClick={getUserDetails}
          className="bg-green-500 mt-3 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Get User Details
        </button>
        <button
          onClick={logout}
          className="bg-blue-500 mt-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "10px",
            },
          }}
        />
      </div>
    );
}