"use client";

import React, { useState, useEffect } from "react";
import { MessagesSquare, Plus, CheckCircle2, AlertTriangle, Sparkles, Filter, ChevronDown } from "lucide-react";

export default function InterviewsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [weakOnly, setWeakOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // New question form
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [qText, setQText] = useState("");
  const [qCategory, setQCategory] = useState("SYSTEM_DESIGN");
  const [qCompany, setQCompany] = useState("");
  const [qDifficulty, setQDifficulty] = useState("MEDIUM");
  const [qAnswer, setQAnswer] = useState("");
  const [qConfidence, setQConfidence] = useState("SOMEWHAT_CONFIDENT");
  const [qIsWeak, setQIsWeak] = useState(false);

  useEffect(() => {
    loadData();
  }, [categoryFilter, weakOnly]);

  async function loadData() {
    try {
      let qUrl = `/api/interviews/questions?category=${categoryFilter}`;
      if (weakOnly) qUrl += `&weakOnly=true`;

      const [qRes, iRes] = await Promise.all([
        fetch(qUrl),
        fetch("/api/interviews"),
      ]);

      const qData = await qRes.json();
      const iData = await iRes.json();
      setQuestions(qData.questions || []);
      setInterviews(iData.interviews || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!qText) return;

    const res = await fetch("/api/interviews/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: qText,
        category: qCategory,
        company: qCompany,
        difficulty: qDifficulty,
        answerNotes: qAnswer,
        confidence: qConfidence,
        isWeakTopic: qIsWeak,
      }),
    });

    if (res.ok) {
      setShowQuestionModal(false);
      setQText("");
      setQAnswer("");
      loadData();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Interview Preparation & Question Bank
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Technical questions, system design deep dives, behavioral STAR stories, and weak topics list.
          </p>
        </div>

        <button
          onClick={() => setShowQuestionModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm self-start sm:self-auto"
        >
          <Plus size={14} /> Add Interview Question
        </button>
      </div>

      {/* Filter and Weak Topic Toggle */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
          >
            <option value="ALL">All Categories</option>
            <option value="SYSTEM_DESIGN">System Design</option>
            <option value="CORE_CS">Core Computer Science</option>
            <option value="DSA">DSA Interview Questions</option>
            <option value="BEHAVIORAL">Behavioral & Leadership</option>
          </select>

          <button
            onClick={() => setWeakOnly(!weakOnly)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              weakOnly
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {weakOnly ? "Showing Weak Topics Only" : "Filter Weak Topics"}
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {questions.length} questions in bank
        </span>
      </div>

      {/* Questions Grid */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200/50 rounded-xl"></div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
          <MessagesSquare size={36} className="text-indigo-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No questions recorded in this filter.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {questions.map((q) => (
            <div key={q._id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
                      {q.category}
                    </span>
                    {q.company && (
                      <span className="text-[10px] font-semibold text-slate-500">
                        Asked at: {q.company}
                      </span>
                    )}
                    {q.isWeakTopic && (
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        Weak Area
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{q.question}</h3>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    q.confidence === "INTERVIEW_READY"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {q.confidence}
                </span>
              </div>

              {q.answerNotes && (
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Answer Notes & Tradeoffs
                  </span>
                  <p>{q.answerNotes}</p>
                </div>
              )}

              {q.keyPoints && q.keyPoints.length > 0 && (
                <ul className="text-xs text-slate-600 list-disc pl-4 space-y-0.5">
                  {q.keyPoints.map((pt: string, i: number) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddQuestion}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-3.5"
          >
            <h3 className="text-sm font-bold text-slate-800">Add Question to Bank</h3>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Question</label>
              <input
                type="text"
                required
                placeholder="e.g. How does Kafka guarantee ordered messaging across partitions?"
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={qCategory}
                  onChange={(e) => setQCategory(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="SYSTEM_DESIGN">System Design</option>
                  <option value="CORE_CS">Core CS</option>
                  <option value="DSA">DSA</option>
                  <option value="BEHAVIORAL">Behavioral</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  placeholder="e.g. Uber / Stripe"
                  value={qCompany}
                  onChange={(e) => setQCompany(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Confidence</label>
                <select
                  value={qConfidence}
                  onChange={(e) => setQConfidence(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="NOT_CONFIDENT">Needs Work</option>
                  <option value="SOMEWHAT_CONFIDENT">Somewhat</option>
                  <option value="CONFIDENT">Confident</option>
                  <option value="INTERVIEW_READY">Ready</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Answer Summary & Notes</label>
              <textarea
                rows={3}
                placeholder="Key talking points, STAR response, architecture diagram notes..."
                value={qAnswer}
                onChange={(e) => setQAnswer(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="weakTopicCheck"
                checked={qIsWeak}
                onChange={(e) => setQIsWeak(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="weakTopicCheck" className="text-xs font-medium text-slate-700">
                Mark as Weak Topic needing intensive follow-up practice
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Save Question
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

