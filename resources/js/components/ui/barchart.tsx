import { BarChart } from '@mui/x-charts/BarChart';
import { Calendar, CheckCircle, Plus, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function valueFormatter(value: number | null) {
    return `${value} tasks`;
}

interface BarsDatasetProps {
    dataset: { month: string; created: number; completed: number }[];
}

export default function BarsDataset({ dataset }: BarsDatasetProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        // Trigger animation
        setTimeout(() => setIsVisible(true), 100);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Calculate totals for summary
    const totalCreated = dataset.reduce((sum, item) => sum + item.created, 0);
    const totalCompleted = dataset.reduce((sum, item) => sum + item.completed, 0);
    const completionRate = totalCreated > 0 ? Math.round((totalCompleted / totalCreated) * 100) : 0;

    // Mobile: Enhanced card layout
    if (isMobile) {
        const maxValue = Math.max(...dataset.map((d) => Math.max(d.created, d.completed)));

        return (
            <div className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-3">
                        <div className="mb-1 flex items-center gap-2">
                            <Plus className="h-4 w-4 text-indigo-600" />
                            <span className="text-xs font-medium text-indigo-700">Total Created</span>
                        </div>
                        <div className="text-xl font-bold text-indigo-900">{totalCreated}</div>
                    </div>
                    <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-green-100/50 p-3">
                        <div className="mb-1 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-700">Completed</span>
                        </div>
                        <div className="text-xl font-bold text-green-900">{totalCompleted}</div>
                    </div>
                </div>

                {/* Completion Rate with Animation */}
                <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
                        <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
                            {/* Animated gradient bar */}
                            <div
                                className={`h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 transition-all duration-1500 ease-out ${
                                    isVisible ? 'animate-pulse' : ''
                                }`}
                                style={{
                                    width: isVisible ? `${completionRate}%` : '0%',
                                    transitionDelay: '500ms',
                                }}
                            >
                                {/* Shimmer effect */}
                                <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Breakdown */}
                <div className="h-[280px] space-y-3 overflow-y-auto pr-2">
                    {dataset.map((item, index) => (
                        <div
                            key={index}
                            className={`transform transition-all duration-500 ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            } rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="font-semibold text-gray-800">{item.month}</span>
                                </div>
                                <div className="flex gap-4 text-xs">
                                    <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                        <span className="font-medium text-indigo-700">{item.created}</span>
                                    </span>
                                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="font-medium text-green-700">{item.completed}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Created tasks bar */}
                                <div className="flex items-center gap-3">
                                    <span className="w-16 text-xs font-medium text-indigo-600">Created</span>
                                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            className="h-3 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500 transition-all duration-1000"
                                            style={{
                                                width: `${(item.created / maxValue) * 100}%`,
                                                transitionDelay: `${index * 100 + 200}ms`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="w-8 text-xs font-bold text-indigo-700">{item.created}</span>
                                </div>

                                {/* Completed tasks bar */}
                                <div className="flex items-center gap-3">
                                    <span className="w-16 text-xs font-medium text-green-600">Done</span>
                                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000"
                                            style={{
                                                width: `${(item.completed / maxValue) * 100}%`,
                                                transitionDelay: `${index * 100 + 400}ms`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="w-8 text-xs font-bold text-green-700">{item.completed}</span>
                                </div>

                                {/* Progress indicator */}
                                <div className="mt-2 border-t border-gray-100 pt-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Progress</span>
                                        <span className="font-semibold text-gray-700">
                                            {item.created > 0 ? Math.round((item.completed / item.created) * 100) : 0}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Desktop: Enhanced MUI chart with custom styling
    return (
        <div className="space-y-4">
            {/* Summary Header */}
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                        <Plus className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-700">Created</span>
                    </div>
                    <div className="text-2xl font-bold text-indigo-900">{totalCreated}</div>
                </div>
                <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-4 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Completed</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">{totalCompleted}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
                </div>
            </div>

            {/* Enhanced Bar Chart */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <BarChart
                    dataset={dataset}
                    xAxis={[
                        {
                            dataKey: 'month',
                            scaleType: 'band',
                            categoryGapRatio: 0.3,
                            barGapRatio: 0.1,
                        },
                    ]}
                    series={[
                        {
                            dataKey: 'created',
                            label: 'Tasks Created',
                            color: '#6366F1', // Indigo-500
                            valueFormatter,
                        },
                        {
                            dataKey: 'completed',
                            label: 'Tasks Completed',
                            color: '#10B981', // Green-500
                            valueFormatter,
                        },
                    ]}
                    height={320}
                    margin={{ left: 60, right: 40, top: 60, bottom: 60 }}
                    sx={{
                        '& .MuiChartsAxis-line': {
                            stroke: '#E5E7EB', // Gray-200
                            strokeWidth: 1,
                        },
                        '& .MuiChartsAxis-tick': {
                            stroke: '#9CA3AF', // Gray-400
                        },
                        '& .MuiChartsAxis-tickLabel': {
                            fill: '#6B7280', // Gray-500
                            fontSize: '12px',
                            fontWeight: 500,
                        },
                        '& .MuiChartsLegend-series': {
                            fontSize: '14px',
                            fontWeight: 500,
                        },
                        '& .MuiBarElement-root': {
                            rx: 4, // Rounded bars
                        },
                    }}
                />
            </div>
        </div>
    );
}
