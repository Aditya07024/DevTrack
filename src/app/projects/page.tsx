"use client";

import React, { useState, useEffect } from "react";
import { FolderGit2, Plus, ExternalLink, Github, CheckCircle2, Circle, AlertCircle } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New project modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("PERSONAL");
  const [techStack, setTechStack] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [status, setStatus] = useState("IN_PROGRESS");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        category,
        techStack: techStack.split(",").map((s) => s.trim()).filter(Boolean),
        repoUrl,
        demoUrl,
        status,
      }),
    });

    if (res.ok) {
      setShowModal(false);
      setTitle("");
      setDescription("");
      setTechStack("");
      setRepoUrl("");
      setDemoUrl("");
      loadProjects();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Engineering Projects Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Document practical production-grade development, system architecture, challenges, and achievements.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm self-start sm:self-auto"
        >
          <Plus size={14} /> New Engineering Project
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200/50 rounded-xl"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-slate-200">
          <FolderGit2 size={36} className="text-indigo-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No projects added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => (
            <div key={proj._id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
                      {proj.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {proj.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{proj.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                      title="GitHub Repository"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-indigo-600 hover:text-indigo-800 rounded hover:bg-indigo-50"
                      title="Live Demo"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>

              {/* Tech Stack Tags */}
              {proj.techStack && proj.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Milestones */}
              {proj.milestones && proj.milestones.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Engineering Milestones
                  </span>
                  {proj.milestones.map((m: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      {m.completed ? (
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Circle size={14} className="text-slate-300 shrink-0" />
                      )}
                      <span className={m.completed ? "line-through text-slate-400" : ""}>{m.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Decisions / Challenges */}
              {proj.technicalDecisions && proj.technicalDecisions.length > 0 && (
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Key Architectural Decisions
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    {proj.technicalDecisions.map((d: string, i: number) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProject}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-3.5"
          >
            <h3 className="text-sm font-bold text-slate-800">Add Engineering Project</h3>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Project Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Task Queue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="What does it do? What problem does it solve?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="PERSONAL">Personal</option>
                  <option value="OPEN_SOURCE">Open Source</option>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="ACADEMIC">Academic</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="PLANNING">Planning</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Go, Redis, Docker, gRPC, TypeScript"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Repository URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Demo URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
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
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
