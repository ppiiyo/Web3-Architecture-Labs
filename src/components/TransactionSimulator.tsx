import React, { useState, useEffect } from "react";
import { Play, RotateCcw, AlertTriangle, ShieldCheck, Zap, Layers, Terminal, ChevronRight, User, RefreshCw } from "lucide-react";
import { SimulatedTransaction } from "../types";

export default function TransactionSimulator() {
  const [activeScenario, setActiveScenario] = useState<"MEV" | "SOL_CONGESTION" | "TON_ASYNC">("MEV");
  const [useShield, setUseShield] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0); // 0 = Idle, 1 = Mempool/Broadcaster, 2 = Processing/Ordering, 3 = Mined/Settled
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [history, setHistory] = useState<SimulatedTransaction[]>([]);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [blockHeight, setBlockHeight] = useState<number>(18293109);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Stop simulation on scenario change
  useEffect(() => {
    resetSimulation();
  }, [activeScenario, useShield]);

  const resetSimulation = () => {
    setStep(0);
    setProgressPercent(0);
    setSimLogs([]);
    setIsSimulating(false);
  };

  const executeSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setStep(1);
    setProgressPercent(15);
    setBlockHeight((h) => h + 1);

    const logs: string[] = [];
    const log = (msg: string) => {
      logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
      setSimLogs([...logs]);
    };

    if (activeScenario === "MEV") {
      log("Initiating $50,000 WETH/USDT Swap request...");
      if (useShield) {
        log("MEV-Shield Activated: Routing transactions through Flashbots Direct RPC bundle...");
        setTimeout(() => {
          setStep(2);
          setProgressPercent(50);
          log("Broadcasting cryptographically committed bundle. Bypassing public Geth mempool.");
          log("Proposer validates bundle execution atoms. Arbitrage shield validated.");
          
          setTimeout(() => {
            setStep(3);
            setProgressPercent(100);
            log("Transaction successfully integrated in block directly. Target execution safe.");
            log("Slippage loss: $0.00 | Retained absolute asset value.");
            setIsSimulating(false);
            
            // Add to history
            setHistory((prev) => [
              {
                id: `tx-0x${Math.random().toString(16).slice(2, 10)}`,
                sender: "Alice (0x71C...)",
                receiver: "USDT Pool (0x3Df...)",
                amount: "15.4 WETH ($50,000)",
                gasPaid: 0.0042,
                status: "SHIELDED",
                type: "MEV_SHIELDED",
                timestamp: new Date().toLocaleTimeString(),
                logs: [...logs],
              },
              ...prev,
            ]);
          }, 1500);
        }, 1500);
      } else {
        log("Mempool Breach Warning: Transaction broadcasted to public peer-to-peer mempool.");
        setTimeout(() => {
          setStep(2);
          setProgressPercent(50);
          log("MEV bot 0xArbitrageur detected pending swap value high threshold!");
          log("MEV Warning: Frontrunning transaction inserted! Gas price bid increased high (+120 Gwei).");
          log("MEV Warning: Backrun swap pending immediately after user's slot.");
          
          setTimeout(() => {
            setStep(3);
            setProgressPercent(100);
            log("Transaction processed. High Slippage triggered.");
            log("Result: User bought WETH at inflated price. MEV bot pocketed profit of $850.50.");
            setIsSimulating(false);
            
            setHistory((prev) => [
              {
                id: `tx-0x${Math.random().toString(16).slice(2, 10)}`,
                sender: "Alice (0x71C...)",
                receiver: "USDT Pool (0x3Df...)",
                amount: "15.4 WETH ($49,150 delivered)",
                gasPaid: 0.0215,
                status: "ATTACKED",
                type: "MEV_VICTIM",
                timestamp: new Date().toLocaleTimeString(),
                logs: [...logs],
              },
              ...prev,
            ]);
          }, 1500);
        }, 1500);
      }
    } else if (activeScenario === "SOL_CONGESTION") {
      log("Submitting transaction payload to hot NFT candy machine program...");
      if (useShield) {
        log("Aura Priority Overlay active. Evaluating user history and lock allocations...");
        log("Evaluating account reputation rating: 92/100 (Safe actor).");
        setTimeout(() => {
          setStep(2);
          setProgressPercent(60);
          log("Assigning transaction to Reserved Priority slot lane...");
          log("Dynamic fee adjusted: +0.00005 SOL priority supplement.");
          
          setTimeout(() => {
            setStep(3);
            setProgressPercent(100);
            log("Block confirmation success. Executed inside first slot with 400ms finality.");
            setIsSimulating(false);
            
            setHistory((prev) => [
              {
                id: `${Math.random().toString(36).slice(2, 10)}...Aura`,
                sender: "Alice",
                receiver: "Minter v3 Program",
                amount: "1.0 SOL",
                gasPaid: 0.000055,
                status: "MINED",
                type: "STANDARD",
                timestamp: new Date().toLocaleTimeString(),
                logs: [...logs],
              },
              ...prev,
            ]);
          }, 1500);
        }, 1500);
      } else {
        log("Broadcasting generic transaction via public QUIC validators...");
        setTimeout(() => {
          setStep(2);
          setProgressPercent(40);
          log("Validator queue full. QUIC buffer overflow detected.");
          log("Network Packet lost: Tx dropped. Retry sequence 1, 2, 3 triggered...");
          
          setTimeout(() => {
            setStep(3);
            setProgressPercent(100);
            log("Fatal Error: Blockhash expired. Client timed out.");
            setIsSimulating(false);
            
            setHistory((prev) => [
              {
                id: `${Math.random().toString(36).slice(2, 10)}...Spam`,
                sender: "Alice",
                receiver: "Minter v3 Program",
                amount: "0 SOL (Failed)",
                gasPaid: 0,
                status: "EXPIRED",
                type: "CONGESTED_RETRY",
                timestamp: new Date().toLocaleTimeString(),
                logs: [...logs],
              },
              ...prev,
            ]);
          }, 1500);
        }, 1500);
      }
    } else if (activeScenario === "TON_ASYNC") {
      log("Alice dispatches 100 TON asynchronous saga transfer to recipient Bob...");
      if (useShield) {
        log("T-Saga Guardian Active. Instantiating secure Escrow custody stage...");
        setTimeout(() => {
          setStep(2);
          setProgressPercent(55);
          log("Stage 1 complete: Funds deposited in escrow. Forwarding verification call...");
          log("System Alert: Bob contract balance low. Recipient rent starvation triggered.");
          log("State confirmation failed. Execution timed out (Expired block range reached).");
          log("Saga Guard triggered Rollback path: Refunding 100 TON to Alice securely.");
          
          setTimeout(() => {
            setStep(3);
            setProgressPercent(100);
            log("Escrow contract closed. Alice received full rollback refund. Security preserved.");
            setIsSimulating(false);
            
            setHistory((prev) => [
              {
                id: `saga-usr-${Math.random().toString(10).slice(2, 7)}`,
                sender: "Alice (EQCv...)",
                receiver: "Saga Escrow (EQDx...)",
                amount: "100 TON Rollback",
                gasPaid: 0.015,
                status: "SHIELDED",
                type: "ASYNC_HOP",
                timestamp: new Date().toLocaleTimeString(),
                logs: [...logs],
              },
              ...prev,
            ]);
          }, 1500);
        }, 1500);
      } else {
        log("Direct asynchronous transfer dispatched. No middleware coordinator.");
        setTimeout(() => {
          setStep(2);
          setProgressPercent(50);
          log("Direct Stage 1: Contract registers balance subtracted from Alice.");
          log("System Alert: Destination actor Bob rejects receipt due to balance-exhausted rent limits!");
          log("Asynchronous message dropped. Alice remains with 100 TON balance subtracted.");
          log("Critical Defect: Alice balance deducted but Bob did not receive credit. No automatic rollback active.");
          
          setTimeout(() => {
            setStep(3);
            setProgressPercent(100);
            log("Simulation completed with state desynchronization. 100 TON locked in async limbo.");
            setIsSimulating(false);
            
            setHistory((prev) => [
              {
                id: `async-err-${Math.random().toString(10).slice(2, 7)}`,
                sender: "Alice (EQCv...)",
                receiver: "Bob (EQA7...)",
                amount: "100 TON (Stuck)",
                gasPaid: 0.009,
                status: "ATTACKED",
                type: "MEV_VICTIM",
                timestamp: new Date().toLocaleTimeString(),
                logs: [...logs],
              },
              ...prev,
            ]);
          }, 1500);
        }, 1500);
      }
    }
  };

  return (
    <div className="glass-card-premium border border-slate-800/85 rounded-2xl p-6.5 space-y-6 shadow-3d-lg" id="simulator-card">
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between border-b border-slate-900 pb-5 gap-5">
        <div>
          <h3 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400 glow-emerald" />
            Dynamic Web3 Crisis Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Witness the real mechanics of blockchain execution bottlenecks and how revolutionary designs mitigate them.
          </p>
        </div>
        <div className="flex bg-[#030611] p-1 border border-slate-900/80 rounded-xl max-w-full overflow-x-auto shrink-0 shadow-3d-inner">
          <button
            id="scenario-mev-btn"
            onClick={() => setActiveScenario("MEV")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap active:translate-y-[0.5px] ${
              activeScenario === "MEV" ? "bg-slate-900 text-white border border-slate-800 shadow-3d-sm" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Ethereum: MEV Sandwich
          </button>
          <button
            id="scenario-sol-btn"
            onClick={() => setActiveScenario("SOL_CONGESTION")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap active:translate-y-[0.5px] ${
              activeScenario === "SOL_CONGESTION" ? "bg-slate-900 text-white border border-slate-800 shadow-3d-sm" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Solana: QUIC Spam
          </button>
          <button
            id="scenario-ton-btn"
            onClick={() => setActiveScenario("TON_ASYNC")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap active:translate-y-[0.5px] ${
              activeScenario === "TON_ASYNC" ? "bg-slate-900 text-white border border-slate-800 shadow-3d-sm" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            TON: Async Rollback
          </button>
        </div>
      </div>

      {/* Simulator Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="sim-body">
        {/* Play-Control Left Panel */}
        <div className="lg:col-span-4 space-y-5" id="sim-controls">
          <div className="bg-[#030611] p-4.5 border border-slate-905 rounded-2xl space-y-4 shadow-3d-sm">
            <h4 className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-widest border-b border-slate-900 pb-2">
              Simulation Parameters
            </h4>

            {activeScenario === "MEV" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Observe standard swap routing in WETH/USDT where public mempools alert sandwich bot relays versus Flashbots commit-reveal RPC routing.
                </p>
                <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-900 rounded-xl shadow-3d-inner">
                  <span className="text-xs font-bold text-slate-200">Activate MEV-Shield</span>
                  <input
                    type="checkbox"
                    id="shield-checkbox"
                    checked={useShield}
                    onChange={(e) => setUseShield(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded bg-slate-850 border-slate-700 cursor-pointer focus:ring-0 focus:ring-offset-0"
                  />
                </div>
              </div>
            )}

            {activeScenario === "SOL_CONGESTION" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Observe high QUIC validator drop-out under hot mint spamming vs a local fame-weighted Priority Slot Lane middleware.
                </p>
                <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-900 rounded-xl shadow-3d-inner">
                  <span className="text-xs font-bold text-slate-200">Enable Aura Priority</span>
                  <input
                    type="checkbox"
                    id="shield-checkbox"
                    checked={useShield}
                    onChange={(e) => setUseShield(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded bg-slate-850 border-slate-700 cursor-pointer focus:ring-0 focus:ring-offset-0"
                  />
                </div>
              </div>
            )}

            {activeScenario === "TON_ASYNC" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Observe what happens when an asynchronous transfer destination contract fails: balance stuck vs T-Saga Escrow automatically returning funds.
                </p>
                <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-900 rounded-xl shadow-3d-inner">
                  <span className="text-xs font-bold text-slate-200">Deploy T-Saga Router</span>
                  <input
                    type="checkbox"
                    id="shield-checkbox"
                    checked={useShield}
                    onChange={(e) => setUseShield(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded bg-slate-850 border-slate-700 cursor-pointer focus:ring-0 focus:ring-offset-0"
                  />
                </div>
              </div>
            )}

            <div className="pt-1.5">
              <button
                id="start-sim-btn"
                disabled={isSimulating}
                onClick={executeSimulation}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all transform active:translate-y-[1px] cursor-pointer shadow-3d-sm ${
                  isSimulating
                    ? "bg-slate-900 border-slate-850 text-slate-500 cursor-not-allowed"
                    : "bg-emerald-600 hover:from-emerald-500 hover:to-emerald-600 hover:scale-[1.01] text-white bg-gradient-to-b from-emerald-500 to-emerald-700 border-emerald-500/30"
                }`}
              >
                {isSimulating ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                    Executing Nodes...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <Play className="w-4 h-4 text-emerald-100 fill-current" />
                    Launch Transaction
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Block Status Monitor */}
          <div className="bg-[#030611] p-4.5 border border-slate-905 rounded-xl space-y-3 shadow-3d-sm">
            <h4 className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-widest border-b border-slate-900 pb-2">
              Consensus Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3 pb-1 text-[11px] font-mono">
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[9px]">L1 Block</p>
                <p className="text-slate-200 font-bold mt-0.5">#{blockHeight}</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[9px]">Latency</p>
                <p className="text-slate-200 font-bold mt-0.5">
                  {activeScenario === "SOL_CONGESTION" ? "405ms" : "12.04s"}
                </p>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[9px]">Mempool size</p>
                <p className="text-slate-200 font-bold mt-0.5">
                  {activeScenario === "MEV" ? "1,842 txs" : "0 (Direct)"}
                </p>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[9px]">Security Guard</p>
                <p className="font-bold mt-0.5 text-emerald-400">
                  {useShield ? "Shield Enabled" : "Bypassed"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Graph Middle Panel */}
        <div className="lg:col-span-8 flex flex-col gap-5" id="sim-timeline">
          {/* Progress Timeline Pipeline */}
          <div className="bg-[#030611] border border-slate-900 rounded-2xl p-5.5 relative overflow-hidden flex-1 flex flex-col justify-between min-h-[300px] shadow-3d-sm">
            {/* Background absolute graph grids */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#050b1c_1px,transparent_1px),linear-gradient(to_bottom,#050b1c_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-75" />

            <div className="relative flex items-center justify-between text-xs font-mono border-b border-slate-900 pb-3 z-10">
              <span className="text-slate-400 font-bold flex items-center gap-1.5 uppercase text-[10px] tracking-wide">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Live State Machine Graph
              </span>
              <span className="text-[10px] font-black font-mono px-2 py-0.5 border border-slate-800 rounded bg-[#070e24] text-indigo-300">
                STATE {step}/3
              </span>
            </div>

            {/* Visual Steps representation */}
            <div className="relative my-6 grid grid-cols-3 gap-4.5 z-10" id="step-visualizer">
              {/* Step 1 */}
              <div
                className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2.5 transition-all duration-300 shadow-3d-sm ${
                  step >= 1
                    ? "bg-blue-950/20 border-blue-500/35 text-blue-300"
                    : "bg-slate-950/30 border-slate-900/60 text-slate-600"
                }`}
              >
                <div
                  className={`w-7.5 h-7.5 rounded-full font-bold flex items-center justify-center text-xs border transition-all ${
                    step >= 1 ? "bg-blue-500 text-blue-950 border-blue-400 shadow-glow" : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  1
                </div>
                <span className="text-[11px] font-bold">Broadcaster queue</span>
                <span className="text-[9.5px] text-slate-500 leading-tight">Initial dynamic entry payload</span>
              </div>

              {/* Step 2 */}
              <div
                className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2.5 transition-all duration-300 shadow-3d-sm ${
                  step >= 2
                    ? useShield
                      ? "bg-emerald-950/20 border-emerald-500/35 text-emerald-300"
                      : "bg-rose-950/20 border-rose-500/35 text-rose-300"
                    : "bg-slate-950/30 border-slate-900/60 text-slate-600"
                }`}
              >
                <div
                  className={`w-7.5 h-7.5 rounded-full font-bold flex items-center justify-center text-xs border transition-all ${
                    step >= 2
                      ? useShield
                        ? "bg-emerald-500 text-emerald-950 border-emerald-400"
                        : "bg-rose-500 text-rose-950 border-rose-400"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  2
                </div>
                <span className="text-[11px] font-bold">Consensus sorting</span>
                <span className="text-[9.5px] text-slate-500 leading-tight">Transaction header evaluation</span>
              </div>

              {/* Step 3 */}
              <div
                className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2.5 transition-all duration-300 shadow-3d-sm ${
                  step >= 3
                    ? useShield
                      ? "bg-emerald-950/30 border-emerald-500/35 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/35 text-rose-400"
                    : "bg-slate-950/30 border-slate-900/60 text-slate-600"
                }`}
              >
                <div
                  className={`w-7.5 h-7.5 rounded-full font-bold flex items-center justify-center text-xs border transition-all ${
                    step >= 3
                      ? useShield
                        ? "bg-emerald-505 text-[#030611] border-emerald-400"
                        : "bg-rose-505 text-[#030611] border-rose-400"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  3
                </div>
                <span className="text-[11px] font-bold">Settled transaction</span>
                <span className="text-[9.5px] text-slate-500 leading-tight">Cryptographic commitment proof</span>
              </div>
            </div>

            {/* Simulated Live Log Screen */}
            <div className="bg-[#01040d] border border-slate-900/80 rounded-xl p-4.5 font-mono text-[10.5px] leading-relaxed max-h-[140px] overflow-y-auto space-y-1.5 shadow-3d-inner">
              {simLogs.length === 0 ? (
                <p className="text-slate-600 italic">No Simulation Running. Trigger the "Launch Transaction" button to evaluate active nodes.</p>
              ) : (
                simLogs.map((log, idx) => {
                  let colorClass = "text-slate-400";
                  if (log.includes("Warning") || log.includes("Error") || log.includes("vulnerability") || log.includes("sandwiched") || log.includes("Defect")) {
                    colorClass = "text-rose-400 font-bold";
                  } else if (log.includes("Shield") || log.includes("Successfully") || log.includes("safe") || log.includes("Atomic") || log.includes("refund") || log.includes("retained") || log.includes("Rollback")) {
                    colorClass = "text-emerald-450 font-bold";
                  }
                  return (
                    <div key={idx} className={colorClass}>
                      {log}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Historical Tx Log table */}
          {history.length > 0 && (
            <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-4.5 space-y-3 shadow-3d-inner" id="sim-history">
              <h4 className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-widest">
                Simulation History Feed
              </h4>
              <div className="overflow-x-auto max-h-[140px] text-xs font-mono">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-500 text-[10px] uppercase tracking-wider">
                      <th className="pb-2">Transaction ID</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Amount / Gas Paid</th>
                      <th className="pb-2 text-right">Shield Protection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/40 text-slate-300">
                    {history.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-900/20">
                        <td className="py-2.5 font-bold text-slate-200">{tx.id}</td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                              tx.status === "SHIELDED"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-2.5">
                          {tx.amount} <span className="text-slate-700">|</span> Fee: {tx.gasPaid}
                        </td>
                        <td className="py-2.5 text-right font-bold flex items-center justify-end gap-1.5">
                          {tx.status === "SHIELDED" ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="text-emerald-400 uppercase text-[10px]">Secure</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
                              <span className="text-rose-400 uppercase text-[10px]">Leaked</span>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
