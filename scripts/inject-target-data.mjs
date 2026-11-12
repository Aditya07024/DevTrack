import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI || "mongodb+srv://adityakumar07024_db_user:uFiprHrJ5hQQEDOx@cluster0.plxylon.mongodb.net/devtrack?retryWrites=true&w=majority";

async function injectTargetData() {
  console.log("[DevTrack Injection] Connecting to MongoDB Atlas...");
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const targetEmail = "adityakumar07024@gmail.com";
  const targetName = "Aditya07024";

  // 1. Ensure User
  let user = await db.collection("users").findOne({ email: targetEmail });
  if (!user) {
    const hashedPassword = await bcrypt.hash("DevTrack2025!", 10);
    const res = await db.collection("users").insertOne({
      email: targetEmail,
      name: targetName,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    user = { _id: res.insertedId };
  }
  const userId = user._id;
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  console.log(`[DevTrack Injection] Injecting target data for user: ${targetName} (${userId})`);

  // 2. User Settings - Aligned with Target Role
  await db.collection("usersettings").updateOne(
    { userId },
    {
      $set: {
        userId,
        targetRole: "Senior Full-Stack & Distributed Systems Engineer",
        targetCompanyCategory: [
          "FAANG & Major Global Tech",
          "Tier-1 Product Companies (India & Global)",
          "High-Growth Global Startups",
          "US & International Remote Software Engineering",
        ],
        careerGoalSummary: "Targeting Senior Full-Stack & Distributed Systems roles across US Remote ($150k-$195k) and Top Product Companies in India (₹45L-₹60L). Focused on DSA mastery (DP, Graphs, Trees), scalable low-latency system design, and production Next.js/Node/Cloud architecture.",
        dailyStudyHoursTarget: 4.0,
        workingDays: [1, 2, 3, 4, 5, 6],
        timezone: "Asia/Kolkata",
        preferredCurrency: "USD",
        notificationPreferences: {
          dailyReminderTime: "20:30",
          dailyReminderEnabled: true,
          taskDeadlineEnabled: true,
          dsaRevisionEnabled: true,
          weeklyReviewEnabled: true,
          monthlyGoalEnabled: true,
        },
        revisionIntervals: [3, 7, 21],
        updatedAt: now,
      },
    },
    { upsert: true }
  );

  // 3. Clear existing user items to inject clean, targeted data
  await Promise.all([
    db.collection("tasks").deleteMany({ userId }),
    db.collection("dsaproblems").deleteMany({ userId }),
    db.collection("revisions").deleteMany({ userId }),
    db.collection("goals").deleteMany({ userId }),
    db.collection("plans").deleteMany({ userId }),
    db.collection("jobapplications").deleteMany({ userId }),
    db.collection("interviews").deleteMany({ userId }),
    db.collection("interviewquestions").deleteMany({ userId }),
    db.collection("weeklyreviews").deleteMany({ userId }),
    db.collection("studysessions").deleteMany({ userId }),
    db.collection("notes").deleteMany({ userId }),
    db.collection("resources").deleteMany({ userId }),
    db.collection("notifications").deleteMany({ userId }),
  ]);

  // 4. Goals for Current Month
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  await db.collection("goals").insertMany([
    {
      userId,
      title: "Solve 60 LeetCode Medium/Hard Problems",
      description: "Master DP, Graphs, Trees, and Two-Pointer patterns for FAANG & US Remote technical screenings.",
      category: "DSA",
      targetMonth: currentMonth,
      targetYear: currentYear,
      targetCount: 60,
      currentCount: 42,
      metricLabel: "problems",
      status: "IN_PROGRESS",
      keyResults: [
        "20 Dynamic Programming problems (Knapsack, LCS, LIS)",
        "15 Graph problems (BFS/DFS, Dijkstra, Topological Sort)",
        "Zero backlog in 3/7/21-day spaced repetition queue",
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Design 6 Production-Grade Distributed Systems",
      description: "Deep dive into real-world architectures: Rate Limiting, Distributed Caching, Message Queues, and Sharding.",
      category: "SYSTEM_DESIGN",
      targetMonth: currentMonth,
      targetYear: currentYear,
      targetCount: 6,
      currentCount: 4,
      metricLabel: "system architectures",
      status: "IN_PROGRESS",
      keyResults: [
        "Distributed Rate Limiter with Redis Token Bucket & Lua",
        "High-Throughput Distributed Task Queue with Dead Letter Queue",
        "Video Ingestion & CDN Streaming Pipeline (YouTube-scale)",
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Active Pipeline: 5 High-Paying Engineering Opportunities",
      description: "Convert screening calls into final rounds with Vercel, Atlassian, Stripe, and Razorpay.",
      category: "CAREER",
      targetMonth: currentMonth,
      targetYear: currentYear,
      targetCount: 5,
      currentCount: 4,
      metricLabel: "active interviews",
      status: "IN_PROGRESS",
      keyResults: [
        "Clear Vercel Technical Round 1 (Next.js & Systems)",
        "Pass Atlassian System Design & LLD Round",
        "Complete Stripe HackerRank Assessment with 100% test coverage",
      ],
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // 5. My Day Tasks
  await db.collection("tasks").insertMany([
    {
      userId,
      title: "Solve 3 Dynamic Programming problems (Coin Change & Knapsack variations)",
      description: "Implement recursive memoization followed by space-optimized bottom-up tabular DP.",
      priority: "HIGH",
      status: "COMPLETED",
      category: "DSA",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 90,
      actualMinutes: 85,
      tags: ["DP", "LeetCode-Medium", "Knapsack"],
      notes: "State representation: dp[amount] = min(dp[amount], 1 + dp[amount - coin]). Initialized with Infinity.",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Review DBMS Indexing Architecture: B-Trees vs LSM-Trees",
      description: "Compare random read/write trade-offs, write amplification, and compaction algorithms in RocksDB vs Postgres.",
      priority: "HIGH",
      status: "IN_PROGRESS",
      category: "CORE_CS",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 60,
      actualMinutes: 35,
      tags: ["DBMS", "Storage-Engine", "B-Tree", "LSM"],
      notes: "LSM memtable write to WAL -> immutable memtable -> flush to SSTable -> background compaction.",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Design Idempotent Payment API & Webhook Delivery Engine",
      description: "Review atomic Redis distributed locks and unique constraint database transaction rollback strategies.",
      priority: "HIGH",
      status: "TODO",
      category: "SYSTEM_DESIGN",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 60,
      actualMinutes: 0,
      tags: ["System-Design", "Idempotency", "Payments", "Stripe-Prep"],
      notes: "Header: Idempotency-Key. Store status: PENDING -> PROCESSED with TTL.",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Spaced Repetition: LRU Cache & Topological Sort Revision",
      description: "Code LRU Cache from scratch in under 15 minutes with doubly linked list + map.",
      priority: "URGENT",
      status: "TODO",
      category: "REVISION",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 40,
      actualMinutes: 0,
      tags: ["Revision", "Spaced-Repetition", "Linked-List"],
      notes: "Sentinel nodes remove all null checks for head and tail.",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Confirm Vercel Architecture Round slot & prep Next.js 14 notes",
      description: "Review Next.js App Router streaming, React Server Components payload protocol, and Edge Middleware.",
      priority: "MEDIUM",
      status: "TODO",
      category: "APPLICATION",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 30,
      actualMinutes: 0,
      tags: ["Interview-Prep", "Vercel", "Next.js"],
      notes: "Scheduled slot: 8:00 PM IST (10:30 AM EST).",
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // 6. Comprehensive DSA Problems & Spaced Repetition Queue
  const dsaProblems = [
    {
      userId,
      topicName: "Dynamic Programming",
      title: "Coin Change (LC #322)",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/coin-change/",
      difficulty: "MEDIUM",
      status: "SOLVED_INDEPENDENTLY",
      timeComplexity: "O(amount * coins.length)",
      spaceComplexity: "O(amount)",
      approach: "Bottom-up dynamic programming array initialized to amount + 1.",
      notes: "Classical unbounded knapsack variation. Solved in 18 minutes.",
      attemptCount: 2,
      solvedCount: 2,
      revisionCount: 1,
      nextRevisionDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      topicName: "Dynamic Programming",
      title: "Longest Common Subsequence (LC #1143)",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/longest-common-subsequence/",
      difficulty: "MEDIUM",
      status: "SOLVED_INDEPENDENTLY",
      timeComplexity: "O(m * n)",
      spaceComplexity: "O(min(m, n)) space-optimized",
      approach: "2D DP with 2 rolling 1D rows for memory optimization.",
      notes: "If characters match: 1 + dp[i-1][j-1], else max(dp[i-1][j], dp[i][j-1]).",
      attemptCount: 3,
      solvedCount: 2,
      revisionCount: 2,
      nextRevisionDate: todayStr,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      topicName: "Linked Lists",
      title: "LRU Cache (LC #146)",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/lru-cache/",
      difficulty: "MEDIUM",
      status: "SOLVED_INDEPENDENTLY",
      timeComplexity: "O(1) get & put",
      spaceComplexity: "O(capacity)",
      approach: "Doubly Linked List + Hash Map with pseudo-head and pseudo-tail dummy nodes.",
      notes: "Must-know interview question for FAANG and high-concurrency systems.",
      attemptCount: 4,
      solvedCount: 3,
      revisionCount: 3,
      nextRevisionDate: todayStr,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      topicName: "Graphs",
      title: "Course Schedule II (LC #210)",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/course-schedule-ii/",
      difficulty: "MEDIUM",
      status: "SOLVED_INDEPENDENTLY",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V + E)",
      approach: "Kahn's Algorithm (BFS topological sort) tracking in-degrees.",
      notes: "If result.length != numCourses, graph has a cycle (impossible to complete).",
      attemptCount: 2,
      solvedCount: 2,
      revisionCount: 1,
      nextRevisionDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      topicName: "Two Pointers",
      title: "Trapping Rain Water (LC #42)",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/trapping-rain-water/",
      difficulty: "HARD",
      status: "NEEDS_REVISION",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      approach: "Two pointers left and right moving towards center based on max boundary height.",
      notes: "Need to redo without checking notes. Tricky pointer movement condition.",
      attemptCount: 3,
      solvedCount: 1,
      revisionCount: 1,
      nextRevisionDate: todayStr,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      topicName: "Graphs",
      title: "Network Delay Time (LC #743)",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/network-delay-time/",
      difficulty: "MEDIUM",
      status: "SOLVED_WITH_HINTS",
      timeComplexity: "O(E log V) with Min-Heap",
      spaceComplexity: "O(V + E)",
      approach: "Dijkstra's shortest path algorithm using PriorityQueue.",
      notes: "Ensure distance array initialized to infinity and visited set prevents stale queue entries.",
      attemptCount: 2,
      solvedCount: 1,
      revisionCount: 0,
      nextRevisionDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      topicName: "Trees",
      title: "Lowest Common Ancestor of a Binary Tree (LC #236)",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
      difficulty: "MEDIUM",
      status: "SOLVED_INDEPENDENTLY",
      timeComplexity: "O(n)",
      spaceComplexity: "O(h) recursion stack",
      approach: "Post-order recursive traversal returning node when found.",
      notes: "If both left and right return non-null, current node is LCA.",
      attemptCount: 2,
      solvedCount: 2,
      revisionCount: 1,
      nextRevisionDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
  ];

  const insertedProblems = await db.collection("dsaproblems").insertMany(dsaProblems);
  const probMap = insertedProblems.insertedIds;

  // Insert revisions for due items
  const revisionItems = [
    {
      userId,
      problemTitle: "Longest Common Subsequence (LC #1143)",
      topicName: "Dynamic Programming",
      difficulty: "MEDIUM",
      intervalDays: 7,
      iteration: 2,
      scheduledDate: todayStr,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      problemTitle: "LRU Cache (LC #146)",
      topicName: "Linked Lists",
      difficulty: "MEDIUM",
      intervalDays: 21,
      iteration: 3,
      scheduledDate: todayStr,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      problemTitle: "Trapping Rain Water (LC #42)",
      topicName: "Two Pointers",
      difficulty: "HARD",
      intervalDays: 3,
      iteration: 1,
      scheduledDate: todayStr,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
  ];
  await db.collection("revisions").insertMany(revisionItems);

  // 7. Active Job Applications Pipeline
  const applications = [
    {
      userId,
      company: "Vercel",
      role: "Senior Full-Stack Engineer (Platforms)",
      country: "United States",
      city: "San Francisco / Remote",
      workArrangement: "REMOTE",
      employmentType: "FULL_TIME",
      jobUrl: "https://vercel.com/careers",
      currency: "USD",
      salaryMin: 160000,
      salaryMax: 195000,
      salaryNotes: "$175k base + equity options + comprehensive remote perks",
      requiredExperience: "4+ years TypeScript, Next.js internal architecture, distributed systems",
      requiredSkills: ["Next.js", "TypeScript", "Node.js", "Edge Computing", "Serverless Architecture"],
      applicationDate: "2026-10-25",
      status: "TECHNICAL_ROUND",
      resumeVersion: "v2.5_US_Remote_FullStack",
      referralName: "Staff Engineer via GitHub collaboration",
      notes: "Passed screening. Technical interview scheduled on Next.js 14 internals, RSC streaming protocols, and cache invalidation architectures.",
      nextStepDate: todayStr,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      company: "Atlassian",
      role: "Senior Software Engineer (Distributed Backend)",
      country: "India",
      city: "Bengaluru",
      workArrangement: "HYBRID",
      employmentType: "FULL_TIME",
      jobUrl: "https://www.atlassian.com/company/careers",
      currency: "INR",
      salaryMin: 4500000,
      salaryMax: 5500000,
      salaryNotes: "₹48L base + ₹7L bonus + $80k USD RSUs over 4 years",
      requiredExperience: "3-6 years backend engineering",
      requiredSkills: ["Java", "Distributed Systems", "Kafka", "AWS", "PostgreSQL", "Microservices"],
      applicationDate: "2026-10-18",
      status: "INTERVIEW_SCHEDULED",
      resumeVersion: "v2.4_Backend_Enterprise",
      notes: "Cleared Online Assessment (100% on both Graph & DP questions). System Design round scheduled.",
      nextStepDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      company: "Stripe",
      role: "Backend Infrastructure Engineer (Core Payments)",
      country: "United States",
      city: "Global Remote",
      workArrangement: "REMOTE",
      employmentType: "FULL_TIME",
      jobUrl: "https://stripe.com/jobs",
      currency: "USD",
      salaryMin: 155000,
      salaryMax: 185000,
      salaryNotes: "Top-tier global USD remote salary + RSU grant",
      requiredExperience: "3+ years high-reliability systems",
      requiredSkills: ["Go/Java/Node", "REST APIs", "Idempotency", "Database Transactions", "Distributed Systems"],
      applicationDate: "2026-11-02",
      status: "ASSESSMENT",
      resumeVersion: "v2.5_US_Remote_Systems",
      notes: "Completed 90-minute HackerRank coding challenge. Submitted optimal O(n log n) solution.",
      nextStepDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      company: "Razorpay",
      role: "Staff Backend Engineer (Payment Gateway)",
      country: "India",
      city: "Bengaluru / Remote",
      workArrangement: "HYBRID",
      employmentType: "FULL_TIME",
      jobUrl: "https://razorpay.com/careers",
      currency: "INR",
      salaryMin: 4200000,
      salaryMax: 5200000,
      salaryNotes: "₹45L base + Performance bonus + ESOPs",
      requiredExperience: "4+ years high-concurrency transaction processing",
      requiredSkills: ["Go", "Node.js", "Redis", "Kafka", "MySQL", "High Availability"],
      applicationDate: "2026-10-20",
      status: "TECHNICAL_ROUND",
      resumeVersion: "v2.4_Backend",
      notes: "Cleared Low Level Design round (Design Parking Lot with Concurrency). Next: HLD of Payment Router.",
      nextStepDate: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      company: "Supabase",
      role: "Full-Stack Cloud Engineer",
      country: "Global",
      city: "Remote (Async First)",
      workArrangement: "REMOTE",
      employmentType: "FULL_TIME",
      jobUrl: "https://supabase.com/careers",
      currency: "USD",
      salaryMin: 140000,
      salaryMax: 175000,
      salaryNotes: "Fully remote international contractor or employee with stock options",
      requiredExperience: "3+ years Postgres, TypeScript, Cloud architecture",
      requiredSkills: ["PostgreSQL", "TypeScript", "Next.js", "Go", "Docker"],
      applicationDate: "2026-11-05",
      status: "APPLIED",
      resumeVersion: "v2.5_US_Remote_FullStack",
      notes: "Applied with public open-source contribution and portfolio demo.",
      nextStepDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      company: "Swiggy",
      role: "SDE-2 (Logistics Dispatch Platform)",
      country: "India",
      city: "Bengaluru",
      workArrangement: "ONSITE",
      employmentType: "FULL_TIME",
      jobUrl: "https://careers.swiggy.com",
      currency: "INR",
      salaryMin: 3800000,
      salaryMax: 4600000,
      salaryNotes: "₹40L base + Joining Bonus",
      requiredExperience: "2-4 years distributed systems",
      requiredSkills: ["Java", "Golang", "Kafka", "Redis", "Cassandra"],
      applicationDate: "2026-10-12",
      status: "HR_ROUND",
      resumeVersion: "v2.0",
      notes: "Cleared DSA, LLD, and HLD. Final offer discussion with HR and Director of Engineering.",
      nextStepDate: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.collection("jobapplications").insertMany(applications);

  // 8. Scheduled Interviews
  await db.collection("interviews").insertMany([
    {
      userId,
      company: "Vercel",
      role: "Senior Full-Stack Engineer (Platforms)",
      roundName: "Technical Round 1 (System Architecture & Next.js Internals)",
      roundType: "SYSTEM_DESIGN",
      scheduledDate: todayStr,
      scheduledTime: "20:00",
      interviewerInfo: "Staff Software Engineer - Infrastructure",
      topicsTested: ["App Router Streaming Protocols", "RSC Server Serialization", "Edge Cache Invalidation"],
      notes: "Prepare STAR stories regarding low-latency API architectures and memory profiling.",
      status: "SCHEDULED",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      company: "Atlassian",
      role: "Senior Software Engineer (Distributed Backend)",
      roundName: "System Design & Distributed Data",
      roundType: "SYSTEM_DESIGN",
      scheduledDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      scheduledTime: "15:30",
      interviewerInfo: "Principal Engineer, Jira Cloud Architecture",
      topicsTested: ["Distributed Event Streaming", "Database Sharding", "Deadlock Prevention"],
      notes: "Focus on zero-downtime database migration and idempotent Kafka consumer semantics.",
      status: "SCHEDULED",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      company: "Razorpay",
      role: "Staff Backend Engineer (Payment Gateway)",
      roundName: "High Level Design (HLD) of Payment Router",
      roundType: "SYSTEM_DESIGN",
      scheduledDate: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
      scheduledTime: "17:00",
      interviewerInfo: "Engineering Manager - Merchant Experience",
      topicsTested: ["Payment State Machines", "Circuit Breakers (Resilience4j)", "Multi-Bank Failover"],
      notes: "Emphasize 99.999% reliability SLA and sub-100ms routing latency.",
      status: "SCHEDULED",
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // 9. Interview Question Bank
  await db.collection("interviewquestions").insertMany([
    {
      userId,
      question: "How does the Node.js Event Loop handle microtasks vs macrotasks during high asynchronous I/O?",
      category: "NODEJS",
      company: "Vercel / Uber",
      round: "Technical Round 1",
      difficulty: "MEDIUM",
      answerNotes: "Microtasks (process.nextTick, Promise callbacks) run immediately after the currently running script and between every event loop phase (Timers, Poll, Check). Recursively scheduling microtasks causes event loop starvation.",
      keyPoints: [
        "process.nextTick queue executes ahead of Promise microtask queue",
        "Event loop phases: Timers -> Pending I/O -> Poll -> Check (setImmediate) -> Close",
        "Libuv threadpool handles blocking operations (fs, crypto, zlib, dns.lookup)",
      ],
      confidence: "INTERVIEW_READY",
      isWeakTopic: false,
      timesPracticed: 4,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      question: "Design an Idempotent Payment Processing API that handles network drops and retries safely.",
      category: "SYSTEM_DESIGN",
      company: "Stripe / Razorpay",
      round: "System Design",
      difficulty: "HARD",
      answerNotes: "Client attaches an Idempotency-Key UUID header. Backend acquires a Redis distributed lock (SET NX PX) for that key. If key exists with status PENDING, reject duplicate concurrent request (HTTP 409). If completed, return cached response.",
      keyPoints: [
        "Atomic Redis lock prevents race condition check-then-act vulnerabilities",
        "Database stores payment state machine: INITIATED -> PROCESSING -> SUCCESS / FAILED",
        "Webhook retries must also be idempotent using unique event_id",
      ],
      confidence: "INTERVIEW_READY",
      isWeakTopic: false,
      timesPracticed: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      question: "Compare B-Tree vs LSM-Tree storage engines: When would you choose RocksDB/Cassandra over PostgreSQL?",
      category: "DBMS",
      company: "Atlassian / Swiggy",
      round: "Backend Fundamentals",
      difficulty: "MEDIUM",
      answerNotes: "B-Trees perform in-place updates and are optimal for fast point/range reads but suffer write amplification on SSDs. LSM-Trees append to in-memory memtable (RAM) and flush to disk SSTables sequentially, giving orders-of-magnitude higher write throughput.",
      keyPoints: [
        "LSM-Tree compaction (Size-tiered vs Leveled) trades CPU/IO for read optimization",
        "Bloom filters in LSM prevent reading SSTables that do not contain the target key",
        "PostgreSQL (B-Tree) is ideal for relational consistency; Cassandra/RocksDB (LSM) for append-heavy telemetry/chat",
      ],
      confidence: "STRONG",
      isWeakTopic: false,
      timesPracticed: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      question: "Tell me about a time you led the resolution of a high-severity production incident.",
      category: "BEHAVIORAL",
      company: "FAANG / Amazon / Atlassian",
      round: "Leadership / Behavioral (STAR)",
      difficulty: "MEDIUM",
      answerNotes: "Situation: Microservice memory leak triggered OOM crash under 10x traffic spike. Task: Mitigate customer downtime immediately and identify root cause. Action: Scaled container replicas horizontally, captured heap dump, identified unbounded event listener map in WebSocket connection handler, shipped fix with unit test. Result: Zero data loss, reduced memory footprint by 65%, wrote blameless post-mortem.",
      keyPoints: [
        "Focus on fast mitigation (rollback / horizontal scale) before deep debugging",
        "Blameless post-mortem and permanent preventative guardrails",
        "Quantifiable results: metrics, MTTR, memory optimization",
      ],
      confidence: "INTERVIEW_READY",
      isWeakTopic: false,
      timesPracticed: 3,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // 10. Study Sessions (Past 7 Days for Streak & Performance Consistency)
  const pastSessionData = [
    { daysAgo: 6, duration: 210, category: "DSA", title: "Dynamic Programming Knapsack & Interval Patterns" },
    { daysAgo: 5, duration: 180, category: "SYSTEM_DESIGN", title: "Distributed Caching (Redis Cluster, Cache Aside, Write-Through)" },
    { daysAgo: 4, duration: 240, category: "DSA", title: "Graph BFS/DFS & Topological Sort LeetCode Mediums" },
    { daysAgo: 3, duration: 195, category: "CORE_CS", title: "DBMS Indexing, Isolation Levels & MVCC Concurrency" },
    { daysAgo: 2, duration: 225, category: "DEV", title: "Next.js 14 App Router Streaming & Server Actions Architecture" },
    { daysAgo: 1, duration: 250, category: "SYSTEM_DESIGN", title: "High-Throughput Distributed Task Scheduler with Redis" },
    { daysAgo: 0, duration: 160, category: "DSA", title: "Spaced Repetition & Live Technical Round Coding Practice" },
  ];

  for (const s of pastSessionData) {
    const sDate = new Date(Date.now() - s.daysAgo * 86400000).toISOString().split("T")[0];
    await db.collection("studysessions").insertOne({
      userId,
      category: s.category,
      title: s.title,
      durationMinutes: s.duration,
      date: sDate,
      startTime: new Date(Date.now() - s.daysAgo * 86400000 - s.duration * 60000),
      endTime: new Date(Date.now() - s.daysAgo * 86400000),
      notes: "Logged deep preparation study block.",
      createdAt: now,
    });
  }

  // 11. Weekly Reviews (Real Reflective Logs)
  await db.collection("weeklyreviews").insertMany([
    {
      userId,
      year: 2026,
      weekNumber: 45,
      startDate: "2026-11-03",
      endDate: "2026-11-09",
      tasksCompletedCount: 24,
      tasksMissedCount: 2,
      dsaSolvedCount: 16,
      studyHours: 24.5,
      selfRating: 9,
      strugglesSummary: "Felt slightly challenged on DP state formulation for multi-dimensional game theory problems, but cleared concept after drawing decision trees.",
      developmentLearnings: "Deep-dived into Next.js App Router streaming protocols, HTTP/2 multiplexing, and Web Push VAPID notification lifecycles.",
      challengesFaced: "Balancing intense algorithmic problem-solving with full-stack project building. Managed by timeblocking mornings for DSA.",
      prioritiesNextWeek: [
        "Clear Vercel System Design & App Router technical round",
        "Solve 12 Graph & Shortest Path problems (Dijkstra, Bellman-Ford)",
        "Review Core CS DBMS isolation levels (Read Committed vs Repeatable Read)",
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      year: 2026,
      weekNumber: 44,
      startDate: "2026-10-27",
      endDate: "2026-11-02",
      tasksCompletedCount: 21,
      tasksMissedCount: 3,
      dsaSolvedCount: 14,
      studyHours: 21.0,
      selfRating: 8,
      strugglesSummary: "Initial difficulty with Red-Black tree rebalancing rules; reviewed B-Tree equivalence instead.",
      developmentLearnings: "Implemented distributed locking in Redis using Lua scripts with SET NX PX semantics.",
      challengesFaced: "Context switching between asynchronous work and interview preparation.",
      prioritiesNextWeek: [
        "Submit Stripe HackerRank assessment",
        "Complete 3 full-scale system design diagrams in Excalidraw",
        "Maintain 100% on-time revision queue compliance",
      ],
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // 12. Curated Notes & Cheat Sheets
  await db.collection("notes").insertMany([
    {
      userId,
      title: "Distributed Systems & System Design Cheatsheet",
      category: "SYSTEM_DESIGN",
      isPinned: true,
      content: `# Distributed Systems Golden Rules

### 1. CAP & PACELC Trade-offs
- **PACELC**: If Partition (**P**), choose Availability (**A**) or Consistency (**C**); Else (**E**), choose Latency (**L**) or Consistency (**C**).
- **Postgres / MySQL**: PC / EC (Strong consistency, higher latency).
- **Cassandra / DynamoDB**: PA / EL (High write availability, eventual consistency).

### 2. Caching Strategies
- **Cache-Aside**: App reads cache; on miss, reads DB and writes to cache. Standard for read-heavy apps.
- **Write-Through**: App writes to cache, which synchronously writes to DB. Safe, no stale reads.
- **Write-Back (Write-Behind)**: App writes to cache; cache asynchronously writes to DB in batches. Extreme write speed, small data-loss risk on crash.

### 3. Rate Limiting Algorithms
1. **Token Bucket**: Fixed capacity, tokens refill at constant rate. Allows bursts. (AWS, Stripe).
2. **Leaky Bucket**: Requests processed at constant FIFO rate. Smooths out traffic spikes.
3. **Sliding Window Counter**: Balances low memory with accurate window accounting.`,
      tags: ["System-Design", "Distributed-Systems", "Caching", "Architecture"],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "DSA State Transitions & Recurrence Cheatsheet",
      category: "DSA",
      isPinned: true,
      content: `# Dynamic Programming Patterns

### 1. 0/1 Knapsack
\`\`\`ts
// dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]])
// Space-optimized 1D (traverse backwards to prevent reuse):
for (let i = 0; i < n; i++) {
  for (let w = W; w >= wt[i]; w--) {
    dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);
  }
}
\`\`\`

### 2. Unbounded Knapsack (Coin Change)
\`\`\`ts
// Traverse forward so items can be reused:
for (const coin of coins) {
  for (let w = coin; w <= target; w++) {
    dp[w] = Math.min(dp[w], 1 + dp[w - coin]);
  }
}
\`\`\`

### 3. Longest Common Subsequence (LCS)
\`\`\`ts
if (s1[i - 1] === s2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
\`\`\``,
      tags: ["DSA", "DP", "Knapsack", "Cheatsheet"],
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // 13. Curated High-Value Resources
  await db.collection("resources").insertMany([
    {
      userId,
      title: "NeetCode 150 Practice Guide",
      url: "https://neetcode.io/practice",
      category: "DSA",
      tags: ["LeetCode", "NeetCode", "Interview-Prep"],
      description: "Structured practice roadmap grouped by algorithmic archetype.",
      isFavorite: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Designing Data-Intensive Applications (DDIA)",
      url: "https://dataintensive.net/",
      category: "SYSTEM_DESIGN",
      tags: ["Book", "Martin-Kleppmann", "Distributed-Systems"],
      description: "Essential reference for distributed storage, consensus, and fault tolerance.",
      isFavorite: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "ByteByteGo System Design Blog & Newsletter",
      url: "https://blog.bytebytego.com/",
      category: "SYSTEM_DESIGN",
      tags: ["System-Design", "HLD", "Visual-Guides"],
      description: "High-quality visual breakdowns of real-world scale architectures.",
      isFavorite: true,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  console.log(`[DevTrack Injection] Target dataset successfully injected for ${targetName}!`);
  await mongoose.disconnect();
}

injectTargetData().catch((err) => {
  console.error("[DevTrack Injection] Failed:", err);
  process.exit(1);
});
