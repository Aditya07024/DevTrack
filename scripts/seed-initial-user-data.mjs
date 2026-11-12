import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI || "mongodb+srv://adityakumar07024_db_user:uFiprHrJ5hQQEDOx@cluster0.plxylon.mongodb.net/devtrack?retryWrites=true&w=majority";

async function seedUserData() {
  console.log("[DevTrack Seed] Connecting to MongoDB Atlas...");
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const userEmail = "adityakumar07024@gmail.com";
  const userName = "Aditya07024";

  // 1. Ensure User Account
  let user = await db.collection("users").findOne({ email: userEmail.toLowerCase() });
  const hashedPassword = await bcrypt.hash("DevTrack2025!", 10);

  if (!user) {
    const res = await db.collection("users").insertOne({
      email: userEmail.toLowerCase(),
      name: userName,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    user = { _id: res.insertedId };
    console.log(`[DevTrack Seed] Created user: ${userEmail}`);
  } else {
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { name: userName, password: hashedPassword, role: "admin", updatedAt: new Date() } }
    );
    console.log(`[DevTrack Seed] Using existing user: ${userEmail} (${user._id})`);
  }

  const userId = user._id;
  const now = new Date();

  // Clean collections for this user so we have a completely fresh slate
  await Promise.all([
    db.collection("usersettings").deleteMany({ userId }),
    db.collection("goals").deleteMany({ userId }),
    db.collection("plans").deleteMany({ userId }),
    db.collection("tasks").deleteMany({ userId }),
    db.collection("dsatopics").deleteMany({}),
    db.collection("dsaproblems").deleteMany({ userId }),
    db.collection("revisions").deleteMany({ userId }),
    db.collection("learningtracks").deleteMany({}),
    db.collection("learningtopics").deleteMany({ userId }),
    db.collection("projects").deleteMany({ userId }),
    db.collection("jobapplications").deleteMany({ userId }),
    db.collection("interviews").deleteMany({ userId }),
    db.collection("interviewquestions").deleteMany({ userId }),
    db.collection("weeklyreviews").deleteMany({ userId }),
    db.collection("studysessions").deleteMany({ userId }),
    db.collection("notes").deleteMany({ userId }),
    db.collection("resources").deleteMany({ userId }),
    db.collection("notifications").deleteMany({ userId }),
  ]);

  console.log("[DevTrack Seed] Reset collections to clean state for user.");

  // ==========================================
  // STEP 1: USER PROFILE & CAREER GOALS
  // ==========================================
  await db.collection("usersettings").insertOne({
    userId,
    targetRole: "Software Engineer / SDE-1 (Full-Stack & Backend)",
    targetCompanyCategory: [
      "Strong Product-Based Companies (India ~₹10–12 LPA)",
      "Engineering-Focused Startups",
      "FAANG & Major Technology Companies",
      "Remote US-Based Software Engineering Roles",
      "Remote International Opportunities (Hiring from India)",
    ],
    careerGoalSummary: "Currently Software Developer at Sparix Global. Dedicated to mastering independent Java DSA problem-solving (4-hour daily office block), deepening full-stack production engineering through company projects, and building solid Core CS & System Design foundations to achieve strong SDE-1 opportunities.",
    dailyStudyHoursTarget: 4.0,
    workingDays: [1, 2, 3, 4, 5, 6],
    timezone: "Asia/Kolkata",
    preferredCurrency: "INR",
    notificationPreferences: {
      dailyReminderTime: "20:00",
      dailyReminderEnabled: true,
      taskDeadlineEnabled: true,
      dsaRevisionEnabled: true,
      weeklyReviewEnabled: true,
      monthlyGoalEnabled: true,
    },
    revisionIntervals: [3, 7, 21],
    createdAt: now,
    updatedAt: now,
  });

  // Current Month Goals (Month 1 — November 2026)
  await db.collection("goals").insertMany([
    {
      userId,
      title: "Establish 4-Hour Daily Java DSA Routine & Solve 45 Foundational Problems",
      description: "Focus on Arrays, Strings, Hashing, Two Pointers, and Binary Search in Java during the 4-hour office study block.",
      category: "DSA",
      targetMonth: 11,
      targetYear: 2026,
      targetCount: 45,
      currentCount: 0,
      metricLabel: "problems",
      status: "IN_PROGRESS",
      keyResults: [
        "Master 2-Pointer and Sliding Window core patterns in Java",
        "Implement custom binary search variations with zero overflow bugs",
        "Maintain 100% compliance with daily DevTrack study logs",
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Document Real-World Sparix Global Engineering Learnings",
      description: "Log non-confidential feature ownership, API designs, bug investigations, and architectural lessons from company projects.",
      category: "DEV",
      targetMonth: 11,
      targetYear: 2026,
      targetCount: 15,
      currentCount: 0,
      metricLabel: "engineering logs",
      status: "IN_PROGRESS",
      keyResults: [
        "Record 1 engineering learning per working day from Sparix Global projects",
        "Assess personal depth across TypeScript, Next.js, and PostgreSQL",
        "Identify and bridge production debugging gaps",
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Master Java Collections Framework & Memory Fundamentals",
      description: "Deep dive into HashMap internals (buckets, collision resolution, load factor) and Java memory layout.",
      category: "CORE_CS",
      targetMonth: 11,
      targetYear: 2026,
      targetCount: 4,
      currentCount: 0,
      metricLabel: "milestones",
      status: "IN_PROGRESS",
      keyResults: [
        "Explain HashMap rehashing and treeification (Java 8+)",
        "Understand Comparator vs Comparable and PriorityQueue mechanics",
        "Complete Week 1 to Week 4 structured weekly reviews",
      ],
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // ==========================================
  // STEP 2: ALL DSA TOPICS & LEARNING TRACKS
  // ==========================================
  const dsaCurriculum = [
    // Stage 1: Foundations
    { name: "Time and Space Complexity", slug: "complexity", category: "PARADIGM", stage: "Stage 1: Foundations", order: 1 },
    { name: "Arrays", slug: "arrays", category: "DATA_STRUCTURE", stage: "Stage 1: Foundations", order: 2 },
    { name: "Strings", slug: "strings", category: "DATA_STRUCTURE", stage: "Stage 1: Foundations", order: 3 },
    { name: "Hashing & Hash Tables", slug: "hashing", category: "DATA_STRUCTURE", stage: "Stage 1: Foundations", order: 4 },
    { name: "Basic Mathematics & Bit Tricks", slug: "math-basics", category: "ALGORITHM", stage: "Stage 1: Foundations", order: 5 },
    { name: "Sorting Algorithms", slug: "sorting", category: "ALGORITHM", stage: "Stage 1: Foundations", order: 6 },
    { name: "Two Pointers", slug: "two-pointers", category: "ALGORITHM", stage: "Stage 1: Foundations", order: 7 },
    { name: "Sliding Window", slug: "sliding-window", category: "ALGORITHM", stage: "Stage 1: Foundations", order: 8 },
    { name: "Binary Search", slug: "binary-search", category: "ALGORITHM", stage: "Stage 1: Foundations", order: 9 },

    // Stage 2: Linear Data Structures
    { name: "Linked Lists", slug: "linked-lists", category: "DATA_STRUCTURE", stage: "Stage 2: Linear Data Structures", order: 10 },
    { name: "Stacks", slug: "stacks", category: "DATA_STRUCTURE", stage: "Stage 2: Linear Data Structures", order: 11 },
    { name: "Queues & Deques", slug: "queues", category: "DATA_STRUCTURE", stage: "Stage 2: Linear Data Structures", order: 12 },
    { name: "Prefix Sums", slug: "prefix-sums", category: "ALGORITHM", stage: "Stage 2: Linear Data Structures", order: 13 },
    { name: "Monotonic Stack & Queue", slug: "monotonic-stack", category: "DATA_STRUCTURE", stage: "Stage 2: Linear Data Structures", order: 14 },

    // Stage 3: Recursion & Search
    { name: "Recursion Fundamentals", slug: "recursion", category: "PARADIGM", stage: "Stage 3: Recursion and Search", order: 15 },
    { name: "Backtracking (Subsets, Permutations)", slug: "backtracking", category: "ALGORITHM", stage: "Stage 3: Recursion and Search", order: 16 },

    // Stage 4: Trees & Heaps
    { name: "Binary Trees & BST", slug: "trees", category: "DATA_STRUCTURE", stage: "Stage 4: Trees and Heaps", order: 17 },
    { name: "Heaps & PriorityQueues", slug: "heaps", category: "DATA_STRUCTURE", stage: "Stage 4: Trees and Heaps", order: 18 },

    // Stage 5: Graphs
    { name: "Graph Representation, BFS & DFS", slug: "graphs-traversal", category: "ALGORITHM", stage: "Stage 5: Graphs", order: 19 },
    { name: "Cycle Detection & Topological Sort", slug: "topological-sort", category: "ALGORITHM", stage: "Stage 5: Graphs", order: 20 },
    { name: "Shortest Paths (Dijkstra)", slug: "dijkstra", category: "ALGORITHM", stage: "Stage 5: Graphs", order: 21 },
    { name: "Disjoint Set Union (DSU) & MST", slug: "dsu-mst", category: "DATA_STRUCTURE", stage: "Stage 5: Graphs", order: 22 },

    // Stage 6: Greedy & Dynamic Programming
    { name: "Greedy Algorithms & Intervals", slug: "greedy", category: "PARADIGM", stage: "Stage 6: Greedy and Dynamic Programming", order: 23 },
    { name: "1D Dynamic Programming", slug: "1d-dp", category: "PARADIGM", stage: "Stage 6: Greedy and Dynamic Programming", order: 24 },
    { name: "2D & Grid Dynamic Programming", slug: "2d-grid-dp", category: "PARADIGM", stage: "Stage 6: Greedy and Dynamic Programming", order: 25 },
    { name: "Knapsack & Subsequence DP", slug: "knapsack-dp", category: "PARADIGM", stage: "Stage 6: Greedy and Dynamic Programming", order: 26 },

    // Stage 7: Advanced Topics
    { name: "Tries", slug: "tries", category: "DATA_STRUCTURE", stage: "Stage 7: Advanced Topics", order: 27 },
    { name: "Bit Manipulation", slug: "bit-manipulation", category: "ALGORITHM", stage: "Stage 7: Advanced Topics", order: 28 },
    { name: "Segment Trees & Fenwick Trees", slug: "segment-trees", category: "DATA_STRUCTURE", stage: "Stage 7: Advanced Topics", order: 29 },
  ];

  await db.collection("dsatopics").insertMany(dsaCurriculum);

  // Learning Tracks
  const tracks = [
    {
      name: "Track A: DSA & Java Problem Solving",
      slug: "dsa-java",
      category: "DSA",
      description: "Dedicated 4-hour daily office routine in Java. 250-300 core problems solved independently with spaced repetition (3, 7, 21 days).",
      order: 1,
    },
    {
      name: "Track B: Practical Software Engineering (Sparix Global & Projects)",
      slug: "practical-dev",
      category: "DEVELOPMENT",
      description: "Production development depth learned through real company projects: Next.js, Node.js, TypeScript, PostgreSQL, Prisma, Redis, Docker, and Linux.",
      order: 2,
    },
    {
      name: "Track C: Core Computer Science & System Design",
      slug: "core-cs-sysdesign",
      category: "CORE_CS",
      description: "Object-Oriented Programming (Java), DBMS (Postgres/Mongo), Operating Systems, Computer Networks, Low-Level Design (LLD), and High-Level Design (HLD).",
      order: 3,
    },
    {
      name: "Track D: Remote & International Job Readiness",
      slug: "remote-readiness",
      category: "CAREER",
      description: "Technical writing, asynchronous collaboration, architecture documentation, resume & GitHub portfolio readiness for Indian & international remote opportunities.",
      order: 4,
    },
  ];
  await db.collection("learningtracks").insertMany(tracks);

  // Learning Topics with real proficiency tracking
  const learningTopics = [
    // Core CS - Java & OOP
    {
      userId,
      trackName: "Track C: Core Computer Science & System Design",
      category: "CORE_CS",
      title: "Java Collections Framework Internals",
      confidence: "MEDIUM",
      status: "IN_PROGRESS",
      subtopics: [
        { title: "HashMap hashing, bucket array, linked list to red-black tree (treeification threshold 8)", completed: false },
        { title: "HashSet mechanics backed by HashMap", completed: false },
        { title: "PriorityQueue Min-Heap array representation and siftUp/siftDown", completed: false },
        { title: "Comparable vs Comparator custom sort contracts", completed: false },
      ],
      notes: "Crucial for Java DSA efficiency and technical interview deep-dives.",
    },
    {
      userId,
      trackName: "Track C: Core Computer Science & System Design",
      category: "CORE_CS",
      title: "Object-Oriented Programming & SOLID Principles",
      confidence: "STRONG",
      status: "IN_PROGRESS",
      subtopics: [
        { title: "Encapsulation, Inheritance, Polymorphism (Runtime vs Compile-time)", completed: true },
        { title: "Abstract classes vs Interfaces (Default and static methods in Java 8+)", completed: true },
        { title: "Single Responsibility & Open/Closed Principle with practical examples", completed: true },
        { title: "Liskov Substitution, Interface Segregation & Dependency Inversion", completed: false },
      ],
      notes: "Focus on clean class boundaries and maintainable design.",
    },
    // Core CS - DBMS
    {
      userId,
      trackName: "Track C: Core Computer Science & System Design",
      category: "CORE_CS",
      title: "Database Management Systems (DBMS) & Indexing",
      confidence: "MEDIUM",
      status: "IN_PROGRESS",
      subtopics: [
        { title: "Relational modeling, Primary Keys, Foreign Keys, Normalization (1NF, 2NF, 3NF, BCNF)", completed: true },
        { title: "B-Trees & B+ Trees: leaf pointer traversal, disk I/O reduction, depth calculation", completed: false },
        { title: "ACID properties, Write-Ahead Logging (WAL) and durability guarantees", completed: false },
        { title: "Transaction isolation levels: Dirty read, Non-repeatable read, Phantom read", completed: false },
        { title: "Query optimization, EXPLAIN ANALYZE, composite indexes, and index selectivity", completed: false },
      ],
      notes: "Applies directly to production PostgreSQL and MongoDB used in Sparix Global projects.",
    },
    // Core CS - Operating Systems
    {
      userId,
      trackName: "Track C: Core Computer Science & System Design",
      category: "CORE_CS",
      title: "Operating Systems Fundamentals",
      confidence: "MEDIUM",
      status: "NOT_STARTED",
      subtopics: [
        { title: "Processes vs Threads, PCB, Context Switching overhead", completed: false },
        { title: "CPU Scheduling algorithms (CFS, Round Robin, Priority)", completed: false },
        { title: "Concurrency, Race Conditions, Critical Section, Mutex vs Semaphore", completed: false },
        { title: "Deadlocks: 4 Coffman conditions, detection, prevention, Banker's Algorithm", completed: false },
        { title: "Virtual Memory, Paging, Page Faults, TLB, Page replacement algorithms", completed: false },
      ],
      notes: "Scheduled for Month 4 (February 2027) in the 12-month blueprint.",
    },
    // Core CS - Computer Networks
    {
      userId,
      trackName: "Track C: Core Computer Science & System Design",
      category: "CORE_CS",
      title: "Computer Networks & Web Protocols",
      confidence: "MEDIUM",
      status: "NOT_STARTED",
      subtopics: [
        { title: "OSI 7 Layers vs TCP/IP 4-Layer Model", completed: false },
        { title: "TCP 3-Way Handshake, 4-Way Teardown, TCP vs UDP comparison", completed: false },
        { title: "HTTP/1.1 vs HTTP/2 (Multiplexing) vs HTTP/3 (QUIC)", completed: false },
        { title: "TLS/HTTPS Handshake (Symmetric vs Asymmetric encryption, Certificates)", completed: false },
        { title: "DNS Resolution lifecycle, CNAME, A records, TTL caching", completed: false },
        { title: "WebSockets, Long Polling, Server-Sent Events (SSE) trade-offs", completed: false },
      ],
      notes: "Scheduled for Month 5 (March 2027) in the 12-month blueprint.",
    },
    // Track B - Development (Sparix Global & Production)
    {
      userId,
      trackName: "Track B: Practical Software Engineering (Sparix Global & Projects)",
      category: "DEVELOPMENT",
      title: "Full-Stack Production Engineering (Next.js & Node.js)",
      confidence: "STRONG",
      status: "IN_PROGRESS",
      subtopics: [
        { title: "Next.js App Router, Server Components vs Client Components, Streaming SSR", completed: true },
        { title: "Node.js Event Loop phases, non-blocking I/O, streams & buffers", completed: true },
        { title: "PostgreSQL & Prisma: schema migrations, connection pooling, complex relations", completed: true },
        { title: "Authentication: JWT, secure httpOnly cookies, refresh token rotation", completed: true },
        { title: "Server management: Linux, PM2 clustering, Nginx reverse proxy, SSL certbot", completed: true },
      ],
      notes: "Refined through company projects (TechMedix, IVF Storage System).",
    },
    // System Design
    {
      userId,
      trackName: "Track C: Core Computer Science & System Design",
      category: "SYSTEM_DESIGN",
      title: "Low-Level Design (LLD) & Object-Oriented Modeling",
      confidence: "MEDIUM",
      status: "NOT_STARTED",
      subtopics: [
        { title: "Design Patterns: Factory, Singleton, Strategy, Observer, Decorator", completed: false },
        { title: "Parking Lot System LLD in Java", completed: false },
        { title: "Splitwise Expense Sharing System LLD in Java", completed: false },
        { title: "Rate Limiter / Notification System LLD", completed: false },
      ],
      notes: "Scheduled for Month 7 (May 2027) in the 12-month blueprint.",
    },
    {
      userId,
      trackName: "Track C: Core Computer Science & System Design",
      category: "SYSTEM_DESIGN",
      title: "High-Level Design (HLD) & Scalable Architecture",
      confidence: "MEDIUM",
      status: "NOT_STARTED",
      subtopics: [
        { title: "Scalability, Vertical vs Horizontal scaling, Load Balancers", completed: false },
        { title: "Caching architectures: Redis, Memcached, Cache-Aside, Write-Through", completed: false },
        { title: "Database Sharding, Partitioning, Replication (Master-Slave vs Multi-Master)", completed: false },
        { title: "Message Brokers: Kafka vs RabbitMQ (Message queues, Pub/Sub, consumer offsets)", completed: false },
        { title: "Design a URL Shortener (TinyURL) & Rate Limiting service", completed: false },
      ],
      notes: "Scheduled for Month 7 & 8 in the 12-month blueprint.",
    },
  ];

  await db.collection("learningtopics").insertMany(learningTopics);

  // ==========================================
  // STEP 3: THE 12 MONTHLY PLANS (Nov 2026 - Oct 2027)
  // ==========================================
  const monthlyPlans = [
    {
      userId,
      type: "MONTHLY",
      title: "Month 1 — DSA Foundations & Consistent 4-Hour Routine",
      description: "Establish dedicated 4-hour office DSA routine in Java. Master Complexity, Arrays, Strings, Hashing, Two Pointers, Sliding Window, and Binary Search.",
      year: 2026,
      month: 11,
      startDate: "2026-11-01",
      endDate: "2026-11-30",
      dsaTargetProblems: 45,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 20, // tracked through real Sparix Global work
      devStudyHoursActual: 0,
      priorities: [
        "Commit to 4-hour daily Java DSA office routine",
        "Master 2 Pointers and Sliding Window patterns",
        "Implement robust Binary Search templates",
        "Log daily Sparix Global project engineering learnings",
        "Establish weekly review habit on Sundays",
      ],
      milestones: [
        { title: "Arrays, Strings, and Hashing core problems (15 problems)", completed: false, dueDate: "2026-11-08" },
        { title: "Two Pointers and Sliding Window pattern mastery (12 problems)", completed: false, dueDate: "2026-11-15" },
        { title: "Binary Search template and variations (10 problems)", completed: false, dueDate: "2026-11-22" },
        { title: "Java Collections internals & first month review (8 problems)", completed: false, dueDate: "2026-11-30" },
      ],
      status: "IN_PROGRESS",
      reviewNotes: "Month 1 kickoff in progress. Focus on pattern intuition over rushing problem counts.",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "MONTHLY",
      title: "Month 2 — Linear Data Structures & Recursion",
      description: "Linked Lists, Stacks, Queues, Deques, Prefix Sums, Monotonic Stacks, Recursion, and Backtracking fundamentals in Java. Structured DBMS revision kickoff.",
      year: 2026,
      month: 12,
      startDate: "2026-12-01",
      endDate: "2026-12-31",
      dsaTargetProblems: 35,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 20,
      priorities: [
        "Master singly and doubly linked list pointer manipulation",
        "Implement stack/queue interview favorites (Min Stack, Valid Parentheses, LRU preview)",
        "Understand monotonic stack pattern for next greater element",
        "Revise DBMS relational schemas, keys, and normalization",
      ],
      milestones: [
        { title: "Linked Lists reversal, cycles, and merge operations", completed: false, dueDate: "2026-12-08" },
        { title: "Stack and Queue applications & Monotonic Stack", completed: false, dueDate: "2026-12-16" },
        { title: "Recursion & Backtracking decision trees", completed: false, dueDate: "2026-12-24" },
        { title: "DBMS SQL queries & Month 2 review", completed: false, dueDate: "2026-12-31" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "MONTHLY",
      title: "Month 3 — Trees, Binary Search Trees & Heaps",
      description: "Binary Trees, BST properties, traversals, LCA, Heaps, and PriorityQueues in Java. DBMS indexes (B-Trees) and SQL performance.",
      year: 2027,
      month: 1,
      startDate: "2027-01-01",
      endDate: "2027-01-31",
      dsaTargetProblems: 35,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 20,
      priorities: [
        "Recursive and iterative tree traversals (Pre, In, Post, Level-order)",
        "BST insert, delete, validate, and LCA logic",
        "Heap building, PriorityQueue in Java, Top K frequent elements pattern",
        "Understand B-Trees and indexing internals in PostgreSQL",
      ],
      milestones: [
        { title: "Tree traversals and height/diameter calculations", completed: false, dueDate: "2027-01-08" },
        { title: "BST operations and Lowest Common Ancestor", completed: false, dueDate: "2027-01-16" },
        { title: "Heaps and PriorityQueue Top-K patterns", completed: false, dueDate: "2027-01-24" },
        { title: "PostgreSQL B-Tree indexing deep-dive & Month 3 review", completed: false, dueDate: "2027-01-31" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "MONTHLY",
      title: "Month 4 — Graphs & Operating Systems",
      description: "Graph representation, BFS, DFS, Connected Components, Cycle Detection, Topological Sort, Shortest Paths (Dijkstra), DSU, and MST in Java. Operating Systems revision.",
      year: 2027,
      month: 2,
      startDate: "2027-02-01",
      endDate: "2027-02-28",
      dsaTargetProblems: 30,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 20,
      priorities: [
        "Build adjacency list representations in Java",
        "Master Kahn's Algorithm for topological sorting",
        "Implement Dijkstra's shortest path with PriorityQueue",
        "Revise Operating Systems processes, threads, synchronization, and deadlocks",
      ],
      milestones: [
        { title: "BFS and DFS traversal patterns on matrices & graphs", completed: false, dueDate: "2027-02-07" },
        { title: "Cycle detection and Topological Sort (Course Schedule)", completed: false, dueDate: "2027-02-14" },
        { title: "Dijkstra algorithm and Disjoint Set Union (DSU)", completed: false, dueDate: "2027-02-21" },
        { title: "OS concurrency & deadlocks + Month 4 review", completed: false, dueDate: "2027-02-28" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "MONTHLY",
      title: "Month 5 — Greedy, Dynamic Programming & Computer Networks",
      description: "Greedy algorithms, intervals, 1D DP, 2D DP, Knapsack, Subsequences, Grid DP, and String DP in Java. Computer Networks fundamentals (HTTP, TCP, TLS, DNS).",
      year: 2027,
      month: 3,
      startDate: "2027-03-01",
      endDate: "2027-03-31",
      dsaTargetProblems: 30,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 20,
      priorities: [
        "Learn systematic DP framework: state, transition, base cases, space optimization",
        "Master 0/1 Knapsack and Unbounded Knapsack patterns",
        "Solve Longest Common Subsequence and Edit Distance variations",
        "Revise TCP 3-way handshake, HTTP/2 multiplexing, and TLS handshake",
      ],
      milestones: [
        { title: "Greedy interval scheduling & 1D DP foundations", completed: false, dueDate: "2027-03-08" },
        { title: "2D and Grid Dynamic Programming patterns", completed: false, dueDate: "2027-03-16" },
        { title: "Knapsack and Subsequence DP mastery", completed: false, dueDate: "2027-03-24" },
        { title: "Computer Networks revision & Month 5 review", completed: false, dueDate: "2027-03-31" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "MONTHLY",
      title: "Month 6 — Advanced DSA, Tries & Core CS Consolidation",
      description: "Advanced DP, Tries, Bit Manipulation, Segment Tree concepts. Comprehensive revision of DBMS, OS, and CN. Identify and bridge weak areas.",
      year: 2027,
      month: 4,
      startDate: "2027-04-01",
      endDate: "2027-04-30",
      dsaTargetProblems: 25,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 20,
      priorities: [
        "Implement Trie prefix tree with insert, search, startsWith",
        "Bitwise operations, XOR tricks, and subset masking",
        "Complete structured revision of all Core CS subjects (DBMS, OS, CN, OOP)",
        "Audit DSA backlog and strengthen weak problem categories",
      ],
      milestones: [
        { title: "Tries and string prefix matching", completed: false, dueDate: "2027-04-08" },
        { title: "Bit manipulation algorithms and optimizations", completed: false, dueDate: "2027-04-16" },
        { title: "Full Core CS mock questionnaire & audit", completed: false, dueDate: "2027-04-24" },
        { title: "Mid-year preparation review & Month 6 consolidation", completed: false, dueDate: "2027-04-30" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "MONTHLY",
      title: "Month 7 — System Design (LLD & HLD) & Production Depth",
      description: "Low-Level Design (SOLID, design patterns, clean class modeling). High-Level Design (scalability, caching, queues, sharding). Production engineering with Docker and CI/CD.",
      year: 2027,
      month: 5,
      startDate: "2027-05-01",
      endDate: "2027-05-31",
      dsaTargetProblems: 20,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 25,
      priorities: [
        "Implement SOLID design patterns in practical Java LLD",
        "Design Parking Lot and Splitwise systems from scratch",
        "Learn HLD building blocks: Load balancers, Redis caching, Kafka queues",
        "Articulate architectural trade-offs with confidence",
      ],
      milestones: [
        { title: "SOLID principles & Creational/Behavioral design patterns", completed: false, dueDate: "2027-05-08" },
        { title: "LLD Case Studies: Parking Lot & Splitwise in Java", completed: false, dueDate: "2027-05-16" },
        { title: "HLD Foundations: TinyURL & Distributed Caching with Redis", completed: false, dueDate: "2027-05-24" },
        { title: "High-level architecture documentation & Month 7 review", completed: false, dueDate: "2027-05-31" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "MONTHLY",
      title: "Month 8 — Interview Readiness & Portfolio Polish",
      description: "Mixed DSA timed assessments, mock interviews, resume refinement, GitHub portfolio documentation, STAR behavioral answers. Begin selective applications.",
      year: 2027,
      month: 6,
      startDate: "2027-06-01",
      endDate: "2027-06-30",
      dsaTargetProblems: 20,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 25,
      priorities: [
        "Take weekly timed 60-minute DSA assessments",
        "Polished READMEs and live demos for TechMedix & IVF Cryobank projects",
        "Craft STAR stories for Sparix Global work impact",
        "Begin selective job applications to suitable SDE-1 / Full-Stack openings",
      ],
      milestones: [
        { title: "Resume v2.0 finalized with quantified engineering achievements", completed: false, dueDate: "2027-06-08" },
        { title: "GitHub portfolio cleanup and architecture documentation", completed: false, dueDate: "2027-06-16" },
        { title: "Behavioral interview preparation (STAR format)", completed: false, dueDate: "2027-06-24" },
        { title: "First wave of selective job applications (5 target companies)", completed: false, dueDate: "2027-06-30" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "MONTHLY",
      title: "Month 9 — Active Applications & Interview Cycle",
      description: "Apply to selected Indian product companies (~₹10–12 LPA) and international remote opportunities. Track application funnel, feedback, and online assessments.",
      year: 2027,
      month: 7,
      startDate: "2027-07-01",
      endDate: "2027-07-31",
      dsaTargetProblems: 20,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 20,
      priorities: [
        "Maintain active CRM tracking for Indian product companies & remote startups",
        "Perform well on company Online Assessments (OA)",
        "Continue daily 1-2 medium problem solving + spaced revisions",
        "Analyze interview feedback and immediately patch knowledge gaps",
      ],
      milestones: [
        { title: "Apply to 10 product-based companies / engineering startups", completed: false, dueDate: "2027-07-10" },
        { title: "Targeted company OA problem practice", completed: false, dueDate: "2027-07-20" },
        { title: "Interview round review & retrospective analysis", completed: false, dueDate: "2027-07-31" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "MONTHLY",
      title: "Month 10 — Technical Communication & Mock Rounds",
      description: "Refine technical communication during live coding and system design rounds. Learn from actual interview feedback and iterate.",
      year: 2027,
      month: 8,
      startDate: "2027-08-01",
      endDate: "2027-08-31",
      dsaTargetProblems: 20,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 20,
      priorities: [
        "Practice thinking out loud and clarifying constraints before coding",
        "Simulate live technical rounds with peers or mock interviewers",
        "Review Sparix Global engineering trade-offs with technical depth",
      ],
      milestones: [
        { title: "3 Full mock technical interviews (DSA + Core CS)", completed: false, dueDate: "2027-08-15" },
        { title: "Review failed problem attempts and edge cases", completed: false, dueDate: "2027-08-31" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "MONTHLY",
      title: "Month 11 — Advanced Preparation & High-Value Targets",
      description: "Target stronger opportunities, deep-dive into role-specific requirements, and demonstrate senior-level independent problem-solving.",
      year: 2027,
      month: 9,
      startDate: "2027-09-01",
      endDate: "2027-09-30",
      dsaTargetProblems: 15,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 20,
      priorities: [
        "Target high-growth startups and global companies hiring from India",
        "Prepare custom system design deep-dives based on company tech stacks",
        "Strengthen asynchronous technical documentation and code review skills",
      ],
      milestones: [
        { title: "Advanced system design mock (Distributed Queue / Notification Engine)", completed: false, dueDate: "2027-09-15" },
        { title: "Targeted applications to tier-1 engineering companies", completed: false, dueDate: "2027-09-30" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "MONTHLY",
      title: "Month 12 — Consolidation & Comprehensive Review",
      description: "Comprehensive evaluation of interview readiness, core CS retention, and development engineering maturity. Plan next career milestones.",
      year: 2027,
      month: 10,
      startDate: "2027-10-01",
      endDate: "2027-10-31",
      dsaTargetProblems: 15,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 20,
      priorities: [
        "Evaluate actual interview readiness using real performance data",
        "Final consolidation of all major DSA patterns and Core CS topics",
        "Review career conversion and decide next stage of engineering progression",
      ],
      milestones: [
        { title: "Comprehensive DSA pattern speed-drill", completed: false, dueDate: "2027-10-15" },
        { title: "12-Month Preparation Retrospective & Career Progression Plan", completed: false, dueDate: "2027-10-31" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.collection("plans").insertMany(monthlyPlans);

  // ==========================================
  // STEP 4: FIRST MONTH'S WEEKLY MILESTONES (Month 1: Nov 2026)
  // ==========================================
  const weeklyPlans = [
    {
      userId,
      type: "WEEKLY",
      title: "Week 1 (Nov 1–7, 2026): Complexity, Arrays & Hashing in Java",
      description: "Establish 4-hour office DSA habit. Focus on Time/Space complexity, Array traversals, HashMap/HashSet lookups in Java, and prefix sums.",
      year: 2026,
      month: 11,
      weekNumber: 45,
      startDate: "2026-11-01",
      endDate: "2026-11-07",
      dsaTargetProblems: 12,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 5,
      priorities: [
        "Clock 4 hours daily of uninterrupted Java DSA practice",
        "Solve 12 foundational array & hashing problems",
        "Master Java HashMap methods (getOrDefault, putIfAbsent, entrySet)",
        "Log 1 Sparix Global engineering learning per working day",
      ],
      milestones: [
        { title: "Time & Space complexity analysis drill", completed: false, dueDate: "2026-11-03" },
        { title: "Array manipulation & Hashing problems in Java", completed: false, dueDate: "2026-11-06" },
        { title: "Sunday Weekly Review #1", completed: false, dueDate: "2026-11-07" },
      ],
      status: "IN_PROGRESS",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "WEEKLY",
      title: "Week 2 (Nov 8–14, 2026): Two Pointers & Sliding Window Patterns",
      description: "Opposite-direction two pointers, same-direction fast/slow pointers, fixed window, and dynamic shrinkable sliding window in Java.",
      year: 2026,
      month: 11,
      weekNumber: 46,
      startDate: "2026-11-08",
      endDate: "2026-11-14",
      dsaTargetProblems: 12,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 5,
      priorities: [
        "Internalize 2-pointer boundary conditions",
        "Master Sliding Window hash table frequency tracking",
        "Execute 3-day spaced repetition for Week 1 problems",
      ],
      milestones: [
        { title: "Two Pointers problem set (Container With Most Water, 3Sum)", completed: false, dueDate: "2026-11-11" },
        { title: "Sliding Window set (Longest Substring Without Repeating Characters)", completed: false, dueDate: "2026-11-14" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "WEEKLY",
      title: "Week 3 (Nov 15–21, 2026): Binary Search Templates & Variations",
      description: "Standard binary search, search in rotated sorted array, search on answer space (monotonically increasing/decreasing condition).",
      year: 2026,
      month: 11,
      weekNumber: 47,
      startDate: "2026-11-15",
      endDate: "2026-11-21",
      dsaTargetProblems: 11,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 5,
      priorities: [
        "Write bug-free binary search without infinite loops",
        "Master lower_bound / first true binary search pattern",
        "Solve Search in Rotated Sorted Array independently",
      ],
      milestones: [
        { title: "Classic Binary Search variations in Java", completed: false, dueDate: "2026-11-18" },
        { title: "Binary Search on Answer Space problems", completed: false, dueDate: "2026-11-21" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      type: "WEEKLY",
      title: "Week 4 (Nov 22–30, 2026): Strings, Java Collections & Monthly Audit",
      description: "String matching, anagrams, palindromes, Java Collections Framework internals (HashMap, PriorityQueue), and Month 1 retrospective.",
      year: 2026,
      month: 11,
      weekNumber: 48,
      startDate: "2026-11-22",
      endDate: "2026-11-30",
      dsaTargetProblems: 10,
      dsaSolvedProblems: 0,
      devStudyHoursTarget: 5,
      priorities: [
        "Deep dive into Java HashMap rehashing & treeification internals",
        "Execute 7-day and 21-day spaced repetitions",
        "Conduct Month 1 review and prepare Month 2 plan",
      ],
      milestones: [
        { title: "String algorithms and character counting arrays", completed: false, dueDate: "2026-11-26" },
        { title: "Month 1 Retrospective & Progress Audit", completed: false, dueDate: "2026-11-30" },
      ],
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.collection("plans").insertMany(weeklyPlans);

  // ==========================================
  // STEP 5: FIRST WEEK'S PROGRESSIVE DAILY TASKS (Week 1 Only!)
  // Exactly 4 structured DSA hours + 1 Sparix Global work learning log
  // ==========================================
  const todayStr = now.toISOString().split("T")[0];

  const firstWeekTasks = [
    // Today's 4-Hour DSA Block
    {
      userId,
      title: "[Office DSA Hour 1] Complexity Analysis & Array Memory Fundamentals",
      description: "Review Big-O formal definitions, cache locality, amortized O(1) ArrayList resizing in Java, and common space pitfalls.",
      priority: "HIGH",
      status: "IN_PROGRESS",
      category: "DSA",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 60,
      actualMinutes: 40,
      tags: ["DSA", "Java", "Complexity", "Hour-1"],
      notes: "Formula: Amortized resizing copy time sum is 1 + 2 + 4 + ... + N = 2N, giving amortized O(1).",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "[Office DSA Hour 2] Java Implementation: Two Sum & Best Time to Buy and Sell Stock",
      description: "Code Two Sum (LC #1) using single-pass HashMap and Stock I (LC #121) using min-price tracking in Java. Analyze edge cases.",
      priority: "HIGH",
      status: "TODO",
      category: "DSA",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 60,
      actualMinutes: 0,
      tags: ["DSA", "Java", "Arrays", "Hour-2"],
      notes: "Ensure HashMap handles duplicate values correctly by checking complement before inserting.",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "[Office DSA Hour 3] Independent Medium Problem: Product of Array Except Self",
      description: "Attempt LC #238. First develop brute force O(n^2), then optimize with prefix and suffix product passes in O(n) time and O(1) extra space.",
      priority: "HIGH",
      status: "TODO",
      category: "DSA",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 60,
      actualMinutes: 0,
      tags: ["DSA", "Java", "Prefix-Sum", "Hour-3"],
      notes: "Solve independently without consulting solution. Track variables carefully.",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "[Office DSA Hour 4] Daily Revision & DevTrack Performance Logging",
      description: "Review solved code snippets, record mistakes in DevTrack question tracker, log study time, and verify tomorrow's 4-hour schedule.",
      priority: "MEDIUM",
      status: "TODO",
      category: "REVISION",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 60,
      actualMinutes: 0,
      tags: ["DSA", "Revision", "Hour-4", "Logging"],
      notes: "Schedule 3-day spaced repetition for Product of Array Except Self.",
      createdAt: now,
      updatedAt: now,
    },
    // Daily Real Work Learning Log (Track B - Sparix Global)
    {
      userId,
      title: "[Work Learning Log] Sparix Global: Production Engineering & Architecture Note",
      description: "Record feature worked on, technical hurdle encountered, solution implemented, and architecture takeaway from company projects.",
      priority: "MEDIUM",
      status: "TODO",
      category: "DEV",
      scheduledDate: todayStr,
      dueDate: todayStr,
      estimatedMinutes: 25,
      actualMinutes: 0,
      tags: ["Sparix-Global", "Work-Log", "Real-World-Engineering"],
      notes: "Keep non-confidential. Focus on architecture decisions, API performance, or database query optimizations.",
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.collection("tasks").insertMany(firstWeekTasks);

  // ==========================================
  // STEP 6: EXISTING REAL PROJECT PORTFOLIO
  // ==========================================
  const realProjects = [
    {
      userId,
      title: "TechMedix",
      description: "Full-stack healthcare platform featuring medicine database management, electronic health records (EHR), OCR medical prescription scanning, and AI-assisted health diagnostics. Runner-up at Agentathon (Tech Navya 2.0).",
      category: "WORK",
      techStack: ["Next.js", "TypeScript", "Node.js", "Express.js", "MongoDB", "OCR", "LLM APIs", "Tailwind CSS"],
      repoUrl: "https://github.com/Aditya07024/TechMedix",
      demoUrl: "",
      startDate: "2024-06-01",
      status: "COMPLETED",
      milestones: [
        { title: "EHR database architecture & REST API implementation", completed: true },
        { title: "OCR integration for automated prescription digitization", completed: true },
        { title: "LLM API integration for clinical summary generation", completed: true },
      ],
      challenges: [
        "Handling noisy OCR output from handwritten medical prescriptions",
        "Ensuring patient data security and compliant record access control",
      ],
      technicalDecisions: [
        "Used MongoDB flexible schema for evolving medical record attributes",
        "Adopted prompt engineering guardrails for clinical safety",
      ],
      keyLearnings: [
        "Practical integration of multimodal AI models into web workflows",
        "End-to-end hackathon project delivery under high time pressure",
      ],
      achievements: [
        "Runner-up at Agentathon (Tech Navya 2.0)",
        "Demonstrated working OCR-to-EHR pipeline to industry judges",
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "IVF Storage Management System",
      description: "Production cryobank inventory and specimen tracking platform for an IVF facility. Automated label reading, secure cold-storage location mapping, and multi-tenant access control.",
      category: "WORK",
      techStack: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Google Cloud Vision OCR", "Gemini AI", "Linux", "Nginx", "PM2"],
      repoUrl: "https://github.com/Aditya07024/IVF-Storage-Management",
      demoUrl: "",
      startDate: "2024-09-01",
      status: "COMPLETED",
      milestones: [
        { title: "PostgreSQL & Prisma relational cryo-tank storage hierarchy", completed: true },
        { title: "Google Cloud Vision OCR integration for cryo-vial barcodes and labels", completed: true },
        { title: "Gemini AI integration for automated specimen classification", completed: true },
        { title: "Production deployment on Linux server with Nginx reverse proxy and PM2", completed: true },
      ],
      challenges: [
        "High-stakes data integrity: a single misplaced cryo-sample has severe medical consequences",
        "Configuring secure production server with SSL, firewall, and zero downtime deployment",
      ],
      technicalDecisions: [
        "Used PostgreSQL with ACID transaction isolation for specimen movement logs",
        "Hardened Nginx with rate limiting and secure headers",
      ],
      keyLearnings: [
        "Hands-on Linux server administration and PM2 cluster management",
        "Building mission-critical software where data consistency is paramount",
      ],
      achievements: [
        "Successfully deployed and actively used in production cryobank operations",
        "Reduced manual specimen logging time by over 70%",
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Outreach AI",
      description: "AI-powered candidate and client outreach automation system featuring a Chrome extension, personalized email workflows, deliverability tracking, and automated response categorization.",
      category: "PERSONAL",
      techStack: ["React.js", "TypeScript", "Node.js", "Chrome Extension API", "REST APIs", "LLM APIs", "MongoDB"],
      repoUrl: "https://github.com/Aditya07024/Outreach-AI",
      demoUrl: "",
      startDate: "2024-08-01",
      status: "COMPLETED",
      milestones: [
        { title: "Chrome Extension for LinkedIn & web profile data extraction", completed: true },
        { title: "Automated personalized email generation using LLM context", completed: true },
        { title: "Webhook delivery and open/reply tracking pipeline", completed: true },
      ],
      challenges: [
        "Adapting Chrome extension content scripts to frequent LinkedIn DOM changes",
        "Managing API rate limits during bulk outreach campaigns",
      ],
      technicalDecisions: [
        "Implemented exponential backoff retry queues for outreach email dispatch",
        "Used local browser storage sync for seamless extension session caching",
      ],
      keyLearnings: [
        "Browser extension architecture and background service workers",
        "Email delivery infrastructure and automated webhook status handling",
      ],
      achievements: [
        "Built working end-to-end automation from browser click to sent email",
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "MyDesignGhar",
      description: "Architectural and interior design consultation marketplace connecting homeowners with verified designers.",
      category: "CLIENT",
      techStack: ["Next.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
      status: "COMPLETED",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "MindVerse",
      description: "Mental wellness and guided journaling web application with sentiment analysis and personalized reflection prompts.",
      category: "PERSONAL",
      techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "NLP"],
      status: "COMPLETED",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Wallet Expense Tracker",
      description: "Personal finance and budget analytics web application with multi-account tracking and categorical expense breakdown.",
      category: "PERSONAL",
      techStack: ["React.js", "Node.js", "MongoDB", "Chart.js"],
      status: "COMPLETED",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Graduate Verification System",
      description: "Tamper-proof academic credential verification portal for educational institutions and recruiters.",
      category: "WORK",
      techStack: ["React.js", "Node.js", "PostgreSQL", "Cryptographic Hashing"],
      status: "COMPLETED",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "VedicAI",
      description: "Conversational knowledge retrieval engine indexing ancient Indian philosophy and literature using vector embeddings and semantic search.",
      category: "PERSONAL",
      techStack: ["Python", "FastAPI", "React.js", "Vector DB", "Embeddings"],
      status: "COMPLETED",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "CheckTalent",
      description: "Technical candidate screening and skill assessment platform with automated evaluation reports.",
      category: "WORK",
      techStack: ["Next.js", "Node.js", "PostgreSQL", "Prisma"],
      status: "COMPLETED",
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.collection("projects").insertMany(realProjects);

  // ==========================================
  // STEP 7: FOUNDATIONAL JAVA DSA PROBLEMS (Starting Set)
  // ==========================================
  const initialProblems = [
    {
      userId,
      topicName: "Arrays",
      title: "Two Sum (LC #1)",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/two-sum/",
      difficulty: "EASY",
      status: "SOLVED_INDEPENDENTLY",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      approach: "Single-pass HashMap in Java storing value to index mapping.",
      notes: "Check if complement exists in map before inserting current number.",
      attemptCount: 1,
      solvedCount: 1,
      revisionCount: 1,
      nextRevisionDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      topicName: "Arrays",
      title: "Best Time to Buy and Sell Stock (LC #121)",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      difficulty: "EASY",
      status: "SOLVED_INDEPENDENTLY",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      approach: "Track minimum price seen so far and maximum potential profit at each step.",
      notes: "Simple single-pass Kadane-like logic.",
      attemptCount: 1,
      solvedCount: 1,
      revisionCount: 0,
      nextRevisionDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.collection("dsaproblems").insertMany(initialProblems);

  // 1 Initial Revision for 3-day spaced repetition
  await db.collection("revisions").insertOne({
    userId,
    problemTitle: "Two Sum (LC #1)",
    topicName: "Arrays",
    difficulty: "EASY",
    intervalDays: 3,
    iteration: 1,
    scheduledDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    status: "PENDING",
    createdAt: now,
    updatedAt: now,
  });

  // ==========================================
  // STEP 8: CURATED RESOURCES & CHEATSHEETS
  // ==========================================
  await db.collection("resources").insertMany([
    {
      userId,
      title: "NeetCode 150 Roadmap (Java Solutions)",
      url: "https://neetcode.io/practice",
      category: "DSA",
      tags: ["Java", "DSA", "LeetCode", "NeetCode"],
      description: "Systematic progressive problem sets grouped by algorithmic archetype.",
      isFavorite: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Striver's A2Z DSA Sheet",
      url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
      category: "DSA",
      tags: ["Striver", "A2Z", "Java", "DSA-Sheet"],
      description: "Comprehensive step-by-step curriculum from basic mathematics to advanced graphs & DP.",
      isFavorite: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Java Collections Framework Architecture (Baeldung)",
      url: "https://www.baeldung.com/java-collections",
      category: "CORE_CS",
      tags: ["Java", "Collections", "OOP", "Baeldung"],
      description: "Deep dive into List, Set, Map, and Queue implementations in Java.",
      isFavorite: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Designing Data-Intensive Applications (DDIA)",
      url: "https://dataintensive.net/",
      category: "SYSTEM_DESIGN",
      tags: ["Book", "Distributed-Systems", "Database-Internals"],
      description: "The gold standard book on data storage, indexing, replication, and consensus.",
      isFavorite: true,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  await db.collection("notes").insertMany([
    {
      userId,
      title: "Java DSA Quick Reference & Syntax Cheatsheet",
      category: "DSA",
      isPinned: true,
      content: `# Java DSA Quick Syntax Cheatsheet

### 1. Primitive Arrays & Lists
\`\`\`java
int[] arr = new int[n];
Arrays.sort(arr);
List<Integer> list = new ArrayList<>();
list.add(10);
list.get(0);
Collections.sort(list);
\`\`\`

### 2. HashMap & HashSet
\`\`\`java
Map<Integer, Integer> map = new HashMap<>();
map.put(key, map.getOrDefault(key, 0) + 1);
map.containsKey(key);

Set<Integer> set = new HashSet<>();
set.add(val);
set.contains(val);
\`\`\`

### 3. Queue & Deque (BFS)
\`\`\`java
Deque<Integer> dq = new ArrayDeque<>(); // Faster than LinkedList
dq.offer(x);
int val = dq.poll();
\`\`\`

### 4. PriorityQueue (Min-Heap / Max-Heap)
\`\`\`java
// Min-Heap (default):
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max-Heap:
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

// Custom Object by property:
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]); // Sort by 2nd element
\`\`\``,
      tags: ["Java", "Syntax", "Cheatsheet", "DSA"],
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      title: "Sparix Global: Daily Work Learning Template",
      category: "DEV",
      isPinned: true,
      content: `# Sparix Global — Engineering Reflection Template

### 1. Feature / Task
- **Module:** [e.g. Next.js API route / PostgreSQL query / UI component]
- **Objective:** [What was required?]

### 2. Technical Encounter
- **Challenge / Bug:** [What issue or unexpected behavior occurred?]
- **Root Cause:** [Why did it happen?]

### 3. Solution & Implementation
- **Fix:** [How was it resolved?]
- **Code or architectural pattern applied:** [e.g. Added index / debounce / transaction]

### 4. Long-term Engineering Takeaway
- [What did I learn that makes me a stronger engineer?]`,
      tags: ["Sparix-Global", "Work-Log", "Template"],
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // Notifications
  await db.collection("notifications").insertOne({
    userId,
    title: "Welcome to DevTrack, Aditya!",
    body: "Your 12-Month Preparation OS is initialized. Your 4-hour office Java DSA block and first week milestones are ready.",
    type: "DAILY_REMINDER",
    link: "/my-day",
    isRead: false,
    createdAt: now,
  });

  console.log("[DevTrack Seed] Successfully initialized DevTrack with authentic 12-Month Plan for Aditya07024!");
  await mongoose.disconnect();
}

seedUserData().catch((err) => {
  console.error("[DevTrack Seed] Error:", err);
  process.exit(1);
});
