"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  Plus,
  Bell,
  Play,
  Pause,
  Square,
  Sparkles,
  Database,
  Menu,
} from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import QuickAddModal from "./QuickAddModal";
import GlobalSearchModal from "./GlobalSearchModal";

interface TopNavProps {
  onMobileMenuToggle?: () => void;
}

export default function TopNav({ onMobileMenuToggle }: TopNavProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerTopic, setTimerTopic] = useState("DSA Problem Solving");
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    // Poll notifications
    fetch("/api/notifications")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => {});
  }, [pathname]);

  // Timer tick
  useEffect(() => {
    let interval: any;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  async function handleStopTimer() {
    setTimerRunning(false);
    const minutes = Math.max(1, Math.round(seconds / 60));
    try {
      await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: timerTopic,
          category: timerTopic.toLowerCase().includes("dsa") ? "DSA" : "DEV",
          durationMinutes: minutes,
        }),
      });
      alert(`Study session logged! ${minutes} minute(s) recorded in your Consistency Analytics.`);
    } catch (e) {}
    setSeconds(0);
  }

  async function handleQuickSeed() {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert("DevTrack populated with full sample DSA topics, learning tracks, and career records!");
        window.location.reload();
      } else {
        alert(`Seed error: ${data.error || "Failed"}`);
      }
    } catch (e) {
      alert("Seeding failed. Ensure MongoDB is running.");
    } finally {
      setIsSeeding(false);
    }
  }

  if (pathname === "/login") return null;

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-md text-[#64748B] hover:text-[#172033] hover:bg-slate-100"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Pill */}
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#64748B] hover:text-[#172033] hover:border-slate-300 transition-colors w-40 sm:w-64"
        >
          <Search size={14} />
          <span className="flex-1 text-left truncate">Search tasks, DSA, notes...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-mono text-slate-500">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Center/Right: Study Timer & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Study Timer Widget */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono font-medium text-slate-800">{formatTimer(seconds)}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 max-w-[120px] truncate">{timerTopic}</span>
          {!timerRunning ? (
            <button
              onClick={() => setTimerRunning(true)}
              className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
              title="Start Timer"
            >
              <Play size={14} />
            </button>
          ) : (
            <button
              onClick={() => setTimerRunning(false)}
              className="p-1 rounded text-amber-600 hover:bg-amber-50"
              title="Pause Timer"
            >
              <Pause size={14} />
            </button>
          )}
          {seconds > 0 && (
            <button
              onClick={handleStopTimer}
              className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-red-50"
              title="Finish & Save Session"
            >
              <Square size={13} />
            </button>
          )}
        </div>

        {/* Seed Database Quick Action */}
        <button
          onClick={handleQuickSeed}
          disabled={isSeeding}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          title="Seed realistic DSA and Career data"
        >
          <Database size={13} className={isSeeding ? "animate-spin text-indigo-600" : "text-slate-500"} />
          <span>{isSeeding ? "Seeding..." : "Seed Data"}</span>
        </button>

        {/* Quick Add Button */}
        <button
          onClick={() => setShowQuickAdd(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg shadow-sm transition-colors"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Quick Add</span>
        </button>

        {/* In-app Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <NotificationCenter
              onClose={() => setShowNotifications(false)}
              onCountChange={(c) => setUnreadCount(c)}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showQuickAdd && <QuickAddModal onClose={() => setShowQuickAdd(false)} />}
      {showSearch && <GlobalSearchModal onClose={() => setShowSearch(false)} />}
    </header>
  );
}

