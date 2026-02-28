import type { Assumption, Financials } from "./gtm-data";

// ---------------------------------------------------------------------------
// Compute financials from assumption ranges when the API returns all zeros.
// Shared between the page (SSR) and the video-agent (API route).
// ---------------------------------------------------------------------------

type Range = { low: number; high: number };

export function computeFinancials(assumptions: Assumption[]): Financials {
  const get = (name: string): Range => {
    const found = assumptions.find((a) => a.name === name);
    return found?.range ?? { low: 0, high: 0 };
  };
  const mid = (r: Range) => (r.low + r.high) / 2;

  // ---------- Assumption ranges ----------
  const implCost      = get("Bedrock implementation cost");
  const trainCost     = get("Bedrock training cost");
  const legacyInfra   = get("Legacy model and infrastructure cost");
  const engineers     = get("Software engineers");
  const engAdopt      = get("Engineer adoption rate");
  const engHours      = get("Hours saved per engineer");
  const engCostHr     = get("Engineer cost per hour");
  const engReal       = get("Engineer realization rate");
  const opsStaff      = get("Operations staff");
  const opsAdopt      = get("Operations adoption rate");
  const opsHours      = get("Hours saved per operations staff");
  const opsCostHr     = get("Operations cost per hour");
  const opsReal       = get("Operations realization rate");
  const ccAgents      = get("Contact center agents");
  const ccAdopt       = get("Contact center adoption rate");
  const agentHours    = get("Hours saved per agent");
  const agentCostHr   = get("Agent cost per hour");
  const agentReal     = get("Agent realization rate");
  const requests      = get("Bedrock requests");
  const inputTok      = get("Average input tokens");
  const outputTok     = get("Average output tokens");
  const inputPrice    = get("Price per million input tokens");
  const outputPrice   = get("Price per million output tokens");
  const overheadRate  = get("Bedrock overhead rate");
  const bedrockFTE    = get("Bedrock platform FTE");
  const legacyFTE     = get("Legacy platform FTE");
  const fteCost       = get("Cost per platform FTE");

  const WEEKS = 52;
  const MONTHS = 12;
  const YEARS = 3;
  const DISCOUNT = 0.10;

  function calc(mode: "conservative" | "expected" | "optimistic") {
    // benefit-side: conservative → low, optimistic → high
    const b = (r: Range) =>
      mode === "conservative" ? r.low : mode === "optimistic" ? r.high : mid(r);
    // cost-side: conservative → high, optimistic → low
    const c = (r: Range) =>
      mode === "conservative" ? r.high : mode === "optimistic" ? r.low : mid(r);

    const annualProductivity =
      b(engineers) * b(engAdopt) * b(engHours)  * WEEKS * b(engCostHr) * b(engReal) +
      b(opsStaff)  * b(opsAdopt) * b(opsHours)  * WEEKS * b(opsCostHr) * b(opsReal) +
      b(ccAgents)  * b(ccAdopt)  * b(agentHours) * WEEKS * b(agentCostHr) * b(agentReal);

    const annualLegacySavings =
      b(legacyInfra) +
      Math.max(b(legacyFTE) - c(bedrockFTE), 0) * b(fteCost) * MONTHS;

    const annualBedrockCost =
      (c(requests) *
        (c(inputTok) * c(inputPrice) + c(outputTok) * c(outputPrice)) /
        1_000_000) *
      (1 + c(overheadRate));

    const annualBedrockFTECost = c(bedrockFTE) * c(fteCost) * MONTHS;
    const oneTimeCost = c(implCost) + c(trainCost);

    const annualBenefit = annualProductivity + annualLegacySavings;
    const annualCost    = annualBedrockCost + annualBedrockFTECost;
    const annualNet     = annualBenefit - annualCost;

    const totalBenefit = annualBenefit * YEARS;
    const totalCost    = oneTimeCost + annualCost * YEARS;
    const roi = totalCost > 0 ? Math.round((totalBenefit / totalCost) * 10) / 10 : 0;

    let npv = -oneTimeCost;
    for (let yr = 1; yr <= YEARS; yr++) npv += annualNet / Math.pow(1 + DISCOUNT, yr);
    npv = Math.round(npv / 1_000) * 1_000;

    const monthlyNet = annualNet / MONTHS;
    const payback = monthlyNet > 0 ? Math.round(oneTimeCost / monthlyNet) : 0;

    return { roi: Math.max(roi, 0), npv: Math.round(npv), payback: Math.max(payback, 1) };
  }

  const lo = calc("conservative");
  const ex = calc("expected");
  const hi = calc("optimistic");

  return {
    roi:                 { low: lo.roi,    expected: ex.roi,    high: hi.roi    },
    npv:                 { low: lo.npv,    expected: ex.npv,    high: hi.npv    },
    paybackPeriodMonths: {
      low:      Math.min(lo.payback, hi.payback),
      expected: ex.payback,
      high:     Math.max(lo.payback, hi.payback),
    },
  };
}

/** Returns true when all three expected financial values are zero */
export function financialsAreEmpty(financials: {
  roi: { expected: number };
  npv: { expected: number };
  paybackPeriodMonths: { expected: number };
}): boolean {
  return (
    financials.roi.expected === 0 &&
    financials.npv.expected === 0 &&
    financials.paybackPeriodMonths.expected === 0
  );
}
