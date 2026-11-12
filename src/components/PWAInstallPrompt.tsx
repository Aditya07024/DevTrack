"use client";

import React, { useState, useEffect } from "react";
import { Download, Sparkles, X, Check } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[DevTrack SW] Registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("[DevTrack SW] Registration failed:", err);
        });
    }

    // 2. Check standalone display mode
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // 3. Listen for install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  }

  if (isInstalled || !showBanner) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 bg-white border border-indigo-200 shadow-xl rounded-xl p-3.5 max-w-sm flex items-start gap-3 animate-in slide-in-from-bottom-5">
      <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
        DT
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-slate-900">Install DevTrack App</h4>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Install as a desktop or mobile PWA for offline access, fast loading, and native reminders.
        </p>
        <div className="flex items-center gap-2 mt-2.5">
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
          >
            <Download size={13} />
            Install PWA
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
          >
            Later
          </button>
        </div>
      </div>
      <button
        onClick={() => setShowBanner(false)}
        className="text-slate-400 hover:text-slate-600 p-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}

