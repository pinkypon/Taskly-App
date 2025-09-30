// // router.tsx
// import { Route, Routes } from 'react-router-dom';
// import AuthGuard from './guard/authguard';
// import GuestGuard from './guard/guestguard'; // import guard
// import EmailGuard from '@/guard/verify-email';
// import VerifyEmail from './pages/email/verifyemailpage';
// import Home from './pages/homes';
// import Landing from './pages/landing/landing';
// import Login from './pages/login';
// import NotFound from './pages/not-found/not-found';
// import Playground from './pages/playground';
// import Register from './pages/register';
// import Test from './pages/test';
// import ForgotPassword from './pages/forgotpassword';
// import ResetPassword from './pages/reset-password';

// export default function AppRoutes() {
//     return (
//         <Routes>
//             {/* Public Route - Landing page */}
//             <Route path="/" element={<Landing />} />

//             {/* Guest-only Route - accessible only if not logged in */}
//             <Route
//                 path="/login"
//                 element={
//                     <GuestGuard>
//                         <Login />
//                     </GuestGuard>
//                 }
//             />
//             <Route
//                 path="/register"
//                 element={
//                     <GuestGuard>
//                         <Register />
//                     </GuestGuard>
//                 }
//             />

//             {/* Email verification Route - protected by EmailGuard */}
//             <Route
//                 path="/verify-email"
//                 element={
//                     <EmailGuard>
//                         <VerifyEmail />
//                     </EmailGuard>
//                 }
//             />

//             {/* Password reset routes - public */}
//             <Route path="/forgot-password" element={
//                 <GuestGuard>
//                     <ForgotPassword />
//                 </GuestGuard>
//             }
//             />
//             <Route path="/reset-password" element={<ResetPassword />} />

//             {/* <Route path="/test" element={<Test />} />
//             <Route path="/play" element={<Playground />} /> */}

//             {/* Protected Route - requires authentication */}
//             <Route
//                 path="/home"
//                 element={
//                     <AuthGuard>
//                         <Home />
//                     </AuthGuard>
//                 }
//             />

//             {/* Catch-all Route for undefined paths */}
//             <Route path="*" element={<NotFound />} />
//         </Routes>
//     );
// }

import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

// Guards (small, keep normal import)
import AuthGuard from "@/guard/authguard";
import GuestGuard from "@/guard/guestguard";
import EmailGuard from "@/guard/verify-email";
import Loader from "@/components/Loader";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load pages
const Home = lazy(() => import("./pages/homes"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Landing = lazy(() => import("./pages/landing/landing"));
const VerifyEmail = lazy(() => import("./pages/email/verifyemailpage"));
const ForgotPassword = lazy(() => import("./pages/forgotpassword"));
const ResetPassword = lazy(() => import("./pages/reset-password"));
const NotFound = lazy(() => import("./pages/not-found/not-found"));

// Prefetch function for important routes
const prefetchRoute = (importFunc: () => Promise<any>) => {
    importFunc();
};

export default function AppRoutes() {
    // Prefetch login and register on mount
    useEffect(() => {
        // Prefetch after a small delay to not block initial render
        const timer = setTimeout(() => {
            prefetchRoute(() => import("./pages/login"));
            prefetchRoute(() => import("./pages/register"));
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Public Route - Landing page */}
                <Route
                    path="/"
                    element={
                        <ErrorBoundary>
                            <Landing />
                        </ErrorBoundary>
                    }
                />

                {/* Guest-only Routes */}
                <Route
                    path="/login"
                    element={
                        <ErrorBoundary>
                            <GuestGuard>
                                <Login />
                            </GuestGuard>
                        </ErrorBoundary>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <ErrorBoundary>
                            <GuestGuard>
                                <Register />
                            </GuestGuard>
                        </ErrorBoundary>
                    }
                />

                {/* Email verification Route */}
                <Route
                    path="/verify-email"
                    element={
                        <ErrorBoundary>
                            <EmailGuard>
                                <VerifyEmail />
                            </EmailGuard>
                        </ErrorBoundary>
                    }
                />

                {/* Password reset routes */}
                <Route
                    path="/forgot-password"
                    element={
                        <ErrorBoundary>
                            <GuestGuard>
                                <ForgotPassword />
                            </GuestGuard>
                        </ErrorBoundary>
                    }
                />
                <Route
                    path="/reset-password"
                    element={
                        <ErrorBoundary>
                            <GuestGuard>
                                <ResetPassword />
                            </GuestGuard>
                        </ErrorBoundary>
                    }
                />

                {/* Protected Route */}
                <Route
                    path="/home"
                    element={
                        <ErrorBoundary>
                            <AuthGuard>
                                <Home />
                            </AuthGuard>
                        </ErrorBoundary>
                    }
                />

                {/* Catch-all */}
                <Route
                    path="*"
                    element={
                        <ErrorBoundary>
                            <NotFound />
                        </ErrorBoundary>
                    }
                />
            </Routes>
        </Suspense>
    );
}
