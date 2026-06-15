export type Experience = {
  company: string;
  role: string;
  location: string;
  period: string;
  highlights: string[];
};

export const experience: Experience[] = [
  {
    company: "Northrop Grumman",
    role: "Software Engineer Intern (Co-op)",
    location: "St. Petersburg, FL",
    period: "Oct 2025 to Present",
    highlights: [
      "Contributed to Java based backend services for an operational readiness platform monitoring military equipment health and fault status, processing 5+ million events per day",
      "Reduced status visibility lag by 24% by migrating from polling-based, batched updates to Kafka based event pipelines that propagate near-real-time equipment health and alert data",
      "Improved Apache Beam and Spark workflows that cut processing latency by 19% by reducing shuffle costs, parallelizing operations, and removing batch boundaries in nearline telemetry processing",
    ],
  },
  {
    company: "Gradual",
    role: "Software Developer Intern",
    location: "San Francisco, CA",
    period: "Aug 2025 to Oct 2025",
    highlights: [
      "Architected AI Agents in Next.js with MCP connections to GitHub, MongoDB, and ClickHouse to query 100GB+ of company events data and to generate charts/graphs using AI SDK",
      "Deployed containerized AI agents and data services to a Kubernetes demo environment, using Deployments and Services to scale to 3 to 5 replicas and enable repeatable execution",
    ],
  },
  {
    company: "Bill",
    role: "Software Engineer Intern",
    location: "San Jose, CA",
    period: "May 2025 to Aug 2025",
    highlights: [
      "Implemented workflow using AWS SQS, Lambda, and API Gateway to resend and resolve over 700 failed webhook subscription events weekly",
      "Improved backend performance by building 6 new REST endpoints in Java (Spring Boot) and boosting query speed by 22% with index-backed lookups, prefix-based queries, and 4 global secondary indexes",
      "Developed React-based subscription querying tool and enhanced GraphQL endpoint with webhook schema integration, saving ~5 hours weekly for developers",
    ],
  },
];
