"use client";

import React, { useState } from "react";
import { X, Check, Calendar, Code2, Briefcase, FileText } from "lucide-react";

interface QuickAddModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function QuickAddModal({ onClose, onSuccess }: QuickAddModalProps) {
  const [tab, setTab] = useState<"TASK" | "DSA" | "JOB" | "NOTE">("TASK");
  const [loading, setLoading] = useState(false);
  const todayStr = new Date().toISOString().split("T")[0];

  // Task form
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
  const [taskCategory, setTaskCategory] = useState("DSA");
  const [taskDate, setTaskDate] = useState(todayStr);

  // DSA form
  const [dsaTitle, setDsaTitle] = useState("");
  const [dsaTopic, setDsaTopic] = useState("Arrays");
  const [dsaDifficulty, setDsaDifficulty] = useState("MEDIUM");
  const [dsaStatus, setDsaStatus] = useState("SOLVED_INDEPENDENTLY");
  const [dsaUrl, setDsaUrl] = useState("");

  // Job form
  const [jobCompany, setJobCompany] = useState("");
  const [jobRole, setJobRole] = useState("Software Engineer");
  const [jobCountry, setJobCountry] = useState("Remote US");
  const [jobStatus, setJobStatus] = useState("APPLIED");
  const [jobCurrency, setJobCurrency] = useState("USD");

  // Note form
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === "TASK") {
        if (!taskTitle) return;
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: taskTitle,
            priority: taskPriority,
            category: taskCategory,
            scheduledDate: taskDate,
          }),
        });
      } else if (tab === "DSA") {
        if (!dsaTitle) return;
        await fetch("/api/dsa/problems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: dsaTitle,
            topicName: dsaTopic,
            difficulty: dsaDifficulty,
            status: dsaStatus,
            url: dsaUrl,
          }),
        });
      } else if (tab === "JOB") {
        if (!jobCompany) return;
        await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: jobCompany,
            role: jobRole,
            country: jobCountry,
            status: jobStatus,
            currency: jobCurrency,
          }),
        });
      } else if (tab === "NOTE") {
        if (!noteTitle) return;
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: noteTitle,
            content: noteContent,
            category: "GENERAL",
          }),
        });
      }

      if (onSuccess) onSuccess();
      onClose();
      window.location.reload();
    } catch (err) {
      alert("Failed to create entry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Quick Add to DevTrack</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-slate-100 bg-slate-50 p-1 gap-1">
          {[
            { id: "TASK", label: "Task", icon: Calendar },
            { id: "DSA", label: "DSA Problem", icon: Code2 },
            { id: "JOB", label: "Job App", icon: Briefcase },
            { id: "NOTE", label: "Note", icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  tab === item.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {tab === "TASK" && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve LeetCode #15 Two Pointers"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="DSA">DSA</option>
                    <option value="DEV">Dev</option>
                    <option value="CORE_CS">Core CS</option>
                    <option value="SYSTEM_DESIGN">System Design</option>
                    <option value="PROJECT">Project</option>
                    <option value="APPLICATION">Job App</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </>
          )}

          {tab === "DSA" && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trapping Rain Water"
                  value={dsaTitle}
                  onChange={(e) => setDsaTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Topic</label>
                  <select
                    value={dsaTopic}
                    onChange={(e) => setDsaTopic(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Arrays">Arrays</option>
                    <option value="Two Pointers">Two Pointers</option>
                    <option value="Sliding Window">Sliding Window</option>
                    <option value="Binary Search">Binary Search</option>
                    <option value="Trees">Trees</option>
                    <option value="Graphs">Graphs</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={dsaDifficulty}
                    onChange={(e) => setDsaDifficulty(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={dsaStatus}
                    onChange={(e) => setDsaStatus(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="SOLVED_INDEPENDENTLY">Solved (Solo)</option>
                    <option value="SOLVED_WITH_HINTS">Solved (Hints)</option>
                    <option value="SOLUTION_VIEWED">Viewed Sol</option>
                    <option value="NEEDS_REVISION">Needs Revision</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={dsaUrl}
                  onChange={(e) => setDsaUrl(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
            </>
          )}

          {tab === "JOB" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe, Vercel"
                    value={jobCompany}
                    onChange={(e) => setJobCompany(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Location/Type</label>
                  <select
                    value={jobCountry}
                    onChange={(e) => setJobCountry(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Remote US">Remote US</option>
                    <option value="Remote Global">Remote Global</option>
                    <option value="India">India (Bengaluru/Remote)</option>
                    <option value="Europe">Europe / UK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
                  <select
                    value={jobCurrency}
                    onChange={(e) => setJobCurrency(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={jobStatus}
                    onChange={(e) => setJobStatus(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="ASSESSMENT">Assessment</option>
                    <option value="INTERVIEW_SCHEDULED">Interview</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {tab === "NOTE" && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Consistent Hashing notes"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Content (Markdown)</label>
                <textarea
                  rows={4}
                  placeholder="Write your study notes or code snippets..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              {loading ? "Adding..." : "Add to DevTrack"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

