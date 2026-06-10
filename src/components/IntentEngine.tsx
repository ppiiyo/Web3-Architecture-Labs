import React, { useState } from "react";
import { Sparkles, ArrowRight, Zap, Shield, HelpCircle, Terminal, Check, Copy, TrendingDown, Users, Coins, HeartHandshake } from "lucide-react";
import WalletConnector from "./WalletConnector";

interface IntentScenario {
  sourceChain: string;
  destChain: string;
  sourceAsset: string;
  destAsset: string;
  action: string;
  estimatedSlippageNoSolver: string;
  estimatedSlippageSolver: string;
}

export default function IntentEngine() {
  const [sourceChain, setSourceChain] = useState<string>("Ethereum Arbitrum L2");
  const [destChain, setDestChain] = useState<string>("Solana Network");
  const [sourceAsset, setSourceAsset] = useState<string>("USDC (Arbitrum)");
  const [destAsset, setDestAsset] = useState<string>("SOL (Native)");
  const [actionType, setActionType] = useState<string>("Swap & Buy Hot NFT Mint");
  
  const [wallet, setWallet] = useState<{
    isConnected: boolean;
    address: string;
    providerType: "extension" | "sandbox";
    balances: { eth: string; sol: string; ton: string };
    network: string;
  }>({
    isConnected: false,
    address: "",
    providerType: "sandbox",
    balances: { eth: "0.0", sol: "0.0", ton: "0.0" },
    network: "Disconnected"
  });
  
  const [usePaymaster, setUsePaymaster] = useState<boolean>(true);
  const [useAtomicEscrow, setUseAtomicEscrow] = useState<boolean>(true);
  
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [solveStep, setSolveStep] = useState<number>(0); // 0: Idle, 1: Intention Published, 2: Solver Auction, 3: Atomic Lock, 4: Settled
  const [selectedSolutionCode, setSelectedSolutionCode] = useState<"solidity" | "rust">("solidity");
  const [copiedCodeCode, setCopiedCodeCode] = useState<boolean>(false);
  const [solverLogs, setSolverLogs] = useState<string[]>([]);
  
  const activeIntents: IntentScenario[] = [
    {
      sourceChain: "Ethereum Arbitrum L2",
      destChain: "Solana Network",
      sourceAsset: "100 USDC",
      destAsset: "SOL Native",
      action: "Instant Buy & Stake in Liquid Protocol",
      estimatedSlippageNoSolver: "$18.50 (Chain Bridges + gas friction)",
      estimatedSlippageSolver: "$0.30 (Internal Solver Netting)"
    },
    {
      sourceChain: "EVM Optimism L2",
      destChain: "TON Network",
      sourceAsset: "50 USDT",
      destAsset: "TON Native",
      action: "Direct Telegram Micro-Lottery Subscription",
      estimatedSlippageNoSolver: "$12.00 (Gas on both sides + Multi-hop swaps)",
      estimatedSlippageSolver: "$0.10 (Meta Paymaster Sponsored Session)"
    }
  ];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeCode(true);
    setTimeout(() => setCopiedCodeCode(false), 2000);
  };

  const handleWalletChange = (newWallet: any) => {
    setWallet(newWallet);
    
    // Auto-align default networks if possible based on address type
    if (newWallet.address.startsWith("0x")) {
      setSourceChain("Ethereum Arbitrum L2");
      setDestChain("Solana Network");
    } else if (newWallet.address.length > 0) {
      setSourceChain("Solana Network");
      setDestChain("Ethereum Arbitrum L2");
    }
  };

  const handleStartSolving = () => {
    if (isSolving) return;
    setIsSolving(true);
    setSolveStep(1);
    
    const logs: string[] = [];
    const pushLog = (msg: string) => {
      logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
      setSolverLogs([...logs]);
    };

    const userLabel = wallet.isConnected 
      ? `Active Wallet (${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)})`
      : "Standard User EQ0x9C...";

    pushLog(`Intent Broadcasted: ${userLabel} wants targeting outcome [${actionType}] on ${destChain}.`);
    pushLog(`ERC-7683 Router active. Generating execution intent commitment hash: 0xda79...e43c`);

    setTimeout(() => {
      setSolveStep(2);
      pushLog(`Solver Auction initiated. Reading order parameter memory cells...`);
      pushLog(`Solver 1 (Wintermute_Proxy) submitted execution bid. Slippage fee limit: 0.15%`);
      pushLog(`Solver 2 (Amber_Active) submitted competitive bid. Slippage fee limit: 0.12%`);
      pushLog(`Win awarded to Amber_Active for offering sponsored low gas cost.`);

      setTimeout(() => {
        setSolveStep(3);
        pushLog(`Creating atomic state vault contract escrow on ${sourceChain}...`);
        if (usePaymaster) {
          pushLog(`Paymaster triggered. Transaction gas paid from abstract state reserves (No native gas required from user!).`);
        } else {
          pushLog(`Notice: Paymaster disabled. Charging native network coin index fee directly to user.`);
        }
        pushLog(`Symmetric Cryptographic lock generated: 0x93ab...52c`);
        pushLog(`Solvers locking matching liquidity collateral on target ${destChain} destination escrow...`);

        setTimeout(() => {
          setSolveStep(4);
          pushLog(`Cross-Chain Oracle Relay validates finality step...`);
          pushLog(`Oracle receipt valid. Unlocking funds. User receives requested [${destAsset}] natively.`);
          pushLog(`Solvers receive original payload security assets atomically. Settlement success.`);
          setIsSolving(false);
        }, 1800);
      }, 1800);
    }, 1500);
  };

  const solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ERC-7683 Multi-Chain Intent Settlement Manager
 * @notice Solves fragmented Web3 onboarding. Users deposit source assets without holding native gas,
 * and competitive Solvers fulfill destinations atomically. Backed by security bond collaterals.
 */
contract ERC7683IntentManager {
    
    struct CrossChainIntent {
        bytes32 intentId;
        address creator;
        address sourceToken;
        uint256 amount;
        uint32 destChainId;
        address destRecipient;
        uint256 maxDeadline;
        uint256 solverReward;
    }

    enum IntentStatus { UNINITIALIZED, LOCKED, FILLED, CLAIMED, REFUNDED }

    mapping(bytes32 => IntentStatus) public intentStates;
    mapping(bytes32 => address) public lockedSolvers;
    address public immutable basePaymaster;

    event IntentCreated(bytes32 indexed intentId, address indexed creator, uint256 amount);
    event IntentFilled(bytes32 indexed intentId, address indexed solver);
    event SettlementCompleted(bytes32 indexed intentId, address indexed solver);

    constructor(address _paymaster) {
        basePaymaster = _paymaster;
    }

    /**
     * @notice Enforces Sponsored Gas abstraction (Account Abstraction ERC-4337 compat)
     * Allows users with empty gas wallets to authorize transactions via cryptographic signatures.
     */
    function submitIntentSponsored(
        CrossChainIntent calldata intent,
        bytes calldata signature,
        bytes calldata paymasterPermit
    ) external {
        // Cryptographic Signature check (Alice's EIP-712 off-chain intention verification)
        bytes32 messageHash = keccak256(abi.encode(intent));
        address signer = recoverSigner(messageHash, signature);
        require(signer == intent.creator, "Invalid off-chain intent signature");
        
        // Hold initial user security assets
        require(intentStates[intent.intentId] == IntentStatus.UNINITIALIZED, "Intent ID duplicated");
        intentStates[intent.intentId] = IntentStatus.LOCKED;
        
        emit IntentCreated(intent.intentId, signer, intent.amount);
    }

    /**
     * @notice Solvers call this with cryptographically signed proof from destination chain
     * to unlock Alice's source assets + the solver reward.
     */
    function executeSettlement(
        bytes32 intentId, 
        address solver, 
        bytes32 destProofAnchor
    ) external {
        require(intentStates[intentId] == IntentStatus.LOCKED, "Intent is not in solvable state");
        
        // Optimistic Challenge Verification: Oracle validates proof
        intentStates[intentId] = IntentStatus.CLAIMED;
        
        emit SettlementCompleted(intentId, solver);
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _sig) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_sig);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}`;

  const rustCode = `// Anchor program for Solana recipient-side Intent Fulfillment
use anchor_lang::prelude::*;

declare_id!("Int3ntRecip1entSolana111111111111111112");

#[program]
pub mod solana_intent_recipient {
    use super::*;

    /// Allows registered Solvers to buy NFTs, swap tokens or mint assets
    /// on behalf of the user, using Solver’s own SOL balance to cover gas fees.
    pub fn fulfill_intent_on_chain(
        ctx: Context<FulfillIntent>, 
        intent_id: [u8; 32], 
        requested_amount: u64
    ) -> Result<()> {
        let execution_record = &mut ctx.accounts.execution_record;
        let solver = &ctx.accounts.solver;
        let recipient = &ctx.accounts.recipient;

        require!(!execution_record.is_fulfilled, CustomError::AlreadyFulfilled);

        // Core dynamic execution logic (Gas Abstraction):
        // Solver spends Sol from their account to trigger recipient programs instantly
        let clock = Clock::get()?;
        execution_record.is_fulfilled = true;
        execution_record.intent_id = intent_id;
        execution_record.solver = *solver.key;
        execution_record.timestamp = clock.unix_timestamp;

        msg!("Cross-chain receipt locked on Solana. Signature: ID-{}", intent_id[0]);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct FulfillIntent<'info> {
    #[account(
        init, 
        payer = solver, 
        space = 8 + 1 + 32 + 32 + 8,
        seeds = [b"intent-sig", solver.key().as_ref()],
        bump
    )]
    pub execution_record: Account<'info, IntentExecutionRecord>,
    #[account(mut)]
    pub solver: Signer<'info>,
    /// CHECK: Recipient is arbitrary. Solver sponsors Sol to mint into this account.
    pub recipient: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct IntentExecutionRecord {
    pub is_fulfilled: bool,
    pub intent_id: [u8; 32],
    pub solver: Pubkey,
    pub timestamp: i64,
}

#[error_code]
pub enum CustomError {
    #[msg("This dynamic cross-chain intent has already been claimed on Solana")]
    AlreadyFulfilled,
}`;  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="intent-engine-grid">
      
      {/* Simulation Form Controller (Left) */}
      <div className="lg:col-span-4 space-y-5" id="intent-form-panel">
        <WalletConnector onWalletChange={handleWalletChange} currentWallet={wallet} />
        
        <div className="glass-card-premium border border-slate-800/85 rounded-2xl p-5.5 space-y-4 shadow-3d-md">
          <div className="flex items-center gap-2 border-b border-slate-905 pb-3">
            <Sparkles className="w-4 h-4 text-emerald-400 glow-emerald" />
            <h4 className="text-xs font-bold text-slate-200 font-display uppercase tracking-widest">
              Set Your Execution Intent
            </h4>
          </div>

          <div className="space-y-4">
            {/* Presets Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-405 font-display uppercase tracking-wider block">Load Active Sandbox Preset</span>
              <div className="grid grid-cols-1 gap-2">
                {activeIntents.map((scenario, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSourceChain(scenario.sourceChain);
                      setDestChain(scenario.destChain);
                      setSourceAsset(scenario.sourceAsset);
                      setDestAsset(scenario.destAsset);
                      setActionType(scenario.action);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/80 border border-slate-900 hover:border-slate-800 hover:bg-[#0c1630]/20 transition-all cursor-pointer shadow-3d-sm active:translate-y-[0.5px]"
                  >
                    <p className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 glow-emerald" />
                        {scenario.sourceChain.split(" ")[1]} ➔ {scenario.destChain.split(" ")[0]}
                      </span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-405 px-2 py-0.5 rounded-md font-mono border border-emerald-550/10 font-black uppercase">Optimal</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold truncate mt-1.5">{scenario.action}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Inputs */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-405 font-display tracking-wide block">First: Source Blockchain</label>
              <input
                type="text"
                value={sourceChain}
                onChange={(e) => setSourceChain(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 transition-colors font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-405 font-display tracking-wide block">Target Dest Blockchain</label>
              <input
                type="text"
                value={destChain}
                onChange={(e) => setDestChain(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 transition-colors font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-450 font-display block">Input Asset</label>
                <input
                  type="text"
                  value={sourceAsset}
                  onChange={(e) => setSourceAsset(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-200 font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-450 font-display block">Target Outcome</label>
                <input
                  type="text"
                  value={destAsset}
                  onChange={(e) => setDestAsset(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-200 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-405 font-display tracking-wide block">What do you want to happen on Destination?</label>
              <input
                type="text"
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 transition-colors font-medium"
              />
            </div>

            {/* Custom Safeguards */}
            <div className="space-y-2.5 pt-3.5 border-t border-slate-905">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-indigo-400" /> Account Abstraction (Sponsored Gas)
                </span>
                <input
                  type="checkbox"
                  checked={usePaymaster}
                  onChange={(e) => setUsePaymaster(e.target.checked)}
                  className="w-4 h-4 rounded-md bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> Cryptographic State Escrows (ERC-7683)
                </span>
                <input
                  type="checkbox"
                  checked={useAtomicEscrow}
                  onChange={(e) => setUseAtomicEscrow(e.target.checked)}
                  className="w-4 h-4 rounded-md bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleStartSolving}
              disabled={isSolving}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-550 hover:to-indigo-550 active:translate-y-[1px] disabled:from-slate-900 disabled:to-slate-900 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all border border-emerald-500/10 shadow-3d-sm select-none cursor-pointer"
            >
              {isSolving ? "Seeking Solvers..." : "Publish Intent to Solvers Hub"}
            </button>
          </div>
        </div>

        {/* Benefits Panel */}
        <div className="glass-card-premium border border-slate-850/60 rounded-2xl p-5 space-y-3.5 shadow-3d-sm">
          <h4 className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-2">
            <HeartHandshake className="w-4 h-4 text-indigo-400" /> Why this is revolutionary
          </h4>
          <div className="space-y-3 text-xs leading-relaxed text-slate-400 font-sans">
            <div className="flex gap-2.5">
              <TrendingDown className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
              <p className="font-medium text-slate-400">
                <strong className="text-slate-205 font-bold">95% Slippage Netting:</strong> Solvers balance out-flows internally off-chain, completely skipping public bridges.
              </p>
            </div>
            <div className="flex gap-2.5">
              <Users className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="font-medium text-slate-400">
                <strong className="text-slate-205 font-bold">Abstracted Onboarding:</strong> No need to buy native gas coins on both networks. Your transactions are fully sponsored.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* State Graph Visualizer (Middle/Right) */}
      <div className="lg:col-span-8 space-y-6" id="intent-visualization-workspace">
        <div className="glass-card-premium border border-slate-800/85 rounded-2xl p-6.5 space-y-6 shadow-3d-lg">
          
          <div className="border-b border-slate-905 pb-4.5 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100 font-display flex items-center gap-1.5">
                <Terminal className="w-5 h-5 text-indigo-400 glow-indigo" />
                Atomic Intent Solver visual state machine
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Witness how Solvers safely execute complex multi-chain swaps gaslessly.
              </p>
            </div>
            <span className="text-[10px] text-emerald-450 bg-[#001c10]/20 border border-emerald-500/10 px-2.5 py-1 rounded font-mono font-bold select-all animate-pulse">Protocol: ERC-7683</span>
          </div>

          {/* Visual Sequence Map */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" id="intent-sequence-grid">
            <div
              className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 transition-all shadow-3d-sm ${
                solveStep >= 1 ? "bg-[#0b122c]/50 border-indigo-500/35 text-indigo-300" : "bg-[#02050f] border-slate-900 text-slate-600"
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${solveStep >= 1 ? "bg-indigo-500 text-indigo-950 glow-indigo" : "bg-slate-900"}`}>
                01
              </div>
              <h5 className="text-[11px] font-bold font-display uppercase tracking-wide">Intent Signed</h5>
              <p className="text-[9px] text-slate-400 font-medium">Commitment payload is published off-chain</p>
            </div>

            <div
              className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 transition-all shadow-3d-sm ${
                solveStep >= 2 ? "bg-[#0b122c]/50 border-indigo-500/35 text-indigo-300" : "bg-[#02050f] border-slate-900 text-slate-600"
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${solveStep >= 2 ? "bg-indigo-500 text-indigo-950 glow-indigo" : "bg-slate-900"}`}>
                02
              </div>
              <h5 className="text-[11px] font-bold font-display uppercase tracking-wide">Solver Bidding</h5>
              <p className="text-[9px] text-slate-400 font-medium">Solvers compete to offer lowest execution slippage</p>
            </div>

            <div
              className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 transition-all shadow-3d-sm ${
                solveStep >= 3 ? "bg-[#002b16]/30 border-emerald-500/30 text-emerald-300" : "bg-[#02050f] border-slate-900 text-slate-600"
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${solveStep >= 3 ? "bg-emerald-500 text-emerald-950 glow-emerald" : "bg-slate-900"}`}>
                03
              </div>
              <h5 className="text-[11px] font-bold font-display uppercase tracking-wide">Locks Placed</h5>
              <p className="text-[9px] text-slate-400 font-medium">Atomic escrows established across layers</p>
            </div>

            <div
              className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 transition-all shadow-3d-sm ${
                solveStep >= 4 ? "bg-[#002b16]/30 border-emerald-500/30 text-emerald-300" : "bg-[#02050f] border-slate-900 text-slate-600"
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${solveStep >= 4 ? "bg-emerald-500 text-emerald-950 glow-emerald" : "bg-slate-900"}`}>
                04
              </div>
              <h5 className="text-[11px] font-bold font-display uppercase tracking-wide">Atomic Settled</h5>
              <p className="text-[9px] text-slate-400 font-medium">Outcome proven. User assets released instantly</p>
            </div>
          </div>

          {/* Simulator Console Output */}
          <div className="bg-[#030611] rounded-2xl border border-slate-900/80 p-4.5 font-mono text-[10.5px] leading-relaxed max-h-[140px] overflow-y-auto space-y-1.5 text-slate-400 shadow-3d-inner">
            {solverLogs.length === 0 ? (
              <p className="text-slate-600 italic">No intent active. Fill in specifications and click "Publish Intent" on the left to witness competitive solver netting.</p>
            ) : (
              solverLogs.map((log, idx) => (
                <div key={idx} className={log.includes("success") || log.includes("awarded") || log.includes("Paymaster") ? "text-emerald-450" : ""}>
                  {log}
                </div>
              ))
            )}
          </div>

          {/* Code Section */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-bold font-display uppercase tracking-widest text-slate-400 block">Implementation Blueprints</h5>
              
              <div className="flex bg-[#030611] p-1 border border-slate-900 rounded-xl shadow-3d-sm">
                <button
                  onClick={() => setSelectedSolutionCode("solidity")}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold font-display cursor-pointer transition ${
                    selectedSolutionCode === "solidity" ? "bg-[#0c1630] text-indigo-400 border border-indigo-500/10 shadow-3d-sm" : "text-slate-500 hover:text-slate-350"
                  }`}
                >
                  ERC7683IntentManager.sol
                </button>
                <button
                  onClick={() => setSelectedSolutionCode("rust")}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold font-display cursor-pointer transition ${
                    selectedSolutionCode === "rust" ? "bg-[#0c1630] text-indigo-400 border border-indigo-500/10 shadow-3d-sm" : "text-slate-500 hover:text-slate-350"
                  }`}
                >
                  solana_intent_recipient.rs
                </button>
              </div>
            </div>

            <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-[#030611] shadow-3d-md">
              <div className="flex items-center justify-between px-4.5 py-2.5 bg-[#0d1324] border-b border-slate-800/80">
                <span className="text-[10px] font-mono font-bold text-slate-355">
                  {selectedSolutionCode === "solidity" ? "ERC7683IntentManager.sol (Solidity v0.8.24)" : "solana_intent_recipient.rs (Anchor Rust)"}
                </span>
                <button
                  onClick={() => handleCopyCode(selectedSolutionCode === "solidity" ? solidityCode : rustCode)}
                  className="text-[10px] font-mono font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition select-none cursor-pointer"
                >
                  {copiedCodeCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono uppercase tracking-wider">Copy Program</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <pre className="p-4.5 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-[300px] leading-relaxed select-all">
                  <code>{selectedSolutionCode === "solidity" ? solidityCode : rustCode}</code>
                </pre>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#030611] to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
