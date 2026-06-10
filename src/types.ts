export interface MetricIndex {
  scalability: number; // 1-100
  security: number; // 1-100
  decentralization: number; // 1-100
  userCostFriction: number; // 1-100 (high is bad or high is cheap? let's make it 1-100 where higher is better, e.g. "Affordability")
  devFriction: number; // 1-100 where higher is better, i.e. "Ease of Development"
}

export interface EcosystemAnalysis {
  id: string;
  name: string;
  symbol: string;
  logoColor: string;
  majorBottlenecks: string[];
  vulnerabilityIndex: MetricIndex;
  detailedProblems: {
    title: string;
    description: string;
    impact: "CRITICAL" | "HIGH" | "MEDIUM";
    rootCause: string;
  }[];
  revolutionarySolutions: {
    title: string;
    type: "dApp" | "Middleware" | "L2 Rollup" | "L1 Fork";
    summary: string;
    howItWorks: string[];
    technicalGain: string;
    engineCodeLanguage: string;
    engineCodeTitle: string;
    engineCode: string;
  }[];
}

export interface SimulatedTransaction {
  id: string;
  sender: string;
  receiver: string;
  amount: string;
  gasPaid: number;
  status: "MEMPOOL" | "PROCESSING" | "MINED" | "ATTACKED" | "SHIELDED" | "EXPIRED";
  timestamp: string;
  type: "STANDARD" | "MEV_VICTIM" | "MEV_SHIELDED" | "CONGESTED_RETRY" | "ASYNC_HOP";
  logs: string[];
}

export interface ArchitectOutput {
  blockchain: string;
  bottleneckName: string;
  technicalFailureAnalysis: string;
  proposedSolutionName: string;
  proposedSolutionSummary: string;
  architecturalBreakdown: string[];
  engineCodeLanguage: string;
  engineCodeTitle: string;
  engineCodeContent: string;
  securityAuditChecklist: string[];
}
