import React from "react";
import { AbsoluteFill } from "remotion";
import { FadeIn } from "../components/FadeIn";
import { AnimatedBar } from "../components/AnimatedBar";
import { colors as TOKENS } from "@/style/tokens";
import type { SceneScript } from "@/lib/video-script";
import type { Financials } from "@/lib/gtm-data";

interface Props {
  script: SceneScript;
  financials: Financials;
}

interface ScenarioRow {
  label: string;
  icon: string;
  color: string;
  roi: string;
  npv: string;
  payback: string;
  barPercent: number;
}

// ---------------------------------------------------------------------------
// Static style objects — hoisted to avoid recreation every frame (30fps)
// ---------------------------------------------------------------------------
const sceneFill: React.CSSProperties = {
  background: "linear-gradient(135deg, #0a0a1a 0%, #111827 50%, #0d1b2a 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Inter, system-ui, sans-serif",
  padding: "0 100px",
};

const sectionLabelStyle: React.CSSProperties = {
  color: TOKENS.green,
  fontSize: 16,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 3,
  marginBottom: 10,
  textAlign: "center",
};

const sectionTitleStyle: React.CSSProperties = {
  color: "#fff",
  fontSize: 44,
  fontWeight: 800,
  textAlign: "center",
  margin: "0 0 50px 0",
};

const scenariosRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 30,
  width: "100%",
  maxWidth: 1500,
};

const metricLabelStyle: React.CSSProperties = { color: "rgba(148,163,184,0.7)", fontSize: 16 };

const metricRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const narrationStyle: React.CSSProperties = {
  color: "rgba(148,163,184,0.5)",
  fontSize: 18,
  fontStyle: "italic",
  marginTop: 40,
  textAlign: "center",
  maxWidth: 800,
  lineHeight: 1.5,
};

// ---------------------------------------------------------------------------

export const FinancialRangeScene: React.FC<Props> = ({ script, financials }) => {
  const scenarios: ScenarioRow[] = [
    {
      label: "Low",
      icon: "⚠️",
      color: TOKENS.amber,
      roi: `${financials.roi.low}x`,
      npv: `€${(financials.npv.low / 1_000_000).toFixed(1)}M`,
      payback: `${financials.paybackPeriodMonths.high} mo`,
      barPercent: 50,
    },
    {
      label: "Expected",
      icon: "✅",
      color: TOKENS.mainPurple,
      roi: `${financials.roi.expected}x`,
      npv: `€${(financials.npv.expected / 1_000_000).toFixed(1)}M`,
      payback: `${financials.paybackPeriodMonths.expected} mo`,
      barPercent: 72,
    },
    {
      label: "High",
      icon: "🚀",
      color: TOKENS.green,
      roi: `${financials.roi.high}x`,
      npv: `€${(financials.npv.high / 1_000_000).toFixed(1)}M`,
      payback: `${financials.paybackPeriodMonths.low} mo`,
      barPercent: 95,
    },
  ];

  return (
    <AbsoluteFill style={sceneFill}>
      {/* Header */}
      <FadeIn delay={0} direction="down" distance={15}>
        <p style={sectionLabelStyle}>
          Financial Scenarios
        </p>
        <h2 style={sectionTitleStyle}>
          Business Case Outcomes
        </h2>
      </FadeIn>

      {/* Scenario rows */}
      <div style={scenariosRowStyle}>
        {scenarios.map((s, i) => (
          <FadeIn key={s.label} delay={15 + i * 15} direction="up" distance={30} style={{ flex: 1 }}>
            <div
              style={{
                height: "100%",
                background: `${s.color}08`,
                border: `1px solid ${s.color}30`,
                borderTop: `4px solid ${s.color}`,
                borderRadius: 16,
                padding: "30px 36px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 28 }}>{s.icon}</span>
                <span style={{ color: s.color, fontSize: 22, fontWeight: 700 }}>{s.label}</span>
              </div>

              {[
                { metric: "ROI", value: s.roi },
                { metric: "NPV", value: s.npv },
                { metric: "Payback", value: s.payback },
              ].map((row) => (
                <div
                  key={row.metric}
                  style={metricRowStyle}
                >
                  <span style={metricLabelStyle}>{row.metric}</span>
                  <span style={{ color: s.color, fontSize: 22, fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}

              <AnimatedBar
                widthPercent={s.barPercent}
                height={6}
                color={s.color}
                delay={30 + i * 15}
                style={{ marginTop: 8 }}
              />
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Narration */}
      <FadeIn delay={70} direction="none">
        <p style={narrationStyle}>
          {script.narration}
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
};
