<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Carbon;

class TaskController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $userId = Auth::id();

        $query = Task::where('user_id', $userId);

        // Filter
        if ($request->status === 'active') {
            $query->where('completed', false);
        } elseif ($request->status === 'completed') {
            $query->where('completed', true);
        }

        // Search
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if (!in_array($sortBy, ['title', 'due_date', 'priority', 'completed', 'created_at'])) {
            $sortBy = 'created_at';
        }
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }

        $tasks = $query
            ->with('user') // eager load to prevent N+1
            ->orderBy($sortBy, $sortOrder)
            ->get();

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'required|in:Low,Medium,High',
        ]);

        $task = $request->user()->tasks()->create($validated);

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'sometimes|required|date',
            'completed' => 'sometimes|required|boolean',
            'priority' => 'sometimes|required|in:Low,Medium,High',
        ]);

        $task->update($validated);

        return response()->json($task->fresh());
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $task->delete();

        return response()->noContent();
    }

    // chart
    public function getTaskStatusCounts()
    {
        $today = Carbon::today();
        $userId = Auth::id();

        $completed = Task::where('user_id', $userId)
            ->where('completed', true)
            ->count();

        $overdue = Task::where('user_id', $userId)
            ->where('completed', false)
            ->whereDate('due_date', '<', $today)
            ->count();

        $pending = Task::where('user_id', $userId)
            ->where('completed', false)
            ->where(function ($query) use ($today) {
                $query->whereNull('due_date')
                    ->orWhereDate('due_date', '>=', $today);
            })->count();

        return response()->json([
            'Completed' => $completed,
            'Pending' => $pending,
            'Overdue' => $overdue,
        ]);
    }

    public function priorityCounts()
    {
        $userId = Auth::id();

        $counts = Task::where('user_id', $userId)
            ->selectRaw('priority, COUNT(*) as total')
            ->groupBy('priority')
            ->get();

        // Ensure all priorities are present even if count is 0
        $priorities = ['Low', 'Medium', 'High'];
        $data = collect($priorities)->map(function ($priority) use ($counts) {
            return [
                'priority' => $priority,
                'total' => $counts->firstWhere('priority', $priority)->total ?? 0
            ];
        });

        return response()->json($data);
    }

    public function barChart()
    {
        $userId = Auth::id();

        // SQLite uses strftime, PostgreSQL uses TO_CHAR for month formatting
        if (config('database.default') === 'sqlite') {
            $createdData = Task::where('user_id', $userId)
                ->selectRaw("strftime('%m', created_at) as month_num, COUNT(*) as created")
                ->groupBy('month_num')
                ->pluck('created', 'month_num')
                ->toArray();

            $completedData = Task::where('user_id', $userId)
                ->where('completed', true)
                ->selectRaw("strftime('%m', created_at) as month_num, COUNT(*) as completed")
                ->groupBy('month_num')
                ->pluck('completed', 'month_num')
                ->toArray();
        } else {
            // For PostgreSQL/MySQL later
            $createdData = Task::where('user_id', $userId)
                ->selectRaw("TO_CHAR(created_at, 'MM') as month_num, COUNT(*) as created")
                ->groupBy('month_num')
                ->pluck('created', 'month_num')
                ->toArray();

            $completedData = Task::where('user_id', $userId)
                ->where('completed', true)
                ->selectRaw("TO_CHAR(created_at, 'MM') as month_num, COUNT(*) as completed")
                ->groupBy('month_num')
                ->pluck('completed', 'month_num')
                ->toArray();
        }

        // Month mapping
        $months = [
            '01' => 'Jan',
            '02' => 'Feb',
            '03' => 'Mar',
            '04' => 'Apr',
            '05' => 'May',
            '06' => 'Jun',
            '07' => 'Jul',
            '08' => 'Aug',
            '09' => 'Sep',
            '10' => 'Oct',
            '11' => 'Nov',
            '12' => 'Dec'
        ];

        // Combine into one array for chart
        $result = [];
        foreach ($months as $num => $name) {
            $result[] = [
                'month' => $name,
                'created' => $createdData[$num] ?? 0,
                'completed' => $completedData[$num] ?? 0,
            ];
        }

        return response()->json($result);
    }


    public function productivityStats(Request $request)
    {
        $user = $request->user();

        // Count total tasks and completed tasks for this user
        $totalTasks = $user->tasks()->count();
        $completedTasks = $user->tasks()->where('completed', true)->count();

        if ($totalTasks === 0) {
            $productivity = 0;
        } else {
            $productivity = round(($completedTasks / $totalTasks) * 100);
        }

        // Today's tasks
        $todayTasks = $user->tasks()->count();
        $todayCompleted = $user->tasks()->where('completed', true)->count();

        // Define target
        $target = 85;

        // Status label based on ranges
        if ($productivity >= $target) {
            $status = 'Excellent';
        } elseif ($productivity >= 70) {
            $status = 'Very Good';
        } elseif ($productivity >= 50) {
            $status = 'Good';
        } else {
            $status = 'Needs Improvement';
        }

        // Calculate remaining message
        $remaining = $this->calculateRemaining($productivity, $target);

        return response()->json([
            'productivity' => $productivity,
            'target' => $target,
            'status' => $status,
            'remaining' => $remaining,
            'todayCompleted' => $todayCompleted,
            'todayTotal' => $todayTasks,
        ]);
    }

    // Helper method for calculating remaining message
    private function calculateRemaining($productivity, $target)
    {
        if ($productivity >= $target) {
            return 'Target achieved! 🎯';
        }

        $remaining = $target - $productivity;
        return "{$remaining}% to target";
    }
}