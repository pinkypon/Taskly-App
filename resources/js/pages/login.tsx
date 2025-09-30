import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios, { csrf } from "../lib/axios";

export default function Login() {
    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        // Trigger animation
        document.title = "Taskly - Log In";
        setTimeout(() => setIsVisible(true), 100);

        // Mouse movement handler
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        setError("");

        try {
            await csrf();
            await axios.post("/login", form);
            await fetchUser();
            navigate("/home");
        } catch (err: any) {
            const res = err.response;

            if (res?.status === 422 && res.data?.errors) {
                const firstKey = Object.keys(res.data.errors)[0];
                const firstMessage = res.data.errors[firstKey][0];
                setError(firstMessage);
            } else if (res?.status === 401 && res.data?.message) {
                setError(res.data.message);
            } else {
                setError("Login failed. Please try again.");
            }

            console.error("Login error:", res?.data || err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="via-indigo-80/60 to-blue-80/60 min-h-screen overflow-hidden bg-gradient-to-br from-slate-200">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Dynamic gradient orbs */}
                <div
                    className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-indigo-400/10 via-indigo-500/8 to-blue-500/10 blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * 0.02}px, ${
                            mousePosition.y * 0.02
                        }px)`,
                    }}
                ></div>
                <div
                    className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/10 via-indigo-500/8 to-indigo-600/10 blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * -0.01}px, ${
                            mousePosition.y * -0.01
                        }px)`,
                    }}
                ></div>

                {/* Additional floating elements */}
                <div
                    className="absolute top-20 right-20 h-4 w-4 animate-bounce rounded-full bg-indigo-300/20"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute bottom-32 left-20 h-6 w-6 animate-bounce rounded-full bg-indigo-400/20"
                    style={{ animationDelay: "3s" }}
                ></div>
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
                <div
                    className={`w-full max-w-md transform transition-all duration-1000 ${
                        isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                    }`}
                >
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-6 flex items-center justify-center gap-3">
                            <h1 className="text-4xl font-black text-indigo-900 md:text-4xl">
                                Taskly
                            </h1>
                            <img
                                src="/images/task-logo.png"
                                alt="Logo"
                                className="h-12 w-12 md:h-12 md:w-12"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="w-full">
                        <div className="group relative rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl">
                            {/* Gradient border effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                            <div className="relative z-10">
                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 p-4 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0">
                                                <AlertCircle className="h-5 w-5 text-red-600" />
                                            </div>
                                            <div className="text-sm font-medium text-red-800">
                                                {error}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Mail className="h-4 w-4 text-indigo-600" />
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                className={`w-full rounded-xl border-2 px-4 py-3 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                                                    error
                                                        ? "border-red-300 bg-red-50/50"
                                                        : "border-gray-200 bg-white/50 focus:border-indigo-400 focus:bg-white"
                                                }`}
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Lock className="h-4 w-4 text-indigo-600" />
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                className={`w-full rounded-xl border-2 px-4 py-3 pr-12 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                                                    error
                                                        ? "border-red-300 bg-red-50/50"
                                                        : "border-gray-200 bg-white/50 focus:border-indigo-400 focus:bg-white"
                                                }`}
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-indigo-600"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Forgot Password Link */}
                                    <div className="flex justify-end">
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="group relative w-full transform overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                        <span className="relative flex items-center justify-center">
                                            {submitting ? (
                                                <>
                                                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                                                    Signing In...
                                                </>
                                            ) : (
                                                <>
                                                    Sign In
                                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                {/* Register Link */}
                                <div className="mt-8 text-center">
                                    <p className="text-gray-600">
                                        Don't have an account?{" "}
                                        <Link
                                            to="/register"
                                            className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
                                        >
                                            Create one now
                                        </Link>
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="my-8 flex items-center">
                                    <div className="flex-1 border-t border-gray-200"></div>
                                    <div className="mx-4 text-sm text-gray-500">
                                        or
                                    </div>
                                    <div className="flex-1 border-t border-gray-200"></div>
                                </div>

                                {/* Quick Demo Link */}
                                {/* <div className="text-center">
                                    <Link
                                        to="/demo"
                                        className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white/50 px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                                    >
                                        Try Quick Demo
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Back to Landing */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-indigo-600"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
