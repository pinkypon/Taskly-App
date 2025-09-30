import Header from "@/components/ui/nav-header";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios, { csrf } from "../lib/axios";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const { user, loading, fetchUser } = useAuth();
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        document.body.className =
            "via-indigo-80/60 to-blue-80/60 bg-gradient-to-br from-slate-200";
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            isMountedRef.current = false;
            document.body.className = "bg-gray-100";
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (loading || !user) return null;

    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingOut(true);
        setError(null);

        try {
            // await new Promise((resolve) => setTimeout(resolve, 10000)); // 2 second delay
            // Create timeout promise (10 seconds)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timeout")), 10000)
            );

            // Create logout promise
            const logoutPromise = (async () => {
                await csrf();
                await axios.post("/api/logout");
                await fetchUser();
            })();

            // Race between logout and timeout
            await Promise.race([logoutPromise, timeoutPromise]);

            // Only navigate if component is still mounted
            if (isMountedRef.current) {
                navigate("/login", { replace: true });
            }
        } catch (error: any) {
            console.error("Logout failed:", error);

            // Only update state if component is still mounted
            if (isMountedRef.current) {
                if (error.message === "Request timeout") {
                    setError("Logout is taking too long");
                } else if (error.response?.status === 401) {
                    // Already logged out, just navigate
                    navigate("/login", { replace: true });
                } else {
                    setError("Logout failed. Please try again.");
                }
                setIsLoggingOut(false);
            }
        }
    };

    return (
        <>
            <nav className="relative bg-transparent">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center rounded-lg p-2 transition-colors hover:bg-indigo-200/50"
                    >
                        <Header className="text-indigo-700">Taskly</Header>
                        <img
                            src="/images/task-logo.png"
                            alt="Logo"
                            className="h-7 w-7"
                        />
                    </Link>

                    {/* Hamburger button (mobile) */}
                    <button
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="block rounded-lg p-2 transition hover:bg-indigo-50 md:hidden"
                        aria-label="Toggle menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* Desktop menu */}
                    <div className="hidden items-center md:flex">
                        {/* User dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-indigo-200/50 hover:text-indigo-600"
                                aria-expanded={dropdownOpen}
                                aria-haspopup="true"
                            >
                                <svg
                                    viewBox="0 0 16 16"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#000000"
                                    className="h-4 w-4"
                                >
                                    <g
                                        id="SVGRepo_bgCarrier"
                                        strokeWidth="0"
                                    ></g>
                                    <g
                                        id="SVGRepo_tracerCarrier"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                        {" "}
                                        <path
                                            d="m 8 1 c -1.65625 0 -3 1.34375 -3 3 s 1.34375 3 3 3 s 3 -1.34375 3 -3 s -1.34375 -3 -3 -3 z m -1.5 7 c -2.492188 0 -4.5 2.007812 -4.5 4.5 v 0.5 c 0 1.109375 0.890625 2 2 2 h 8 c 1.109375 0 2 -0.890625 2 -2 v -0.5 c 0 -2.492188 -2.007812 -4.5 -4.5 -4.5 z m 0 0"
                                            fill="#2e3436"
                                        ></path>{" "}
                                    </g>
                                </svg>

                                {user.email}
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-5 z-10 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg transition-all duration-200">
                                    {/* Error message */}
                                    {error && (
                                        <div className="mx-2 mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-600">
                                            {error}
                                        </div>
                                    )}

                                    <div className="px-2 py-2 text-sm">
                                        <Link
                                            to="/"
                                            className="flex items-center gap-2 rounded-xl px-4 py-2 transition hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                                                />
                                            </svg>
                                            Dashboard
                                        </Link>
                                        <form onSubmit={handleLogout}>
                                            <button
                                                type="submit"
                                                disabled={isLoggingOut}
                                                aria-busy={isLoggingOut}
                                                aria-label={
                                                    isLoggingOut
                                                        ? "Logging out"
                                                        : "Logout"
                                                }
                                                className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-left transition hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isLoggingOut ? (
                                                    <svg
                                                        className="h-4 w-4 animate-spin"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        aria-hidden="true"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V5"
                                                        />
                                                    </svg>
                                                )}
                                                {isLoggingOut
                                                    ? "Logging out..."
                                                    : "Logout"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile dropdown menu */}
                {mobileMenuOpen && (
                    <div className="animate-slideDown space-y-4 border-t border-indigo-100/50 bg-transparent px-4 pb-6 shadow-sm backdrop-blur-sm md:hidden">
                        {/* Error message for mobile */}
                        {error && (
                            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* user row */}
                        <div className="flex items-center gap-3 rounded-lg p-3 transition-all duration-200">
                            <div className="flex items-center justify-center rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    className="h-5 w-5"
                                    fill="#000000"
                                >
                                    <path d="M8 1a3 3 0 100 6 3 3 0 000-6zM6.5 8C4.01 8 2 10.01 2 12.5v.5A2 2 0 004 15h8a2 2 0 002-2v-.5C14 10.01 11.99 8 9.5 8h-3z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium">
                                {user.email}
                            </span>
                        </div>

                        {/* dashboard */}
                        <Link
                            to="/"
                            className="flex items-center gap-3 rounded-lg p-3 transition-all duration-200 hover:bg-indigo-200/50 hover:text-indigo-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                                />
                            </svg>
                            <span className="text-sm font-medium">
                                Dashboard
                            </span>
                        </Link>

                        {/* logout */}
                        <form onSubmit={handleLogout}>
                            <button
                                type="submit"
                                disabled={isLoggingOut}
                                aria-busy={isLoggingOut}
                                aria-label={
                                    isLoggingOut ? "Logging out" : "Logout"
                                }
                                className="flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:bg-red-200/80 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoggingOut ? (
                                    <svg
                                        className="h-5 w-5 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V5"
                                        />
                                    </svg>
                                )}
                                {isLoggingOut ? "Logging out..." : "Logout"}
                            </button>
                        </form>
                    </div>
                )}
            </nav>

            {/* Page content */}
            {children}

            {/* Footer */}
        </>
    );
}
