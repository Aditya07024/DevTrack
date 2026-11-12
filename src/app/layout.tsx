import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import MobileNav from "@/components/MobileNav";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "DevTrack — Personal Preparation OS",
  description: "A centralized preparation & career management platform for software engineers.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DevTrack",
  },
};

export const viewport: Viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-[#172033] flex flex-col antialiased">
        <div className="flex h-screen overflow-hidden">
          {/* Collapsible Sidebar */}
          <Sidebar user={session ? { name: session.name, email: session.email } : null} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <TopNav />
            <main className="flex-1 overflow-y-auto pb-20 md:pb-8 p-4 sm:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>

        {/* Mobile bottom navigation */}
        <MobileNav />

        {/* PWA Install Banner */}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
