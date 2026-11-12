# DevTrack — Personal Preparation OS

> **A centralized, production-quality personal preparation and career management platform for software engineers.**

Designed for engineers preparing for competitive technical opportunities:
- FAANG & Major Global Technology Companies
- High-Growth Product Startups
- Remote US Software Engineering Roles
- Remote International Engineering Organizations
- Engineering-Focused Companies in India

---

## 🚀 Key Modules & Capabilities

1. **Overview Dashboard**: Real-time aggregated statistics (Today's completion %, DSA solves by difficulty, study streak, weekly study hours, active goals, and upcoming deadlines).
2. **My Day Execution**: Main daily planning engine with priority tags, study timer session logging, completion toggling, and non-destructive rescheduling with audit history.
3. **Hierarchy Planner**: Connected hierarchy connecting Monthly Goals $\rightarrow$ Weekly Sprints $\rightarrow$ Daily Schedule, accompanied by an interactive calendar.
4. **DSA Mastery Tracker**: Comprehensive catalog across 25 default topics (Complexity to Advanced Graph Algorithms & DP). Tracks platforms (LeetCode, GfG, Codeforces), time & space complexity, approach writeups, and attempt histories.
5. **Automated Spaced Repetition Queue**: Automatic 3-day, 7-day, and 21-day revision generation upon successful problem solves. Overdue, due today, and upcoming queues.
6. **Learning Concept Tracks**: Full-stack Development, Core Computer Science (OS, Computer Networks, DBMS, OOP & SOLID), and System Design (HLD & LLD). Subtopics checklist, confidence ratings, and resource bookmarks.
7. **Engineering Projects Tracker**: Real-world software project portfolio tracker with tech stack tags, repository links, demo URLs, architectural decisions, and achievements.
8. **Job Applications CRM**: International and Indian opportunity pipeline. Multi-currency support (USD, INR, EUR, GBP), remote/hybrid/onsite categorization, Kanban pipeline stages, and interview round tracking.
9. **Interview Question Bank**: Question repository across System Design, Core CS, DSA, and Behavioral STAR stories with weak-topic tagging.
10. **Analytics**: Visualized performance reports using Recharts (DSA difficulty distribution, solve independence ratio, consistency hours, and recruitment funnel).
11. **Structured Weekly Reviews**: Weekly retrospectives preventing duplicate logs, calculating completion velocity, and logging next week's priorities.
12. **Resources & Notes**: Markdown-enabled study notes, code snippet preservation, and categorized external bookmarks.
13. **PWA & Web Push Notifications**: Service Worker, Web App Manifest, offline fallback shell, VAPID push notification support, and background cron scheduler endpoints (`/api/cron/*`).

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS with custom developer-dashboard design system
- **Database**: MongoDB via Mongoose ODM
- **Data Visualizations**: Recharts
- **Icons**: Lucide React
- **Validation**: Zod
- **Authentication**: Secure JWT sessions with bcryptjs password hashing and httpOnly cookies
- **PWA / Push**: Service Worker, Web Push API, VAPID authentication

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js (v18.0 or newer)
- MongoDB instance (MongoDB Atlas connection string or local MongoDB running on `mongodb://localhost:27017/devtrack`)

### 2. Environment Configuration
Create `.env.local` based on `.env.example`:

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# User Identity
DEVTRACK_USER_NAME=Aditya07024
DEVTRACK_USER_EMAIL=adityakumar07024@gmail.com

# MongoDB
MONGODB_URI=mongodb://localhost:27017/devtrack

# Authentication
AUTH_SECRET=devtrack-dev-secret-key-32-characters-minimum-length-for-jwt
AUTH_URL=http://localhost:3000

# Push Notifications (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U
VAPID_PRIVATE_KEY=UUxI0jS_vV7J01C_0T7b_x5U949m8u1E1gYnSgA5Nks
VAPID_SUBJECT=mailto:adityakumar07024@gmail.com

# Background Schedulers
CRON_SECRET=devtrack-cron-secret-123
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Seed default DSA topics, learning tracks, and demo records
npm run db:seed
# Or click the "Seed Data" button in the top navigation bar!

# Start Development Server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Default User / Quick Demo Login

- **Name**: Aditya07024
- **Email**: `adityakumar07024@gmail.com`
- **Password**: `DevTrack2025!`
- Or click **"Enter as Aditya07024 (Demo)"** on the login page for 1-click instant access.

---

## 🔔 Background Cron Jobs

DevTrack includes secure scheduled cron routes protected by `CRON_SECRET`:
- `GET /api/cron/daily-reminders?key=devtrack-cron-secret-123` — Dispatches daily preparation reminders and checks pending tasks.
- `GET /api/cron/revision-reminders?key=devtrack-cron-secret-123` — Dispatches notifications for DSA spaced repetitions due today.
- `GET /api/cron/weekly-reviews?key=devtrack-cron-secret-123` — Prompts weekly retrospectives on Sunday evenings.

Can be triggered by Vercel Cron, GitHub Actions, or cron-job.org.

---

## 📦 PWA Installation
1. Open DevTrack in Chrome, Edge, or Safari.
2. Click the **"Install PWA"** pill at the bottom right, or use the browser address bar install prompt.
3. DevTrack will run as a standalone desktop or mobile application with offline shell capability.

---

## 🚢 Deployment

### Deploy to Vercel
1. Push repository to GitHub: `https://github.com/Aditya07024/DevTrack`
2. Import repository into [Vercel](https://vercel.com).
3. Set environment variables (`MONGODB_URI`, `AUTH_SECRET`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, etc.).
4. Deploy!

