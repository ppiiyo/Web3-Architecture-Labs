import React, { useState } from "react";
import { ecosystemsData } from "../data";
import { EcosystemAnalysis } from "../types";
import { Shield, Zap, Cpu, AlertTriangle, Layers, Terminal, Sparkles, Copy, Check } from "lucide-react";

interface Props {
  onSelectSolution: (solution: any) => void;
}

export default function EcosystemInsights({ onSelectSolution }: Props) {
  const [selectedChain, setSelectedChain] = useState<EcosystemAnalysis>(ecosystemsData[0]);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const getMetricColor = (val: number) => {
    if (val >= 80) return "bg-emerald-500 text-emerald-950 border-emerald-400/30";
    if (val >= 50) return "bg-amber-500 text-amber-950 border-amber-400/30";
    return "bg-rose-500 text-rose-950 border-rose-400/30";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="insights-grid">
      {/* Sidebar: Chain Selection */}
      <div className="lg:col-span-4 space-y-4" id="chain-sidebar">
        <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
          Ecosystem Hub
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3" id="chain-selector-grid">
          {ecosystemsData.map((chain) => {
            const isSelected = selectedChain.id === chain.id;
            return (
              <button
                key={chain.id}
                id={`chain-btn-${chain.id}`}
                onClick={() => setSelectedChain(chain)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? "bg-slate-800/90 border-slate-700 shadow-lg shadow-black/20"
                    : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-750"
                }`}
              >
                {/* Decorative glow */}
                <div
                  className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${chain.logoColor} transition-transform duration-300 ${
                    isSelected ? "scale-y-100" : "scale-y-0 group-hover:scale-y-50"
                  }`}
                />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-100 flex items-center gap-2">
                      {chain.name}
                      <span className="text-xs font-mono px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
                        {chain.symbol}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {chain.majorBottlenecks[0]}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Chain Metrics Radar Emulator */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4" id="vulnerability-index">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-400" />
              Trilemma Tradeoffs
            </h4>
            <span className="text-xs font-mono text-emerald-400">Index Score: 1-100</span>
          </div>

          <div className="space-y-3.5" id="metric-bars">
            {Object.entries(selectedChain.vulnerabilityIndex).map(([key, val]) => {
              const labelMap: Record<string, string> = {
                scalability: "Latency & Throughput (Scalability)",
                security: "Consensus Finality Guarantee (Security)",
                decentralization: "Node Replication Ratio (Decentralization)",
                userCostFriction: "Transaction Affordability (Cost)",
                devFriction: "Developer Assembly Tooling (DX)",
              };

              const pct = val;
              return (
                <div key={key} className="space-y-1" id={`metric-${key}`}>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 capitalize">{labelMap[key]}</span>
                    <span className="text-slate-200 font-bold">{val}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${selectedChain.logoColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content: Deep Bottleneck & Solutions Analysis */}
      <div className="lg:col-span-8 space-y-6" id="chain-main-analysis">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6" id="analysis-summary-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent flex items-center gap-3">
                {selectedChain.name} Network Audit
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Root causes, physical bottlenecks, and micro-architectural trade-offs.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono rounded-full self-start sm:self-auto">
              <AlertTriangle className="w-3.5 h-3.5" />
              Vulnerability Identified
            </div>
          </div>

          {/* Core Problem Details */}
          <div className="mt-6 space-y-4" id="detailed-problems-list">
            {selectedChain.detailedProblems.map((prob, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-850/60 space-y-2 relative group hover:border-slate-800 transition-colors duration-200"
                id={`problem-${idx}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className="text-xs text-rose-400 font-mono flex items-center justify-center w-5 h-5 bg-rose-500/10 border border-rose-500/20 rounded-full">
                      !
                    </span>
                    {prob.title}
                  </h4>
                  <span
                    className={`text-[10px] tracking-wider font-mono uppercase px-2 py-0.5 rounded-full border ${
                      prob.impact === "CRITICAL"
                        ? "bg-rose-500/15 border-rose-500/20 text-rose-400"
                        : "bg-amber-500/15 border-amber-500/20 text-amber-400"
                    }`}
                  >
                    {prob.impact} Impact
                  </span>
                </div>
                <p className="text-sm text-slate-400">{prob.description}</p>
                <div className="text-xs font-mono pt-2 border-t border-slate-900/80 flex flex-wrap gap-x-2 gap-y-1">
                  <span className="text-slate-500">Root Cause:</span>
                  <span className="text-slate-300">{prob.rootCause}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revolutionary Solutions Section */}
        {selectedChain.revolutionarySolutions.map((sol, index) => (
          <div
            key={index}
            className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-6"
            id={`solution-card-${index}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedChain.logoColor} text-white`}>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-100">{sol.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                      {sol.type}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {sol.technicalGain}
                  </p>
                </div>
              </div>

              <button
                id={`run-sim-button-${selectedChain.id}`}
                onClick={() => onSelectSolution(sol)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-950/20 active:opacity-90 cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                Simulate Architecture
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h5 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Innovation Paradigm</h5>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 border border-slate-900 rounded-xl">
                  {sol.summary}
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Execution Mechanism</h5>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4" id="mechanism-steps">
                  {sol.howItWorks.map((step, idx) => (
                    <li
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850 text-xs text-slate-300 relative"
                    >
                      <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-slate-600">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <p className="pr-4 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code Panel */}
              <div className="space-y-2 rounded-xl border border-slate-800 overflow-hidden" id="contract-blueprint-panel">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                  <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-slate-400" />
                    {sol.engineCodeTitle}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                      {sol.engineCodeLanguage}
                    </span>
                    <button
                      id="copy-blueprint-code"
                      onClick={() => handleCopyCode(sol.engineCode, sol.title)}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-100 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedCodeId === sol.title ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] font-mono text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono">Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <pre className="p-4 bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto max-h-[380px] leading-relaxed select-all">
                    <code>{sol.engineCode}</code>
                  </pre>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
