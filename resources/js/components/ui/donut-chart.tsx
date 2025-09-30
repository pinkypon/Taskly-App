import { PieChart } from "@mui/x-charts/PieChart";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type DonutChartProps = {
    statusCounts: {
        Completed: number;
        Pending: number;
        Overdue: number;
    };
};

export default function DonutChart({ statusCounts }: DonutChartProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 200);
    }, []);

    const total =
        statusCounts.Completed + statusCounts.Pending + statusCounts.Overdue;

    // Map data to chart format with consistent design
    const chartData = [
        {
            id: 0,
            value: statusCounts.Completed,
            label: "Completed",
            color: "#10B981", // Green-500
        },
        {
            id: 1,
            value: statusCounts.Pending,
            label: "Pending",
            color: "#F59E0B", // Amber-500
        },
        {
            id: 2,
            value: statusCounts.Overdue,
            label: "Overdue",
            color: "#EF4444", // Red-500
        },
    ].filter((item) => item.value > 0); // Only show segments with data

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Completed":
                return <CheckCircle className="h-3 w-3 text-green-500" />;
            case "Pending":
                return <Clock className="h-3 w-3 text-amber-500" />;
            case "Overdue":
                return <AlertTriangle className="h-3 w-3 text-red-500" />;
            default:
                return null;
        }
    };

    if (total === 0) {
        return (
            <div className="flex h-32 items-center justify-center text-gray-500">
                <p className="text-sm">No status data</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Compact Chart */}
            <div className="mb-3 flex items-center justify-center">
                <div className="relative">
                    <PieChart
                        series={[
                            {
                                data: chartData,
                                innerRadius: 25,
                                outerRadius: 65,
                                paddingAngle: 1,
                                cornerRadius: 2,
                            },
                        ]}
                        width={140}
                        height={140}
                        margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        hideLegend
                        sx={{
                            "& .MuiPieArc-root": {
                                stroke: "#ffffff",
                                strokeWidth: 2,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    strokeWidth: 3,
                                    filter: "brightness(1.1)",
                                },
                            },
                        }}
                    />

                    {/* Center total - now below the chart like BasicPie */}
                    <div className="mb-3 text-center">
                        <div className="text-lg font-bold text-gray-800">
                            {total}
                        </div>
                        <div className="text-xs text-gray-500">total tasks</div>
                    </div>
                </div>
            </div>

            {/* Compact Legend with Animation */}
            <div className="flex-1 space-y-2">
                {Object.entries(statusCounts).map(([status, count], index) => {
                    if (count === 0) return null; // Don't show zero counts

                    const percentage = Math.round((count / total) * 100);
                    const colors = {
                        Completed: {
                            bg: "bg-green-50",
                            text: "text-green-700",
                            dot: "bg-green-500",
                        },
                        Pending: {
                            bg: "bg-amber-50",
                            text: "text-amber-700",
                            dot: "bg-amber-500",
                        },
                        Overdue: {
                            bg: "bg-red-50",
                            text: "text-red-700",
                            dot: "bg-red-500",
                        },
                    }[status] || {
                        bg: "bg-gray-50",
                        text: "text-gray-700",
                        dot: "bg-gray-500",
                    };

                    return (
                        <div
                            key={status}
                            className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-all duration-500 ${
                                isVisible
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-2 opacity-0"
                            } ${colors.bg}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center gap-2">
                                {getStatusIcon(status)}
                                <span className={`font-medium ${colors.text}`}>
                                    {status}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                                <span className="font-semibold">{count}</span>
                                <span className="text-xs opacity-75">
                                    ({percentage}%)
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
