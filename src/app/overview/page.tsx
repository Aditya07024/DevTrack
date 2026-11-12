"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Code2,
  Clock,
  Flame,
  Target,
  ArrowRight,
  Plus,
  Play,
  Calendar,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function OverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200/60 rounded-xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200/60 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-slate-200/60 rounded-xl lg:col-span-2"></div>
          <div className="h-80 bg-slate-200/60 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const dsa = data?.dsa || {};
  const consistency = data?.consistency || {};
  const revisions = data?.revisions || {};
  const tasks = data?.todayTasks || [];
  const goals = data?.goals || [];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Calendar size={13} className="text-indigo-600" />
            <span>{todayFormatted}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Welcome back, Aditya
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
            Target: <span className="text-slate-800 font-medium">Senior Full-Stack & Distributed Systems Engineer</span> (India & Remote US Opportunities)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/my-day"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg shadow-sm transition-colors"
          >
            <Play size={14} />
            <span>Start Study Session</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Statistics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Today's Tasks */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Today's Tasks</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{data?.completedTasksToday || 0}</span>
            <span className="text-xs text-slate-400">/ {data?.totalTasksToday || 0}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all"
              style={{
                width: `${data?.totalTasksToday > 0 ? (data.completedTasksToday / data.totalTasksToday) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>

        {/* DSA Solved */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">DSA Solved</span>
            <Code2 size={16} className="text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{dsa.totalSolved || 0}</span>
            <span className="text-xs text-slate-400">problems</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5">
            {dsa.solvedIndependently || 0} solo | {dsa.solvedWithHints || 0} hints
          </p>
        </div>

        {/* Weekly Hours */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Weekly Study</span>
            <Clock size={16} className="text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{consistency.weeklyHours || 0}</span>
            <span className="text-xs text-slate-400">hrs</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5">Target: 21 hrs / week</p>
        </div>

        {/* Current Streak */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Daily Streak</span>
            <Flame size={16} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{consistency.streakDays || 1}</span>
            <span className="text-xs text-slate-400">days</span>
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-2.5 flex items-center gap-1">
            Active streak
          </p>
        </div>

        {/* Revisions Due */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Revisions Due</span>
            <AlertTriangle size={16} className={revisions.dueCount > 0 ? "text-amber-500" : "text-slate-400"} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{revisions.dueCount || 0}</span>
            <span className="text-xs text-slate-400">due</span>
          </div>
          <Link href="/dsa" className="text-[11px] text-indigo-600 font-semibold hover:underline mt-2.5 block">
            Review queue &rarr;
          </Link>
        </div>
      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Priorities & Monthly Goal Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Priorities */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <h2 className="text-sm font-bold text-[#172033] tracking-tight">Today's Priorities</h2>
              </div>
              <Link href="/my-day" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                Open My Day <ArrowRight size={13} />
              </Link>
            </div>

            {tasks.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <p className="text-xs text-slate-500 font-medium">No tasks scheduled for today yet.</p>
                <Link
                  href="/my-day"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  <Plus size={13} /> Plan today's schedule
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.slice(0, 4).map((t: any) => (
                  <div
                    key={t._id}
                    className="p-3 rounded-lg border border-slate-100 bg-[#F8FAFC] flex items-center justify-between gap-3 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          t.status === "COMPLETED"
                            ? "bg-emerald-500"
                            : t.priority === "URGENT" || t.priority === "HIGH"
                            ? "bg-red-500"
                            : "bg-indigo-400"
                        }`}
                      ></span>
                      <span
                        className={`text-xs font-medium text-slate-800 truncate ${
                          t.status === "COMPLETED" ? "line-through text-slate-400" : ""
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                        {t.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          t.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly Goals Progress */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-[#172033] tracking-tight">Active Monthly Goals</h2>
              </div>
              <Link href="/planner" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                View Planner <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-4">
              {goals.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No monthly goals created yet.</p>
              ) : (
                goals.map((g: any) => {
                  const pct = Math.min(100, Math.round((g.currentCount / Math.max(1, g.targetCount)) * 100));
                  return (
                    <div key={g._id} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-800">{g.title}</span>
                        <span className="font-bold text-indigo-600">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-[#4F46E5] h-2 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                        <span>
                          {g.currentCount} / {g.targetCount} {g.metricLabel}
                        </span>
                        <span className="uppercase text-[9px] font-bold text-slate-400">{g.category}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: DSA Breakdown, Active Opportunities, Learning Confidence */}
        <div className="space-y-6">
          {/* DSA Difficulty Breakdown */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-[#172033] tracking-tight mb-3 flex items-center gap-2">
              <Code2 size={16} className="text-indigo-600" />
              DSA Solved Breakdown
            </h2>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700">Easy</span>
                  <span className="text-slate-700">{dsa.easySolved || 0}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, (dsa.easySolved || 0) * 5)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-700">Medium</span>
                  <span className="text-slate-700">{dsa.mediumSolved || 0}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, (dsa.mediumSolved || 0) * 3)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-red-700">Hard</span>
                  <span className="text-slate-700">{dsa.hardSolved || 0}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                  <div
                    className="bg-red-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, (dsa.hardSolved || 0) * 10)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <Link
              href="/dsa"
              className="mt-4 block text-center py-2 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-lg border border-slate-200 transition-colors"
            >
              Open DSA Tracker
            </Link>
          </div>

          {/* Active Job Opportunities */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#172033] tracking-tight flex items-center gap-2">
                <Briefcase size={16} className="text-blue-600" />
                Active Job Pipeline
              </h2>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                {data?.activeApplicationsCount || 0} active
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Tracking Indian product companies and remote international software engineering opportunities.
            </p>
            <Link
              href="/applications"
              className="block text-center py-2 bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold text-indigo-700 rounded-lg border border-indigo-200 transition-colors"
            >
              Manage Applications Kanban &rarr;
            </Link>
          </div>

          {/* Learning Tracks */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-[#172033] tracking-tight mb-2 flex items-center gap-2">
              <GraduationCap size={16} className="text-indigo-600" />
              Technical Readiness
            </h2>
            <div className="text-xs text-slate-600 space-y-1.5">
              <p>
                <span className="font-semibold text-emerald-600">{data?.learning?.interviewReadyCount || 0}</span> topics Interview Ready
              </p>
              <p>
                <span className="font-semibold text-indigo-600">{data?.learning?.strongCount || 0}</span> topics Strong confidence
              </p>
            </div>
            <Link
              href="/learning"
              className="mt-3 block text-xs text-indigo-600 font-semibold hover:underline"
            >
              Explore Dev, Core CS & System Design tracks &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
