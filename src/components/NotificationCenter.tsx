"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, X, Bell, ExternalLink, Calendar, Code2, AlertCircle } from "lucide-react";

interface NotificationCenterProps {
  onClose: () => void;
  onCountChange: (count: number) => void;
}

export default function NotificationCenter({ onClose, onCountChange }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setNotifications(data.notifications || []);
          onCountChange(data.unreadCount || 0);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleMarkAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    onCountChange(0);
  }

  async function handleMarkRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    const unread = notifications.filter((n) => !n.isRead && n._id !== id).length;
    onCountChange(unread);
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "DSA_REVISION":
        return <Code2 size={16} className="text-amber-600" />;
      case "DAILY_REMINDER":
      case "WEEKLY_REVIEW":
        return <Calendar size={16} className="text-indigo-600" />;
      default:
        return <AlertCircle size={16} className="text-slate-600" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in-50 duration-150">
      <div className="p-3 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-[#4F46E5]" />
          <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">Notifications</h3>
        </div>
        <div className="flex items-center gap-2">
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-medium text-[#4F46E5] hover:underline"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {loading && <p className="text-xs text-slate-400 p-4 text-center">Loading notifications...</p>}
        {!loading && notifications.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-xs font-medium text-slate-600">No notifications yet</p>
            <p className="text-[11px] text-slate-400 mt-1">Daily reminders and revision alerts will appear here.</p>
          </div>
        )}
        {!loading &&
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-3 text-xs transition-colors ${
                n.isRead ? "bg-white" : "bg-indigo-50/40"
              } hover:bg-slate-50 flex items-start gap-2.5`}
            >
              <div className="mt-0.5 p-1 rounded bg-slate-100">{getIcon(n.type)}</div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-slate-800 ${n.isRead ? "" : "text-[#172033]"}`}>{n.title}</p>
                <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2">{n.body}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                  <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={onClose}
                      className="text-[#4F46E5] font-medium hover:underline flex items-center gap-0.5"
                    >
                      View <ExternalLink size={9} />
                    </Link>
                  )}
                </div>
              </div>
              {!n.isRead && (
                <button
                  onClick={() => handleMarkRead(n._id)}
                  className="p-1 text-slate-400 hover:text-indigo-600"
                  title="Mark as read"
                >
                  <Check size={14} />
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

