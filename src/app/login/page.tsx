"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post("/api/users/login", user);
      // console.log("login response", response.data);
      
      toast.success("Login successful!");
      // router.push(`/profile/${response.data.user.username}`);
      router.push("/profile");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-lg p-8">
        <h1 className="mb-6 text-center text-2xl font-bold">
          {isLoading ? "Processing..." : "Login"}
        </h1>

        <form onSubmit={onLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={user.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 bg-amber-50 p-2 text-black focus:border-gray-600 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Link href="/forgotPassMail" className="text-sm text-gray-500 hover:underline transition duration-300">
              <span className="hover:text-gray-700">Forgot Password?</span>
            </Link>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={user.password}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-gray-600 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-white px-4 py-2 text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center">
            <Link href="/signup" className="text-sm hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </form>
      </div>

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
