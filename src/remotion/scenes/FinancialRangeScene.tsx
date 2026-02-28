import React from "react";
import { AbsoluteFill } from "remotion";
import { FadeIn } from "../components/FadeIn";
import { AnimatedBar } from "../components/AnimatedBar";
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

export const FinancialRangeScene: React.FC<Props> = ({ script, financials }) => {
  const scenarios: ScenarioRow[] = [
    {
      label: "Conservative",
      icon: "⚠️",
      color: "#F59E0B",
      roi: `${financials.roi.low}x`,
      npv: `€${(financials.npv.low / 1_000_000).toFixed(1)}M`,
      payback: `${financials.paybackPeriodMonths.high} mo`,
      barPercent: 50,
    },
    {
      label: "Expected",
      icon: "✅",
      color: "#3B82F6",
      roi: `${financials.roi.expected}x`,
      npv: `€${(financials.npv.expected / 1_000_000).toFixed(1)}M`,
      payback: `${financials.paybackPeriodMonths.expected} mo`,
      barPercent: 72,
    },
    {
      label: "Optimistic",
      icon: "🚀",
      color: "#10B981",
      roi: `${financials.roi.high}x`,
      npv: `€${(financials.npv.high / 1_000_000).toFixed(1)}M`,
      payback: `${financials.paybackPeriodMonths.low} mo`,
      barPercent: 95,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #111827 50%, #0d1b2a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "0 100px",
      }}
    >
      {/* Header */}
      <FadeIn delay={0} direction="down" distance={15}>
        <p
          style={{
            color: "#10B981",
            fontSize: 16,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 3,
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Financial Scenarios
        </p>
        <h2
          style={{
            color: "#fff",
            fontSize: 44,
            fontWeight: 800,
            textAlign: "center",
            margin: "0 0 50px 0",
          }}
        >
          Business Case Outcomes
        </h2>
      </FadeIn>

      {/* Scenario rows */}
      <div style={{ display: "flex", gap: 30, width: "100%", maxWidth: 1500 }}>
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
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span style={{ color: "rgba(148,163,184,0.7)", fontSize: 16 }}>{row.metric}</span>
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
        <p
          style={{
            color: "rgba(148,163,184,0.5)",
            fontSize: 18,
            fontStyle: "italic",
            marginTop: 40,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          {script.narration}
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
};
