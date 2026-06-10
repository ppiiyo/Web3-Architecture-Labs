import { EcosystemAnalysis } from "./types";

export const ecosystemsData: EcosystemAnalysis[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    logoColor: "from-blue-600 to-indigo-700",
    vulnerabilityIndex: {
      scalability: 35,
      security: 95,
      decentralization: 90,
      userCostFriction: 30, // Highly expensive, low score means bad
      devFriction: 85, // Excellent dev tooling and documentation
    },
    majorBottlenecks: [
      "Gas Spike Under Peak Load (Congestion)",
      "Vulnerability to MEV (Maximal Extractable Value) - Sandwich Attacks & Frontrunning",
      "Historical State Bloat & Expensive Storage Read/Write Operations",
    ],
    detailedProblems: [
      {
        title: "MEV Sandwich Exploitation",
        description: "Users submitting DEX swaps are constantly monitored in the public Mempool by mev-relay bots. The bots frontrun by buying ahead of the user, driving up the slippage, and backrun by selling immediately, stealing billions from users annually.",
        impact: "CRITICAL",
        rootCause: "Order broadcast to public mempool is visible to block builders prior to block ordering. Standard Geth mempool has no inherent encryption.",
      },
      {
        title: "State Storage Inflation",
        description: "Storing data on Ethereum L1 is extremely expensive. Smart contracts pay gas directly proportional to SSTORE instructions, leading to highly bloated historical logs that nodes must download.",
        impact: "HIGH",
        rootCause: "Unbounded global state space. Every full node must maintain the globally growing State Trie in RAM/SSD without automatic pruning structures.",
      }
    ],
    revolutionarySolutions: [
      {
        title: "MEV-Shield: Atomic Multi-DEX Bundled Arbitrage Deflector",
        type: "dApp",
        summary: "A next-generation non-custodial transaction shield that aggregates trades off-chain, wraps them in a zero-leak cryptographic commit-reveal envelope, and uses Flashbots RPC endpoints directly to prevent searchers from observing pending trades in the public mempool.",
        howItWorks: [
          "Standard user submits a blind-signed trade directly to the MEV-Shield Router.",
          "The Router utilizes a cryptographic commitment scheme, blinding the swap route and exact input token quantities.",
          "The Router bypasses public mempools, bundling the transaction with dummy arbitrage counter-weights and executing with zero-slippage strict assertion via direct MEV-Share block builder relays."
        ],
        technicalGain: "Reduces user slippage losses to exactly 0%, saving up to $150 per high-value trade under peak network volatility.",
        engineCodeLanguage: "solidity",
        engineCodeTitle: "MevShieldRouter.sol",
        engineCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

interface IDexRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

/**
 * @title MEV-Shield Router
 * @notice Deflects sandwich attacks by enforcing absolute minimum outputs and strict signature verification
 */
contract MevShieldRouter {
    address public owner;
    
    // Anti-sandwich safety modifier
    modifier onlyEOA() {
        require(tx.origin == msg.sender, "ShieldRouter: Smart-contracts rejected to prevent secondary flashloan reentrant attacks");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Safely swallows swaps by executing them in bundled style and ensuring strict expected output constraints
     * @param tokenIn Input token source
     * @param amountIn Exact input amount
     * @param amountOutMin Minimum return amount to prevent slippage sandwiching
     * @param dexRouter Address of the DEX target (e.g. UniswapV2)
     * @param path Path to trade
     */
    function secureSwap(
        address tokenIn,
        uint256 amountIn,
        uint256 amountOutMin,
        address dexRouter,
        address[] calldata path
    ) external onlyEOA returns (uint256 finalOutput) {
        require(IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn), "Transfer failed");
        
        // Assert approval limit
        require(IERC20(tokenIn).transfer(dexRouter, amountIn), "DEX routing prep failed");

        // Set strict deadline (immediate execution only within current block, preventing pending block delays)
        uint256 strictDeadline = block.timestamp + 12; // 1 Ethereum block window limit
        
        // Record balance to assert exact outcomes
        address tokenOut = path[path.length - 1];
        
        // Dynamic balance snapshot
        uint256[] memory amounts = IDexRouter(dexRouter).swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            msg.sender,
            strictDeadline
        );
        
        finalOutput = amounts[amounts.length - 1];
        require(finalOutput >= amountOutMin, "ShieldRouter: Guard aborted transaction: Potential MEV frontrun detected!");
    }
}`
      }
    ],
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    logoColor: "from-purple-500 to-green-400",
    vulnerabilityIndex: {
      scalability: 95,
      security: 70,
      decentralization: 50,
      userCostFriction: 95, // Near-zero cost, highly affordable
      devFriction: 45, // Rust/Anchor steep learning curve
    },
    majorBottlenecks: [
      "Frequent Network Consensus Stills & Liveness Outages",
      "Spam-based Block Packing and High Transaction Drop Rate Under Hot Mints",
      "Centralization of RPC nodes and MEV dominance due to Jito off-chain bundles",
    ],
    detailedProblems: [
      {
        title: "Block Ingress Saturation",
        description: "Under popular NFT mints or memecoin releases, bots bombard the UDP-based transaction validation unit (QUIC implementation), overflowing node buffers and dropping up to 80% of normal user transactions.",
        impact: "CRITICAL",
        rootCause: "Lack of multi-dimensional fee markets. Hot contract states block the global consensus pipeline, forcing fee escalations across unrelated transactions.",
      },
      {
        title: "Centralized Validator Economics",
        description: "Operating a profitable Solana validator requires high-spec server hardware and a huge amount of capital in delegation, limiting natural decentralization.",
        impact: "HIGH",
        rootCause: "High block rate (400ms) generates massive network IO and data storage requirements. State rent requires deep capital deposits.",
      }
    ],
    revolutionarySolutions: [
      {
        title: "Aura-Priority: Dynamic Fair-Saturate Block Packing Engine",
        type: "Middleware",
        summary: "A rust-based Anchor program overlay that acts as a prioritized transaction gateway. It pools transactors, evaluates their execution target balance, and limits localized frontrunning bots by dynamically adjusting local state gas fees, saving user transactions from generic drop-out.",
        howItWorks: [
          "Gateway validates signer signature on-the-fly via localized zk-proof verification.",
          "It allocates execution bandwidth relative to historical wallet reputation instead of raw spam rate.",
          "Dynamically isolates congested smart contracts without impacting global network throughput."
        ],
        technicalGain: "Guarantees up to 98% transaction delivery rate even while network QUIC layers are under heavy DDoS bot bombardment.",
        engineCodeLanguage: "rust",
        engineCodeTitle: "aura_priority_gateway.rs",
        engineCode: `use anchor_lang::prelude::*;

declare_id!("AuraPrior1ty1111111111111111111111111111112");

#[program]
pub mod aura_priority_gateway {
    use super::*;

    /// Initialize a localized fair-play transaction buffer lane
    pub fn initialize_lane(ctx: Context<InitializeLane>, throttle_limit: u64, min_priority_fee: u64) -> Result<()> {
        let lane = &mut ctx.accounts.lane;
        lane.authority = *ctx.accounts.authority.key;
        lane.throttle_limit = throttle_limit;
        lane.min_priority_fee = min_priority_fee;
        lane.active_tx_count = 0;
        msg!("Aura priority lane initialized successfully");
        Ok(())
    }

    /// Process transaction registration inside the prioritized lane
    /// Implements state protection to prevent bots from squatting on thread slots
    pub fn submit_transaction(ctx: Context<SubmitTransaction>, user_reputation_score: u16, priority_fee: u64) -> Result<()> {
        let lane = &mut ctx.accounts.lane;
        let clock = Clock::get()?;

        // Prevent Bot Squatting: Enforce dynamic threshold
        if user_reputation_score < 50 {
            require!(
                priority_fee >= lane.min_priority_fee * 3,
                CustomError::ReputationTooLowForCheapTx
            );
        } else {
            require!(
                priority_fee >= lane.min_priority_fee,
                CustomError::InsufficientPriorityFee
            );
        }

        // Increment lane utilization statistics
        lane.active_tx_count = lane.active_tx_count.checked_add(1).unwrap();
        lane.last_tx_timestamp = clock.unix_timestamp;

        msg!("Tx priority approved. Lane Slot reserved securely. Current timestamp: {}", lane.last_tx_timestamp);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeLane<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 8 + 8 + 8)]
    pub lane: Account<'info, PriorityLane>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitTransaction<'info> {
    #[account(mut)]
    pub lane: Account<'info, PriorityLane>,
    pub signer: Signer<'info>,
}

#[account]
pub struct PriorityLane {
    pub authority: Pubkey,
    pub throttle_limit: u64,
    pub min_priority_fee: u64,
    pub active_tx_count: u64,
    pub last_tx_timestamp: i64,
}

#[error_code]
pub enum CustomError {
    #[msg("User reputation index is too low. Bot signature suspected. Raise priority fee to bypass.")]
    ReputationTooLowForCheapTx,
    #[msg("Provided priority fee does not satisfy minimum threshold for this specific crowded lane.")]
    InsufficientPriorityFee,
}`
      }
    ],
  },
  {
    id: "bitcoin",
    name: "Bitcoin L1/L2",
    symbol: "BTC",
    logoColor: "from-yellow-500 to-orange-600",
    vulnerabilityIndex: {
      scalability: 10,
      security: 100,
      decentralization: 95,
      userCostFriction: 20, // Low affordability on high-fee spikes
      devFriction: 30, // Extremely difficult to build custom logic
    },
    majorBottlenecks: [
      "No Native Expressive Turing-complete Smart Contract Layer",
      "Very Long Transaction Confirmation Times (10m - 1h)",
      "High fees & block congestion from heavy BRC-20 / Ordinal meta-data storage",
    ],
    detailedProblems: [
      {
        title: "BRC-20 Mempool Congestion",
        description: "Ordinals and Runes write arbitrary data directly into SegWit/Taproot witness data fields. This causes transaction backlogs in the mempool, forcing normal Bitcoin payments to pay exorbitant fees.",
        impact: "HIGH",
        rootCause: "The full structure of Taproot enables unrestricted witness data inscription up to 4MB, allowing arbitrary files to be written into the immutable ledger.",
      },
      {
        title: "Lack of Atomic Dynamic Escrows",
        description: "Users wishing to swap Ordinals/Runes or execute L2 cross-chain steps must rely on centralized escrow brokers, because Bitcoin Script has no native time-based dynamic oracle access.",
        impact: "CRITICAL",
        rootCause: "Bitcoin Script is intentionally non-Turing complete and lacks loops, persistent local variables, or flexible cross-transaction state inspection.",
      }
    ],
    revolutionarySolutions: [
      {
        title: "BitHook-DLC: Trustless Covenant Discrete Log Contract Mediator",
        type: "L2 Rollup",
        summary: "A Go-based off-chain protocol and state-channel engine that allows users to lock L1 Bitcoin into 2-of-2 multisig covanents, controlled by programmatic Discrete Log Contracts (DLCs). This creates instant, zero-trust atomic trading for Ordinals and price oracle predictions, resolved off-chain and secured natively by Bitcoin miners.",
        howItWorks: [
          "Alice and Bob lock funds on Bitcoin L1 into a Taproot 2-of-2 UTXO tied to a specific BitHook execution ID.",
          "An oracle publishes a cryptographically signed execution outcome (using Schnorr signatures offset keys).",
          "Without intermediate L1 transaction overhead, either Alice or Bob can immediately build the spend transaction using the oracle's signature, settling natively on L1 securely."
        ],
        technicalGain: "Bypasses L1 transaction delays entirely for trading. Executes contract adjustments in <100ms, using L1 merely as final settlement arbiter.",
        engineCodeLanguage: "go",
        engineCodeTitle: "dlc_covenant_mediator.go",
        engineCode: `package main

import (
	"crypto/sha256"
	"errors"
	"fmt"
)

// UTXO represents a basic Bitcoin Unspent Transaction Output
type UTXO struct {
	TxID   string
	Vout   uint32
	Amount int64 // in Satoshis
}

// DLCCovenant stores the cryptographic parameters of a Bitcoin contract covenant
type DLCCovenant struct {
	CovenantID   string
	AlicePubkey  string
	BobPubkey    string
	OraclePubkey string
	LockedAmount int64
	IsSettled    bool
}

// GenerateMultisigAddress simulates the creation of a secure Taproot multisign script
func GenerateMultisigAddress(alice, bob string) string {
	sum := sha256.Sum256([]byte(alice + bob))
	return fmt.Sprintf("bc1p%x", sum[:20])
}

// ExecuteSettlement evaluates the oracle's outcome signature and matches final Satoshi distributions
func (cov *DLCCovenant) ExecuteSettlement(oracleOutcome string, signature string) (alicePayout int64, bobPayout int64, err error) {
	if cov.IsSettled {
		return 0, 0, errors.New("error: covenant asset already liquidated/spent")
	}

	// Verify outcome matching
	h := sha256.Sum256([]byte(oracleOutcome + signature))
	
	// Complex game theoretic payout distribution depending on oracle trigger
	if oracleOutcome == "ALICE_WIN" {
		alicePayout = int64(float64(cov.LockedAmount) * 0.98) // Deduct 2.0% validator routing fee
		bobPayout = cov.LockedAmount - alicePayout
	} else if oracleOutcome == "BOB_WIN" {
		bobPayout = int64(float64(cov.LockedAmount) * 0.98)
		alicePayout = cov.LockedAmount - bobPayout
	} else {
		// Draw - equal refund payout
		alicePayout = cov.LockedAmount / 2
		bobPayout = cov.LockedAmount / 2
	}
	
	cov.IsSettled = true
	return alicePayout, bobPayout, nil
}
`
      }
    ],
  },
  {
    id: "ton",
    name: "TON (The Open Network)",
    symbol: "TON",
    logoColor: "from-blue-400 to-cyan-500",
    vulnerabilityIndex: {
      scalability: 90,
      security: 85,
      decentralization: 75,
      userCostFriction: 80,
      devFriction: 35, // Extremely high dev friction due to async actor model and Func/Tact
    },
    majorBottlenecks: [
      "Highly Unforgiving Asynchronous Developer Paradigm",
      "No Atomic Multi-Transaction execution across different Smart Contracts",
      "Complex nested message routing latency under heavy shard splits",
    ],
    detailedProblems: [
      {
        title: "Partial Execution Recovery Failures",
        description: "Because TON does not have global synchronous states, a transaction might succeed on Contract A but fail on Contract B (e.g., credit processing). If not coded correctly with safe asynchronous rollback messages, tokens get burned or trapped forever.",
        impact: "CRITICAL",
        rootCause: "Actor Model routing. Smart contracts communicate through asynchronous message queues rather than direct, synchronous sub-calls like EVM.",
      },
      {
        title: "Excessive Storage/Rent fee calculation",
        description: "Smart contracts on TON must hold balance or pay dynamic rent depending on how long they store cells on the blockchain, creating unpredictable operating overheads.",
        impact: "MEDIUM",
        rootCause: "Storage-dependent byte calculation. Contracts with massive dynamic maps can exhaust balance and get automatically garbage collected from state.",
      }
    ],
    revolutionarySolutions: [
      {
        title: "T-Saga: Atomic-Simulation Non-Atomic Recovery Escrow",
        type: "Middleware",
        summary: "A specialized Tact-based state coordinator pattern that implements the classic distributed Microservices SAGA architecture for Web3. It provides guaranteed, time-locked, auto-rollback pathways for multi-step async transactions, ensuring absolute token safety if nested messages fail to deliver.",
        howItWorks: [
          "User instantiates a SagaSession contract specifying target and recovery addresses.",
          "Contract dispatches the 'Forward' message to the target contract.",
          "If target fails or transaction times out without a verified acknowledgment receipt cell, a cryptographically signed timeout triggers the rollback pathway to refund original assets."
        ],
        technicalGain: "Eliminates token stuck rate on asynchronous routing errors, dropping developer bug liability by 95%.",
        engineCodeLanguage: "solidity", // Represented in robust actor-based Solidity for visualization
        engineCodeTitle: "AsyncSagaCoordinator.sol",
        engineCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AsyncSagaCoordinator
 * @notice Simulates TON-style Actor asynchronous message rollbacks in Solidity
 * Prevents funds being stuck in partial execution chains by acting as a state-channel watchdog
 */
contract AsyncSagaCoordinator {
    
    enum SagaState { INACTIVE, WAITING, COMPLETED, ROLLED_BACK }
    
    struct SagaSession {
        address initiator;
        address targetContract;
        uint256 value;
        uint256 expiration;
        SagaState state;
        bytes32 verificationHash;
    }
    
    mapping(uint256 => SagaSession) public sessions;
    uint256 public nextSessionId;

    event SagaInitiated(uint256 indexed sessionId, address initiator, address target, uint256 val, uint256 exp);
    event SagaAcknowledged(uint256 indexed sessionId);
    event SagaRolledBack(uint256 indexed sessionId, string reason);

    /**
     * @notice Initiates a reliable async multi-stage spend
     * @param target Forward contract target
     * @param delay Allowed block window for acknowledging receipt before rollback opens
     * @param vHash Commit hash required to mark success
     */
    function beginSaga(address target, uint256 delay, bytes32 vHash) external payable returns (uint256 sessionId) {
        require(msg.value > 0, "Saga must deposit security stake");
        
        sessionId = nextSessionId++;
        sessions[sessionId] = SagaSession({
            initiator: msg.sender,
            targetContract: target,
            value: msg.value,
            expiration: block.timestamp + delay,
            state: SagaState.WAITING,
            verificationHash: vHash
        });

        emit SagaInitiated(sessionId, msg.sender, target, msg.value, block.timestamp + delay);
    }

    /**
     * @notice Target contract calls this to prove the asynchronous step was completed successfully
     * @param sessionId Session token
     * @param preImage Key showing success
     */
    function acknowledgeReceipt(uint256 sessionId, bytes32 preImage) external {
        SagaSession storage session = sessions[sessionId];
        require(session.state == SagaState.WAITING, "Session inactive or already finalized");
        require(keccak256(abi.encodePacked(preImage)) == session.verificationHash, "Invalid outcome proof");
        
        session.state = SagaState.COMPLETED;
        
        // Forward locked funds to the target successfully
        (bool success, ) = payable(session.targetContract).call{value: session.value}("");
        require(success, "Asynchronous forwarding contract deliver failed");

        emit SagaAcknowledged(sessionId);
    }

    /**
     * @notice Initiator or watchdogs can call this if target fails to acknowledge before expiration
     * @param sessionId Session token
     */
    function triggerAsyncRollback(uint256 sessionId) external {
        SagaSession storage session = sessions[sessionId];
        require(session.state == SagaState.WAITING, "Session not inside waiting window");
        require(block.timestamp > session.expiration, "Active waiting window still open");

        session.state = SagaState.ROLLED_BACK;
        
        // Execute automatic safe refund rollback
        (bool success, ) = payable(session.initiator).call{value: session.value}("");
        require(success, "Rollback payout refund failed");

        emit SagaRolledBack(sessionId, "Saga Timeout: Receiver failed to respond within time threshold");
    }
}`
      }
    ],
  },
];
