"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, CheckCircle2, Circle, BookOpen, ExternalLink, Plus, Sparkles } from "lucide-react";

export default function LearningPage() {
  const [activeCategory, setActiveCategory] = useState<"DEVELOPMENT" | "CORE_CS" | "SYSTEM_DESIGN">("DEVELOPMENT");
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New topic modal
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtopics, setNewSubtopics] = useState("");
  const [newConfidence, setNewConfidence] = useState("BEGINNER");
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    loadTopics();
  }, [activeCategory]);

  async function loadTopics() {
    setLoading(true);
    try {
      const res = await fetch(`/api/learning/topics?category=${activeCategory}`);
      const data = await res.json();
      setTopics(data.topics || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleSubtopic(topicId: string, subtopicIdx: number) {
    const topic = topics.find((t) => t._id === topicId);
    if (!topic) return;

    const updatedSubtopics = topic.subtopics.map((st: any, i: number) =>
      i === subtopicIdx ? { ...st, completed: !st.completed } : st
    );

    await fetch(`/api/learning/topics/${topicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtopics: updatedSubtopics, markStudied: true }),
    });

    setTopics((prev) =>
      prev.map((t) => (t._id === topicId ? { ...t, subtopics: updatedSubtopics, lastStudiedDate: new Date() } : t))
    );
  }

  async function handleUpdateConfidence(topicId: string, confidence: string) {
    await fetch(`/api/learning/topics/${topicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        confidence,
        status: confidence === "INTERVIEW_READY" ? "COMPLETED" : "IN_PROGRESS",
      }),
    });

    setTopics((prev) =>
      prev.map((t) => (t._id === topicId ? { ...t, confidence } : t))
    );
  }

  async function handleAddTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle) return;

    const subtopicArray = newSubtopics
      .split("\n")
      .filter(Boolean)
      .map((title) => ({ title: title.trim(), completed: false }));

    const res = await fetch("/api/learning/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        category: activeCategory,
        subtopics: subtopicArray,
        confidence: newConfidence,
        notes: newNotes,
      }),
    });

    if (res.ok) {
      setShowModal(false);
      setNewTitle("");
      setNewSubtopics("");
      setNewNotes("");
      loadTopics();
    }
  }

  const confidenceBadge = (conf: string) => {
    switch (conf) {
      case "INTERVIEW_READY":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
      case "STRONG":
        return "bg-indigo-100 text-indigo-800 border-indigo-300 font-bold";
      case "INTERMEDIATE":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "BEGINNER":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Learning & Concept Tracks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Practical Development, Core CS Foundations, and System Design Architecture.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Track Switcher */}
          <div className="flex bg-slate-200/70 p-1 rounded-lg gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveCategory("DEVELOPMENT")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeCategory === "DEVELOPMENT" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Practical Dev
            </button>
            <button
              onClick={() => setActiveCategory("CORE_CS")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeCategory === "CORE_CS" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Core CS
            </button>
            <button
              onClick={() => setActiveCategory("SYSTEM_DESIGN")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeCategory === "SYSTEM_DESIGN" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              System Design
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
          >
            <Plus size={14} /> New Topic
          </button>
        </div>
      </div>

      {/* Grid of Topics */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200/50 rounded-xl"></div>
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
          <GraduationCap size={36} className="text-indigo-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No topics in this track yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((t) => (
            <div key={t._id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-900">{t.title}</h3>
                <select
                  value={t.confidence}
                  onChange={(e) => handleUpdateConfidence(t._id, e.target.value)}
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border outline-none bg-white ${confidenceBadge(
                    t.confidence
                  )}`}
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="STRONG">Strong</option>
                  <option value="INTERVIEW_READY">Interview Ready</option>
                </select>
              </div>

              {/* Subtopics Checklist */}
              {t.subtopics && t.subtopics.length > 0 && (
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Core Concepts
                  </span>
                  {t.subtopics.map((st: any, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => handleToggleSubtopic(t._id, idx)}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                      {st.completed ? (
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Circle size={15} className="text-slate-300 shrink-0" />
                      )}
                      <span className={st.completed ? "line-through text-slate-400" : ""}>{st.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {t.notes && (
                <p className="text-xs text-slate-600 bg-indigo-50/30 p-2.5 rounded border border-indigo-100 font-normal">
                  {t.notes}
                </p>
              )}

              {/* Resources */}
              {t.resources && t.resources.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px]">
                  {t.resources.map((res: any, idx: number) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 font-medium hover:underline bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                    >
                      <BookOpen size={11} /> {res.title} <ExternalLink size={10} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Topic Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddTopic}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-3.5"
          >
            <h3 className="text-sm font-bold text-slate-800">Add Learning Concept</h3>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Concept Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Consensus & Raft Protocol"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Subtopics (One per line)</label>
              <textarea
                rows={3}
                placeholder="Leader Election&#10;Log Replication&#10;Split Brain Prevention"
                value={newSubtopics}
                onChange={(e) => setNewSubtopics(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Initial Confidence</label>
              <select
                value={newConfidence}
                onChange={(e) => setNewConfidence(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="STRONG">Strong</option>
                <option value="INTERVIEW_READY">Interview Ready</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Technical Notes</label>
              <textarea
                rows={2}
                placeholder="Key architecture tradeoffs, references..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Save Concept
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
