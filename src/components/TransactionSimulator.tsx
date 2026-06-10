import React, { useState, useEffect } from "react";
import { Play, RotateCcw, AlertTriangle, ShieldCheck, Zap, Layers, Terminal, ChevronRight, User } from "lucide-react";
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
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-6" id="simulator-card">
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Dynamic Web3 Crisis Simulator
          </h3>
          <p className="text-xs text-slate-400">
            Witness the real mechanics of blockchain execution bottlenecks, and how revolutionary designs mitigate them.
          </p>
        </div>
        <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-lg">
          <button
            id="scenario-mev-btn"
            onClick={() => setActiveScenario("MEV")}
            className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
              activeScenario === "MEV" ? "bg-slate-800 text-slate-100 shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Ethereum: MEV Sandwich
          </button>
          <button
            id="scenario-sol-btn"
            onClick={() => setActiveScenario("SOL_CONGESTION")}
            className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
              activeScenario === "SOL_CONGESTION" ? "bg-slate-800 text-slate-100 shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Solana: QUIC Spam
          </button>
          <button
            id="scenario-ton-btn"
            onClick={() => setActiveScenario("TON_ASYNC")}
            className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
              activeScenario === "TON_ASYNC" ? "bg-slate-800 text-slate-100 shadow" : "text-slate-400 hover:text-slate-200"
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
          <div className="bg-slate-950/60 p-4 border border-slate-850 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Simulation Settings
            </h4>

            {activeScenario === "MEV" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Observe standard swap routing in WETH/USDT where public mempools alert sandwich bot relays versus Flashbots commit-reveal RPC routing.
                </p>
                <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-xs font-semibold text-slate-200">Activate MEV-Shield</span>
                  <input
                    type="checkbox"
                    id="shield-checkbox"
                    checked={useShield}
                    onChange={(e) => setUseShield(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded bg-slate-850 border-slate-700"
                  />
                </div>
              </div>
            )}

            {activeScenario === "SOL_CONGESTION" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Observe high QUIC validator drop-out under hot mint spamming vs a local fame-weighted Priority Slot Lane middleware.
                </p>
                <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-xs font-semibold text-slate-200">Enable Aura Priority</span>
                  <input
                    type="checkbox"
                    id="shield-checkbox"
                    checked={useShield}
                    onChange={(e) => setUseShield(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded bg-slate-850 border-slate-700"
                  />
                </div>
              </div>
            )}

            {activeScenario === "TON_ASYNC" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Observe what happens when an asynchronous transfer destination contract fails: balance stuck vs T-Saga Escrow automatically returning funds.
                </p>
                <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-xs font-semibold text-slate-200">Deploy T-Saga Router</span>
                  <input
                    type="checkbox"
                    id="shield-checkbox"
                    checked={useShield}
                    onChange={(e) => setUseShield(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded bg-slate-850 border-slate-700"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                id="start-sim-btn"
                disabled={isSimulating}
                onClick={executeSimulation}
                className={`w-full py-2 px-4 rounded-lg font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer border transform transition-all active:scale-[0.98] ${
                  isSimulating
                    ? "bg-slate-800 border-slate-750 text-slate-500 cursor-not-allowed"
                    : "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500 shadow-md shadow-emerald-900/10"
                }`}
              >
                {isSimulating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-emerald-400" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Launch Transaction
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Block Status Monitor */}
          <div className="bg-slate-950/60 p-4 border border-slate-850 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              L1 Consensus Node Metrics
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-1">
              <div>
                <p className="text-slate-500">Current Block</p>
                <p className="text-slate-200 font-bold">#{blockHeight}</p>
              </div>
              <div>
                <p className="text-slate-500">Node Latency</p>
                <p className="text-slate-200 font-bold">
                  {activeScenario === "SOL_CONGESTION" ? "405ms" : "12.04s"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Mempool Count</p>
                <p className="text-slate-200 font-bold">
                  {activeScenario === "MEV" ? "1,842 pending" : "0 (Direct QUIC)"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Aura Priority Staking</p>
                <p className="text-slate-200 font-semibold text-emerald-400">
                  {useShield ? "Active & Safe" : "Bypassed"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Graph Middle Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6" id="sim-timeline">
          {/* Progress Timeline Pipeline */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 relative overflow-hidden flex-1 flex flex-col justify-between min-h-[300px]">
            {/* Background absolute graph grids */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30" />

            <div className="relative flex items-center justify-between text-xs font-mono border-b border-slate-900 pb-3 z-10">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                Live State Machine Graph
              </span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                Stage {step}/3
              </span>
            </div>

            {/* Visual Steps representation */}
            <div className="relative my-8 grid grid-cols-3 gap-4 z-10" id="step-visualizer">
              {/* Step 1 */}
              <div
                className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 transition-all duration-300 ${
                  step >= 1
                    ? "bg-blue-950/20 border-blue-500/40 text-blue-300 shadow shadow-blue-950/20"
                    : "bg-slate-900/10 border-slate-850 text-slate-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${
                    step >= 1 ? "bg-blue-500 text-blue-950" : "bg-slate-900 text-slate-600"
                  }`}
                >
                  1
                </div>
                <span className="text-xs font-bold">Transaction Dispatched</span>
                <span className="text-[10px] text-slate-500">Mempool queue assignment</span>
              </div>

              {/* Step 2 */}
              <div
                className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 transition-all duration-300 ${
                  step >= 2
                    ? useShield
                      ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                      : "bg-rose-950/20 border-rose-500/40 text-rose-300"
                    : "bg-slate-900/10 border-slate-850 text-slate-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${
                    step >= 2
                      ? useShield
                        ? "bg-emerald-500 text-emerald-950"
                        : "bg-rose-500 text-rose-950"
                      : "bg-slate-900 text-slate-600"
                  }`}
                >
                  2
                </div>
                <span className="text-xs font-bold">Block Builder Sorting</span>
                <span className="text-[10px] text-slate-500">Evaluating transaction headers</span>
              </div>

              {/* Step 3 */}
              <div
                className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 transition-all duration-300 ${
                  step >= 3
                    ? useShield
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    : "bg-slate-900/10 border-slate-850 text-slate-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${
                    step >= 3
                      ? useShield
                        ? "bg-emerald-500 text-emerald-950"
                        : "bg-rose-500 text-rose-950"
                      : "bg-slate-900 text-slate-600"
                  }`}
                >
                  3
                </div>
                <span className="text-xs font-bold">Final Settlement</span>
                <span className="text-[10px] text-slate-500">Atomic block commitment</span>
              </div>
            </div>

            {/* Simulated Live Log Screen */}
            <div className="bg-slate-950 border border-slate-900 rounded-lg p-3 font-mono text-[11px] leading-relaxed max-h-[140px] overflow-y-auto space-y-1">
              {simLogs.length === 0 ? (
                <p className="text-slate-600 italic">No simulation running. Click "Launch Transaction" to inspect physical block execution metrics.</p>
              ) : (
                simLogs.map((log, idx) => {
                  let colorClass = "text-slate-400";
                  if (log.includes("Warning") || log.includes("Error") || log.includes("vulnerability") || log.includes("sandwiched")) {
                    colorClass = "text-rose-400";
                  } else if (log.includes("Shield") || log.includes("Successfully") || log.includes("safe") || log.includes("Atomic") || log.includes("refund")) {
                    colorClass = "text-emerald-400";
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
            <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-4 space-y-3" id="sim-history">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Simulation History
              </h4>
              <div className="overflow-x-auto max-h-[140px] text-xs font-mono">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 text-[10px]">
                      <th className="pb-2">Transaction ID</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Amount / Gas Paid</th>
                      <th className="pb-2 text-right">Protection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {history.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-900/30">
                        <td className="py-2.5 font-bold text-slate-200">{tx.id}</td>
                        <td className="py-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              tx.status === "SHIELDED"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-2.5">
                          {tx.amount} <span className="text-slate-500">|</span> Fee: {tx.gasPaid}
                        </td>
                        <td className="py-2.5 text-right font-bold flex items-center justify-end gap-1">
                          {tx.status === "SHIELDED" ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Shielded</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                              <span className="text-rose-400">Leaked</span>
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
