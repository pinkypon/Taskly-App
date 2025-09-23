import React from "react";

export default function Loader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-indigo-80/60 to-blue-80/60">
            <div className="flex items-center space-x-1">
                <div
                    className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                ></div>
                <div
                    className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                    className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                ></div>
            </div>
        </div>
    );
}
