import { PieChart } from '@mui/x-charts/PieChart';
import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BasicPieProps {
    data: { priority: string; total: number }[];
}

export default function BasicPie({ data }: BasicPieProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 200);
    }, []);

    // Map incoming data to chart format
    const chartData = data.map((item, index) => ({
        id: index,
        value: item.total,
        label: item.priority,
        color:
            item.priority === 'Low'
                ? '#10B981' // Green-500
                : item.priority === 'Medium'
                  ? '#F59E0B' // Amber-500
                  : '#EF4444', // Red-500 for High priority
    }));

    // Calculate totals and percentages
    const total = data.reduce((sum, item) => sum + item.total, 0);

    // Get priority icon
    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'High':
                return <AlertTriangle className="h-3 w-3 text-red-500" />;
            case 'Medium':
                return <TrendingUp className="h-3 w-3 text-amber-500" />;
            case 'Low':
                return <CheckCircle2 className="h-3 w-3 text-green-500" />;
            default:
                return null;
        }
    };

    if (total === 0) {
        return (
            <div className="flex h-32 items-center justify-center text-gray-500">
                <p className="text-sm">No priority data</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Compact Pie Chart */}
            <div className="mb-3 flex items-center justify-center">
                <div className="relative">
                    <PieChart
                        series={[
                            {
                                data: chartData,
                                // Remove innerRadius to make it a true pie chart
                                innerRadius: 0,
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
                            '& .MuiPieArc-root': {
                                stroke: '#ffffff',
                                strokeWidth: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    strokeWidth: 3,
                                    filter: 'brightness(1.1)',
                                },
                            },
                        }}
                    />

                    {/* Optional: You can remove this center display since it's now a solid pie */}
                    {/* Or keep it as an overlay if you want to show total */}
                    <div className="mb-3 text-center">
                        <div className="text-lg font-bold text-gray-800">{total}</div>
                        <div className="text-xs text-gray-500">total tasks</div>
                    </div>
                </div>
            </div>

            {/* Compact Legend */}
            <div className="flex-1 space-y-2">
                {data.map((item, index) => {
                    const percentage = Math.round((item.total / total) * 100);
                    const colors = {
                        High: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
                        Medium: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
                        Low: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
                    }[item.priority] || { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' };

                    return (
                        <div
                            key={index}
                            className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-all duration-500 ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                            } ${colors.bg}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center gap-2">
                                {getPriorityIcon(item.priority)}
                                <span className={`font-medium ${colors.text}`}>{item.priority}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                                <span className="font-semibold">{item.total}</span>
                                <span className="text-xs opacity-75">({percentage}%)</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
