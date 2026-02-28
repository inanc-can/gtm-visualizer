// ---------------------------------------------------------------------------
// Type definitions matching hackathon-demo.json
// ---------------------------------------------------------------------------

export interface Seller {
  name: string;
}

export interface Buyer {
  name: string;
}

export interface Product {
  name: string;
  description: string;
}

export interface Initiative {
  name: string;
  description: string; // markdown
  corporateObjective: string; // markdown
  strategicIntent: string; // markdown
}

export interface RangeValue {
  expected: number;
  low: number;
  high: number;
}

export interface Financials {
  roi: RangeValue;
  npv: RangeValue;
  paybackPeriodMonths: RangeValue;
}

export interface Assumption {
  name: string;
  description: string;
  range: { low: number; high: number };
}

export interface GTMData {
  seller: Seller;
  buyer: Buyer;
  product: Product;
  initiative: Initiative;
  financials: Financials;
  assumptions: Assumption[];
}

// ---------------------------------------------------------------------------
// CTA (kept for the Bayes Case footer CTA)
// ---------------------------------------------------------------------------
export interface CTASection {
  demoUrl: string;
  headline: string;
  subheadline?: string;
}

export const ctaData: CTASection = {
  demoUrl: "https://app.bayescase.com/signup",
  headline: "Ready to simulate your GTM approach?",
  subheadline:
    "Build probabilistic business cases in minutes with Bayes Case",
};

// ---------------------------------------------------------------------------
// Primary dataset — sourced from hackathon-demo.json
// ---------------------------------------------------------------------------
export const sampleGTMData: GTMData = {
  seller: {
    name: "Amazon web services",
  },
  buyer: {
    name: "BMW",
  },
  product: {
    name: "Amazon Bedrock",
    description:
      "Amazon Bedrock is a fully managed service that makes high-performing foundation models (FMs) from leading AI companies available through a unified API. It enables enterprises to build and scale generative AI applications with security, privacy, and responsible AI capabilities built in — without the need to manage any infrastructure.",
  },
  initiative: {
    name: "AI-Driven Customer Insights",
    description:
      "## Overview\n\nBMW wants to leverage **generative AI** to gain deeper, more actionable insights into customer preferences and behaviors across all touchpoints — from digital configurators and test drive bookings to aftersales interactions and connected-vehicle telemetry.\n\n## Key Goals\n\n- **Personalized marketing**: Tailor campaigns at the individual level using propensity models built on foundation models\n- **Product development feedback loops**: Surface latent feature requests and sentiment trends from unstructured feedback (reviews, service tickets, social media)\n- **Omnichannel consistency**: Ensure every customer interaction — whether in-dealership, online, or in-vehicle — is informed by a unified customer profile\n\n## Expected Impact\n\nBy consolidating fragmented data sources into a single AI-driven analytics pipeline, BMW expects to reduce time-to-insight from **weeks to hours** while increasing the precision of customer segmentation by an estimated **30–50%**.",
    corporateObjective:
      '## Software & Digital Vehicle Platform\n\nBMW\'s **"Neue Klasse"** generation represents a fundamental shift from hardware-centric to software-defined vehicle architecture. The corporate objective centers on three pillars:\n\n1. **Digital-first customer experience** — every vehicle ships with an always-connected digital cockpit and personalization engine\n2. **Over-the-air (OTA) monetization** — recurring revenue streams through feature-on-demand, subscription services, and data-driven insurance\n3. **Platform scalability** — a shared software stack across BMW, MINI, and Rolls-Royce that reduces per-model development cost by up to 40%\n\nThis investment in Amazon Bedrock directly supports pillar #1 by enabling real-time, AI-powered personalization at scale.',
    strategicIntent:
      '## Becoming a Digital-Services Leader\n\nBMW is committed to becoming a **leading provider of software and digital services** in the automotive industry, moving beyond the traditional OEM model toward a technology-and-services company.\n\n### Strategic Priorities\n\n- **Data monetization**: Transform the 12+ million connected vehicles in the fleet into a proprietary data asset that fuels predictive analytics, insurance telematics, and smart-city partnerships\n- **AI center of excellence**: Establish an internal AI CoE (Munich & Shanghai) that owns model training, evaluation, and governance — with Amazon Bedrock as the foundational inference layer\n- **Ecosystem lock-in**: Build a BMW digital ecosystem (My BMW app, in-car assistant, dealer portal) so compelling that switching costs rival those of consumer tech platforms\n- **Speed to market**: Cut AI-feature delivery cycles from 12 months to **< 8 weeks** by leveraging managed foundation-model infrastructure instead of self-hosted GPU clusters\n\n> *"We don\'t just build cars — we build relationships powered by intelligence."*\n> — BMW Digital Strategy Board, 2025',
  },
  financials: {
    roi: { expected: 1.8, low: 1.5, high: 2.5 },
    npv: { expected: 5000000, low: 3000000, high: 7000000 },
    paybackPeriodMonths: { expected: 18, low: 12, high: 24 },
  },
  assumptions: [
    {
      name: "Number of customers analyzed",
      description:
        "Total unique customer profiles ingested from CRM, connected-vehicle telemetry, and digital-channel clickstream data that will be processed through the Bedrock-powered analytics pipeline on a rolling 12-month basis.",
      range: { low: 100000, high: 500000 },
    },
    {
      name: "Increase in customer retention rate",
      description:
        "Projected uplift in annual customer retention attributed to personalized re-engagement campaigns, proactive service reminders, and AI-curated loyalty offers generated by foundation models.",
      range: { low: 0.02, high: 0.05 },
    },
    {
      name: "Increase in average revenue per user (€)",
      description:
        "Additional monthly revenue per active digital-services subscriber driven by higher attach rates on feature-on-demand packages, contextual upsell recommendations, and improved conversion from free trials to paid tiers.",
      range: { low: 10, high: 50 },
    },
    {
      name: "Implementation cost for Amazon Bedrock (€)",
      description:
        "Total cost of ownership for the first 24 months, including AWS service fees, data-pipeline engineering, model fine-tuning, internal staffing (AI CoE headcount), security & compliance certification, and change-management across BMW's global dealer network.",
      range: { low: 1000000, high: 2000000 },
    },
  ],
};
