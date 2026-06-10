import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase limit just in case payload has diagrams
app.use(express.json({ limit: "5mb" }));

// Initialize Gemini safely, lazy initialization inside the route as recommended
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it via the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// API endpoint to analyze a custom blockchain issue or brainstorm an architecture
app.post("/api/blockchain/architect", async (req: express.Request, res: express.Response) => {
  try {
    const { blockchain, problem, customDescription } = req.body;
    
    // Lazy check on API client
    const ai = getGeminiClient();

    const systemInstruction = `You are an elite principal blockchain protocol architect, expert Smart Contract auditor, and Web3 cryptographer. 
Analyze blockchain systems and design revolutionary, optimized solutions. Speak in clear, highly professional, technically precise terms.
You must output a highly structured JSON response detailing the problem analysis, the recommended revolutionary dApp or custom L1/L2 consensus/protocol design, 
together with a full, real, production-ready, clean, safe source code snippet (Solidity, Rust/Anchor, or Go/Cosmos-SDK) representing the protocol or core dApp solver, 
and critical security considerations. Keep the code functional, annotated, and avoid placeholder ellipsis inside functions. Use actual logic implementations.`;

    const prompt = `Perform a high-level technical analysis and design a solution for:
BlockChain: ${blockchain}
Core Problem Area: ${problem}
Specific Description / Details: ${customDescription || "Not provided. Analyze the standard protocol bottleneck for this area."}

Generate a JSON object matching this structure:
{
  "blockchain": "string",
  "bottleneckName": "string",
  "technicalFailureAnalysis": "Detailed technical explanation of structural limits, gas overhead, state bloat, UX degradation, or vulnerability",
  "proposedSolutionName": "Innovative, elegant name for the dApp, middleware, or rollup layer",
  "proposedSolutionSummary": "Core value proposition, operational details, and why this is revolutionary",
  "architecturalBreakdown": [
    "Step-by-step description of how transactions / states are processed",
    "How security / validity is guaranteed",
    "Where the game-theoretic incentives lie"
  ],
  "engineCodeLanguage": "solidity | rust | go | typescript",
  "engineCodeTitle": "Name of the main contract or program file",
  "engineCodeContent": "Real, compilable/readable production-quality code. Write real logic with math, state tracking, and modifiers. Include extensive inline guidance explaining security patterns (reentrancy guard, flashloan defense, priority gas tricks, atomic multi-calls, async callbacks, or read/write state limits. Do not truncate functions with comment placeholders! Write genuine loops, safety assertions, and comments!)",
  "securityAuditChecklist": [
    "Critical vector 1: how we mitigated it",
    "Critical vector 2: validation constraints",
    "Defensive assertions in place"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "blockchain",
            "bottleneckName",
            "technicalFailureAnalysis",
            "proposedSolutionName",
            "proposedSolutionSummary",
            "architecturalBreakdown",
            "engineCodeLanguage",
            "engineCodeTitle",
            "engineCodeContent",
            "securityAuditChecklist",
          ],
          properties: {
            blockchain: { type: Type.STRING },
            bottleneckName: { type: Type.STRING },
            technicalFailureAnalysis: { type: Type.STRING },
            proposedSolutionName: { type: Type.STRING },
            proposedSolutionSummary: { type: Type.STRING },
            architecturalBreakdown: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            engineCodeLanguage: { type: Type.STRING },
            engineCodeTitle: { type: Type.STRING },
            engineCodeContent: { type: Type.STRING },
            securityAuditChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini API.");
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini service error:", error);
    res.status(500).json({
      error: error.message || "Internal server error",
      fallback: true,
      message: "Could not fetch dynamic architecture. Make sure GEMINI_API_KEY is configured in Settings > Secrets.",
    });
  }
});

// Configure Vite or Static Assets depending on Environment
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Vite server initialization failed:", err);
});
