// ---------------------------------------------------------------------------
// Video script types — shared between API route and Remotion composition
// ---------------------------------------------------------------------------

export interface SceneScript {
  sceneId: string;
  title: string;
  durationSeconds: number;
  narration: string;
  visualCues: string[];
  dataPoints?: Record<string, string | number>;
}

export interface VideoScript {
  totalDurationSeconds: number;
  scenes: SceneScript[];
}

// ---------------------------------------------------------------------------
// Fallback script — used when API is unavailable or during loading
// ---------------------------------------------------------------------------

export const fallbackScript: VideoScript = {
  totalDurationSeconds: 55,
  scenes: [
    {
      sceneId: "title",
      title: "GTM Strategy Assessment",
      durationSeconds: 5,
      narration:
        "Bayes Case — Probabilistic business cases for strategic decisions.",
      visualCues: ["Logo fade-in", "Title spring animation", "Gradient background"],
    },
    {
      sceneId: "seller-buyer",
      title: "Seller → Buyer",
      durationSeconds: 6,
      narration:
        "Amazon Web Services is proposing a strategic initiative to BMW — powered by Amazon Bedrock.",
      visualCues: [
        "AWS badge slides from left",
        "Arrow animates center",
        "BMW badge slides from right",
      ],
    },
    {
      sceneId: "product",
      title: "Amazon Bedrock",
      durationSeconds: 6,
      narration:
        "Amazon Bedrock provides fully managed foundation models through a unified API — enabling generative AI at enterprise scale.",
      visualCues: [
        "Product name springs in",
        "Description fades up",
        "Key capabilities stagger",
      ],
    },
    {
      sceneId: "initiative",
      title: "AI-Driven Customer Insights",
      durationSeconds: 7,
      narration:
        "The initiative: AI-Driven Customer Insights — personalized marketing, product feedback loops, and omnichannel consistency for BMW's global customer base.",
      visualCues: [
        "Initiative title animates",
        "Three goal bullets stagger in",
        "Impact metric highlights",
      ],
    },
    {
      sceneId: "kpi-dashboard",
      title: "Key Performance Indicators",
      durationSeconds: 9,
      narration:
        "Bayes Case assessed the probabilistic outcomes: 1.8x expected ROI, €5 million net present value, and an 18-month payback period.",
      visualCues: [
        "Three KPI cards animate in",
        "Counter rolls up to target",
        "Range bars fill with gradient",
      ],
      dataPoints: {
        roi: 1.8,
        npv: 5000000,
        payback: 18,
      },
    },
    {
      sceneId: "financial-range",
      title: "Scenario Analysis",
      durationSeconds: 7,
      narration:
        "From conservative to optimistic — every scenario shows positive returns. The range analysis gives decision-makers confidence in the investment thesis.",
      visualCues: [
        "Three scenario columns animate",
        "Bar charts grow sequentially",
        "Color-coded indicators",
      ],
    },
    {
      sceneId: "assumptions",
      title: "Model Assumptions",
      durationSeconds: 7,
      narration:
        "Four key assumptions drive the model: customer volume, retention uplift, revenue per user, and implementation cost — each with transparent ranges.",
      visualCues: [
        "Assumption cards fly in",
        "Range spectrum bars animate",
        "Low-to-high gradient fills",
      ],
    },
    {
      sceneId: "cta",
      title: "Get Started",
      durationSeconds: 8,
      narration:
        "Bayes Case transforms weeks of spreadsheet modeling into minutes of probabilistic intelligence. Ready to simulate your GTM strategy?",
      visualCues: [
        "CTA text fades in",
        "URL and branding animate",
        "Final logo pulse",
      ],
    },
  ],
};
