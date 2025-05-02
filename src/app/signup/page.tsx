"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function SignupPage() {
  const [user, setUser] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [buttonText, setButtonText] = React.useState(false);

  useEffect(() => {
    if (
      user.username.length > 0 &&
      user.email.length > 0 &&
      user.password.length > 0
    ) {
      setButtonText(true);
    } else {
      setButtonText(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.username || !user.email || !user.password) {
      toast.error("All fields are required");
      return;
    }

    if (!user.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

     if (user.password.length < 6) {
       toast.error("Password must be at least 6 characters");
       return;
     }
    try {
      setIsLoading(true);
      const response = await axios.post("/api/users/signup", user);
      // console.log("signup response", response.data);
      toast.success("Signup successful!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
      // console.log("signup failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <form
        className="flex flex-col items-center justify-center min-h-screen py-2"
        onSubmit={handleSubmit}
      >
        <h1>{isLoading ? "Processing" : "Signup"}</h1>
        <hr />

        <label className="block mb-2" htmlFor="username">
          Username
        </label>
        <input
          className="p-2 border bg-amber-50 text-black border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
        />

        <label className="block mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="p-2 border bg-amber-50 text-black border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
        />

        <label className="block mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          {buttonText ? "Signup" : "Fill Values Please"}
        </button>

        <Link href="/login" className="mt-4">
          Visit login page
        </Link>
      </form>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </>
  );
}
