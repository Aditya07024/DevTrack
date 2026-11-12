"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  AlertCircle,
  Trash2,
  Edit2,
  Check,
  X,
  Code2,
} from "lucide-react";

export default function MyDayPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New task form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("HIGH");
  const [newCategory, setNewCategory] = useState("DSA");
  const [newEstMinutes, setNewEstMinutes] = useState(45);

  // Reschedule modal state
  const [reschedulingTask, setReschedulingTask] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [tasksRes, revisionsRes] = await Promise.all([
        fetch(`/api/tasks?date=${todayStr}`),
        fetch(`/api/dsa/revisions`),
      ]);
      const tasksData = await tasksRes.json();
      const revisionsData = await revisionsRes.json();
      setTasks(tasksData.tasks || []);
      setRevisions(revisionsData.dueToday || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(task: any) {
    const nextStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
    await fetch(`/api/tasks/${task._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
    );
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        priority: newPriority,
        category: newCategory,
        scheduledDate: todayStr,
        estimatedMinutes: Number(newEstMinutes),
      }),
    });

    if (res.ok) {
      const { task } = await res.json();
      setTasks((prev) => [task, ...prev]);
      setNewTitle("");
      setShowAddForm(false);
    }
  }

  async function handleDeleteTask(id: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t._id !== id));
  }

  async function handleConfirmReschedule() {
    if (!rescheduleDate || !reschedulingTask) return;
    await fetch(`/api/tasks/${reschedulingTask._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scheduledDate: rescheduleDate,
        rescheduleReason,
      }),
    });
    setTasks((prev) => prev.filter((t) => t._id !== reschedulingTask._id));
    setReschedulingTask(null);
    setRescheduleDate("");
    setRescheduleReason("");
  }

  // Summary Metrics
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const remaining = total - completed;
  const totalMinutesSpent = tasks.reduce((sum, t) => sum + (t.actualMinutes || 0), 0);
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight flex items-center gap-2">
            My Day
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Execution View
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Focus exclusively on high-priority tasks and spaced revisions due today.</p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add Task to Today</span>
        </button>
      </div>

      {/* Daily Summary Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-slate-500">Planned Tasks</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{total}</p>
        </div>
        <div>
          <span className="text-xs text-slate-500">Completed</span>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">{completed}</p>
        </div>
        <div>
          <span className="text-xs text-slate-500">Remaining</span>
          <p className="text-xl font-bold text-amber-600 mt-0.5">{remaining}</p>
        </div>
        <div>
          <span className="text-xs text-slate-500">Completion</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xl font-bold text-indigo-600">{completionPct}%</span>
            <div className="flex-1 bg-slate-100 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${completionPct}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Inline Form */}
      {showAddForm && (
        <form onSubmit={handleAddTask} className="bg-white border border-indigo-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800">Add New Task to Today</h3>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
              <X size={15} />
            </button>
          </div>
          <input
            type="text"
            required
            autoFocus
            placeholder="What will you accomplish today?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="DSA">DSA</option>
                <option value="DEV">Practical Dev</option>
                <option value="CORE_CS">Core CS</option>
                <option value="SYSTEM_DESIGN">System Design</option>
                <option value="PROJECT">Project</option>
                <option value="APPLICATION">Job App</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Estimated Mins</label>
              <input
                type="number"
                min={5}
                value={newEstMinutes}
                onChange={(e) => setNewEstMinutes(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Today's Spaced Revisions Queue */}
      {revisions.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Code2 size={16} className="text-amber-700" />
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              DSA Spaced Repetitions Due Today ({revisions.length})
            </h3>
          </div>
          <div className="space-y-1.5">
            {revisions.map((rev) => (
              <div
                key={rev._id}
                className="bg-white/80 p-2.5 rounded-lg border border-amber-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-800">{rev.problemTitle}</span>
                  <span className="text-[11px] text-slate-500 ml-2">({rev.topicName} — {rev.difficulty})</span>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {rev.intervalDays}d interval
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Today's Schedule & Action Items</h2>
          <span className="text-xs text-slate-400">{todayStr}</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 p-8 text-center">Loading your tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-bold text-slate-800">All clear for today!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't scheduled any tasks for today. Add a new task above or pull priorities from your weekly planner.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const isCompleted = task.status === "COMPLETED";
              return (
                <div
                  key={task._id}
                  className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                    isCompleted ? "bg-slate-50/70" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={20} className="text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isCompleted ? "line-through text-slate-400" : "text-slate-800"
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{task.description}</p>
                      )}
                      {task.rescheduledFrom && (
                        <span className="inline-block text-[10px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 mt-1">
                          Rescheduled from {task.rescheduledFrom}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {task.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        task.priority === "URGENT"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "HIGH"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {task.priority}
                    </span>

                    {/* Reschedule Button */}
                    <button
                      onClick={() => {
                        setReschedulingTask(task);
                        setRescheduleDate(new Date(Date.now() + 86400000).toISOString().split("T")[0]);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100"
                      title="Reschedule without losing history"
                    >
                      <RotateCcw size={14} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
                      title="Delete task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reschedule Dialog Modal */}
      {reschedulingTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Reschedule Task</h3>
            <p className="text-xs text-slate-500">
              Rescheduling preserves task history and logs reason in your weekly review.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">New Scheduled Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Reason (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Delayed by mock interview / workload"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReschedulingTask(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
