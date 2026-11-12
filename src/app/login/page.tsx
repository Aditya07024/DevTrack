"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Lock, Mail, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/overview");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setDemoLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Demo login failed");

      // Also ensure seed data exists
      await fetch("/api/seed", { method: "POST" }).catch(() => {});

      router.push("/overview");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to initialize demo account.");
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 selection:bg-indigo-100">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#4F46E5] text-white rounded-xl flex items-center justify-center font-black text-xl mx-auto shadow-md shadow-indigo-200 mb-3">
            DT
          </div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">DevTrack OS</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Personal Preparation OS & Career Platform for Software Engineers
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        {/* 1-Click Demo Quick Access */}
        <div className="mb-6 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Zap size={14} className="text-indigo-600" />
              Quick Demo Access
            </span>
            <span className="text-[10px] uppercase font-semibold text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-indigo-200">
              1-Click
            </span>
          </div>
          <p className="text-[11px] text-indigo-700/80 mb-3">
            Explore with preloaded DSA topics, revision queues, and job pipeline (Aditya07024).
          </p>
          <button
            onClick={handleDemoLogin}
            disabled={demoLoading}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
          >
            {demoLoading ? "Initializing Environment..." : "Enter as Aditya07024 (Demo)"}
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            Or {isRegister ? "create an account" : "sign in with credentials"}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Aditya Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="adityakumar07024@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors mt-2"
          >
            {loading ? "Processing..." : isRegister ? "Create DevTrack Account" : "Sign In to DevTrack"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-xs text-[#4F46E5] hover:underline font-medium"
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register now"}
          </button>
        </div>
      </div>
    </div>
  );
}
