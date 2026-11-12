"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Clock,
  Globe,
  Download,
  Send,
  CheckCircle2,
  AlertCircle,
  Shield,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testPushStatus, setTestPushStatus] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [dailyHours, setDailyHours] = useState(3.5);
  const [currency, setCurrency] = useState("USD");
  const [reminderTime, setReminderTime] = useState("20:00");
  const [dailyPush, setDailyPush] = useState(true);
  const [dsaPush, setDsaPush] = useState(true);
  const [weeklyPush, setWeeklyPush] = useState(true);

  // Push subscription state
  const [isPushSubscribed, setIsPushSubscribed] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);

  useEffect(() => {
    // Check push support
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      setPushSupported(true);
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setIsPushSubscribed(!!sub);
        });
      });
    }

    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser(data.user);
          const s = data.settings || {};
          setSettings(s);
          setName(data.user?.name || "Aditya07024");
          setTargetRole(s.targetRole || "Senior Full-Stack & Distributed Systems Engineer");
          setTimezone(s.timezone || "Asia/Kolkata");
          setDailyHours(s.dailyStudyHoursTarget || 3.5);
          setCurrency(s.preferredCurrency || "USD");
          setReminderTime(s.notificationPreferences?.dailyReminderTime || "20:00");
          setDailyPush(s.notificationPreferences?.dailyReminderEnabled !== false);
          setDsaPush(s.notificationPreferences?.dsaRevisionEnabled !== false);
          setWeeklyPush(s.notificationPreferences?.weeklyReviewEnabled !== false);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaveSuccess(false);

    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        targetRole,
        timezone,
        dailyStudyHoursTarget: Number(dailyHours),
        preferredCurrency: currency,
        notificationPreferences: {
          dailyReminderTime: reminderTime,
          dailyReminderEnabled: dailyPush,
          dsaRevisionEnabled: dsaPush,
          weeklyReviewEnabled: weeklyPush,
        },
      }),
    });

    if (res.ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  }

  // Helper to convert base64 to Uint8Array for VAPID key
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function handleTogglePushSubscription() {
    if (!pushSupported) {
      alert("Push notifications are not supported in this browser mode.");
      return;
    }

    try {
      const reg = await navigator.serviceWorker.ready;
      if (isPushSubscribed) {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          await fetch("/api/notifications/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          });
        }
        setIsPushSubscribed(false);
      } else {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          alert("Notification permission was denied. You will receive in-app notifications only.");
          return;
        }

        // Use public VAPID key from env
        const vapidKey =
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
          "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

        const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });

        await fetch("/api/notifications/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });

        setIsPushSubscribed(true);
        alert("Push notifications enabled! DevTrack will remind you of daily targets and spaced DSA revisions.");
      }
    } catch (err: any) {
      console.error("[Push toggle error]", err);
      alert(`Could not toggle push subscription: ${err.message}`);
    }
  }

  async function handleSendTestPush() {
    setTestPushStatus("Sending...");
    try {
      const res = await fetch("/api/notifications/test-push", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setTestPushStatus(data.message || "Notification sent!");
      } else {
        setTestPushStatus(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setTestPushStatus("Failed to send test push.");
    }
    setTimeout(() => setTestPushStatus(null), 4000);
  }

  if (loading) {
    return <p className="text-xs text-slate-400 p-8 text-center">Loading settings...</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight flex items-center gap-2">
          <Settings className="text-indigo-600" /> Platform & Career Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure profile, remote work time zones, VAPID push notifications, and data backups.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in-50">
          <CheckCircle2 size={16} className="text-emerald-600" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: User & Career Target */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Profile & Target Career Dimensions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Handle</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Authenticated)</label>
              <input
                type="email"
                disabled
                value={user?.email || "adityakumar07024@gmail.com"}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Engineering Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Zone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST — UTC+5:30)</option>
                <option value="America/New_York">America/New_York (EST — UTC-5:00)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST — UTC-8:00)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="UTC">UTC (Universal)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Study Target</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg"
                />
                <span className="text-xs text-slate-500">hours</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: PWA Push Notifications & VAPID */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell size={16} className="text-indigo-600" />
                Push Notifications & Spaced Reminders
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Web Push API with VAPID subscription delivery and background cron scheduling.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTogglePushSubscription}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                isPushSubscribed
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isPushSubscribed ? "Push Enabled" : "Enable Push"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Review Time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 8:00 PM ({timezone})</span>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={dailyPush}
                  onChange={(e) => setDailyPush(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                Daily Preparation Summary & Pending Tasks
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={dsaPush}
                  onChange={(e) => setDsaPush(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                DSA Spaced Repetition Reminders (3d, 7d, 21d)
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={weeklyPush}
                  onChange={(e) => setWeeklyPush(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                Sunday Weekly Review Retrospective
              </label>
            </div>
          </div>

          {/* Test Notification Trigger */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Verify Web Push delivery to this device & notification center:
            </span>
            <button
              type="button"
              onClick={handleSendTestPush}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Send size={13} /> Send Test Push
            </button>
          </div>
          {testPushStatus && (
            <p className="text-xs text-indigo-700 font-medium bg-indigo-50 p-2 rounded border border-indigo-200">
              {testPushStatus}
            </p>
          )}
        </div>

        {/* Section 3: Data Export & Backup */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Download size={16} className="text-indigo-600" />
                Data Portability & Export
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Download all your tasks, DSA problem histories, notes, and CRM records in JSON format.
              </p>
            </div>

            <a
              href="/api/export"
              download
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
            >
              <Download size={14} /> Export DevTrack Backup
            </a>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
