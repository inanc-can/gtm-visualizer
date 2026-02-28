import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { GTMData } from "@/lib/gtm-data";
import type { VideoScript } from "@/lib/video-script";

const client = new OpenAI({
  baseURL: "https://api.featherless.ai/v1",
  apiKey: process.env.FEATHERLESS_API_KEY ?? "",
});

const MODEL = process.env.FEATHERLESS_MODEL ?? "Qwen/Qwen2.5-32B-Instruct";

// ---------------------------------------------------------------------------
// System prompt — instructs the LLM to produce a structured video script
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a video script writer for B2B go-to-market strategy presentations.
You work for Bayes Case, a platform that builds probabilistic business cases for strategic decisions.

Given GTM assessment data, generate a scene-by-scene video script as JSON.
The video should showcase Bayes Case's effectiveness at assessing and simulating GTM strategy.

Rules:
- Exactly 8 scenes, total duration 45–60 seconds.
- Each scene must have: sceneId (string), title (string), durationSeconds (number 5–9), narration (1–2 punchy sentences, professional tone), visualCues (array of 2–3 short visual direction strings), and optional dataPoints (key-value pairs of numbers to animate).
- Scene IDs in order: "title", "seller-buyer", "product", "initiative", "kpi-dashboard", "financial-range", "assumptions", "cta"
- The narration should tell a compelling investment story, not just list facts.
- Return ONLY valid JSON — no markdown fences, no extra text.

JSON schema:
{
  "totalDurationSeconds": number,
  "scenes": [
    {
      "sceneId": string,
      "title": string,
      "durationSeconds": number,
      "narration": string,
      "visualCues": string[],
      "dataPoints": Record<string, string | number> | undefined
    }
  ]
}`;

// ---------------------------------------------------------------------------
// POST /api/generate-script
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const { gtmData } = (await req.json()) as { gtmData: GTMData };

    if (!gtmData?.seller?.name || !gtmData?.product?.name) {
      return NextResponse.json(
        { error: "Invalid GTM data provided" },
        { status: 400 }
      );
    }

    const userPrompt = buildUserPrompt(gtmData);

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const content = completion.choices?.[0]?.message?.content ?? "";

    // The model may wrap JSON in markdown code fences — strip them
    const cleaned = content
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const script: VideoScript = JSON.parse(cleaned);

    // Basic validation
    if (!script.scenes || !Array.isArray(script.scenes) || script.scenes.length === 0) {
      throw new Error("Script has no scenes");
    }

    // Ensure totalDurationSeconds matches
    script.totalDurationSeconds = script.scenes.reduce(
      (sum, s) => sum + s.durationSeconds,
      0
    );

    return NextResponse.json(script);
  } catch (error) {
    console.error("[generate-script] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate script",
      },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Build user prompt from GTM data
// ---------------------------------------------------------------------------

function buildUserPrompt(data: GTMData): string {
  const assumptionList = data.assumptions
    .map((a) => `  - ${a.name}: ${a.range.low} – ${a.range.high}`)
    .join("\n");

  return `Generate a video narration script for this GTM strategy assessment:

Seller: ${data.seller.name}
Buyer: ${data.buyer.name}
Product: ${data.product.name}
Product Description: ${data.product.description}

Initiative: ${data.initiative.name}

Financial Projections:
  - ROI: ${data.financials.roi.expected}x (range: ${data.financials.roi.low}x – ${data.financials.roi.high}x)
  - NPV: €${(data.financials.npv.expected / 1_000_000).toFixed(1)}M (range: €${(data.financials.npv.low / 1_000_000).toFixed(1)}M – €${(data.financials.npv.high / 1_000_000).toFixed(1)}M)
  - Payback Period: ${data.financials.paybackPeriodMonths.expected} months (range: ${data.financials.paybackPeriodMonths.low} – ${data.financials.paybackPeriodMonths.high} months)

Key Assumptions:
${assumptionList}

The video should position Bayes Case as the tool that made this assessment possible — turning complex deal data into a clear, probabilistic business case.`;
}
