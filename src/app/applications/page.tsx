"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Filter,
  DollarSign,
  MapPin,
  ExternalLink,
  Kanban,
  Table as TableIcon,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function ApplicationsPage() {
  const [viewMode, setViewMode] = useState<"KANBAN" | "TABLE">("KANBAN");
  const [applications, setApplications] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [workFilter, setWorkFilter] = useState("ALL");

  // New Application Modal
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("Software Engineer");
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("Remote");
  const [workArrangement, setWorkArrangement] = useState("REMOTE");
  const [currency, setCurrency] = useState("USD");
  const [salaryMin, setSalaryMin] = useState<any>("");
  const [salaryMax, setSalaryMax] = useState<any>("");
  const [jobUrl, setJobUrl] = useState("");
  const [appStatus, setAppStatus] = useState("APPLIED");
  const [notes, setNotes] = useState("");

  const PIPELINE_COLUMNS = [
    { id: "APPLIED", label: "Applied" },
    { id: "ASSESSMENT", label: "Assessment (OA)" },
    { id: "INTERVIEW_SCHEDULED", label: "Screening" },
    { id: "TECHNICAL_ROUND", label: "Tech / System Design" },
    { id: "HR_ROUND", label: "HR / HM Round" },
    { id: "OFFER", label: "Offers" },
  ];

  useEffect(() => {
    loadApplications();
  }, [countryFilter, statusFilter, workFilter]);

  async function loadApplications() {
    try {
      const url = `/api/applications?country=${countryFilter}&status=${statusFilter}&workArrangement=${workFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setApplications(data.applications || []);
      setFunnel(data.funnel || {});
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateApplication(e: React.FormEvent) {
    e.preventDefault();
    if (!company || !role) return;

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company,
        role,
        country,
        city,
        workArrangement,
        currency,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        jobUrl,
        status: appStatus,
        notes,
      }),
    });

    if (res.ok) {
      setShowModal(false);
      setCompany("");
      setNotes("");
      loadApplications();
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setApplications((prev) =>
      prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
    );
  }

  const formatSalary = (app: any) => {
    if (!app.salaryMin && !app.salaryMax) return "Not specified";
    const symbol = app.currency === "USD" ? "$" : app.currency === "INR" ? "₹" : app.currency;
    if (app.salaryMin && app.salaryMax) {
      return `${symbol}${app.salaryMin.toLocaleString()} - ${symbol}${app.salaryMax.toLocaleString()}`;
    }
    return `${symbol}${(app.salaryMin || app.salaryMax).toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Job Applications CRM
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full support for Indian and International roles (Remote US, Europe, and Global tech).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Switcher */}
          <div className="flex bg-slate-200/70 p-1 rounded-lg gap-1 text-xs font-semibold">
            <button
              onClick={() => setViewMode("KANBAN")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === "KANBAN" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Kanban size={13} /> Kanban
            </button>
            <button
              onClick={() => setViewMode("TABLE")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === "TABLE" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TableIcon size={13} /> Table
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
          >
            <Plus size={14} /> Log Opportunity
          </button>
        </div>
      </div>

      {/* Funnel Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-500">Total Opportunities</span>
          <p className="text-lg font-bold text-slate-900 mt-0.5">{funnel.total || 0}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-500">Applied</span>
          <p className="text-lg font-bold text-indigo-600 mt-0.5">{funnel.applied || 0}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-500">Interviewing</span>
          <p className="text-lg font-bold text-amber-600 mt-0.5">{funnel.inInterview || 0}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-500">Offers Received</span>
          <p className="text-lg font-bold text-emerald-600 mt-0.5">{funnel.offers || 0}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-500">Archived / Rejected</span>
          <p className="text-lg font-bold text-slate-400 mt-0.5">{funnel.rejected || 0}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Filter size={13} />
          <span>Filters:</span>
        </div>

        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
        >
          <option value="ALL">All Countries / Regions</option>
          <option value="United States">United States</option>
          <option value="India">India</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Germany">Germany</option>
        </select>

        <select
          value={workFilter}
          onChange={(e) => setWorkFilter(e.target.value)}
          className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
        >
          <option value="ALL">All Arrangements</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ONSITE">Onsite</option>
        </select>
      </div>

      {/* VIEW: KANBAN PIPELINE */}
      {viewMode === "KANBAN" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-start">
          {PIPELINE_COLUMNS.map((col) => {
            const colApps = applications.filter((a) => a.status === col.id);
            return (
              <div key={col.id} className="bg-slate-100/70 border border-slate-200/80 rounded-xl p-2.5 min-h-[400px]">
                <div className="flex items-center justify-between px-1.5 py-1 mb-2">
                  <h3 className="text-xs font-bold text-slate-700 truncate">{col.label}</h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.2 rounded-full border border-slate-200">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {colApps.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-2 hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{app.company}</h4>
                          <p className="text-[11px] text-slate-600 line-clamp-1">{app.role}</p>
                        </div>
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-600"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <MapPin size={11} className="shrink-0 text-slate-400" />
                        <span className="truncate">{app.country} ({app.workArrangement})</span>
                      </div>

                      <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                        {formatSalary(app)}
                      </div>

                      {/* Advance Pipeline Button */}
                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[9px] text-slate-400">{app.applicationDate}</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="text-[9px] font-semibold text-indigo-700 border border-slate-200 rounded px-1 py-0.5 bg-white"
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="ASSESSMENT">Assessment</option>
                          <option value="INTERVIEW_SCHEDULED">Screening</option>
                          <option value="TECHNICAL_ROUND">Tech Round</option>
                          <option value="HR_ROUND">HR Round</option>
                          <option value="OFFER">Offer</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: TABLE */}
      {viewMode === "TABLE" && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Work Type</th>
                  <th className="py-3 px-3">Salary Range</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{app.company}</div>
                      <div className="text-[11px] font-normal text-slate-500">{app.role}</div>
                    </td>
                    <td className="py-3 px-3">{app.country} {app.city ? `(${app.city})` : ""}</td>
                    <td className="py-3 px-3 font-semibold text-slate-600">{app.workArrangement}</td>
                    <td className="py-3 px-3 font-medium text-emerald-700">{formatSalary(app)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{app.applicationDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateApplication}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-3.5"
          >
            <h3 className="text-sm font-bold text-slate-800">Track New Job Opportunity</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vercel / Stripe / Atlassian"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Full-Stack Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Arrangement</label>
                <select
                  value={workArrangement}
                  onChange={(e) => setWorkArrangement(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">Onsite</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Salary Min</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Salary Max</label>
                <input
                  type="number"
                  placeholder="e.g. 185000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Application URL</label>
              <input
                type="url"
                placeholder="https://company.com/careers/..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
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
                Save Opportunity
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
