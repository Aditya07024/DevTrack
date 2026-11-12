"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { BarChart3, TrendingUp, Flame, CheckCircle2, Clock } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard"),
      fetch("/api/study-sessions"),
      fetch("/api/applications"),
    ])
      .then(async ([dashRes, sessRes, appRes]) => {
        const dashData = await dashRes.json();
        const sessData = await sessRes.json();
        const appData = await appRes.json();
        setData(dashData);
        setSessions(sessData.sessions || []);
        setApplications(appData.applications || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-xs text-slate-400 p-8 text-center">Computing performance analytics...</p>;
  }

  const dsa = data?.dsa || {};

  // 1. Difficulty Chart Data
  const difficultyData = [
    { name: "Easy", solved: dsa.easySolved || 0, fill: "#16A34A" },
    { name: "Medium", solved: dsa.mediumSolved || 0, fill: "#D97706" },
    { name: "Hard", solved: dsa.hardSolved || 0, fill: "#DC2626" },
  ];

  // 2. Solve Independence Data
  const solveTypeData = [
    { name: "Solo", value: dsa.solvedIndependently || 0, color: "#4F46E5" },
    { name: "With Hints", value: dsa.solvedWithHints || 0, color: "#3B82F6" },
    { name: "Viewed Sol", value: dsa.solutionViewed || 0, color: "#94A3B8" },
  ];

  // 3. Past 7 days study hours computed dynamically from logged study sessions
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const studyHoursData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = dayNames[d.getDay()];

    const totalMinutes = sessions
      .filter((s) => s.date === dateStr)
      .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    return {
      day: dayLabel,
      hours: Math.round((totalMinutes / 60) * 10) / 10,
    };
  });

  // 4. Job Funnel Data computed dynamically from active applications
  const funnelData = [
    { stage: "Applied", count: applications.filter((a) => a.status === "APPLIED").length, fill: "#4F46E5" },
    { stage: "OA", count: applications.filter((a) => a.status === "ASSESSMENT").length, fill: "#6366F1" },
    {
      stage: "Tech Round",
      count: applications.filter((a) => ["TECHNICAL_ROUND", "INTERVIEW_SCHEDULED"].includes(a.status)).length,
      fill: "#818CF8",
    },
    { stage: "HR / HM", count: applications.filter((a) => a.status === "HR_ROUND").length, fill: "#A5B4FC" },
    { stage: "Offer", count: applications.filter((a) => a.status === "OFFER").length, fill: "#16A34A" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight flex items-center gap-2">
          <BarChart3 className="text-indigo-600" /> Preparation Analytics & Insights
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real metrics calculated from actual solved problems, study time logs, and interview pipeline data.
        </p>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: DSA Difficulty Distribution */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">DSA Solves by Difficulty</h3>
            <span className="text-xs font-bold text-indigo-600">{dsa.totalSolved || 0} Total Solved</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="solved" radius={[6, 6, 0, 0]}>
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Daily Study Hours Consistency */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Daily Study Hours (Past 7 Days)</h3>
            <span className="text-xs font-bold text-indigo-600">Streak: {data?.consistency?.streakDays || 1} Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="hours" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Solve Independence Ratio */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Solve Independence Breakdown</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={solveTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {solveTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs font-semibold text-slate-600">
            {solveTypeData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span>
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Career Conversion Pipeline Funnel */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Job Application Conversion Funnel</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

