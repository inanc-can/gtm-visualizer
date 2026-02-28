import { NextRequest, NextResponse } from "next/server";
import type { GTMData } from "@/lib/gtm-data";
import { computeFinancials, financialsAreEmpty } from "@/lib/compute-financials";
import { runVideoAgent, buildFallbackScript } from "@/lib/video-agent";

// POST /api/video-agent
//
// Accepts either:
//   { url: string }         — fetches GTM data from the URL
//   { gtmData: GTMData }    — uses the provided data directly
//
// Returns: { data: GTMData, script: VideoScript, agentSteps: AgentStep[] }
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ---- 1. Resolve GTM data ----
    let raw: GTMData;
    if (body.url && typeof body.url === "string") {
      const res = await fetch(body.url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch data from ${body.url}: ${res.status}`);
      raw = await res.json();
    } else if (body.gtmData) {
      raw = body.gtmData;
    } else {
      return NextResponse.json(
        { error: "Provide either { url } or { gtmData } in the request body" },
        { status: 400 }
      );
    }

    // Basic validation
    if (!raw?.seller?.name || !raw?.product?.name) {
      return NextResponse.json(
        { error: "Invalid GTM data — missing seller.name or product.name" },
        { status: 400 }
      );
    }

    // ---- 2. Compute financials if they're all zero ----
    const data: GTMData = financialsAreEmpty(raw.financials)
      ? { ...raw, financials: computeFinancials(raw.assumptions) }
      : raw;

    // ---- 3. Run the 2-step video agent ----
    let script;
    let agentSteps: { step: number; name: string; output: string }[] = [];
    try {
      const result = await runVideoAgent(data);
      script = result.script;
      agentSteps = result.steps;
    } catch (err) {
      console.warn("[video-agent] Agent failed, using fallback:", err);
      script = buildFallbackScript(data);
    }

    return NextResponse.json({ data, script, agentSteps });
  } catch (error) {
    console.error("[video-agent] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Video agent failed" },
      { status: 500 }
    );
  }
}
