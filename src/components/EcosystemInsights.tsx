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
      <div className="lg:col-span-4 space-y-5" id="chain-sidebar">
        <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase font-display">
          Ecosystem Hub
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3.5" id="chain-selector-grid">
          {ecosystemsData.map((chain) => {
            const isSelected = selectedChain.id === chain.id;
            return (
              <button
                key={chain.id}
                id={`chain-btn-${chain.id}`}
                onClick={() => setSelectedChain(chain)}
                className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden group active:translate-y-[1px] cursor-pointer ${
                  isSelected
                    ? "bg-[#0c1630] border-indigo-500/35 shadow-3d-md"
                    : "bg-slate-950/60 border-slate-900 hover:bg-[#0c1630]/30 hover:border-slate-800"
                }`}
              >
                {/* Decorative glow on active item */}
                <div
                  className={`absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b ${chain.logoColor} transition-transform duration-300 ${
                    isSelected ? "scale-y-100" : "scale-y-0 group-hover:scale-y-50"
                  }`}
                />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-100 font-sans flex items-center gap-2">
                      {chain.name}
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-900 border border-slate-850 text-slate-400 rounded">
                        {chain.symbol}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 truncate max-w-[210px] font-medium">
                      {chain.majorBottlenecks[0]}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Chain Metrics Radar Emulator */}
        <div className="glass-card-premium border border-slate-800/85 rounded-2xl p-5.5 space-y-4" id="vulnerability-index">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-display flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400 glow-indigo" />
              Trilemma Tradeoffs
            </h4>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">Score Benchmark</span>
          </div>

          <div className="space-y-4" id="metric-bars">
            {Object.entries(selectedChain.vulnerabilityIndex).map(([key, val]) => {
              const labelMap: Record<string, string> = {
                scalability: "Scalability (Throughput & Latency)",
                security: "Security (Consensus Stability)",
                decentralization: "Decentralization (Node Distribution)",
                userCostFriction: "Cost (Network Fees & Gas)",
                devFriction: "Developer Experience (DX Tooling)",
              };

              const pct = val;
              return (
                <div key={key} className="space-y-1.5" id={`metric-${key}`}>
                  <div className="flex justify-between text-[11px] font-mono font-medium">
                    <span className="text-slate-400">{labelMap[key]}</span>
                    <span className="text-slate-200 font-bold">{val}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden flex border border-slate-900 p-[1px]">
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
      <div className="lg:col-span-8 space-y-5" id="chain-main-analysis">
        <div className="glass-card-premium border border-slate-800/85 rounded-2xl p-6.5" id="analysis-summary-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4.5">
            <div>
              <h2 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2.5">
                {selectedChain.name} Network Audit
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 font-medium">
                Root cause diagnosis, resource bounds, and systemic protocol trade-offs.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10.5px] font-mono font-bold rounded-full self-start sm:self-auto uppercase tracking-wide">
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
              Critical Friction point
            </div>
          </div>

          {/* Core Problem Details */}
          <div className="mt-6 space-y-4" id="detailed-problems-list">
            {selectedChain.detailedProblems.map((prob, idx) => (
              <div
                key={idx}
                className="p-4.5 rounded-xl bg-slate-950/80 border border-slate-900 space-y-2.5 relative group hover:border-slate-800/80 transition-all duration-300 shadow-3d-sm"
                id={`problem-${idx}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-bold text-slate-100 flex items-center gap-2.5">
                    <span className="text-xs text-rose-400 font-mono font-bold flex items-center justify-center w-5.5 h-5.5 bg-rose-500/10 border border-rose-500/20 rounded-full shrink-0">
                      !
                    </span>
                    {prob.title}
                  </h4>
                  <span
                    className={`text-[9.5px] tracking-wider font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      prob.impact === "CRITICAL"
                        ? "bg-rose-500/15 border-rose-500/20 text-rose-400"
                        : "bg-amber-500/15 border-amber-500/20 text-amber-400"
                    }`}
                  >
                    {prob.impact} Impact
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{prob.description}</p>
                <div className="text-[10px] font-mono pt-2.5 border-t border-slate-900/80 flex flex-wrap gap-x-2 gap-y-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Root Cause:</span>
                  <span className="text-indigo-300 font-medium">{prob.rootCause}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revolutionary Solutions Section */}
        {selectedChain.revolutionarySolutions.map((sol, index) => (
          <div
            key={index}
            className="glass-card-premium border border-slate-800/85 rounded-2xl p-6.5 space-y-5.5"
            id={`solution-card-${index}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4.5">
              <div className="flex items-center gap-3.5">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedChain.logoColor} text-white shadow-3d-sm`}>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold font-display text-white">{sol.title}</h3>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 uppercase tracking-widest">
                      {sol.type}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-400 font-mono font-bold mt-1.5 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> {sol.technicalGain}
                  </p>
                </div>
              </div>

              <button
                id={`run-sim-button-${selectedChain.id}`}
                onClick={() => onSelectSolution(sol)}
                className="px-4.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-3d-sm hover:scale-[1.01] active:translate-y-[1px] transition-all cursor-pointer select-none"
              >
                <Terminal className="w-4 h-4 text-emerald-100" />
                Simulate Architecture
              </button>
            </div>

            <div className="space-y-4.5">
              <div className="space-y-2">
                <h5 className="text-[9.5px] uppercase tracking-widest text-slate-400 font-bold font-display">Innovation Paradigm</h5>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#030611] p-4.5 border border-slate-900/60 rounded-xl font-sans">
                  {sol.summary}
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="text-[9.5px] uppercase tracking-widest text-slate-400 font-bold font-display">Execution Mechanism</h5>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4" id="mechanism-steps">
                  {sol.howItWorks.map((step, idx) => (
                    <li
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/50 border border-slate-900/60 text-xs text-slate-300 relative shadow-3d-sm"
                    >
                      <div className="absolute top-3.5 right-3.5 text-[10px] font-mono font-black text-slate-700">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <p className="pr-4 leading-relaxed mt-1 font-sans">{step}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code Panel */}
              <div className="space-y-2 rounded-xl border border-slate-800/80 overflow-hidden shadow-3d-md" id="contract-blueprint-panel">
                <div className="flex items-center justify-between px-4 py-3 bg-[#0d1324] border-b border-slate-800/80">
                  <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-slate-400" />
                    {sol.engineCodeTitle}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono font-bold uppercase bg-slate-950 px-2.5 py-0.5 rounded border border-slate-850 text-slate-400">
                      {sol.engineCodeLanguage}
                    </span>
                    <button
                      id="copy-blueprint-code"
                      onClick={() => handleCopyCode(sol.engineCode, sol.title)}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer select-none"
                    >
                      {copiedCodeId === sol.title ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono uppercase tracking-wider">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <pre className="p-4.5 bg-[#030611] text-slate-300 font-mono text-[11px] overflow-x-auto max-h-[380px] leading-relaxed select-all">
                    <code>{sol.engineCode}</code>
                  </pre>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#030611] to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
