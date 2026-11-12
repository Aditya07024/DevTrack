import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  DEFAULT_DSA_TOPICS,
  DEFAULT_LEARNING_TRACKS,
  DEFAULT_DEVELOPMENT_TOPICS,
  DEFAULT_CORE_CS_TOPICS,
  DEFAULT_SYSTEM_DESIGN_TOPICS,
} from "../src/lib/seedData.js";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/devtrack";

console.log("[DevTrack Seed] Connecting to MongoDB at:", uri.replace(/\/\/.*@/, "//***@"));

async function seed() {
  await mongoose.connect(uri);
  console.log("[DevTrack Seed] MongoDB connected successfully.");

  // Clean collections if needed or upsert
  const db = mongoose.connection.db;

  // 1. Create or retrieve demo/primary user
  const userEmail = process.env.DEVTRACK_USER_EMAIL || "adityakumar07024@gmail.com";
  const userName = process.env.DEVTRACK_USER_NAME || "Aditya07024";
  const hashedPassword = await bcrypt.hash("DevTrack2025!", 10);
  const usersCollection = db.collection("users");
  
  let user = await usersCollection.findOne({ email: userEmail.toLowerCase() });
  if (!user) {
    const res = await usersCollection.insertOne({
      email: userEmail.toLowerCase(),
      password: hashedPassword,
      name: userName,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    user = { _id: res.insertedId };
    console.log(`[DevTrack Seed] Created user (${userEmail} / DevTrack2025!)`);
  } else {
    console.log("[DevTrack Seed] User already exists:", user._id);
  }

  const userId = user._id;

  // 2. User Settings
  const userSettingsCollection = db.collection("usersettings");
  await userSettingsCollection.updateOne(
    { userId },
    {
      $set: {
        userId,
        targetRole: "Senior Full-Stack & Distributed Systems Engineer",
        targetCompanyCategory: [
          "Product-based Companies",
          "High-Growth Startups",
          "Remote US/International Engineering",
          "FAANG & Global Tech",
        ],
        careerGoalSummary: "Transition into top-tier global product roles & remote US engineering positions with $150k+ / ₹50L+ compensation through rigorous DSA mastery, production-grade system design, and clean full-stack architecture.",
        dailyStudyHoursTarget: 3.5,
        workingDays: [1, 2, 3, 4, 5, 6],
        timezone: "Asia/Kolkata",
        preferredCurrency: "USD",
        notificationPreferences: {
          dailyReminderTime: "20:00",
          dailyReminderEnabled: true,
          taskDeadlineEnabled: true,
          dsaRevisionEnabled: true,
          weeklyReviewEnabled: true,
          monthlyGoalEnabled: true,
        },
        revisionIntervals: [3, 7, 21],
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  // 3. DSA Topics
  const dsaTopicsCollection = db.collection("dsatopics");
  for (const topic of DEFAULT_DSA_TOPICS) {
    await dsaTopicsCollection.updateOne(
      { slug: topic.slug },
      { $set: { ...topic, isCustom: false, updatedAt: new Date() } },
      { upsert: true }
    );
  }
  console.log(`[DevTrack Seed] Seeded ${DEFAULT_DSA_TOPICS.length} default DSA topics.`);

  // 4. Learning Tracks & Topics
  const learningTracksCollection = db.collection("learningtracks");
  const learningTopicsCollection = db.collection("learningtopics");

  for (const track of DEFAULT_LEARNING_TRACKS) {
    await learningTracksCollection.updateOne(
      { slug: track.slug },
      { $set: { ...track, updatedAt: new Date() } },
      { upsert: true }
    );
  }

  const allTopics = [
    ...DEFAULT_DEVELOPMENT_TOPICS,
    ...DEFAULT_CORE_CS_TOPICS,
    ...DEFAULT_SYSTEM_DESIGN_TOPICS,
  ];

  for (const t of allTopics) {
    await learningTopicsCollection.updateOne(
      { userId, title: t.title },
      {
        $set: {
          userId,
          trackName: t.category,
          category: t.category,
          title: t.title,
          subtopics: t.subtopics,
          confidence: t.confidence,
          notes: t.notes,
          resources: t.resources,
          status: t.confidence === "INTERVIEW_READY" ? "COMPLETED" : "IN_PROGRESS",
          lastStudiedDate: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  }
  console.log(`[DevTrack Seed] Seeded ${allTopics.length} learning topics.`);

  // 5. Goals
  const goalsCollection = db.collection("goals");
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const sampleGoals = [
    {
      userId,
      title: "Solve 50 LeetCode Medium & Hard Problems",
      description: "Focus on Dynamic Programming, Graphs, and Advanced Trees for top product interviews.",
      category: "DSA",
      targetMonth: currentMonth,
      targetYear: currentYear,
      targetCount: 50,
      currentCount: 34,
      metricLabel: "problems",
      status: "IN_PROGRESS",
      keyResults: [
        "15 DP problems solved independently",
        "12 Graph BFS/DFS/Dijkstra problems",
        "Clear 100% revision queue on schedule",
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Master High-Level System Design & Microservices",
      description: "Prepare for senior system design rounds covering distributed caching, sharding, and event messaging.",
      category: "SYSTEM_DESIGN",
      targetMonth: currentMonth,
      targetYear: currentYear,
      targetCount: 8,
      currentCount: 5,
      metricLabel: "case studies",
      status: "IN_PROGRESS",
      keyResults: [
        "Design YouTube / Netflix video ingestion & streaming",
        "Design Distributed Rate Limiter with Redis",
        "Design Real-time Collaborative Document Editor",
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Apply to 25 Remote US / Global Software Engineering Roles",
      description: "Target high-growth startups and international companies offering competitive global packages.",
      category: "CAREER",
      targetMonth: currentMonth,
      targetYear: currentYear,
      targetCount: 25,
      currentCount: 16,
      metricLabel: "applications",
      status: "IN_PROGRESS",
      keyResults: [
        "Tailor resume version 2.0 with quantifiable business impact",
        "Reach out to 10 hiring managers & engineers for referrals",
        "Track interview funnel with conversion analytics",
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const g of sampleGoals) {
    await goalsCollection.updateOne(
      { userId, title: g.title },
      { $set: g },
      { upsert: true }
    );
  }

  // 6. Tasks for Today (My Day)
  const todayStr = now.toISOString().split("T")[0];
  const tasksCollection = db.collection("tasks");

  const sampleTasks = [
    {
      userId,
      title: "Dynamic Programming: Longest Common Subsequence & Variations",
      description: "Solve LeetCode #1143 and implement space-optimized DP table.",
      priority: "HIGH",
      status: "IN_PROGRESS",
      category: "DSA",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 60,
      actualMinutes: 45,
      tags: ["DP", "Recursion", "LeetCode-Medium"],
      notes: "Remember state transition: dp[i][j] = text1[i-1] == text2[j-1] ? 1 + dp[i-1][j-1] : max(dp[i-1][j], dp[i][j-1])",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Design Distributed Rate Limiter with Redis Token Bucket",
      description: "Review race conditions, Lua scripts, and sliding window counter algorithm.",
      priority: "HIGH",
      status: "TODO",
      category: "SYSTEM_DESIGN",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 45,
      actualMinutes: 0,
      tags: ["System Design", "Redis", "Distributed Systems"],
      notes: "Compare Token Bucket vs Sliding Window Log memory overhead.",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
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
      tags: ["Networking", "TCP/IP"],
      notes: "Completed notes in Obsidian and DevTrack.",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "DSA Spaced Repetition: LRU Cache Implementation",
      description: "Double LinkedList + HashMap O(1) get & put revision.",
      priority: "URGENT",
      status: "TODO",
      category: "REVISION",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 35,
      actualMinutes: 0,
      tags: ["Revision", "Data-Structures"],
      notes: "Be careful with dummy head and tail node edge cases.",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Follow up on Vercel Full-Stack Technical Round scheduling",
      description: "Confirm interview availability for Next.js Architecture round with recruiter.",
      priority: "MEDIUM",
      status: "TODO",
      category: "APPLICATION",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 20,
      actualMinutes: 0,
      tags: ["Career", "Remote-US"],
      notes: "Timezone slot: 8:30 PM IST / 10:00 AM EST",
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const t of sampleTasks) {
    await tasksCollection.updateOne(
      { userId, title: t.title, scheduledDate: t.scheduledDate },
      { $set: t },
      { upsert: true }
    );
  }

  // 7. DSA Problems & Revisions
  const dsaProblemsCollection = db.collection("dsaproblems");
  const revisionsCollection = db.collection("revisions");

  const sampleProblems = [
    {
      userId,
      topicName: "Linked Lists",
      title: "LRU Cache",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/lru-cache/",
      difficulty: "MEDIUM",
      status: "SOLVED_INDEPENDENTLY",
      timeComplexity: "O(1) get and put",
      spaceComplexity: "O(capacity)",
      approach: "Doubly Linked List to maintain order + Hash Map for O(1) node lookup.",
      notes: "Always maintain sentinel head and tail to simplify boundary pointer operations.",
      attemptCount: 2,
      solvedCount: 2,
      revisionCount: 1,
      nextRevisionDate: todayStr,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      topicName: "Dynamic Programming",
      title: "Longest Increasing Subsequence",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/longest-increasing-subsequence/",
      difficulty: "MEDIUM",
      status: "SOLVED_INDEPENDENTLY",
      timeComplexity: "O(n log n) with binary search / patience sorting",
      spaceComplexity: "O(n)",
      approach: "tails array with binary search (std::lower_bound).",
      notes: "Standard O(n^2) DP is easy; O(n log n) patience sorting is the interviewer expectation.",
      attemptCount: 3,
      solvedCount: 2,
      revisionCount: 2,
      nextRevisionDate: todayStr,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      topicName: "Graphs",
      title: "Course Schedule II",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/course-schedule-ii/",
      difficulty: "MEDIUM",
      status: "SOLVED_INDEPENDENTLY",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V + E)",
      approach: "Kahn's Algorithm using indegree array and BFS queue.",
      notes: "If result length < numCourses, graph contains a cycle.",
      attemptCount: 1,
      solvedCount: 1,
      revisionCount: 0,
      nextRevisionDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      topicName: "Two Pointers",
      title: "Trapping Rain Water",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/trapping-rain-water/",
      difficulty: "HARD",
      status: "NEEDS_REVISION",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      approach: "Two pointers left and right with leftMax and rightMax tracking.",
      notes: "Need to practice without looking at hints; struggle with boundary indices.",
      attemptCount: 2,
      solvedCount: 1,
      revisionCount: 1,
      nextRevisionDate: todayStr,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const p of sampleProblems) {
    const res = await dsaProblemsCollection.updateOne(
      { userId, title: p.title },
      { $set: p },
      { upsert: true }
    );

    const probDoc = await dsaProblemsCollection.findOne({ userId, title: p.title });
    if (probDoc) {
      await revisionsCollection.updateOne(
        { userId, problemId: probDoc._id, intervalDays: 3 },
        {
          $set: {
            userId,
            problemId: probDoc._id,
            problemTitle: probDoc.title,
            topicName: probDoc.topicName,
            difficulty: probDoc.difficulty,
            intervalDays: 3,
            iteration: 1,
            scheduledDate: p.nextRevisionDate || todayStr,
            status: "PENDING",
            updatedAt: now,
          },
        },
        { upsert: true }
      );
    }
  }

  // 8. Practical Projects
  const projectsCollection = db.collection("projects");
  const sampleProjects = [
    {
      userId,
      title: "DevTrack - Personal Preparation OS",
      description: "Production-ready developer preparation system connecting daily planning, DSA mastery, system design, and international career CRM.",
      category: "PERSONAL",
      techStack: ["Next.js App Router", "TypeScript", "MongoDB", "Mongoose", "Tailwind CSS", "Web Push PWA"],
      repoUrl: "https://github.com/developer/devtrack",
      demoUrl: "https://devtrack.io",
      startDate: "2025-01-10",
      status: "IN_PROGRESS",
      milestones: [
        { title: "Core Data Architecture & Mongoose Schemas", completed: true },
        { title: "Interactive DSA Tracker & Spaced Repetition Queue", completed: true },
        { title: "Job CRM with Multi-Currency & International Support", completed: true },
        { title: "Service Worker PWA & Web Push Notification System", completed: true },
      ],
      challenges: [
        "Ensuring idempotent notification dispatch across serverless cron triggers",
        "Clean aggregation pipeline for real-time consistency streak calculations",
      ],
      technicalDecisions: [
        "Adopted modular monolith in Next.js App Router for zero-friction maintenance",
        "Used Web Push VAPID with MongoDB subscription pruning for push notifications",
      ],
      keyLearnings: [
        "Proper separation of concerns between Route Handlers and Mongoose ODM models",
        "Offline caching strategy distinctions between static shell and dynamic user records",
      ],
      achievements: [
        "Lighthouse PWA score: 100/100",
        "Zero-latency optimistic UI updates for task completion",
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Distributed Async Job Queue & Worker Pool",
      description: "High-throughput asynchronous task orchestrator with Redis streams, worker heartbeats, and dead-letter queues.",
      category: "OPEN_SOURCE",
      techStack: ["Node.js", "Redis", "Docker", "TypeScript", "Prometheus"],
      repoUrl: "https://github.com/developer/async-worker-queue",
      demoUrl: "",
      startDate: "2024-11-01",
      endDate: "2025-01-05",
      status: "COMPLETED",
      milestones: [
        { title: "Redis Streams producer & consumer groups", completed: true },
        { title: "Backoff retry mechanism with jitter", completed: true },
        { title: "Grafana dashboard metrics exporter", completed: true },
      ],
      challenges: ["Handling abrupt worker crashes without duplicate job processing"],
      technicalDecisions: ["Utilized Redis XCLAIM and consumer group ACK semantics"],
      keyLearnings: ["Distributed consensus tradeoffs and idempotency keys"],
      achievements: ["Successfully processed 15,000 tasks/second in benchmark tests"],
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const pr of sampleProjects) {
    await projectsCollection.updateOne(
      { userId, title: pr.title },
      { $set: pr },
      { upsert: true }
    );
  }

  // 9. Job Applications (International + Indian Product Companies)
  const jobsCollection = db.collection("jobapplications");
  const sampleApplications = [
    {
      userId,
      company: "Vercel",
      role: "Senior Full-Stack Engineer - Platforms",
      country: "United States",
      city: "San Francisco (Remote)",
      workArrangement: "REMOTE",
      employmentType: "FULL_TIME",
      jobUrl: "https://vercel.com/careers",
      currency: "USD",
      salaryMin: 160000,
      salaryMax: 195000,
      salaryNotes: "+ Equity & health benefits (Remote International / US hours)",
      requiredExperience: "4+ years full-stack Next.js/React & distributed systems",
      requiredSkills: ["Next.js", "TypeScript", "Node.js", "Turborepo", "Web Standards"],
      applicationDate: "2025-02-01",
      status: "TECHNICAL_ROUND",
      resumeVersion: "v2.4 - Systems & Fullstack",
      referralName: "Staff Engineer on Twitter/LinkedIn",
      notes: "Passed recruiter phone screen. Technical round scheduled on system architecture & live Next.js App Router live coding.",
      nextStepDate: todayStr,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      company: "Atlassian",
      role: "Senior Software Engineer (Backend)",
      country: "India",
      city: "Bengaluru (Hybrid)",
      workArrangement: "HYBRID",
      employmentType: "FULL_TIME",
      jobUrl: "https://www.atlassian.com/company/careers",
      currency: "INR",
      salaryMin: 4500000,
      salaryMax: 5500000,
      salaryNotes: "Base ₹48L + 15% bonus + $80k USD RSUs over 4 years",
      requiredExperience: "3-6 years backend engineering",
      requiredSkills: ["Java", "Distributed Systems", "AWS", "Microservices", "Kafka"],
      applicationDate: "2025-01-20",
      status: "INTERVIEW_SCHEDULED",
      resumeVersion: "v2.2 - Enterprise Backend",
      notes: "Passed Online Assessment (100% test cases on 2 questions). System design round upcoming.",
      nextStepDate: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      company: "Stripe",
      role: "Backend Infrastructure Engineer",
      country: "United States",
      city: "Remote (Global)",
      workArrangement: "REMOTE",
      employmentType: "FULL_TIME",
      jobUrl: "https://stripe.com/jobs",
      currency: "USD",
      salaryMin: 155000,
      salaryMax: 185000,
      salaryNotes: "Competitive global compensation tier",
      requiredExperience: "3+ years API & distributed systems",
      requiredSkills: ["Ruby/Go/Java", "REST APIs", "Payment Systems", "Reliability"],
      applicationDate: "2025-02-05",
      status: "ASSESSMENT",
      resumeVersion: "v2.4 - Systems",
      notes: "HackerRank assessment received. Focus on concurrency and algorithmic correctness.",
      nextStepDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      company: "Swiggy",
      role: "SDE-2 (Delivery Logistics Platform)",
      country: "India",
      city: "Bengaluru",
      workArrangement: "ONSITE",
      employmentType: "FULL_TIME",
      jobUrl: "https://careers.swiggy.com",
      currency: "INR",
      salaryMin: 3800000,
      salaryMax: 4600000,
      salaryNotes: "Base ₹40L + Performance Bonus",
      requiredExperience: "2-4 years high-concurrency systems",
      requiredSkills: ["Golang/Java", "PostgreSQL", "Redis", "Kafka", "Low-Latency APIs"],
      applicationDate: "2025-01-15",
      status: "HR_ROUND",
      resumeVersion: "v2.0",
      notes: "Cleared both DSA round and LLD round. Awaiting final offer discussion.",
      nextStepDate: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const app of sampleApplications) {
    await jobsCollection.updateOne(
      { userId, company: app.company, role: app.role },
      { $set: app },
      { upsert: true }
    );
  }

  // 10. Study Sessions (for Analytics & Consistency)
  const studySessionsCollection = db.collection("studysessions");
  const pastDays = [0, 1, 2, 3, 4, 5, 6];
  for (const d of pastDays) {
    const sessionDate = new Date(Date.now() - d * 86400000).toISOString().split("T")[0];
    const duration = 120 + Math.floor(Math.sin(d) * 40 + 30);
    await studySessionsCollection.updateOne(
      { userId, date: sessionDate },
      {
        $set: {
          userId,
          category: d % 2 === 0 ? "DSA" : "SYSTEM_DESIGN",
          title: d % 2 === 0 ? "DSA LeetCode Grinding & Topic Mastery" : "System Design & Distributed Patterns",
          durationMinutes: duration,
          date: sessionDate,
          startTime: new Date(Date.now() - d * 86400000 - duration * 60000),
          endTime: new Date(Date.now() - d * 86400000),
          notes: "Consistent daily prep session.",
        },
      },
      { upsert: true }
    );
  }

  // 11. Interview Question Bank
  const interviewQuestionsCollection = db.collection("interviewquestions");
  const sampleQuestions = [
    {
      userId,
      question: "How does the Node.js Event Loop handle microtasks vs macrotasks?",
      category: "CORE_CS",
      company: "Vercel / Uber",
      round: "Technical Round 1",
      difficulty: "MEDIUM",
      answerNotes: "Microtasks (process.nextTick, Promise.then callbacks) run immediately after the current operation finishes and before moving to the next macrotask (setTimeout, setInterval, setImmediate, I/O polling).",
      keyPoints: [
        "process.nextTick queue has priority over standard Promise microtask queue",
        "Event loop phases: Timers -> Pending callbacks -> Idle/Prepare -> Poll -> Check -> Close",
        "Starvation risk if continuous microtasks are queued recursively",
      ],
      confidence: "INTERVIEW_READY",
      isWeakTopic: false,
      timesPracticed: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      question: "Design a Distributed Rate Limiter: How do you handle race conditions with high concurrency?",
      category: "SYSTEM_DESIGN",
      company: "Stripe / Razorpay",
      round: "System Design",
      difficulty: "HARD",
      answerNotes: "Use Redis Lua scripts to execute get, check, and increment atomically in single execution without multi-roundtrip race conditions. Alternatively use Redis EVALSHA with Token Bucket.",
      keyPoints: [
        "Avoid simple GET then INCR (classic check-then-act race condition)",
        "Sliding Window Counter algorithm balances memory and accuracy",
        "Local memory caching for IP-based pre-filtering to reduce Redis load",
      ],
      confidence: "CONFIDENT",
      isWeakTopic: false,
      timesPracticed: 4,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      question: "Tell me about a time you had a technical disagreement with a teammate. How did you resolve it?",
      category: "BEHAVIORAL",
      company: "Amazon / Atlassian",
      round: "Hiring Manager / Leadership Principles",
      difficulty: "MEDIUM",
      answerNotes: "STAR format: Situation regarding database choice (PostgreSQL vs MongoDB for analytics service). Proposed a 1-day benchmark with realistic write volume, shared data objectively, aligned with team consensus.",
      keyPoints: [
        "Focus on business metrics and objective data rather than ego",
        "Emphasize disagree and commit principle once decision was finalized",
        "Positive long-term relationship outcome with teammate",
      ],
      confidence: "INTERVIEW_READY",
      isWeakTopic: false,
      timesPracticed: 2,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const q of sampleQuestions) {
    await interviewQuestionsCollection.updateOne(
      { userId, question: q.question },
      { $set: q },
      { upsert: true }
    );
  }

  // 12. Resources & Notes
  const resourcesCollection = db.collection("resources");
  const notesCollection = db.collection("notes");

  const sampleResources = [
    {
      userId,
      title: "NeetCode 150 Roadmap",
      url: "https://neetcode.io/roadmap",
      category: "DSA",
      tags: ["DSA", "LeetCode", "Interview-Prep"],
      description: "Structured progressive list covering every essential pattern.",
      isFavorite: true,
      relatedDsaTopic: "All",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Designing Data-Intensive Applications (DDIA)",
      url: "https://dataintensive.net/",
      category: "SYSTEM_DESIGN",
      tags: ["Book", "HLD", "Distributed-Systems"],
      description: "The gold standard book for understanding data storage, consensus, and scaling.",
      isFavorite: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "ByteByteGo System Design Newsletter",
      url: "https://blog.bytebytego.com/",
      category: "SYSTEM_DESIGN",
      tags: ["Architecture", "HLD", "Visual-Diagrams"],
      description: "Excellent visual breakdowns of real-world enterprise architectures.",
      isFavorite: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const r of sampleResources) {
    await resourcesCollection.updateOne(
      { userId, title: r.title },
      { $set: r },
      { upsert: true }
    );
  }

  const sampleNotes = [
    {
      userId,
      title: "Binary Search Template & Edge Cases",
      content: `### Universal Binary Search Pattern
\`\`\`ts
let left = 0;
let right = n - 1;
while (left <= right) {
  const mid = left + Math.floor((right - left) / 2);
  if (condition(mid)) {
    // search left or answer = mid
    right = mid - 1;
  } else {
    left = mid + 1;
  }
}
\`\`\`
- Always use \`left + Math.floor((right - left) / 2)\` to avoid integer overflow.
- If looking for first true, initialize \`ans = -1\` and record whenever condition holds.`,
      category: "DSA",
      tags: ["Binary-Search", "Algorithms"],
      isPinned: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "CAP Theorem & PACELC Cheat Sheet",
      content: `### PACELC Theorem
If there is a **Partition (P)**:
- How does system choose between **Availability (A)** and **Consistency (C)**?

**Else (E)** (normal operations when no partition):
- How does system choose between **Latency (L)** and **Consistency (C)**?

Examples:
- **MongoDB**: PC/EC (Consistent under partition; consistent by default during normal operation with primary read/write)
- **Cassandra**: PA/EL (Available under partition; favors low latency over strong consistency normally)
- **DynamoDB**: Configurable via read consistency parameters.`,
      category: "SYSTEM_DESIGN",
      tags: ["System-Design", "Distributed-Systems", "Database"],
      isPinned: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const n of sampleNotes) {
    await notesCollection.updateOne(
      { userId, title: n.title },
      { $set: n },
      { upsert: true }
    );
  }

  // 13. In-App Notifications
  const notificationsCollection = db.collection("notifications");
  const sampleNotifications = [
    {
      userId,
      title: "Daily Preparation Reminder",
      body: "Time for your DevTrack daily review. You have 3 pending tasks and 2 DSA revisions due today.",
      type: "DAILY_REMINDER",
      link: "/my-day",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      userId,
      title: "DSA Revision Due: LRU Cache",
      body: "3-day spaced repetition interval reached. Solve it independently to reinforce memory retention.",
      type: "DSA_REVISION",
      link: "/dsa",
      isRead: false,
      createdAt: new Date(Date.now() - 7200000),
    },
    {
      userId,
      title: "Upcoming Interview: Vercel Full-Stack Round",
      body: "Technical discussion scheduled for this week. Review your System Design & Next.js notes.",
      type: "TASK_DEADLINE",
      link: "/applications",
      isRead: true,
      createdAt: new Date(Date.now() - 86400000),
    },
  ];

  for (const notif of sampleNotifications) {
    await notificationsCollection.updateOne(
      { userId, title: notif.title },
      { $set: notif },
      { upsert: true }
    );
  }

  console.log("[DevTrack Seed] Seed completed successfully! All collections initialized.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[DevTrack Seed] Seed failed:", err);
  process.exit(1);
});
