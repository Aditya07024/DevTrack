"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Sun,
  Calendar,
  Code2,
  GraduationCap,
  FolderGit2,
  Briefcase,
  MessagesSquare,
  BarChart3,
  CalendarCheck,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  user?: { name: string; email: string } | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState<{ revisionCount?: number; todayCount?: number }>({});

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setStats({
            revisionCount: data.revisions?.dueCount || 0,
            todayCount: (data.totalTasksToday || 0) - (data.completedTasksToday || 0),
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  const navItems = [
    { name: "Overview", href: "/overview", icon: LayoutDashboard },
    { name: "My Day", href: "/my-day", icon: Sun, badge: stats.todayCount && stats.todayCount > 0 ? stats.todayCount : undefined },
    { name: "Planner", href: "/planner", icon: Calendar },
    { name: "DSA Tracker", href: "/dsa", icon: Code2, badge: stats.revisionCount && stats.revisionCount > 0 ? `${stats.revisionCount} due` : undefined, badgeColor: "bg-amber-100 text-amber-800" },
    { name: "Learning", href: "/learning", icon: GraduationCap },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Job Applications", href: "/applications", icon: Briefcase },
    { name: "Interview Prep", href: "/interviews", icon: MessagesSquare },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Weekly Reviews", href: "/reviews", icon: CalendarCheck },
    { name: "Resources & Notes", href: "/resources", icon: BookOpen },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  // Don't show sidebar on login page
  if (pathname === "/login") return null;

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-[#E2E8F0] transition-all duration-200 z-30 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#E2E8F0]">
        {!collapsed && (
          <Link href="/overview" className="flex items-center gap-2.5 font-bold text-lg text-[#172033] tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-indigo-200">
              DT
            </div>
            <span>DevTrack</span>
            <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
              OS
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/overview" className="mx-auto">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-black text-sm">
              DT
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold"
                  : "text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]"
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon size={18} className={isActive ? "text-[#4F46E5]" : "text-[#64748B]"} />
              {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
              {!collapsed && item.badge && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    item.badgeColor || "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout Footer */}
      <div className="p-3 border-t border-[#E2E8F0]">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center text-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#172033] truncate">{user?.name || "Aditya07024"}</p>
                <p className="text-[11px] text-[#64748B] truncate">{user?.email || "adityakumar07024@gmail.com"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#64748B] hover:text-red-600 rounded hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center p-2 text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}

