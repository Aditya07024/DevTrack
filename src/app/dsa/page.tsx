"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function DsaPage() {
  const [tab, setTab] = useState<"PROBLEMS" | "REVISION_QUEUE" | "TOPICS">("PROBLEMS");
  const [problems, setProblems] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [revisions, setRevisions] = useState<any>({ dueToday: [], overdue: [], upcoming: [], completed: [] });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Add Problem Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [pTitle, setPTitle] = useState("");
  const [pTopic, setPTopic] = useState("Arrays");
  const [pDifficulty, setPDifficulty] = useState("MEDIUM");
  const [pPlatform, setPPlatform] = useState("LeetCode");
  const [pUrl, setPUrl] = useState("");
  const [pStatus, setPStatus] = useState("SOLVED_INDEPENDENTLY");
  const [pTimeComp, setPTimeComp] = useState("O(n)");
  const [pSpaceComp, setPSpaceComp] = useState("O(1)");
  const [pApproach, setPApproach] = useState("");

  useEffect(() => {
    loadDsaData();
  }, [topicFilter, difficultyFilter, statusFilter, search]);

  async function loadDsaData() {
    try {
      let url = `/api/dsa/problems?topic=${topicFilter}&difficulty=${difficultyFilter}&status=${statusFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const [probRes, topicsRes, revRes] = await Promise.all([
        fetch(url),
        fetch("/api/dsa/topics"),
        fetch("/api/dsa/revisions"),
      ]);

      const probData = await probRes.json();
      const topicsData = await topicsRes.json();
      const revData = await revRes.json();

      setProblems(probData.problems || []);
      setTopics(topicsData.topics || []);
      setRevisions(revData || { dueToday: [], overdue: [], upcoming: [], completed: [] });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  async function handleAddProblem(e: React.FormEvent) {
    e.preventDefault();
    if (!pTitle) return;

    const res = await fetch("/api/dsa/problems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: pTitle,
        topicName: pTopic,
        difficulty: pDifficulty,
        platform: pPlatform,
        url: pUrl,
        status: pStatus,
        timeComplexity: pTimeComp,
        spaceComplexity: pSpaceComp,
        approach: pApproach,
      }),
    });

    if (res.ok) {
      setShowAddModal(false);
      setPTitle("");
      setPUrl("");
      setPApproach("");
      loadDsaData();
    }
  }

  async function handleCompleteRevision(revisionId: string) {
    await fetch(`/api/dsa/revisions/${revisionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "COMPLETE", outcome: "RESOLVED_EASILY" }),
    });
    loadDsaData();
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "SOLVED_INDEPENDENTLY":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">Solved (Solo)</span>;
      case "SOLVED_WITH_HINTS":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded">Solved (Hints)</span>;
      case "SOLUTION_VIEWED":
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">Solution Viewed</span>;
      case "NEEDS_REVISION":
        return <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded">Needs Practice</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded">{status}</span>;
    }
  };

  const difficultyBadge = (diff: string) => {
    switch (diff) {
      case "EASY":
        return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Easy</span>;
      case "MEDIUM":
        return <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Med</span>;
      case "HARD":
        return <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Hard</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            DSA Preparation & Mastery Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Systematic tracking, automated spaced repetition (3d, 7d, 21d), and approach documentation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-slate-200/70 p-1 rounded-lg gap-1 text-xs font-semibold">
            <button
              onClick={() => setTab("PROBLEMS")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                tab === "PROBLEMS" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Problems ({problems.length})
            </button>
            <button
              onClick={() => setTab("REVISION_QUEUE")}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                tab === "REVISION_QUEUE" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Revision Queue
              {(revisions.dueToday?.length || 0) + (revisions.overdue?.length || 0) > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>
            <button
              onClick={() => setTab("TOPICS")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                tab === "TOPICS" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Topics (25)
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
          >
            <Plus size={14} /> Log Problem
          </button>
        </div>
      </div>

      {/* TAB: PROBLEMS */}
      {tab === "PROBLEMS" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-sm flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search problems by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="All">All Topics</option>
                {topics.map((t) => (
                  <option key={t.slug} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="All">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="SOLVED_INDEPENDENTLY">Solved Independently</option>
                <option value="SOLVED_WITH_HINTS">Solved With Hints</option>
                <option value="SOLUTION_VIEWED">Solution Viewed</option>
                <option value="NEEDS_REVISION">Needs Practice</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Problem</th>
                    <th className="py-3 px-3">Topic</th>
                    <th className="py-3 px-3">Diff</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Complexity</th>
                    <th className="py-3 px-3">Next Revision</th>
                    <th className="py-3 px-4 text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Loading problems...
                      </td>
                    </tr>
                  ) : problems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No problems match your filter.
                      </td>
                    </tr>
                  ) : (
                    problems.map((prob) => (
                      <tr key={prob._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <div>{prob.title}</div>
                          {prob.approach && (
                            <div className="text-[11px] font-normal text-slate-500 mt-0.5 line-clamp-1">
                              {prob.approach}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">{prob.topicName}</td>
                        <td className="py-3 px-3">{difficultyBadge(prob.difficulty)}</td>
                        <td className="py-3 px-3">{statusBadge(prob.status)}</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                          {prob.timeComplexity || "O(?)"} / {prob.spaceComplexity || "O(?)"}
                        </td>
                        <td className="py-3 px-3">
                          {prob.nextRevisionDate ? (
                            <span className="text-indigo-600 font-semibold">{prob.nextRevisionDate}</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {prob.url ? (
                            <a
                              href={prob.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 p-1 inline-flex items-center"
                              title="Open on LeetCode/Platform"
                            >
                              <ExternalLink size={14} />
                            </a>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: REVISION QUEUE */}
      {tab === "REVISION_QUEUE" && (
        <div className="space-y-6">
          {/* Overdue Alert */}
          {revisions.overdue && revisions.overdue.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle size={15} /> Overdue Revisions ({revisions.overdue.length})
              </h3>
              <div className="space-y-2">
                {revisions.overdue.map((item: any) => (
                  <div
                    key={item._id}
                    className="bg-white p-3 rounded-lg border border-red-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{item.problemTitle}</span>
                      <span className="text-slate-500 ml-2">({item.topicName} — {item.difficulty})</span>
                      <p className="text-[11px] text-red-600 font-medium mt-0.5">
                        Due was: {item.scheduledDate} ({item.intervalDays}d interval)
                      </p>
                    </div>
                    <button
                      onClick={() => handleCompleteRevision(item._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded text-xs"
                    >
                      Mark Solved
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Due Today */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-indigo-600" />
              Due Today ({revisions.dueToday?.length || 0})
            </h3>
            {revisions.dueToday?.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No revisions due today. Great job keeping your queue clear!</p>
            ) : (
              <div className="space-y-2">
                {revisions.dueToday.map((item: any) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-lg border border-slate-100 bg-indigo-50/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{item.problemTitle}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Topic: {item.topicName} | Interval: {item.intervalDays} Days (Iteration {item.iteration})
                      </p>
                    </div>
                    <button
                      onClick={() => handleCompleteRevision(item._id)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm text-xs"
                    >
                      Complete Revision
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Revisions */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Upcoming Spaced Repetitions</h3>
            {revisions.upcoming?.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No upcoming revisions scheduled yet.</p>
            ) : (
              <div className="space-y-2">
                {revisions.upcoming.map((item: any) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{item.problemTitle}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({item.topicName})</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{item.scheduledDate}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: TOPICS */}
      {tab === "TOPICS" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {topics.map((t) => (
            <div key={t.slug} className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {t.category}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>{t.totalProblems || 0} tracked</span>
                <span className="font-semibold text-emerald-600">{t.solvedProblems || 0} solved</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Problem Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddProblem}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-3.5"
          >
            <h3 className="text-sm font-bold text-slate-800">Log New DSA Problem</h3>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Problem Title</label>
              <input
                type="text"
                required
                placeholder="e.g. 3Sum / LRU Cache"
                value={pTitle}
                onChange={(e) => setPTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Topic</label>
                <select
                  value={pTopic}
                  onChange={(e) => setPTopic(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  {topics.map((t) => (
                    <option key={t.slug} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Difficulty</label>
                <select
                  value={pDifficulty}
                  onChange={(e) => setPDifficulty(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={pStatus}
                  onChange={(e) => setPStatus(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="SOLVED_INDEPENDENTLY">Solved Independently</option>
                  <option value="SOLVED_WITH_HINTS">Solved With Hints</option>
                  <option value="SOLUTION_VIEWED">Solution Viewed</option>
                  <option value="NEEDS_REVISION">Needs Practice</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Time Complexity</label>
                <input
                  type="text"
                  placeholder="e.g. O(n log n)"
                  value={pTimeComp}
                  onChange={(e) => setPTimeComp(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Space Complexity</label>
                <input
                  type="text"
                  placeholder="e.g. O(1)"
                  value={pSpaceComp}
                  onChange={(e) => setPSpaceComp(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Approach & Key Observations</label>
              <textarea
                rows={3}
                placeholder="Key intuition, pointers technique, edge cases..."
                value={pApproach}
                onChange={(e) => setPApproach(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">URL (Optional)</label>
              <input
                type="url"
                placeholder="https://leetcode.com/problems/..."
                value={pUrl}
                onChange={(e) => setPUrl(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Save & Auto-Schedule Revision
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
