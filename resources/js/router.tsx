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
import { lazy, Suspense } from "react"; // add this

// Guards (small, keep normal import)
import AuthGuard from "@/guard/authguard";
import GuestGuard from "@/guard/guestguard"; // import guard
import EmailGuard from "@/guard/verify-email";
import Loader from "@/components/Loader"; // adjust path if needed

const Home = lazy(() => import("./pages/homes"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Landing = lazy(() => import("./pages/landing/landing"));
const VerifyEmail = lazy(() => import("./pages/email/verifyemailpage"));
const ForgotPassword = lazy(() => import("./pages/forgotpassword"));
const ResetPassword = lazy(() => import("./pages/reset-password"));
const NotFound = lazy(() => import("./pages/not-found/not-found"));

export default function AppRoutes() {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Public Route - Landing page */}
                <Route path="/" element={<Landing />} />

                {/* Guest-only Route */}
                <Route
                    path="/login"
                    element={
                        <GuestGuard>
                            <Login />
                        </GuestGuard>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <GuestGuard>
                            <Register />
                        </GuestGuard>
                    }
                />

                {/* Email verification Route */}
                <Route
                    path="/verify-email"
                    element={
                        <EmailGuard>
                            <VerifyEmail />
                        </EmailGuard>
                    }
                />

                {/* Password reset routes */}
                <Route
                    path="/forgot-password"
                    element={
                        <GuestGuard>
                            <ForgotPassword />
                        </GuestGuard>
                    }
                />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Route */}
                <Route
                    path="/home"
                    element={
                        <AuthGuard>
                            <Home />
                        </AuthGuard>
                    }
                />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
