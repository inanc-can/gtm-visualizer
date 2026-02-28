/**
 * Video agent — 2-step LLM pipeline that produces a Remotion VideoScript.
 *
 * Importable from both the Next.js API route (client-triggered regeneration)
 * and server components (SSR-time generation so the page arrives script-ready).
 *
 * Step 1 — Story Analysis + Narration Plan
 *   The model reads the GTM data, identifies the strongest narrative angle,
 *   and drafts a punchy narration (≤ 25 words) for every scene.
 *
 * Step 2 — JSON Generation + Inline Self-Critique
 *   The model converts the plan into the exact Remotion schema **and**
 *   immediately self-validates common issues in the same turn, returning
 *   only the final corrected JSON.
 */

import OpenAI from "openai";
import type { GTMData } from "./gtm-data";
import type { VideoScript, SceneScript } from "./video-script";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AgentStep {
  step: number;
  name: string;
  output: string;
}

type Message = OpenAI.Chat.ChatCompletionMessageParam;

// ---------------------------------------------------------------------------
// featherless.ai client — reads env vars so this works in both App Router
// server components and API routes.
// ---------------------------------------------------------------------------

function makeClient() {
  return new OpenAI({
    baseURL: "https://api.featherless.ai/v1",
    apiKey: process.env.FEATHERLESS_API_KEY ?? "",
  });
}

const MODEL = () => process.env.FEATHERLESS_MODEL ?? "Qwen/Qwen2.5-32B-Instruct";

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a world-class video scriptwriter for Bayes Case — a platform that builds probabilistic B2B go-to-market business cases. You produce compelling video narratives that feel like investment pitches.

The Remotion composition has exactly 8 pre-built animated scenes in this fixed order:

1. title           — Full-screen branded intro. One punchy typewriter hook line.
2. seller-buyer    — Seller badge → arrow → Buyer badge. Deal context narration.
3. product         — Product name springs in, description fades up. Value prop.
4. initiative      — Initiative name + 3 goal bullets. Business impact.
5. kpi-dashboard   — 3 KPI cards: ROI, NPV, Payback. Rolling counters. **Most important scene.**
6. financial-range — 3 scenario columns (Conservative / Expected / Optimistic). Confidence story.
7. assumptions     — 2×2 grid of 4 assumption cards with range bars. Transparency story.
8. cta             — "Simulate your GTM with Bayes Case" + Book a Demo. Closing pitch.

Hard rules:
- Total video: 45–60 seconds total. Each scene: 5–9 seconds.
- Every narration: max 25 words. Punchy, professional, investment-pitch tone.
- Always use the ACTUAL names and numbers from the data — never placeholders.
- kpi-dashboard MUST include dataPoints: { "roi": number, "npv": number, "payback": number }.`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stripThinking(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

function parseScriptJSON(raw: string): VideoScript {
  const cleaned = stripThinking(raw)
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const script: VideoScript = JSON.parse(cleaned);

  if (!script.scenes || !Array.isArray(script.scenes) || script.scenes.length === 0) {
    throw new Error("Parsed script has no scenes");
  }

  script.totalDurationSeconds = script.scenes.reduce(
    (sum, s) => sum + s.durationSeconds,
    0
  );

  return script;
}

function buildDataContext(data: GTMData): string {
  const fmt = (n: number) => {
    if (Math.abs(n) >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
    if (Math.abs(n) >= 1_000) return `€${(n / 1_000).toFixed(0)}K`;
    return `€${n}`;
  };

  const assumptionList = data.assumptions
    .slice(0, 8)
    .map((a) => `  - ${a.name}: ${a.range.low}–${a.range.high} (${a.description.slice(0, 80)}…)`)
    .join("\n");

  const initiativeSnippet = data.initiative.description
    .replace(/#+\s+/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .slice(0, 300);

  return `SELLER: ${data.seller.name}
BUYER: ${data.buyer.name}
PRODUCT: ${data.product.name}
PRODUCT DESCRIPTION: ${data.product.description.slice(0, 250)}

INITIATIVE: ${data.initiative.name}
INITIATIVE CONTEXT: ${initiativeSnippet}

FINANCIAL PROJECTIONS (from ${data.assumptions.length} probabilistic assumptions):
  - ROI:     ${data.financials.roi.expected}x expected  (low ${data.financials.roi.low}x — high ${data.financials.roi.high}x)
  - NPV:     ${fmt(data.financials.npv.expected)} expected  (low ${fmt(data.financials.npv.low)} — high ${fmt(data.financials.npv.high)})
  - Payback: ${data.financials.paybackPeriodMonths.expected} months expected  (low ${data.financials.paybackPeriodMonths.low} — high ${data.financials.paybackPeriodMonths.high} months)

KEY ASSUMPTIONS (first 8 of ${data.assumptions.length}):
${assumptionList}`;
}

async function chat(
  client: OpenAI,
  messages: Message[],
  temperature: number,
  max_tokens: number
): Promise<string> {
  const MAX_RETRIES = 5;
  let delay = 3000; // start at 3 s

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: MODEL(),
        messages,
        temperature,
        max_tokens,
      });
      return stripThinking(completion.choices?.[0]?.message?.content ?? "");
    } catch (err: unknown) {
      // Retry on 429 (concurrency / rate limit) with exponential backoff
      const status =
        err instanceof Error && "status" in err ? (err as { status: number }).status : 0;
      if (status === 429 && attempt < MAX_RETRIES) {
        console.warn(
          `[video-agent] 429 concurrency limit — retrying in ${delay / 1000}s (attempt ${attempt + 1}/${MAX_RETRIES})`
        );
        await new Promise((r) => setTimeout(r, delay));
        delay = Math.min(delay * 2, 30_000); // cap at 30 s
        continue;
      }
      throw err;
    }
  }
  // TypeScript unreachable — loop always throws or returns
  throw new Error("chat: exceeded max retries");
}

// ---------------------------------------------------------------------------
// 2-step agent
// ---------------------------------------------------------------------------

export async function runVideoAgent(
  data: GTMData
): Promise<{ script: VideoScript; steps: AgentStep[] }> {
  const client = makeClient();
  const steps: AgentStep[] = [];
  const dataContext = buildDataContext(data);

  const thread: Message[] = [{ role: "system", content: SYSTEM_PROMPT }];

  // ── Step 1: Story Analysis + Narration Plan ──────────────────────────────
  // Single turn that both analyses the data and drafts all 8 narrations.
  thread.push({
    role: "user",
    content: `Here is the GTM assessment data:\n\n${dataContext}

Think about:
1. The single most impressive financial metric (and why it's compelling to a buyer CFO)
2. The emotional story arc of this deal (efficiency, revenue, risk reduction, etc.)
3. The ideal tone in 3 words

Then write a narration draft (max 25 words each) for all 8 scenes in this order:
title | seller-buyer | product | initiative | kpi-dashboard | financial-range | assumptions | cta

Use exact names and numbers from the data. Format as:
[scene-id]: <narration>`,
  });

  const plan = await chat(client, thread, 0.7, 1200);
  thread.push({ role: "assistant", content: plan });
  steps.push({ step: 1, name: "Story Analysis & Narration Plan", output: plan });
  console.log("[video-agent] Step 1 complete");

  // ── Step 2: JSON Generation + Inline Self-Critique ──────────────────────
  // The model writes the JSON and immediately self-checks it in one turn,
  // returning only the corrected final version.
  const jsonSchema = `{
  "totalDurationSeconds": number,
  "scenes": [
    {
      "sceneId": "title"|"seller-buyer"|"product"|"initiative"|"kpi-dashboard"|"financial-range"|"assumptions"|"cta",
      "title": string,
      "durationSeconds": number (5–9),
      "narration": string (max 25 words),
      "visualCues": string[] (2–3 items),
      "dataPoints"?: { "roi": number, "npv": number, "payback": number }  // kpi-dashboard only
    }
  ]
}`;

  thread.push({
    role: "user",
    content: `Convert the narration plan above into the final Remotion video script JSON using this schema:

${jsonSchema}

Immediately after writing the JSON, silently check:
✓ All 8 scenes present in correct order?
✓ Every narration ≤ 25 words?
✓ kpi-dashboard has dataPoints with roi/npv/payback as real numbers from the data?
✓ Every durationSeconds between 5 and 9?
✓ Total duration between 45 and 60 seconds?
✓ No placeholder text like [seller] or [buyer]?

Fix any issues inline, then return ONLY the final corrected JSON — no markdown fences, no explanation.`,
  });

  const jsonOutput = await chat(client, thread, 0.2, 2500);
  steps.push({ step: 2, name: "JSON Script + Self-Validation", output: jsonOutput });
  console.log("[video-agent] Step 2 complete");

  const script = parseScriptJSON(jsonOutput);
  return { script, steps };
}

// ---------------------------------------------------------------------------
// Data-driven fallback — used when the LLM is unavailable
// ---------------------------------------------------------------------------

export function buildFallbackScript(data: GTMData): VideoScript {
  const fmt = (n: number) => {
    if (Math.abs(n) >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
    if (Math.abs(n) >= 1_000) return `€${(n / 1_000).toFixed(0)}K`;
    return `€${n}`;
  };

  // Truncate to at most N words cleanly
  const w = (text: string, max: number) => {
    const parts = text.trim().split(/\s+/);
    return parts.length <= max ? text.trim() : parts.slice(0, max).join(" ") + "…";
  };

  // Top assumption name for a specific callout
  const topAssumption = data.assumptions[0]?.name ?? "key model inputs";

  // Financial range copy — avoids "every scenario positive" when low ROI ≤ 0
  const rangeNarration =
    data.financials.roi.low > 0
      ? `Even the conservative case delivers ${data.financials.roi.low}x ROI. Expected: ${data.financials.roi.expected}x. Optimistic ceiling: ${data.financials.roi.high}x.`
      : `Expected ROI: ${data.financials.roi.expected}x. Conservative: ${data.financials.roi.low}x. Optimistic: ${data.financials.roi.high}x.`;

  const scenes: SceneScript[] = [
    {
      sceneId: "title",
      title: "GTM Strategy Assessment",
      durationSeconds: 5,
      narration: w(`${data.seller.name} × ${data.buyer.name} — a data-driven business case for ${data.product.name}.`, 25),
      visualCues: ["Logo fade-in", "Title typewriter", "Gradient background"],
    },
    {
      sceneId: "seller-buyer",
      title: `${data.seller.name} → ${data.buyer.name}`,
      durationSeconds: 6,
      narration: w(`${data.seller.name} is presenting ${data.product.name} to ${data.buyer.name}. Here's what the numbers say.`, 25),
      visualCues: ["Seller slides from left", "Arrow animates", "Buyer slides from right"],
    },
    {
      sceneId: "product",
      title: data.product.name,
      durationSeconds: 6,
      narration: w(data.product.description, 22),
      visualCues: ["Product name springs in", "Description fades up", "Line animates"],
    },
    {
      sceneId: "initiative",
      title: data.initiative.name,
      durationSeconds: 7,
      narration: w(`${data.initiative.name}: ${data.buyer.name}'s strategic bet on ${data.product.name} — quantified by Bayes Case.`, 25),
      visualCues: ["Initiative title animates", "Goal bullets stagger", "Impact highlights"],
    },
    {
      sceneId: "kpi-dashboard",
      title: "Key Performance Indicators",
      durationSeconds: 9,
      narration: w(`${data.financials.roi.expected}x ROI. ${fmt(data.financials.npv.expected)} NPV. ${data.financials.paybackPeriodMonths.expected}-month payback. Probabilistically assessed by Bayes Case.`, 25),
      visualCues: ["KPI cards animate", "Counters roll up", "Range bars fill"],
      dataPoints: {
        roi: data.financials.roi.expected,
        npv: data.financials.npv.expected,
        payback: data.financials.paybackPeriodMonths.expected,
      },
    },
    {
      sceneId: "financial-range",
      title: "Scenario Analysis",
      durationSeconds: 7,
      narration: w(rangeNarration, 25),
      visualCues: ["Scenario columns animate", "Bars grow", "Color-coded indicators"],
    },
    {
      sceneId: "assumptions",
      title: "Model Assumptions",
      durationSeconds: 7,
      narration: w(`${data.assumptions.length} probabilistic assumptions drive this model — starting with ${topAssumption}.`, 25),
      visualCues: ["Assumption cards fly in", "Range bars animate", "Gradient fills"],
    },
    {
      sceneId: "cta",
      title: "Get Started",
      durationSeconds: 8,
      narration: w(`Bayes Case modelled ${data.assumptions.length} assumptions to reach this conviction. Ready to simulate your deal?`, 25),
      visualCues: ["CTA fades in", "Button animates", "Logo pulse"],
    },
  ];

  return {
    totalDurationSeconds: scenes.reduce((s, sc) => s + sc.durationSeconds, 0),
    scenes,
  };
}
