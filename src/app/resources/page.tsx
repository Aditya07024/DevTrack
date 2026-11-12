"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, FileText, Plus, ExternalLink, Star, Pin, Search } from "lucide-react";

export default function ResourcesPage() {
  const [tab, setTab] = useState<"RESOURCES" | "NOTES">("NOTES");
  const [notes, setNotes] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Note state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteCategory, setNoteCategory] = useState("GENERAL");
  const [noteContent, setNoteContent] = useState("");
  const [notePinned, setNotePinned] = useState(false);

  // New Resource state
  const [showResModal, setShowResModal] = useState(false);
  const [resTitle, setResTitle] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resCategory, setResCategory] = useState("DSA");
  const [resDesc, setResDesc] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [nRes, rRes] = await Promise.all([
        fetch("/api/notes"),
        fetch("/api/resources"),
      ]);
      const nData = await nRes.json();
      const rData = await rRes.json();
      setNotes(nData.notes || []);
      setResources(rData.resources || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteTitle) return;

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: noteTitle,
        category: noteCategory,
        content: noteContent,
        isPinned: notePinned,
      }),
    });

    if (res.ok) {
      setShowNoteModal(false);
      setNoteTitle("");
      setNoteContent("");
      loadData();
    }
  }

  async function handleCreateResource(e: React.FormEvent) {
    e.preventDefault();
    if (!resTitle || !resUrl) return;

    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: resTitle,
        url: resUrl,
        category: resCategory,
        description: resDesc,
      }),
    });

    if (res.ok) {
      setShowResModal(false);
      setResTitle("");
      setResUrl("");
      setResDesc("");
      loadData();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Resources & Engineering Notes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Markdown architecture notes, cheat sheets, algorithms templates, and curated documentation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-slate-200/70 p-1 rounded-lg gap-1 text-xs font-semibold">
            <button
              onClick={() => setTab("NOTES")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                tab === "NOTES" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Notes ({notes.length})
            </button>
            <button
              onClick={() => setTab("RESOURCES")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                tab === "RESOURCES" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Resources ({resources.length})
            </button>
          </div>

          <button
            onClick={() => (tab === "NOTES" ? setShowNoteModal(true) : setShowResModal(true))}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
          >
            <Plus size={14} /> {tab === "NOTES" ? "New Note" : "Save Resource"}
          </button>
        </div>
      </div>

      {/* TAB: NOTES */}
      {tab === "NOTES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div key={note._id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
                      {note.category}
                    </span>
                    {note.isPinned && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Pin size={10} /> Pinned
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1.5">{note.title}</h3>
                </div>
              </div>

              <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                {note.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: RESOURCES */}
      {tab === "RESOURCES" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {resources.map((res) => (
            <div key={res._id} className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                  {res.category}
                </span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 p-1"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{res.title}</h3>
              {res.description && <p className="text-xs text-slate-500 line-clamp-2">{res.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateNote}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-3.5"
          >
            <h3 className="text-sm font-bold text-slate-800">Add Technical Note</h3>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Sliding Window Invariants & Two Pointers Template"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="DSA">DSA</option>
                <option value="SYSTEM_DESIGN">System Design</option>
                <option value="DEV">Practical Dev</option>
                <option value="INTERVIEW">Interview Prep</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Markdown Content</label>
              <textarea
                rows={6}
                required
                placeholder="Write your study notes, code blocks, or formulas..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinCheck"
                checked={notePinned}
                onChange={(e) => setNotePinned(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="pinCheck" className="text-xs font-medium text-slate-700">
                Pin to top of notes
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resource Modal */}
      {showResModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateResource}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-3.5"
          >
            <h3 className="text-sm font-bold text-slate-800">Save Resource Bookmark</h3>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Systems Course - MIT 6.824"
                value={resTitle}
                onChange={(e) => setResTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">URL</label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={resUrl}
                onChange={(e) => setResUrl(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={resCategory}
                onChange={(e) => setResCategory(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="DSA">DSA</option>
                <option value="SYSTEM_DESIGN">System Design</option>
                <option value="FRONTEND">Frontend</option>
                <option value="BACKEND">Backend</option>
                <option value="CAREER">Career</option>
                <option value="BOOK">Book</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                placeholder="Brief takeaway or notes..."
                value={resDesc}
                onChange={(e) => setResDesc(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Save Bookmark
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

