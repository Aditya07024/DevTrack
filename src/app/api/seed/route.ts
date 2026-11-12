import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser, ensureDefaultDemoUser } from "@/lib/auth";
import DsaTopic from "@/lib/models/DsaTopic";
import LearningTrack from "@/lib/models/LearningTrack";
import LearningTopic from "@/lib/models/LearningTopic";
import Task from "@/lib/models/Task";
import DsaProblem from "@/lib/models/DsaProblem";
import Revision from "@/lib/models/Revision";
import Project from "@/lib/models/Project";
import JobApplication from "@/lib/models/JobApplication";
import Goal from "@/lib/models/Goal";
import StudySession from "@/lib/models/StudySession";
import InterviewQuestion from "@/lib/models/InterviewQuestion";
import Resource from "@/lib/models/Resource";
import Note from "@/lib/models/Note";
import Notification from "@/lib/models/Notification";
import {
  DEFAULT_DSA_TOPICS,
  DEFAULT_LEARNING_TRACKS,
  DEFAULT_DEVELOPMENT_TOPICS,
  DEFAULT_CORE_CS_TOPICS,
  DEFAULT_SYSTEM_DESIGN_TOPICS,
} from "@/lib/seedData";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    let session = await getAuthenticatedUser(req);
    let userId: any;

    if (!session) {
      const demoUser = await ensureDefaultDemoUser();
      userId = demoUser._id;
    } else {
      userId = session.userId;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const now = new Date();

    // 1. Topics
    for (const topic of DEFAULT_DSA_TOPICS) {
      await DsaTopic.updateOne({ slug: topic.slug }, { $set: topic }, { upsert: true });
    }

    // 2. Tracks & Topics
    for (const track of DEFAULT_LEARNING_TRACKS) {
      await LearningTrack.updateOne({ slug: track.slug }, { $set: track }, { upsert: true });
    }

    const allTopics = [
      ...DEFAULT_DEVELOPMENT_TOPICS,
      ...DEFAULT_CORE_CS_TOPICS,
      ...DEFAULT_SYSTEM_DESIGN_TOPICS,
    ];
    for (const t of allTopics) {
      await LearningTopic.updateOne(
        { userId, title: t.title },
        {
          $set: {
            ...t,
            userId,
            trackName: t.category,
            status: t.confidence === "INTERVIEW_READY" ? "COMPLETED" : "IN_PROGRESS",
            lastStudiedDate: now,
          },
        },
        { upsert: true }
      );
    }

    // 3. Goals
    await Goal.updateOne(
      { userId, title: "Solve 50 LeetCode Medium & Hard Problems" },
      {
        $set: {
          userId,
          title: "Solve 50 LeetCode Medium & Hard Problems",
          description: "Focus on Dynamic Programming, Graphs, and Advanced Trees for top product interviews.",
          category: "DSA",
          targetMonth: now.getMonth() + 1,
          targetYear: now.getFullYear(),
          targetCount: 50,
          currentCount: 34,
          metricLabel: "problems",
          status: "IN_PROGRESS",
          keyResults: [
            "15 DP problems solved independently",
            "12 Graph BFS/DFS/Dijkstra problems",
            "Clear 100% revision queue on schedule",
          ],
        },
      },
      { upsert: true }
    );

    await Goal.updateOne(
      { userId, title: "Apply to 25 Remote US / Global Roles" },
      {
        $set: {
          userId,
          title: "Apply to 25 Remote US / Global Roles",
          description: "Target high-growth startups and international engineering organizations.",
          category: "CAREER",
          targetMonth: now.getMonth() + 1,
          targetYear: now.getFullYear(),
          targetCount: 25,
          currentCount: 16,
          metricLabel: "applications",
          status: "IN_PROGRESS",
          keyResults: [
            "Tailor resume version 2.0 with quantifiable business impact",
            "Reach out to 10 hiring managers for referrals",
          ],
        },
      },
      { upsert: true }
    );

    // 4. Tasks for My Day
    const sampleTasks = [
      {
        title: "Dynamic Programming: Longest Common Subsequence & Variations",
        description: "Solve LeetCode #1143 and implement space-optimized DP table.",
        priority: "HIGH",
        status: "IN_PROGRESS",
        category: "DSA",
        scheduledDate: todayStr,
        dueDate: todayStr,
        estimatedMinutes: 60,
        actualMinutes: 45,
        tags: ["DP", "LeetCode-Medium"],
        notes: "Space optimization: only previous row is needed.",
      },
      {
        title: "Design Distributed Rate Limiter with Redis Token Bucket",
        description: "Review race conditions, Lua scripts, and sliding window counter algorithm.",
        priority: "HIGH",
        status: "TODO",
        category: "SYSTEM_DESIGN",
        scheduledDate: todayStr,
        dueDate: todayStr,
        estimatedMinutes: 45,
        actualMinutes: 0,
        tags: ["System Design", "Redis"],
      },
      {
        title: "Computer Networks: TCP 3-Way Handshake & SYN Flood Protection",
        description: "Revise SYN Cookies, Half-Open connections, and TIME_WAIT state.",
        priority: "MEDIUM",
        status: "COMPLETED",
        category: "CORE_CS",
        scheduledDate: todayStr,
        dueDate: todayStr,
        estimatedMinutes: 30,
        actualMinutes: 30,
        completedAt: now,
        tags: ["Networking"],
      },
      {
        title: "Spaced Repetition: LRU Cache Implementation",
        description: "Double LinkedList + HashMap O(1) get & put revision.",
        priority: "URGENT",
        status: "TODO",
        category: "REVISION",
        scheduledDate: todayStr,
        dueDate: todayStr,
        estimatedMinutes: 35,
        actualMinutes: 0,
        tags: ["Revision"],
      },
    ];

    for (const t of sampleTasks) {
      await Task.updateOne(
        { userId, title: t.title, scheduledDate: t.scheduledDate },
        { $set: { ...t, userId } },
        { upsert: true }
      );
    }

    // 5. Problems & Revisions
    const sampleProblems = [
      {
        title: "LRU Cache",
        topicName: "Linked Lists",
        platform: "LeetCode",
        url: "https://leetcode.com/problems/lru-cache/",
        difficulty: "MEDIUM",
        status: "SOLVED_INDEPENDENTLY",
        timeComplexity: "O(1)",
        spaceComplexity: "O(capacity)",
        approach: "Doubly Linked List + Hash Map",
        nextRevisionDate: todayStr,
      },
      {
        title: "Longest Increasing Subsequence",
        topicName: "Dynamic Programming",
        platform: "LeetCode",
        url: "https://leetcode.com/problems/longest-increasing-subsequence/",
        difficulty: "MEDIUM",
        status: "SOLVED_INDEPENDENTLY",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        approach: "Binary search on patience sorting tails",
        nextRevisionDate: todayStr,
      },
      {
        title: "Course Schedule II",
        topicName: "Graphs",
        platform: "LeetCode",
        url: "https://leetcode.com/problems/course-schedule-ii/",
        difficulty: "MEDIUM",
        status: "SOLVED_INDEPENDENTLY",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V + E)",
        approach: "Kahn's Algorithm BFS",
        nextRevisionDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      },
      {
        title: "Trapping Rain Water",
        topicName: "Two Pointers",
        platform: "LeetCode",
        url: "https://leetcode.com/problems/trapping-rain-water/",
        difficulty: "HARD",
        status: "NEEDS_REVISION",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        approach: "Two pointers with leftMax and rightMax",
        nextRevisionDate: todayStr,
      },
    ];

    for (const p of sampleProblems) {
      await DsaProblem.updateOne(
        { userId, title: p.title },
        { $set: { ...p, userId, attemptCount: 2, solvedCount: 1 } },
        { upsert: true }
      );

      const prob = await DsaProblem.findOne({ userId, title: p.title });
      if (prob) {
        await Revision.updateOne(
          { userId, problemId: prob._id, intervalDays: 3 },
          {
            $set: {
              userId,
              problemId: prob._id,
              problemTitle: prob.title,
              topicName: prob.topicName,
              difficulty: prob.difficulty,
              intervalDays: 3,
              iteration: 1,
              scheduledDate: p.nextRevisionDate || todayStr,
              status: "PENDING",
            },
          },
          { upsert: true }
        );
      }
    }

    // 6. Projects
    await Project.updateOne(
      { userId, title: "DevTrack - Personal Preparation OS" },
      {
        $set: {
          userId,
          title: "DevTrack - Personal Preparation OS",
          description: "Full-stack personal career OS with daily planner, DSA revision engine, and international job CRM.",
          category: "PERSONAL",
          techStack: ["Next.js App Router", "TypeScript", "MongoDB", "Tailwind CSS", "Web Push PWA"],
          repoUrl: "https://github.com/Aditya07024/DevTrack",
          demoUrl: "https://devtrack.io",
          status: "IN_PROGRESS",
          milestones: [
            { title: "Core Data Architecture & Schemas", completed: true },
            { title: "Interactive DSA Tracker & Spaced Repetition", completed: true },
            { title: "Multi-Currency Job Application CRM", completed: true },
            { title: "Web Push & Service Worker PWA", completed: true },
          ],
          challenges: ["Idempotent notification dispatch across background cron tasks"],
          technicalDecisions: ["Modular monolith for streamlined developer experience"],
          achievements: ["100/100 PWA score with installable shell"],
        },
      },
      { upsert: true }
    );

    // 7. Job Applications
    const sampleApps = [
      {
        company: "Vercel",
        role: "Senior Full-Stack Engineer",
        country: "United States",
        city: "San Francisco (Remote)",
        workArrangement: "REMOTE",
        currency: "USD",
        salaryMin: 160000,
        salaryMax: 195000,
        applicationDate: "2025-02-01",
        status: "TECHNICAL_ROUND",
        notes: "Next.js App Router live coding round scheduled.",
      },
      {
        company: "Atlassian",
        role: "Senior Software Engineer",
        country: "India",
        city: "Bengaluru",
        workArrangement: "HYBRID",
        currency: "INR",
        salaryMin: 4500000,
        salaryMax: 5500000,
        applicationDate: "2025-01-20",
        status: "INTERVIEW_SCHEDULED",
        notes: "Passed OA. System design round upcoming.",
      },
      {
        company: "Stripe",
        role: "Backend Infrastructure Engineer",
        country: "United States",
        city: "Remote (Global)",
        workArrangement: "REMOTE",
        currency: "USD",
        salaryMin: 155000,
        salaryMax: 185000,
        applicationDate: "2025-02-05",
        status: "ASSESSMENT",
        notes: "HackerRank concurrency assessment.",
      },
    ];

    for (const a of sampleApps) {
      await JobApplication.updateOne(
        { userId, company: a.company, role: a.role },
        { $set: { ...a, userId, employmentType: "FULL_TIME", requiredSkills: ["TypeScript", "Distributed Systems"] } },
        { upsert: true }
      );
    }

    // 8. Study Sessions for Streak & Consistency
    for (let d = 0; d < 7; d++) {
      const sessionDate = new Date(Date.now() - d * 86400000).toISOString().split("T")[0];
      await StudySession.updateOne(
        { userId, date: sessionDate },
        {
          $set: {
            userId,
            category: d % 2 === 0 ? "DSA" : "SYSTEM_DESIGN",
            title: d % 2 === 0 ? "LeetCode Grind" : "System Design",
            durationMinutes: 120 + d * 10,
            date: sessionDate,
            startTime: new Date(Date.now() - d * 86400000 - 7200000),
            endTime: new Date(Date.now() - d * 86400000),
          },
        },
        { upsert: true }
      );
    }

    // 9. Questions & Notes
    await InterviewQuestion.updateOne(
      { userId, question: "How does the Node.js Event Loop handle microtasks vs macrotasks?" },
      {
        $set: {
          userId,
          question: "How does the Node.js Event Loop handle microtasks vs macrotasks?",
          category: "CORE_CS",
          company: "Vercel / Uber",
          difficulty: "MEDIUM",
          confidence: "INTERVIEW_READY",
          answerNotes: "Microtasks (process.nextTick, Promise callbacks) run between each phase of event loop.",
        },
      },
      { upsert: true }
    );

    await Note.updateOne(
      { userId, title: "Binary Search Template & Edge Cases" },
      {
        $set: {
          userId,
          title: "Binary Search Template & Edge Cases",
          content: "Always use `left + Math.floor((right - left) / 2)` to avoid integer overflow.",
          category: "DSA",
          isPinned: true,
          tags: ["DSA", "BinarySearch"],
        },
      },
      { upsert: true }
    );

    // 10. Notifications
    await Notification.updateOne(
      { userId, title: "Daily Preparation Reminder" },
      {
        $set: {
          userId,
          title: "Daily Preparation Reminder",
          body: "Time for your DevTrack daily review. You have 3 pending tasks and 2 DSA revisions due today.",
          type: "DAILY_REMINDER",
          link: "/my-day",
          isRead: false,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with rich production preparation data!",
    });
  } catch (error: any) {
    console.error("[API Seed Error]", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
