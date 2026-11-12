"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, Calendar, Code2, Briefcase, FileText, ArrowRight } from "lucide-react";

interface GlobalSearchModalProps {
  onClose: () => void;
}

export default function GlobalSearchModal({ onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    tasks: any[];
    dsa: any[];
    jobs: any[];
    notes: any[];
  }>({ tasks: [], dsa: [], jobs: [], notes: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ tasks: [], dsa: [], jobs: [], notes: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [tasksRes, dsaRes, jobsRes, notesRes] = await Promise.all([
          fetch(`/api/tasks?search=${encodeURIComponent(query)}`),
          fetch(`/api/dsa/problems?search=${encodeURIComponent(query)}`),
          fetch(`/api/applications`),
          fetch(`/api/notes?search=${encodeURIComponent(query)}`),
        ]);

        const tasksData = await tasksRes.json();
        const dsaData = await dsaRes.json();
        const jobsData = await jobsRes.json();
        const notesData = await notesRes.json();

        const q = query.toLowerCase();
        const matchedJobs = (jobsData.applications || []).filter(
          (j: any) =>
            j.company.toLowerCase().includes(q) ||
            j.role.toLowerCase().includes(q) ||
            j.country.toLowerCase().includes(q)
        );

        setResults({
          tasks: (tasksData.tasks || []).slice(0, 4),
          dsa: (dsaData.problems || []).slice(0, 4),
          jobs: matchedJobs.slice(0, 4),
          notes: (notesData.notes || []).slice(0, 4),
        });
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="p-3 border-b border-slate-100 flex items-center gap-2.5">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search tasks, DSA problems, applications, notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm outline-none text-slate-800 placeholder-slate-400"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 divide-y divide-slate-100">
          {loading && <p className="text-xs text-slate-400 text-center py-4">Searching DevTrack...</p>}

          {!loading && !query && (
            <p className="text-xs text-slate-400 text-center py-6">
              Type keywords to search across your DSA problems, daily tasks, job applications, and markdown notes.
            </p>
          )}

          {!loading &&
            query &&
            results.tasks.length === 0 &&
            results.dsa.length === 0 &&
            results.jobs.length === 0 &&
            results.notes.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No matching records found for "{query}".</p>
            )}

          {/* DSA Matches */}
          {results.dsa.length > 0 && (
            <div className="py-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">DSA Problems</span>
              {results.dsa.map((p) => (
                <Link
                  key={p._id}
                  href="/dsa"
                  onClick={onClose}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-600" />
                    <span className="font-medium text-slate-800">{p.title}</span>
                    <span className="text-[10px] text-slate-400">({p.topicName})</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    {p.difficulty}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Task Matches */}
          {results.tasks.length > 0 && (
            <div className="py-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tasks</span>
              {results.tasks.map((t) => (
                <Link
                  key={t._id}
                  href="/my-day"
                  onClick={onClose}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-600" />
                    <span className="font-medium text-slate-800">{t.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{t.scheduledDate}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Job Matches */}
          {results.jobs.length > 0 && (
            <div className="py-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Job Applications</span>
              {results.jobs.map((j) => (
                <Link
                  key={j._id}
                  href="/applications"
                  onClick={onClose}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-blue-600" />
                    <span className="font-medium text-slate-800">{j.company}</span>
                    <span className="text-slate-500">— {j.role}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                    {j.status}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Note Matches */}
          {results.notes.length > 0 && (
            <div className="py-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Notes</span>
              {results.notes.map((n) => (
                <Link
                  key={n._id}
                  href="/resources"
                  onClick={onClose}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-amber-600" />
                    <span className="font-medium text-slate-800">{n.title}</span>
                  </div>
                  <ArrowRight size={12} className="text-slate-400" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
