// components/ui/productivity-card.tsx
import { Target, TrendingUp, Zap } from "lucide-react";
import React from "react";

interface ProductivityData {
    productivity: number;
    target: number;
    status: string;
    remaining: string;
    todayCompleted: number;
    todayTotal: number;
}

interface ProductivityCardProps {
    data: ProductivityData | null;
}

const ProductivityCard: React.FC<ProductivityCardProps> = ({ data }) => {
    if (!data) return null;

    const percent = `${data.productivity}%`;
    const target = `${data.target}%`;

    // Motivational messages based on productivity level
    const getMotivationalMessage = (percentage: number) => {
        if (percentage >= 90)
            return {
                message: "Outstanding work! You're crushing it! 🚀",
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-100",
            };
        if (percentage >= 75)
            return {
                message: "Great momentum! Keep it up! 💪",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-100",
            };
        if (percentage >= 60)
            return {
                message: "Good progress! You're on track! 📈",
                color: "text-indigo-600",
                bgColor: "bg-indigo-50",
                borderColor: "border-indigo-100",
            };
        if (percentage >= 40)
            return {
                message: "Keep pushing! You can do this! 🎯",
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
                borderColor: "border-yellow-100",
            };
        return {
            message: "Every step counts! Let's build momentum! 🌱",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-100",
        };
    };

    // Quick action suggestions
    const getQuickTip = (percentage: number) => {
        if (percentage >= 90) return "Time for a well-deserved break!";
        if (percentage >= 75) return "Try tackling a challenging task next";
        if (percentage >= 60) return "Focus on your top priority";
        if (percentage >= 40) return "Break large tasks into smaller steps";
        return "Start with a quick 5-minute task";
    };

    const motivation = getMotivationalMessage(data.productivity);
    const tip = getQuickTip(data.productivity);

    const todayCompleted = data.todayCompleted || 0;
    const todayTotal = data.todayTotal || 0;

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Header */}
            <div className="mb-6 flex justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-600">
                            Productivity Level
                        </h4>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">
                        {percent}
                    </div>
                </div>
            </div>

            {/* Progress Bar Section */}
            <div className="mb-6 space-y-3">
                <div className="flex justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>Target: {target}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                        style={{ width: percent }}
                    ></div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
                        {data.status}
                    </span>
                    <span className="text-xs text-gray-400">
                        {data.remaining}
                    </span>
                </div>
            </div>

            {/* Motivational Message */}
            <div
                className={`mb-4 rounded-lg ${motivation.bgColor} border p-3 ${motivation.borderColor}`}
            >
                <div className="flex items-center gap-2">
                    <Zap className={`h-4 w-4 ${motivation.color}`} />
                    <span className={`text-sm font-medium ${motivation.color}`}>
                        {motivation.message}
                    </span>
                </div>
            </div>

            {/* Today's Summary */}
            <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-green-700">
                        Overall Progress
                    </h5>
                    <Target className="h-5 w-5 text-green-500" />
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="text-2xl font-bold text-green-600">
                            {todayCompleted}/{todayTotal}
                        </div>
                        <div className="text-sm text-green-600">
                            Tasks Completed
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                            {todayTotal > 0
                                ? Math.round(
                                      (todayCompleted / todayTotal) * 100
                                  )
                                : 0}
                            %
                        </div>
                        <div className="text-sm text-green-600">Complete</div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-green-200 rounded-full">
                    <div
                        className="h-2 bg-green-500 rounded-full transition-all duration-500"
                        style={{
                            width: `${
                                todayTotal > 0
                                    ? (todayCompleted / todayTotal) * 100
                                    : 0
                            }%`,
                        }}
                    ></div>
                </div>

                <div className="mt-2 text-center text-sm text-green-600">
                    {todayTotal - todayCompleted > 0
                        ? `${todayTotal - todayCompleted} tasks remaining`
                        : "All done for today!"}
                </div>
            </div>
        </div>
    );
};

export default ProductivityCard;
