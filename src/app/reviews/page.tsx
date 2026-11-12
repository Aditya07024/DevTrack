"use client";

import React, { useState, useEffect } from "react";
import { CalendarCheck, Plus, CheckCircle2, AlertCircle, Sparkles, Star } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [studyHours, setStudyHours] = useState(21);
  const [dsaSolved, setDsaSolved] = useState(12);
  const [tasksCompleted, setTasksCompleted] = useState(18);
  const [tasksMissed, setTasksMissed] = useState(2);
  const [struggles, setStruggles] = useState("");
  const [learnings, setLearnings] = useState("");
  const [prioritiesNext, setPrioritiesNext] = useState("");
  const [rating, setRating] = useState(4);

  const now = new Date();
  const currentYear = now.getFullYear();
  // Get ISO week number
  const weekNumber = 7;

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    const today = new Date();
    const lastMonday = new Date(today.getTime() - 7 * 86400000).toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: currentYear,
        weekNumber,
        startDate: lastMonday,
        endDate: todayStr,
        tasksCompletedCount: Number(tasksCompleted),
        tasksMissedCount: Number(tasksMissed),
        dsaSolvedCount: Number(dsaSolved),
        studyHours: Number(studyHours),
        strugglesSummary: struggles,
        developmentLearnings: learnings,
        prioritiesNextWeek: prioritiesNext.split("\n").filter(Boolean),
        selfRating: Number(rating),
      }),
    });

    if (res.ok) {
      setShowForm(false);
      loadReviews();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Structured Weekly Reviews
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Reflect on completed tasks, struggled DSA topics, study hours, and calibrate next week's focus.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm self-start sm:self-auto"
        >
          <Plus size={14} /> Complete Weekly Retrospective
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-white border border-indigo-200 rounded-xl p-5 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800">
              Week {weekNumber} Retrospective ({currentYear})
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-slate-400 hover:text-slate-600">
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Study Hours</label>
              <input
                type="number"
                value={studyHours}
                onChange={(e) => setStudyHours(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">DSA Solved</label>
              <input
                type="number"
                value={dsaSolved}
                onChange={(e) => setDsaSolved(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tasks Completed</label>
              <input
                type="number"
                value={tasksCompleted}
                onChange={(e) => setTasksCompleted(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tasks Missed</label>
              <input
                type="number"
                value={tasksMissed}
                onChange={(e) => setTasksMissed(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              DSA Topics or Engineering Concepts Struggled With
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Dynamic Programming state formulation, Dijkstra's priority queue implementation..."
              value={struggles}
              onChange={(e) => setStruggles(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Key Development Learnings</label>
            <textarea
              rows={2}
              placeholder="e.g. Next.js App Router streaming with Suspense, Redis Token Bucket rate limiting..."
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Next Week's High Priorities (One per line)
            </label>
            <textarea
              rows={3}
              placeholder="1. Finish 10 Graph BFS/DFS problems&#10;2. Implement Redis caching in Project&#10;3. Follow up with recruiters"
              value={prioritiesNext}
              onChange={(e) => setPrioritiesNext(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-700">Self Evaluation:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 rounded ${rating >= star ? "text-amber-500" : "text-slate-300"}`}
              >
                <Star size={18} fill={rating >= star ? "currentColor" : "none"} />
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              Save Weekly Review
            </button>
          </div>
        </form>
      )}

      {/* Past Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <CalendarCheck size={36} className="text-indigo-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No weekly reviews recorded yet.</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Week {rev.weekNumber} Retrospective ({rev.year})
                  </h3>
                  <span className="text-xs text-slate-400">
                    {rev.startDate} &rarr; {rev.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.selfRating || 4)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg text-xs">
                <div>
                  <span className="text-slate-400">Study Hours</span>
                  <p className="font-bold text-slate-800">{rev.studyHours} hrs</p>
                </div>
                <div>
                  <span className="text-slate-400">DSA Solved</span>
                  <p className="font-bold text-indigo-600">{rev.dsaSolvedCount} problems</p>
                </div>
                <div>
                  <span className="text-slate-400">Tasks Completed</span>
                  <p className="font-bold text-emerald-600">{rev.tasksCompletedCount}</p>
                </div>
                <div>
                  <span className="text-slate-400">Tasks Missed</span>
                  <p className="font-bold text-slate-600">{rev.tasksMissedCount}</p>
                </div>
              </div>

              {rev.strugglesSummary && (
                <div className="text-xs">
                  <span className="font-bold text-slate-700">Topics Struggled: </span>
                  <span className="text-slate-600">{rev.strugglesSummary}</span>
                </div>
              )}

              {rev.prioritiesNextWeek && rev.prioritiesNextWeek.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Priorities Set For Next Week
                  </span>
                  <ul className="text-xs text-slate-700 space-y-0.5 list-disc pl-4">
                    {rev.prioritiesNextWeek.map((p: string, idx: number) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
