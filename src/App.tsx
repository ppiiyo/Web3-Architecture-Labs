import React, { useState } from "react";
import EcosystemInsights from "./components/EcosystemInsights";
import TransactionSimulator from "./components/TransactionSimulator";
import ArchitectAI from "./components/ArchitectAI";
import IntentEngine from "./components/IntentEngine";
import { ShieldAlert, Cpu, Sparkles, Terminal, Activity, HelpCircle, Server, Merge } from "lucide-react";

type ActiveTab = "insights" | "simulator" | "architect" | "intents";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("insights");

  // Handle cross-tab selection
  const handleSelectSolutionSim = (solution: any) => {
    // Navigate user to simulator tab automatically
    setActiveTab("simulator");
  };

  return (
    <div className="min-h-screen bg-[#030611] text-slate-100 flex flex-col font-sans relative selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden" id="web3-root-app">
      {/* Absolute high-end neon dark gradient blooms */}
      <div className="absolute top-0 left-1/4 w-[650px] h-[650px] bg-indigo-950/25 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[35%] right-1/12 w-[550px] h-[550px] bg-emerald-950/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-5 left-1/12 w-[700px] h-[700px] bg-purple-950/15 rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Premium Glassmorphism Header */}
      <header className="border-b border-slate-900/60 bg-slate-950/70 backdrop-blur-xl z-20 sticky top-0 shadow-3d-md" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-slate-800/80 rounded-xl shadow-3d-sm glow-indigo">
              <Cpu className="w-6 h-6 text-indigo-400 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-display tracking-tight text-white drop-shadow-sm">
                  Web3 Architecture Labs
                </h1>
                <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                  System Audit Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Comparative Protocol Trilemma Audits • Real-time Threat Simulator • AI Architecture box
              </p>
            </div>
          </div>

          {/* Quick Stats Panel styled as real-time terminal display */}
          <div className="flex items-center gap-5 text-xs font-mono border border-slate-900 bg-slate-950/50 p-2.5 rounded-xl shadow-3d-sm shrink-0" id="protocol-stats">
            <div className="hidden md:block border-r border-slate-900 pr-5">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block">Eth gas:</span>
              <p className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                14 gwei
              </p>
            </div>
            <div className="hidden md:block border-r border-slate-900 pr-5">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block">solana:</span>
              <p className="text-indigo-300 font-bold flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                2,490 tps
              </p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block">vulnerabilities:</span>
              <p className="text-pink-400 font-bold flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400"></span>
                18 audited
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 z-10" id="main-content">
        
        {/* Navigation Tabs bar with premium tactile 3D styling */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900/60 pb-3.5 gap-4" id="tabs-navbar">
          <nav className="flex space-x-2 p-1.5 bg-slate-950/80 border border-slate-900 rounded-xl shadow-3d-md max-w-full overflow-x-auto scrollbar-none" aria-label="Tabs">
            <button
              id="tab-insights"
              onClick={() => setActiveTab("insights")}
              className={`px-4.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 shrink-0 active:translate-y-[1px] ${
                activeTab === "insights"
                  ? "bg-slate-900 border border-slate-800 text-slate-100 shadow-3d-sm border-b-2 border-b-indigo-500/80"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              L1/L2 Comparative Audits
            </button>
            <button
              id="tab-simulator"
              onClick={() => setActiveTab("simulator")}
              className={`px-4.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 shrink-0 active:translate-y-[1px] ${
                activeTab === "simulator"
                  ? "bg-slate-900 border border-slate-800 text-slate-100 shadow-3d-sm border-b-2 border-b-emerald-500/80"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              Web3 Conflict Simulator
            </button>
            <button
              id="tab-architect"
              onClick={() => setActiveTab("architect")}
              className={`px-4.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 shrink-0 active:translate-y-[1px] ${
                activeTab === "architect"
                  ? "bg-slate-900 border border-slate-800 text-slate-100 shadow-3d-sm border-b-2 border-b-pink-500/80"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <Terminal className="w-4 h-4 text-pink-400" />
              AI Protocol Architect Box
            </button>
            <button
              id="tab-intents"
              onClick={() => setActiveTab("intents")}
              className={`px-4.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 shrink-0 active:translate-y-[1px] relative ${
                activeTab === "intents"
                  ? "bg-slate-900 border border-slate-800 text-slate-100 shadow-3d-sm border-b-2 border-b-yellow-500/80"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <Merge className="w-4 h-4 text-yellow-400 animate-spin-slow" />
              Atomic Intent Solver
              <span className="absolute top-1 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            </button>
          </nav>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 pin-border px-3.5 py-2 border border-slate-900 rounded-xl shadow-3d-sm shrink-0 font-mono">
            <Server className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Sandbox Isolation Active</span>
            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-emerald-400 font-bold border border-slate-850">v1.1.2</span>
          </div>
        </div>

        {/* Dynamic Frame Display */}
        {activeTab === "insights" && (
          <section id="section-comparative-insights" className="space-y-6">
            <div className="glass-card-premium p-6 rounded-2xl relative overflow-hidden" id="editorial-problem-statement">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-indigo-400 glow-indigo" /> Executive Problem Statement
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-5xl mt-2.5">
                Blockchains struggle with physical boundaries. Ethereum faces immense <strong className="text-indigo-300">MEV extraction</strong> and gas cost issues; Solana struggles with <strong className="text-emerald-300">re-transmission bottlenecks</strong> and liveness failures under extreme transaction floods; TON faces <strong className="text-sky-300">partial transaction rollbacks</strong> due to asynchronous Actor limits; Bitcoin is limited by non-Turing complete scripts. Below is an exhaustive structural audit mapping trade-offs to revolutionary, implementable protocol and dApp mechanics.
              </p>
            </div>
            <EcosystemInsights onSelectSolution={handleSelectSolutionSim} />
          </section>
        )}

        {activeTab === "simulator" && (
          <section id="section-conflict-simulator">
            <TransactionSimulator />
          </section>
        )}

        {activeTab === "architect" && (
          <section id="section-ai-architect">
            <ArchitectAI />
          </section>
        )}

        {activeTab === "intents" && (
          <section id="section-intent-engine" className="space-y-6">
            <div className="glass-card-premium p-6 rounded-2xl relative overflow-hidden" id="solver-editorial-statement">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <Merge className="w-4.5 h-4.5 text-yellow-500 glow-yellow animate-pulse" /> The Holy Grail: Cross-Chain Intent Solvers (ERC-7683)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-5xl mt-2.5">
                The massive barrier currently holding back public Web3 adoption is <strong className="text-emerald-300">liquidity fragmentation and gas-token requirements</strong> on every new Layer-1/Layer-2 network. Our custom-designed <strong className="text-indigo-300">Atomic Intent Engine</strong> completely abstracts this away: users sign cryptographically bounded intents off-chain, and an open network of Solvers compete to execute outcomes on the target networks on the user's behalf.
              </p>
            </div>
            <IntentEngine />
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 mt-16 text-center text-xs text-slate-500 backdrop-blur" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-medium">© 2026 Web3 Architecture Labs. Structured protocol research suite.</p>
          <div className="flex gap-5 font-mono text-[11px]">
            <a href="#tab-insights" onClick={() => setActiveTab("insights")} className="hover:text-indigo-400 transition-colors">Audits</a>
            <a href="#tab-simulator" onClick={() => setActiveTab("simulator")} className="hover:text-emerald-450 transition-colors">Simulator</a>
            <a href="#tab-architect" onClick={() => setActiveTab("architect")} className="hover:text-pink-400 transition-colors">AI Architect</a>
            <a href="#tab-intents" onClick={() => setActiveTab("intents")} className="hover:text-yellow-450 transition-colors text-yellow-500">Atomic Solver</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

