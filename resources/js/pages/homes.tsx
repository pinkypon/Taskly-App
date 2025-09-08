// Home component - Main dashboard for Taskly app with task management and analytics
import BarChart from '@/components/ui/barchart';
import { DataTableDemo, type DataTableDemoHandle } from '@/components/ui/data-table';
import DonutChart from '@/components/ui/donut-chart';
import Header from '@/components/ui/nav-header';
import BasicPie from '@/components/ui/piechart';
import ProductivityCard from '@/components/ui/productivity-card';
import { Check, X as CloseIcon, PieChart, RotateCcw, Target, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import HomeLayout from '../layouts/home-layout';
import axios from '../lib/axios';

// Interface for individual task data structure
interface Task {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    completed: boolean;
    priority: 'Low' | 'Medium' | 'High';
}

// Interface for productivity metrics and streak data
interface ProductivityData {
    productivity: number;
    target: number;
    status: string;
    remaining: string;
    streak: number;
    longestStreak: number;
    todayCompleted: number;
    todayTotal: number;
    streakStatus?: string;
    nextMilestone?: string;
}

// Toast notification component for user feedback
const Toast = ({
    message,
    type,
    onClose,
    iconType = 'default',
}: {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    iconType?: 'default' | 'check' | 'undo' | 'delete';
}) => {
    // Auto-dismiss toast after 4 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    // Set background color based on toast type
    const bgColor = type === 'success' ? 'bg-indigo-500' : 'bg-red-500';

    // Select appropriate icon based on action type
    const icon = (() => {
        if (iconType === 'delete') return <Trash2 className="h-5 w-5" />;
        if (iconType === 'undo') return <RotateCcw className="h-5 w-5" />;
        if (iconType === 'check') return <Check className="h-5 w-5" />;
        // Default behavior based on success/error
        return type === 'success' ? <Check className="h-5 w-5" /> : <CloseIcon className="h-5 w-5" />;
    })();

    return (
        <div className="fixed top-4 right-4 z-50 duration-300 animate-in fade-in slide-in-from-top-2">
            <div className={`${bgColor} flex max-w-sm items-center gap-3 rounded-lg px-6 py-4 text-white shadow-lg`}>
                <div className="flex-shrink-0">{icon}</div>
                <p className="text-sm font-medium">{message}</p>
                <button onClick={onClose} className="ml-auto flex-shrink-0 text-white/80 transition-colors hover:text-white">
                    <CloseIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default function Home() {
    // Productivity data state for dashboard metrics
    const [data, setData] = useState<ProductivityData | null>(null);

    // Reference to data table component for programmatic refresh
    const tableRef = useRef<DataTableDemoHandle>(null);

    // Form submission loading state
    const [submitting, setSubmitting] = useState(false);

    // Form state for new task creation
    const [form, setForm] = useState({
        title: '',
        priority: '',
        due_date: '',
        details: '',
    });

    // Task status counts for donut chart visualization
    const [statusCounts, setStatusCounts] = useState({
        Completed: 0,
        Pending: 0,
        Overdue: 0,
    });

    // Add this with your other useState hooks
    const [loading, setLoading] = useState(true);

    // Create a reusable function for refreshing analytics
    const refreshAnalytics = async () => {
        await Promise.allSettled([
            fetchStatusCounts(),
            fetchPriorityCounts(),
            fetchBarChartData(),
            fetchProductivity()
        ]);
    };

    // Toast notification state management
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
        iconType?: 'default' | 'check' | 'undo' | 'delete';
    }>({
        show: false,
        message: '',
        type: 'success',
    });

    // Helper function to display toast notifications
    const showToast = (message: string, type: 'success' | 'error', iconType?: 'default' | 'check' | 'undo' | 'delete') => {
        setToast({ show: true, message, type, iconType });
    };

    // Helper function to close toast notifications
    const closeToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    // Priority distribution data for pie chart
    const [priorityCounts, setPriorityCounts] = useState<{ priority: string; total: number }[]>([]);

    // Monthly task data for bar chart visualization
    const [barData, setBarData] = useState<{ month: string; created: number; completed: number }[]>([]);

    // Fetch bar chart data showing task creation and completion trends
    const fetchBarChartData = async () => {
        try {
            const { data } = await axios.get('/api/tasks/bar-chart');
            setBarData(data);
        } catch (err) {
            console.error('Failed to fetch bar chart data:', err);
        }
    };

    // Fetch task status counts for donut chart
    const fetchStatusCounts = async () => {
        try {
            const { data } = await axios.get('/api/tasks/status-counts');
            setStatusCounts(data);
        } catch (err) {
            console.error('Failed to fetch status counts:', err);
        }
    };

    // Fetch task priority distribution for pie chart
    const fetchPriorityCounts = async () => {
        try {
            const { data } = await axios.get('/api/tasks/priority-counts');
            setPriorityCounts(data);
        } catch (err) {
            console.error('Failed to fetch priority counts:', err);
        }
    };

    // Fetch productivity metrics including streaks and completion rates
    const fetchProductivity = async () => {
        try {
            const res = await axios.get('/api/tasks/productivity');
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };



    // Format productivity data for display
    const percent = `${data?.productivity}%`;
    const target = `${data?.target}%`;

    // Set page title on component mount
    useEffect(() => {
        document.title = "Home";
    }, []);

    // // Initial data fetch for all dashboard components
    // useEffect(() => {
    //     fetchStatusCounts();
    //     fetchPriorityCounts();
    //     fetchBarChartData();
    //     fetchProductivity();
    // }, []);


    useEffect(() => {
        const fetchAllData = async () => {
            const results = await Promise.allSettled([
                axios.get('/api/tasks/status-counts'),
                axios.get('/api/tasks/priority-counts'),
                axios.get('/api/tasks/bar-chart'),
                axios.get('/api/tasks/productivity'),
            ]);

            // Handle each result individually
            if (results[0].status === 'fulfilled') {
                setStatusCounts(results[0].value.data);
            } else {
                console.error('Failed to fetch status counts:', results[0].reason);
            }

            if (results[1].status === 'fulfilled') {
                setPriorityCounts(results[1].value.data);
            } else {
                console.error('Failed to fetch priority counts:', results[1].reason);
            }

            if (results[2].status === 'fulfilled') {
                setBarData(results[2].value.data);
            } else {
                console.error('Failed to fetch bar chart data:', results[2].reason);
            }

            if (results[3].status === 'fulfilled') {
                setData(results[3].value.data);
            } else {
                console.error('Failed to fetch productivity data:', results[3].reason);
            }

            setLoading(false); // Always renders, even if some fail
        };

        fetchAllData();
    }, []);

    // Handle form input changes for new task creation
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle new task form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent double submission
        if (submitting) return;
        setSubmitting(true);

        try {
            // Send task creation request to Laravel backend
            const res = await axios.post('/api/tasks', {
                title: form.title,
                description: form.details,
                due_date: form.due_date,
                priority: form.priority,
            });

            // Show success notification
            showToast(`Task "${form.title}" created successfully!`, 'success');

            // Reset form after successful submission
            setForm({ title: '', priority: '', due_date: '', details: '' });

            // Refresh data table to show new task
            tableRef.current?.refreshData();

            // Refresh all analytics data simultaneously - even if some fail!
            // Use the same reusable function
            await refreshAnalytics();

        } catch (err) {
            console.error('Failed to add task:', err);
            showToast('Failed to create task. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-indigo-80/60 to-blue-80/60">
                <div className="flex items-center space-x-1">
                    <div
                        className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                        style={{ animationDelay: '0s' }}
                    ></div>
                    <div
                        className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                        className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                    ></div>
                </div>
            </div>
        );
    }
    return (
        <HomeLayout>
            {/* Toast notification display */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                    iconType={toast.iconType}
                />
            )}

            <main className="animate-fade-in-up mx-auto mt-10 max-w-6xl px-4">
                {/* Page header section */}
                <div className="mb-5">
                    <div className="flex items-center gap-x-2">
                        {/* Animated status indicator */}
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-700"></span>
                        </span>
                        <Header className="inline-block rounded-lg p-2">Your Tasks</Header>
                    </div>
                    <p className="mt-1 text-gray-600">Manage and track your daily activities efficiently.</p>
                </div>

                {/* Task creation form section */}
                <section className="mb-12 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-xl font-semibold text-gray-800">Add a New Task</h3>
                    <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                        {/* Task title input */}
                        <input
                            type="text"
                            name="title"
                            placeholder="Task title"
                            value={form.title}
                            onChange={handleInputChange}
                            className="rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            required
                        />

                        {/* Priority selection dropdown */}
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleInputChange}
                            className="rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            required
                        >
                            <option value="">Select priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                        {/* Due date picker with floating label */}
                        <label className="relative block">
                            <span className="pointer-events-none absolute top-2 left-3 text-sm text-gray-400">Select due date</span>
                            <input
                                type="date"
                                name="due_date"
                                value={form.due_date}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 p-3 pt-6 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                required
                            />
                        </label>

                        {/* Task description textarea */}
                        <textarea
                            name="details"
                            placeholder="Task details"
                            value={form.details}
                            onChange={handleInputChange}
                            className="rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none md:col-span-2"
                            rows={3}
                        ></textarea>

                        {/* Form submission button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full rounded-lg py-3 font-medium text-white transition md:col-span-2 ${submitting ? 'cursor-not-allowed bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {submitting ? 'Adding...' : 'Add Task'}
                        </button>
                    </form>
                </section>

                {/* Analytics dashboard section */}
                <section className="mb-12">
                    <div className="mb-5">
                        <div className="flex items-center gap-x-2">
                            {/* Animated status indicator */}
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-700"></span>
                            </span>
                            <Header className="inline-block rounded-lg p-2">Task Analytics</Header>
                        </div>
                    </div>

                    {/* Analytics cards grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Productivity tracking card */}
                        <ProductivityCard data={data} />

                        {/* Task status distribution donut chart */}
                        <div
                            id="task-chart"
                            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="mb-2 flex flex-nowrap items-center gap-2">
                                <Target className="h-5 w-5 text-indigo-600" />
                                <h4 className="text-sm font-medium whitespace-nowrap text-gray-600">Task Status</h4>
                            </div>
                            <DonutChart statusCounts={statusCounts} />
                        </div>

                        {/* Task priority distribution pie chart */}
                        <div
                            id="task-chart"
                            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:col-span-2 lg:col-span-1"
                        >
                            <div className="mb-2 flex flex-nowrap items-center gap-2">
                                <PieChart className="h-5 w-5 text-indigo-600" />
                                <h4 className="mb-2 text-sm font-medium text-gray-600">Tasks by Priority</h4>
                            </div>
                            <BasicPie data={priorityCounts} />
                        </div>
                    </div>

                    {/* Monthly task trends bar chart */}
                    <div
                        id="task-chart"
                        className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                        <h4 className="mb-2 text-sm font-medium text-gray-600">Tasks Over Time</h4>
                        <BarChart dataset={barData} />
                    </div>
                </section>

                {/* Task management table section */}
                <div className="mb-5">
                    <div className="flex items-center gap-x-2">
                        {/* Animated status indicator */}
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-700"></span>
                        </span>
                        <Header className="inline-block rounded-lg p-2">Task Table</Header>
                    </div>
                </div>

                {/* Interactive data table for task management */}
                <div className="mx-auto mb-12 max-w-6xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    {/* Then use it in your DataTableDemo */}
                    <DataTableDemo
                        ref={tableRef}
                        onTaskStatusChange={refreshAnalytics}
                        showToast={showToast}
                    />
                </div>
            </main>
        </HomeLayout>
    );
}