"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function ResetPasswordPage() {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        if (urlToken) {
            setToken(urlToken || "");
        }
    }, []);

    useEffect(() => {
        confirmPasswordValidation();
    }, [password, confirmPassword]);

    const confirmPasswordValidation = () => {
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            setButtonDisabled(true);
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setButtonDisabled(true);
            return false;
        }
        setButtonDisabled(false);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!confirmPasswordValidation()) return;

        try {
            setIsProcessing(true);
            const response = await axios.post("/api/users/resetpassword", { token, password });
            toast.success("Password reset successful!");
            router.push("/login");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error resetting password");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "password") {
            setPassword(value);
        } else if (id === "confirmPassword") {
            setConfirmPassword(value);
        }
    };

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <Toaster position="bottom-center" />
        <h1 className="text-2xl font-bold mb-4">
          {isProcessing ? "Processing..." : "Reset Password"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-black text-white p-6 rounded shadow-md w-full max-w-sm"
        >
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={buttonDisabled}
          >
            Reset Password
          </button>
        </form>
      </div>
    );
}

