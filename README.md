# 📊 Bayes Case — GTM Visualizer

> **Probabilistic business cases for strategic decisions.**  
> Turn raw deal data into a beautiful, data-backed GTM assessment page — complete with an animated video, financial scenarios, and a full model methodology — in seconds.

---

## What It Does

Bayes Case GTM Visualizer takes a structured JSON file per deal (stored on S3) and renders a shareable, production-ready assessment page at `/[slug]`.

Each page includes:

- **Hero** — Seller × Buyer partnership framing with markdown-rendered product description  
- **KPI Cards** — Expected ROI, Net Present Value, and Payback Period with confidence ranges  
- **Financial Scenarios** — Low / Expected / High outcomes side-by-side  
- **Animated Video** — A full Remotion-powered scene-by-scene video presentation auto-generated from deal data  
- **Initiative Deep-Dive** — Tabbed markdown sections: Initiative Overview, Corporate Objective, Strategic Intent  
- **Assumptions Table** — Full assumptions with low→high ranges, truncation, and keyboard-accessible tooltips  
- **Methodology** — Optional collapsible section documenting modelling steps and data sources  
- **CTA** — Conversion-optimised trial/demo capture section  

Financials are computed on the server: if the JSON provides zero values, the engine runs a probabilistic range model over the assumptions to derive ROI, NPV, and payback period automatically.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, TypeScript) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Video | [Remotion](https://www.remotion.dev) (player + animated scenes) |
| Markdown | [react-markdown](https://github.com/remarkjs/react-markdown) + remark-gfm |
| AI (on-demand) | [OpenAI](https://openai.com) — script generation via `/api/video-agent` |
| Data | AWS S3 — one JSON file per deal, fetched by slug |
| Design tokens | Centralised `src/style/tokens.ts` consumed across UI and Remotion scenes |

---

## Data Schema

Each deal is a single JSON file uploaded to S3 as `{slug}.json`:

```jsonc
{
  "seller":     { "name": "…" },
  "buyer":      { "name": "…" },
  "product":    { "name": "…", "description": "markdown supported" },
  "initiative": {
    "name": "…",
    "description": "markdown",
    "corporateObjective": "markdown",
    "strategicIntent": "markdown"
  },
  "financials": {
    "roi":                  { "expected": 0, "low": 0, "high": 0 },
    "npv":                  { "expected": 0, "low": 0, "high": 0 },
    "paybackPeriodMonths":  { "expected": 0, "low": 0, "high": 0 }
  },
  "assumptions": [
    {
      "name": "…",
      "description": "…",
      "range": { "low": 0, "high": 0 }
    }
  ],
  "methodology": {           // optional
    "summary": "…",
    "steps": [{ "title": "…", "description": "markdown" }],
    "dataSources": ["markdown link strings"]
  }
}
```

> If all financials are zero the page auto-computes them from the assumption ranges.

---

## Project Structure

```
src/
├── app/
│   ├── [slug]/page.tsx       # Main deal page (server component)
│   └── api/
│       ├── generate-script/  # On-demand AI script generation
│       └── video-agent/      # Full AI video agent endpoint
├── components/
│   ├── LazyVideoPlayer.tsx   # Client-only Remotion player wrapper
│   ├── InitiativeSection.tsx # Tabbed initiative deep-dive
│   ├── MethodologySection.tsx# Always-expanded methodology panel
│   └── ui/                   # shadcn primitives (Button, Badge, Card…)
├── remotion/
│   ├── GTMVideo.tsx          # Root Remotion composition
│   ├── components/           # AnimatedBar, AnimatedCounter, FadeIn
│   └── scenes/               # 8 animated video scenes
├── lib/
│   ├── compute-financials.ts # Probabilistic range → ROI / NPV / payback
│   ├── gtm-data.ts           # TypeScript interfaces + sample data
│   └── video-script.ts       # Fallback script builder (no LLM)
└── style/
    └── tokens.ts             # Centralised brand color/gradient tokens
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to the default demo deal.

To load a custom deal, upload your JSON to S3 and navigate to:

```
http://localhost:3000/{your-slug}
```

### Environment variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=sk-...   # Required only for on-demand AI script generation
```

---

## Deployment

The project is optimised for deployment on [Vercel](https://vercel.com). The `/[slug]` route is server-rendered on demand with 1-hour ISR revalidation.

```bash
npm run build   # Validate production build locally
```

---

## License

MIT

