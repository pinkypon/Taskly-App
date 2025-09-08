import Header from '@/components/ui/nav-header';
import { useAuth } from '@/context/AuthContext';
import Auth from '@/guard/auth';
import Guest from '@/guard/guest';
import { ArrowRight, BarChart3, CheckCircle, Edit3, PieChart, Plus, Target, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function EnhancedLanding() {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { user, loading, fetchUser } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Trigger animation
        document.title = "Taskly";
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    // Sample data to match your homepage structure
    const sampleData = [
        { month: 'Jan', created: 15, completed: 12 },
        { month: 'Feb', created: 20, completed: 18 },
        { month: 'Mar', created: 18, completed: 16 },
        { month: 'Apr', created: 22, completed: 20 },
    ];

    // Calculate totals for summary (matching homepage logic)
    const totalCreated = sampleData.reduce((sum, item) => sum + item.created, 0);
    const totalCompleted = sampleData.reduce((sum, item) => sum + item.completed, 0);
    const completionRate = totalCreated > 0 ? Math.round((totalCompleted / totalCreated) * 100) : 0;

    useEffect(() => {
        // Trigger animation
        setTimeout(() => setIsVisible(true), 100);

        // Mouse movement handler
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        {
            icon: <Zap className="h-8 w-8" />,
            title: 'Lightning Fast',
            description: 'Create and manage tasks instantly with our clean, intuitive interface designed for efficiency',
            delay: '200ms',
        },
        {
            icon: <BarChart3 className="h-8 w-8" />,
            title: 'Visual Analytics',
            description: 'Track your progress with beautiful bar charts showing tasks created vs completed over time',
            delay: '200ms',
        },
        {
            icon: <PieChart className="h-8 w-8" />,
            title: 'Priority Insights',
            description: 'Understand your task distribution with pie charts breaking down high, medium, and low priorities',
            delay: '200ms',
        },
        {
            icon: <TrendingUp className="h-8 w-8" />,
            title: 'Productivity Tracking',
            description: 'Monitor your weekly productivity levels with clear progress indicators and completion rates',
            delay: '200ms',
        },
        {
            icon: <Target className="h-8 w-8" />,
            title: 'Task Status Overview',
            description: 'Visualize your workflow with donut charts showing completed, pending, and overdue tasks',
            delay: '200ms',
        },
        {
            icon: <Edit3 className="h-8 w-8" />,
            title: 'Easy Task Management',
            description: 'Edit, update, and organize your tasks with a powerful table interface and quick actions',
            delay: '200ms',
        },
    ];

    // Loading skeleton component for buttons
    const ButtonSkeleton = () => (
        <div className="rounded-3xl bg-indigo-300 px-6 py-2 animate-pulse">
            <div className="h-5 w-20 rounded"></div>
        </div>
    );

    // Mobile loading skeleton
    const MobileButtonSkeleton = () => (
        <div className="flex items-center gap-3 rounded-lg p-3 bg-indigo-200 animate-pulse">
            <div className="h-5 w-5 rounded"></div>
            <div className="h-5 w-20 rounded"></div>
        </div>
    );

    const additionalStyles = `
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(3deg); }
  50% { transform: translateY(-20px) rotate(-3deg); }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;

    return (
        // Main container with seamless background
        <div className="via-indigo-80/60 to-blue-80/60 min-h-screen overflow-hidden bg-gradient-to-br from-slate-200">
            {/* Navigation */}
            <nav className="relative bg-transparent">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center rounded-lg p-2 hover:bg-indigo-200/50">
                        <Header className="text-indigo-700">Taskly</Header>
                        <img
                            src="/images/task-logo.png"
                            alt="Logo"
                            className="h-7 w-7"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                    {/* Hamburger button (mobile) */}
                    <button
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="block rounded-lg p-2 transition hover:bg-indigo-200/50 md:hidden"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="hidden items-center space-x-6 md:flex">
                        <a href="#features" className="text-gray-700 transition-colors hover:text-indigo-600">
                            Features
                        </a>
                        <a href="#analytics" className="text-gray-700 transition-colors hover:text-indigo-600">
                            Analytics
                        </a>

                        {/* Desktop Button with Loading State */}
                        {loading ? (
                            <ButtonSkeleton />
                        ) : (
                            <>
                                <Auth>
                                    <Link to="/home" className="rounded-3xl bg-indigo-600 px-6 py-2 text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105">
                                        Home
                                    </Link>
                                </Auth>
                                <Guest>
                                    <Link to="/login" className="rounded-3xl bg-indigo-600 px-6 py-2 text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105">
                                        Get Started
                                    </Link>
                                </Guest>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile dropdown menu */}
                {mobileMenuOpen && (
                    <div className="animate-slideDown space-y-4 border-t border-indigo-100/50 bg-transparent px-4 pb-6 shadow-sm backdrop-blur-sm md:hidden">
                        <div className="mt-2">
                            <a
                                href="#features"
                                className="flex items-center gap-3 rounded-lg p-3 text-gray-700 transition-all duration-200 hover:bg-indigo-200/50 hover:text-indigo-600"
                            >
                                <Zap className="h-5 w-5" />
                                <span className="font-medium">Features</span>
                            </a>
                            <a
                                href="#analytics"
                                className="flex items-center gap-3 rounded-lg p-3 text-gray-700 transition-all duration-200 hover:bg-indigo-200/50 hover:text-indigo-600"
                            >
                                <BarChart3 className="h-5 w-5" />
                                <span className="font-medium">Analytics</span>
                            </a>

                            {/* Mobile Button with Loading State */}
                            {loading ? (
                                <MobileButtonSkeleton />
                            ) : (
                                <>
                                    {user ? (
                                        <Link
                                            to="/home"
                                            className="flex items-center gap-3 rounded-lg p-3 text-gray-700 transition-all duration-200 hover:bg-indigo-200/50 hover:text-indigo-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
                                            </svg>
                                            <span className="font-medium">Home</span>
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="flex items-center gap-3 rounded-lg p-3 text-gray-700 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <ArrowRight className="h-5 w-5" />
                                            <span className="font-medium">Get Started</span>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section - no background, inherits from main container */}
            <section className="relative flex h-[650px] items-center justify-center overflow-hidden px-6">
                {/* Enhanced Background Elements - Only decorative elements, no background colors */}
                <div className="absolute inset-0">
                    {/* Dynamic gradient orbs - Updated to indigo theme */}
                    <div
                        className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-indigo-400/10 via-indigo-500/8 to-blue-500/10 blur-3xl"
                        style={{
                            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                        }}
                    ></div>
                    <div
                        className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/10 via-indigo-500/8 to-indigo-600/10 blur-3xl"
                        style={{
                            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
                        }}
                    ></div>

                    {/* Additional floating elements - Updated colors */}
                    <div
                        className="absolute top-20 right-20 h-4 w-4 animate-bounce rounded-full bg-indigo-300/20"
                        style={{ animationDelay: '1s' }}
                    ></div>
                    <div
                        className="absolute bottom-32 left-20 h-6 w-6 animate-bounce rounded-full bg-indigo-400/20"
                        style={{ animationDelay: '3s' }}
                    ></div>
                </div>

                <div className="mx-auto flex min-h-[100vh] max-w-6xl flex-col text-center md:min-h-[100vh]">
                    <div
                        className={`flex min-h-screen transform flex-col items-center justify-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                    >
                        <h1 className="mb-8 text-center text-5xl leading-tight font-black text-indigo-900 md:text-6xl">
                            Task Management
                            <span className="mt-4 block bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text pb-1 text-4xl text-transparent md:pb-2 md:text-5xl">
                                With Visual Insights
                            </span>
                        </h1>
                        <p className="mx-auto mb-12 max-w-3xl text-center text-xl leading-relaxed md:text-2xl">
                            Transform your productivity with beautiful charts, comprehensive analytics, and
                            <span className="font-semibold text-indigo-800"> powerful task management</span> features.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                            <Link
                                to="/register"
                                className="group relative transform overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <span className="relative flex items-center">
                                    Boost My Productivity
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>

                            <Link
                                to="/login"
                                className="rounded-2xl border-2 border-indigo-300 px-8 py-4 text-lg font-semibold text-indigo-700 transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50"
                            >
                                Already a User?
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - no background, inherits from main container */}
            <section id="features" className="relative overflow-hidden py-32">
                {/* Clean Background with Floating Orbs Only */}
                <div className="absolute inset-0">
                    {/* Floating gradient orbs */}
                    <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-r from-indigo-400/10 to-purple-400/10 blur-3xl"></div>
                    <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-400/10 blur-3xl"></div>
                </div>

                <div className="relative z-10 mx-auto max-w-6xl px-6">
                    <div
                        className={`mb-20 transform text-center transition-all delay-300 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                    >
                        <h2 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
                            Powerful Features for
                            <span className="block bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                Better Productivity
                            </span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-xl text-gray-600">Everything you need to stay organized and track your progress</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`group relative transform rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                    }`}
                                style={{
                                    transitionDelay: isVisible ? feature.delay : '0ms',
                                }}
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                                <div className="relative z-10">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 transition-transform duration-300 group-hover:scale-110">
                                        <div className="text-white">{feature.icon}</div>
                                    </div>

                                    <h3 className="mb-4 text-2xl font-bold text-gray-900">{feature.title}</h3>

                                    <p className="leading-relaxed text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Analytics Preview Section - no background, inherits from main container */}
            <section id="analytics" className="relative overflow-hidden py-32">
                {/* Clean Background with Floating Orbs Only */}
                <div className="absolute inset-0">
                    {/* Floating gradient orbs */}
                    <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-r from-indigo-400/10 to-purple-400/10 blur-3xl"></div>
                    <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-400/10 blur-3xl"></div>
                </div>

                <div className="relative z-10 mx-auto max-w-6xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="mb-6 text-5xl font-bold text-gray-900">Visualize Your Progress</h2>
                        <p className="text-xl text-gray-600">Track productivity with beautiful charts and comprehensive analytics</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {/* Bar Chart Preview */}
                        <div className="rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-indigo-600" />
                                <h4 className="font-semibold text-gray-800">Progress Over Time</h4>
                            </div>

                            <div className="space-y-4">
                                {/* Summary Cards - Compact version for preview */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="rounded-lg border border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-2">
                                        <div className="mb-1 flex items-center gap-1">
                                            <Plus className="h-3 w-3 text-indigo-600" />
                                            <span className="text-xs font-medium text-indigo-700">Created</span>
                                        </div>
                                        <div className="text-sm font-bold text-indigo-900">{totalCreated}</div>
                                    </div>
                                    <div className="rounded-lg border border-green-100 bg-gradient-to-br from-green-50 to-green-100/50 p-2">
                                        <div className="mb-1 flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3 text-green-600" />
                                            <span className="text-xs font-medium text-green-700">Done</span>
                                        </div>
                                        <div className="text-sm font-bold text-green-900">{totalCompleted}</div>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50 p-2">
                                        <div className="mb-1 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3 text-gray-600" />
                                            <span className="text-xs font-medium text-gray-700">Rate</span>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">{completionRate}%</div>
                                    </div>
                                </div>

                                {/* Completion Rate Bar - Matching homepage style */}
                                <div className="rounded-lg border border-gray-100 bg-gradient-to-r from-white to-gray-50 p-3">
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-600">Overall Progress</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-lg font-bold text-gray-900">{completionRate}%</div>
                                        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className={`h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 transition-all duration-1500 ease-out ${isVisible ? 'animate-pulse' : ''
                                                    }`}
                                                style={{
                                                    width: isVisible ? `${completionRate}%` : '0%',
                                                    transitionDelay: '300ms',
                                                }}
                                            >
                                                {/* Shimmer effect */}
                                                <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pie Chart Preview */}
                        <div className="rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-indigo-600" />
                                <h4 className="font-semibold text-gray-800">Task Priorities</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <span className="text-sm text-gray-600">High (45%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                    <span className="text-sm text-gray-600">Medium (35%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-gray-600">Low (20%)</span>
                                </div>
                            </div>
                        </div>

                        {/* Donut Chart Preview */}
                        <div className="rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-2">
                                <Target className="h-5 w-5 text-indigo-600" />
                                <h4 className="font-semibold text-gray-800">Task Status</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-gray-600">Completed (60%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                    <span className="text-sm text-gray-600">Pending (30%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <span className="text-sm text-gray-600">Overdue (10%)</span>
                                </div>
                            </div>
                        </div>

                        {/* Productivity Level Preview */}
                        <div className="rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-indigo-600" />
                                <h4 className="font-semibold text-gray-800">Productivity Level</h4>
                            </div>
                            <div className="mb-2">
                                <div className="text-2xl font-bold text-gray-800">87%</div>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200">
                                <div
                                    className={`h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 transition-all duration-1500 ease-out ${isVisible ? 'animate-pulse' : ''
                                        }`}
                                    style={{
                                        width: isVisible ? '87%' : '0%',
                                        transitionDelay: '300ms',
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - no background, inherits from main container */}
            <section className="relative overflow-hidden py-32">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0">
                    {/* Large gradient orbs */}
                    <div className="absolute -top-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-indigo-400/20"></div>
                    <div className="absolute -right-40 -bottom-40 h-80 w-80 animate-pulse rounded-full bg-indigo-400/20"></div>

                    {/* Floating elements */}
                    <div className="absolute top-20 left-1/4 h-2 w-2 animate-pulse rounded-full bg-indigo-400/20"></div>
                    <div className="absolute top-12 left-1/2 h-2 w-2 animate-pulse rounded-full bg-indigo-400/20"></div>
                    <div
                        className="absolute right-1/4 bottom-20 h-3 w-3 animate-pulse rounded-full bg-blue-400/20"
                        style={{ animationDelay: '2s' }}
                    ></div>
                    <div
                        className="absolute top-1/2 right-20 h-1 w-1 animate-pulse rounded-full bg-purple-400/20"
                        style={{ animationDelay: '4s' }}
                    ></div>
                </div>

                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                    <div
                        className={`transform transition-all delay-500 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                    >
                        <h3 className="mb-8 space-y-4 text-5xl font-bold text-gray-900 md:text-5xl">
                            <span className="block">Ready to Boost Your</span>
                            <span className="block bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent md:text-6xl">
                                Productivity?
                            </span>
                        </h3>

                        <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-600">
                            Boost your productivity with Taskly — the smarter way to manage tasks visually.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                            <Link
                                to="/login"
                                className="group relative transform overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-10 py-5 text-xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <span className="relative flex items-center">
                                    Start Your Journey
                                    <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(3deg); }
            50% { transform: translateY(-20px) rotate(-3deg); }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `,
                }}
            />
        </div>
    );
}
