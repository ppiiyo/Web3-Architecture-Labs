import React, { useState } from "react";
import EcosystemInsights from "./components/EcosystemInsights";
import TransactionSimulator from "./components/TransactionSimulator";
import ArchitectAI from "./components/ArchitectAI";
import { ShieldAlert, Cpu, Sparkles, Terminal, Activity, HelpCircle, Server } from "lucide-react";

type ActiveTab = "insights" | "simulator" | "architect";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("insights");

  // Handle cross-tab selection
  const handleSelectSolutionSim = (solution: any) => {
    // Navigate user to simulator tab automatically
    setActiveTab("simulator");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200" id="web3-root-app">
      {/* Decorative ambient gradient blooms */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-emerald-950/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Global Status Banner / Header */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-xl z-20 sticky top-0" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-slate-900 to-indigo-950 border border-indigo-500/20 rounded-xl">
              <Cpu className="w-5.5 h-5.5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-100">
                  Web3 Architecture Labs
                </h1>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  System Audit Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                L1/L2 Protocol Friction Analysis, Visual State Simulation, and Custom dApp Generation Suite
              </p>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="flex items-center gap-6 text-xs font-mono border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-900" id="protocol-stats">
            <div className="hidden md:block">
              <span className="text-slate-500">Eth Priority Fee:</span>
              <p className="text-emerald-400 font-bold">14 Gwei</p>
            </div>
            <div className="hidden md:block">
              <span className="text-slate-500">Solana Processing:</span>
              <p className="text-emerald-400 font-bold">2,490 TPS</p>
            </div>
            <div>
              <span className="text-slate-500">Active Vulnerabilities Audited:</span>
              <p className="text-indigo-400 font-bold">18 Systems</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 z-10" id="main-content">
        
        {/* Navigation Tabs bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-2.5 gap-4" id="tabs-navbar">
          <nav className="flex space-x-1 p-1 bg-slate-900/60 border border-slate-850 rounded-xl" aria-label="Tabs">
            <button
              id="tab-insights"
              onClick={() => setActiveTab("insights")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "insights"
                  ? "bg-slate-800 text-slate-100 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              L1/L2 Comparative Audits
            </button>
            <button
              id="tab-simulator"
              onClick={() => setActiveTab("simulator")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "simulator"
                  ? "bg-slate-800 text-slate-100 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity className="w-4 h-4" />
              Web3 Conflict Simulator
            </button>
            <button
              id="tab-architect"
              onClick={() => setActiveTab("architect")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "architect"
                  ? "bg-slate-800 text-slate-100 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Terminal className="w-4 h-4" />
              AI Protocol Architect Box
            </button>
          </nav>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/40 px-3 py-1.5 border border-slate-900 rounded-lg">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono">Security Model: Sandbox Isolation v1.0.8</span>
          </div>
        </div>

        {/* Dynamic Frame Display */}
        {activeTab === "insights" && (
          <section id="section-comparative-insights" className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-500/20 p-5 rounded-xl space-y-2">
              <h3 className="text-md font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Executive Problem Statement
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-5xl">
                Blockchains struggle with physical boundaries. Ethereum faces immense <strong>MEV extraction</strong> and gas cost issues; Solana struggles with <strong>re-transmission bottlenecks</strong> and liveness failures under extreme transaction floods; TON faces <strong>partial transaction rollbacks</strong> due to asynchronous Actor limits; Bitcoin is limited by non-Turing complete scripts. Below is an exhaustive structural audit mapping trade-offs to revolutionary, implementable protocol and dApp mechanics.
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

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Web3 Architecture Labs. Structured protocol research suite.</p>
          <div className="flex gap-4">
            <a href="#tab-insights" onClick={() => setActiveTab("insights")} className="hover:text-slate-300">Audits</a>
            <a href="#tab-simulator" onClick={() => setActiveTab("simulator")} className="hover:text-slate-300">Simulator</a>
            <a href="#tab-architect" onClick={() => setActiveTab("architect")} className="hover:text-slate-350">AI Architect</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

