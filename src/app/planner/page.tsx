"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Target, Plus, CheckCircle2, ChevronLeft, ChevronRight, Clock, Code2 } from "lucide-react";

export default function PlannerPage() {
  const [view, setView] = useState<"MONTHLY" | "WEEKLY" | "CALENDAR">("MONTHLY");
  const [goals, setGoals] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New goal form state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState("DSA");
  const [goalTargetCount, setGoalTargetCount] = useState(50);
  const [goalMetric, setGoalMetric] = useState("problems");

  // New weekly plan form state
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [planDsaTarget, setPlanDsaTarget] = useState(15);
  const [planDevHours, setPlanDevHours] = useState(20);
  const [planPriorities, setPlanPriorities] = useState("");

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  useEffect(() => {
    loadPlannerData();
  }, []);

  async function loadPlannerData() {
    try {
      const [goalsRes, plansRes, tasksRes] = await Promise.all([
        fetch(`/api/goals?year=${currentYear}&month=${currentMonth}`),
        fetch(`/api/plans`),
        fetch(`/api/tasks`),
      ]);
      const goalsData = await goalsRes.json();
      const plansData = await plansRes.json();
      const tasksData = await tasksRes.json();
      setGoals(goalsData.goals || []);
      setPlans(plansData.plans || []);
      setTasks(tasksData.tasks || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!goalTitle) return;
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: goalTitle,
        category: goalCategory,
        targetMonth: currentMonth,
        targetYear: currentYear,
        targetCount: Number(goalTargetCount),
        metricLabel: goalMetric,
      }),
    });
    if (res.ok) {
      const { goal } = await res.json();
      setGoals((prev) => [goal, ...prev]);
      setShowGoalModal(false);
      setGoalTitle("");
    }
  }

  async function handleCreatePlan(e: React.FormEvent) {
    e.preventDefault();
    if (!planTitle) return;
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 86400000);
    const res = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: planTitle,
        type: "WEEKLY",
        year: currentYear,
        month: currentMonth,
        startDate: today.toISOString().split("T")[0],
        endDate: nextWeek.toISOString().split("T")[0],
        dsaTargetProblems: Number(planDsaTarget),
        devStudyTargetHours: Number(planDevHours),
        priorities: planPriorities.split("\n").filter(Boolean),
      }),
    });
    if (res.ok) {
      const { plan } = await res.json();
      setPlans((prev) => [plan, ...prev]);
      setShowPlanModal(false);
      setPlanTitle("");
      setPlanPriorities("");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Preparation Planner
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hierarchy: Monthly Goal &rarr; Weekly Milestones &rarr; Daily Execution
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-slate-200/70 p-1 rounded-lg gap-1 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setView("MONTHLY")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              view === "MONTHLY" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Monthly Goals
          </button>
          <button
            onClick={() => setView("WEEKLY")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              view === "WEEKLY" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Weekly Plans
          </button>
          <button
            onClick={() => setView("CALENDAR")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              view === "CALENDAR" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Interactive Calendar
          </button>
        </div>
      </div>

      {/* VIEW: MONTHLY */}
      {view === "MONTHLY" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-800">
              Month of {now.toLocaleString("default", { month: "long" })} {currentYear}
            </h2>
            <button
              onClick={() => setShowGoalModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              <Plus size={14} /> New Monthly Objective
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.currentCount / Math.max(1, g.targetCount)) * 100));
              return (
                <div key={g._id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 uppercase">
                        {g.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5">{g.title}</h3>
                      {g.description && <p className="text-xs text-slate-500 mt-1">{g.description}</p>}
                    </div>
                    <span className="text-base font-black text-indigo-600">{pct}%</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                  </div>

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>
                      Progress: {g.currentCount} / {g.targetCount} {g.metricLabel}
                    </span>
                    <span className="font-semibold text-slate-700">{g.status}</span>
                  </div>

                  {g.keyResults && g.keyResults.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Key Deliverables
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {g.keyResults.map((kr: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                            <span>{kr}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: WEEKLY */}
      {view === "WEEKLY" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-800">Weekly Target Sprints</h2>
            <button
              onClick={() => setShowPlanModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              <Plus size={14} /> Create Weekly Sprint
            </button>
          </div>

          <div className="space-y-4">
            {plans.map((p) => (
              <div key={p._id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {p.startDate} &rarr; {p.endDate}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                    {p.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg text-xs">
                  <div>
                    <span className="text-slate-400">DSA Target</span>
                    <p className="font-bold text-slate-800">{p.dsaTargetProblems} problems</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Dev Study Target</span>
                    <p className="font-bold text-slate-800">{p.devStudyTargetHours} hours</p>
                  </div>
                  <div>
                    <span className="text-slate-400">DSA Solved</span>
                    <p className="font-bold text-indigo-600">{p.dsaSolvedProblems} problems</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Study Logged</span>
                    <p className="font-bold text-indigo-600">{p.devStudyActualHours} hours</p>
                  </div>
                </div>

                {p.priorities && p.priorities.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Sprint Priorities
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {p.priorities.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-indigo-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: CALENDAR */}
      {view === "CALENDAR" && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              {now.toLocaleString("default", { month: "long" })} {currentYear}
            </h2>
            <span className="text-xs text-slate-500">Tasks & Revision Reminders by Date</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 border-b border-slate-100 pb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Grid of Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayTasks = tasks.filter((t) => t.scheduledDate === dateStr);
              const isToday = now.getDate() === day;

              return (
                <div
                  key={day}
                  className={`min-h-[70px] sm:min-h-[90px] p-1.5 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                    isToday ? "border-indigo-500 bg-indigo-50/30" : "border-slate-100 bg-[#F8FAFC]/50 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold inline-block w-5 h-5 text-center leading-5 rounded-full ${
                      isToday ? "bg-indigo-600 text-white" : "text-slate-700"
                    }`}
                  >
                    {day}
                  </span>

                  <div className="space-y-1 mt-1">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t._id}
                        className="text-[9px] sm:text-[10px] truncate px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium"
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-indigo-600 font-bold block">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateGoal}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-3.5"
          >
            <h3 className="text-sm font-bold text-slate-800">Add Monthly Objective</h3>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Goal Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Master Graphs and BFS/DFS Algorithms"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="DSA">DSA</option>
                  <option value="DEVELOPMENT">Development</option>
                  <option value="SYSTEM_DESIGN">System Design</option>
                  <option value="CAREER">Career</option>
                  <option value="PROJECT">Project</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Count</label>
                <input
                  type="number"
                  value={goalTargetCount}
                  onChange={(e) => setGoalTargetCount(Number(e.target.value))}
                  className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Unit</label>
                <input
                  type="text"
                  value={goalMetric}
                  onChange={(e) => setGoalMetric(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGoalModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Save Objective
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Weekly Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePlan}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-3.5"
          >
            <h3 className="text-sm font-bold text-slate-800">Create Weekly Sprint Plan</h3>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Sprint Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Week 4: Trees, DP & System Design Scaling"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">DSA Target (# problems)</label>
                <input
                  type="number"
                  value={planDsaTarget}
                  onChange={(e) => setPlanDsaTarget(Number(e.target.value))}
                  className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Study Target (hours)</label>
                <input
                  type="number"
                  value={planDevHours}
                  onChange={(e) => setPlanDevHours(Number(e.target.value))}
                  className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Sprint Priorities (One per line)
              </label>
              <textarea
                rows={3}
                placeholder="1. Master Binary Tree Traversals&#10;2. Finish Redis Caching Case Study&#10;3. Apply to 5 Remote US roles"
                value={planPriorities}
                onChange={(e) => setPlanPriorities(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Create Sprint
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

