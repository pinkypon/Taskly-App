import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../guard/auth';
import Guest from '../guard/guest';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Set landing page body class
        document.body.className = 'bg-white text-gray-800';

        // Optional: cleanup if navigating away
        return () => {
            document.body.className = ''; // or set a default class
        };
    }, []);

    return (
        <>
            {/* Navbar */}
            <nav className="bg-white shadow-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <h1 className="text-2xl font-bold text-indigo-600">TaskManager</h1>
                    <div className="space-x-4">
                        <Auth>
                            <Link to="/home" className="text-gray-700 hover:text-indigo-600">
                                Home
                            </Link>
                        </Auth>
                        <Link to="#features" className="text-gray-700 hover:text-indigo-600">
                            Features
                        </Link>
                        <Guest>
                            <Link to="/login" className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                                Login
                            </Link>
                        </Guest>
                    </div>
                </div>
            </nav>

            {children}

            {/* Footer */}
            <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">&copy; 2025 TaskManager. All rights reserved.</footer>
        </>
    );
}
