export const DEFAULT_DSA_TOPICS = [
  { name: "Time and Space Complexity", slug: "complexity", category: "PARADIGM", order: 1 },
  { name: "Arrays", slug: "arrays", category: "DATA_STRUCTURE", order: 2 },
  { name: "Strings", slug: "strings", category: "DATA_STRUCTURE", order: 3 },
  { name: "Hashing", slug: "hashing", category: "DATA_STRUCTURE", order: 4 },
  { name: "Two Pointers", slug: "two-pointers", category: "ALGORITHM", order: 5 },
  { name: "Sliding Window", slug: "sliding-window", category: "ALGORITHM", order: 6 },
  { name: "Binary Search", slug: "binary-search", category: "ALGORITHM", order: 7 },
  { name: "Linked Lists", slug: "linked-lists", category: "DATA_STRUCTURE", order: 8 },
  { name: "Stacks", slug: "stacks", category: "DATA_STRUCTURE", order: 9 },
  { name: "Queues", slug: "queues", category: "DATA_STRUCTURE", order: 10 },
  { name: "Recursion", slug: "recursion", category: "PARADIGM", order: 11 },
  { name: "Backtracking", slug: "backtracking", category: "ALGORITHM", order: 12 },
  { name: "Trees", slug: "trees", category: "DATA_STRUCTURE", order: 13 },
  { name: "Binary Search Trees", slug: "binary-search-trees", category: "DATA_STRUCTURE", order: 14 },
  { name: "Heaps", slug: "heaps", category: "DATA_STRUCTURE", order: 15 },
  { name: "Graphs", slug: "graphs", category: "DATA_STRUCTURE", order: 16 },
  { name: "BFS", slug: "bfs", category: "ALGORITHM", order: 17 },
  { name: "DFS", slug: "dfs", category: "ALGORITHM", order: 18 },
  { name: "Dijkstra", slug: "dijkstra", category: "ALGORITHM", order: 19 },
  { name: "Topological Sort", slug: "topological-sort", category: "ALGORITHM", order: 20 },
  { name: "Greedy", slug: "greedy", category: "PARADIGM", order: 21 },
  { name: "Dynamic Programming", slug: "dynamic-programming", category: "PARADIGM", order: 22 },
  { name: "Tries", slug: "tries", category: "DATA_STRUCTURE", order: 23 },
  { name: "Disjoint Set Union", slug: "disjoint-set-union", category: "DATA_STRUCTURE", order: 24 },
  { name: "Bit Manipulation", slug: "bit-manipulation", category: "ALGORITHM", order: 25 },
];

export const DEFAULT_LEARNING_TRACKS = [
  {
    name: "Practical Development",
    slug: "development",
    category: "DEVELOPMENT",
    description: "Production-grade full-stack engineering, clean architecture, databases, and deployment.",
    order: 1,
  },
  {
    name: "Core Computer Science",
    slug: "core-cs",
    category: "CORE_CS",
    description: "Operating Systems, Computer Networks, Database Management Systems, and Object-Oriented Design.",
    order: 2,
  },
  {
    name: "System Design (LLD & HLD)",
    slug: "system-design",
    category: "SYSTEM_DESIGN",
    description: "Scalable distributed systems, caching, microservices, database partitioning, and low-level design.",
    order: 3,
  },
];

export const DEFAULT_DEVELOPMENT_TOPICS = [
  {
    title: "TypeScript & Modern JavaScript",
    category: "DEVELOPMENT",
    subtopics: [
      { title: "Generics, Utility Types & Type Narrowing", completed: true },
      { title: "Event Loop, Microtasks & Promises", completed: true },
      { title: "Memory Management & Closures", completed: false },
    ],
    confidence: "STRONG",
    notes: "Deep dive into JS runtime, V8 engine optimization, and advanced TS types.",
    resources: [{ title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/" }],
  },
  {
    title: "React & Next.js App Router",
    category: "DEVELOPMENT",
    subtopics: [
      { title: "Server vs Client Components & Hydration", completed: true },
      { title: "Route Handlers & Server Actions", completed: true },
      { title: "Streaming, Suspense & Parallel Routes", completed: false },
    ],
    confidence: "INTERVIEW_READY",
    notes: "Mastered Next.js App Router rendering pipeline and optimization.",
    resources: [{ title: "Next.js Docs", url: "https://nextjs.org/docs" }],
  },
  {
    title: "Node.js & Backend Architecture",
    category: "DEVELOPMENT",
    subtopics: [
      { title: "Express/Fastify Middleware Pipeline", completed: true },
      { title: "Error Handling & Centralized Logging", completed: true },
      { title: "Stream Processing & Worker Threads", completed: false },
    ],
    confidence: "INTERMEDIATE",
    notes: "Building reliable modular monoliths with domain-driven modularity.",
    resources: [{ title: "Node.js Best Practices", url: "https://github.com/goldbergyoni/nodebestpractices" }],
  },
  {
    title: "Databases: MongoDB & PostgreSQL",
    category: "DEVELOPMENT",
    subtopics: [
      { title: "Indexing strategies (Compound, Partial, TTL)", completed: true },
      { title: "Aggregation Pipelines vs SQL Joins", completed: true },
      { title: "Transactions & Isolation Levels", completed: false },
    ],
    confidence: "STRONG",
    notes: "Query execution plan analysis (EXPLAIN), B-Tree vs Hash index tradeoffs.",
    resources: [{ title: "Use The Index, Luke", url: "https://use-the-index-luke.com/" }],
  },
  {
    title: "Redis & Caching Strategies",
    category: "DEVELOPMENT",
    subtopics: [
      { title: "Cache Aside, Write-Through, Write-Behind", completed: true },
      { title: "Cache Invalidation & Thundering Herd mitigation", completed: false },
      { title: "Redis Data Structures (HyperLogLog, Sorted Sets)", completed: false },
    ],
    confidence: "INTERMEDIATE",
    notes: "Distributed lock patterns with Redlock, session store, rate limiters.",
    resources: [{ title: "Redis University", url: "https://university.redis.com/" }],
  },
  {
    title: "Docker & Containerization",
    category: "DEVELOPMENT",
    subtopics: [
      { title: "Multi-stage Dockerfiles & image minimization", completed: true },
      { title: "Docker Compose networking & volumes", completed: true },
    ],
    confidence: "INTERMEDIATE",
    notes: "Optimizing layer cache, non-root user execution, Alpine images.",
    resources: [{ title: "Docker Docs", url: "https://docs.docker.com/" }],
  },
  {
    title: "CI/CD & Cloud Deployment",
    category: "DEVELOPMENT",
    subtopics: [
      { title: "GitHub Actions workflows & matrix builds", completed: true },
      { title: "Zero-downtime rolling deploys", completed: false },
    ],
    confidence: "BEGINNER",
    notes: "Automated linting, testing, and preview deployments.",
    resources: [{ title: "GitHub Actions Guide", url: "https://docs.github.com/en/actions" }],
  },
];

export const DEFAULT_CORE_CS_TOPICS = [
  {
    title: "Operating Systems",
    category: "CORE_CS",
    subtopics: [
      { title: "Processes vs Threads & Context Switching", completed: true },
      { title: "CPU Scheduling Algorithms", completed: true },
      { title: "Deadlocks & Banker's Algorithm", completed: true },
      { title: "Virtual Memory, Paging & TLB", completed: false },
    ],
    confidence: "STRONG",
    notes: "Important for senior backend and systems interview rounds.",
    resources: [{ title: "OSTEP Book", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" }],
  },
  {
    title: "Computer Networks",
    category: "CORE_CS",
    subtopics: [
      { title: "TCP 3-Way Handshake & 4-Way Termination", completed: true },
      { title: "TCP Flow Control, Congestion Control & Windowing", completed: true },
      { title: "DNS Resolution Flow & Caching", completed: true },
      { title: "HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)", completed: false },
      { title: "TLS 1.3 Handshake & Symmetric Encryption", completed: false },
    ],
    confidence: "INTERMEDIATE",
    notes: "Crucial for remote US & international company technical rounds.",
    resources: [{ title: "Computer Networks: A Top-Down Approach", url: "https://www.ucg.ac.me/skladiste/blog_10062/objava_20864/fajlovi/Computer_Networking_A_Top-Down_Approach.pdf" }],
  },
  {
    title: "DBMS & SQL Fundamentals",
    category: "CORE_CS",
    subtopics: [
      { title: "ACID Properties & Transaction Isolation", completed: true },
      { title: "Normalization (1NF to BCNF) & Denormalization", completed: true },
      { title: "Concurrency Control & 2-Phase Locking", completed: false },
    ],
    confidence: "STRONG",
    notes: "Deeply tested across product companies and startups.",
    resources: [{ title: "Database System Concepts", url: "https://www.db-book.com/" }],
  },
  {
    title: "Object-Oriented Programming & SOLID",
    category: "CORE_CS",
    subtopics: [
      { title: "Encapsulation, Inheritance, Polymorphism, Abstraction", completed: true },
      { title: "Single Responsibility, Open-Closed Principle", completed: true },
      { title: "Liskov Substitution & Interface Segregation", completed: true },
      { title: "Dependency Inversion & Inversion of Control", completed: true },
    ],
    confidence: "INTERVIEW_READY",
    notes: "Foundation for Low-Level Design (LLD) machine coding interviews.",
    resources: [{ title: "Clean Code / Clean Architecture", url: "https://martinfowler.com/" }],
  },
];

export const DEFAULT_SYSTEM_DESIGN_TOPICS = [
  {
    title: "HLD: Scalability & Load Balancing",
    category: "SYSTEM_DESIGN",
    subtopics: [
      { title: "Horizontal vs Vertical Scaling", completed: true },
      { title: "Layer 4 vs Layer 7 Load Balancing (Nginx, Envoy)", completed: true },
      { title: "Consistent Hashing & Virtual Nodes", completed: true },
    ],
    confidence: "STRONG",
    notes: "Standard building blocks for high-throughput distributed systems.",
    resources: [{ title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }],
  },
  {
    title: "HLD: Database Scaling & Partitioning",
    category: "SYSTEM_DESIGN",
    subtopics: [
      { title: "Replication (Master-Slave, Multi-Master)", completed: true },
      { title: "Sharding Strategies (Range, Hash, Directory)", completed: true },
      { title: "CAP Theorem & PACELC Theorem", completed: true },
    ],
    confidence: "INTERVIEW_READY",
    notes: "Tradeoffs between consistency and availability under partition.",
    resources: [{ title: "Designing Data-Intensive Applications", url: "https://dataintensive.net/" }],
  },
  {
    title: "HLD: Message Queues & Event-Driven Architecture",
    category: "SYSTEM_DESIGN",
    subtopics: [
      { title: "Kafka vs RabbitMQ architecture and semantics", completed: true },
      { title: "At-least-once, At-most-once, Exactly-once delivery", completed: false },
      { title: "Dead Letter Queues & Consumer Lag monitoring", completed: false },
    ],
    confidence: "INTERMEDIATE",
    notes: "Decoupling microservices and handling traffic spikes.",
    resources: [{ title: "Kafka Architecture Guide", url: "https://kafka.apache.org/documentation/" }],
  },
  {
    title: "LLD: Classic Design Patterns",
    category: "SYSTEM_DESIGN",
    subtopics: [
      { title: "Creational: Factory, Builder, Singleton", completed: true },
      { title: "Structural: Adapter, Decorator, Facade", completed: true },
      { title: "Behavioral: Strategy, Observer, Command", completed: true },
    ],
    confidence: "INTERVIEW_READY",
    notes: "Frequently asked in machine coding rounds (e.g. Rate Limiter, Parking Lot, Splitwise).",
    resources: [{ title: "Refactoring Guru: Design Patterns", url: "https://refactoring.guru/design-patterns" }],
  },
];

