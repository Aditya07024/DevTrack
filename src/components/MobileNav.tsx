"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sun, Code2, Briefcase, Menu, X, Calendar, GraduationCap, FolderGit2, MessagesSquare, BarChart3, Settings } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  if (pathname === "/login") return null;

  const items = [
    { name: "Overview", href: "/overview", icon: LayoutDashboard },
    { name: "My Day", href: "/my-day", icon: Sun },
    { name: "DSA", href: "/dsa", icon: Code2 },
    { name: "Jobs", href: "/applications", icon: Briefcase },
  ];

  const moreLinks = [
    { name: "Planner", href: "/planner", icon: Calendar },
    { name: "Learning Tracks", href: "/learning", icon: GraduationCap },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Interview Prep", href: "/interviews", icon: MessagesSquare },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] px-3 py-1.5 flex items-center justify-around z-30 shadow-lg">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? "text-[#4F46E5] font-semibold" : "text-[#64748B]"
              }`}
            >
              <Icon size={20} className={isActive ? "text-[#4F46E5]" : "text-[#64748B]"} />
              <span className="mt-0.5">{item.name}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium text-[#64748B]"
        >
          <Menu size={20} />
          <span className="mt-0.5">More</span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-64 h-full p-4 flex flex-col justify-between shadow-xl animate-in slide-in-from-right">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="text-sm font-bold text-slate-800">DevTrack Navigation</span>
                <button onClick={() => setDrawerOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-1">
                {moreLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                        isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
