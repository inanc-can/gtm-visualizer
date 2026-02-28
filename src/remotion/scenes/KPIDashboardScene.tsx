import React from "react";
import { AbsoluteFill } from "remotion";
import { FadeIn } from "../components/FadeIn";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { AnimatedBar } from "../components/AnimatedBar";
import type { SceneScript } from "@/lib/video-script";
import type { Financials } from "@/lib/gtm-data";

interface Props {
  script: SceneScript;
  financials: Financials;
}

const KPICard: React.FC<{
  label: string;
  value: number;
  format: (n: number) => string;
  low: number;
  high: number;
  formatRange: (n: number) => string;
  color: string;
  bgColor: string;
  delay: number;
  barPercent: number;
}> = ({ label, value, format, low, high, formatRange, color, bgColor, delay, barPercent }) => {
  return (
    <FadeIn delay={delay} direction="up" distance={40}>
      <div
        style={{
          background: bgColor,
          border: `1px solid ${color}33`,
          borderRadius: 20,
          padding: "36px 40px",
          width: 460,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <span
          style={{
            color: "rgba(148,163,184,0.8)",
            fontSize: 16,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {label}
        </span>

        <AnimatedCounter
          value={value}
          format={format}
          delay={delay + 5}
          duration={50}
          style={{
            color,
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        />

        <AnimatedBar
          widthPercent={barPercent}
          height={8}
          color={`linear-gradient(90deg, ${color}66, ${color})`}
          delay={delay + 15}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <span style={{ color: "rgba(148,163,184,0.5)", fontSize: 14 }}>
            {formatRange(low)}
          </span>
          <span style={{ color: "rgba(148,163,184,0.5)", fontSize: 14 }}>
            {formatRange(high)}
          </span>
        </div>
      </div>
    </FadeIn>
  );
};

export const KPIDashboardScene: React.FC<Props> = ({ script, financials }) => {
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #111827 50%, #0d1b2a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <FadeIn delay={0} direction="down" distance={15}>
        <p
          style={{
            color: "#3B82F6",
            fontSize: 16,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 3,
            marginBottom: 10,
          }}
        >
          Probabilistic Assessment
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
          Key Performance Indicators
        </h2>
      </FadeIn>

      {/* Three KPI cards */}
      <div style={{ display: "flex", gap: 30 }}>
        <KPICard
          label="Expected ROI"
          value={financials.roi.expected}
          format={(n) => `${n.toFixed(1)}x`}
          low={financials.roi.low}
          high={financials.roi.high}
          formatRange={(n) => `${n}x`}
          color="#3B82F6"
          bgColor="rgba(59,130,246,0.06)"
          delay={10}
          barPercent={financials.roi.high > 0 ? (financials.roi.expected / financials.roi.high) * 100 : 50}
        />

        <KPICard
          label="Net Present Value"
          value={financials.npv.expected / 1_000_000}
          format={(n) => `€${n.toFixed(1)}M`}
          low={financials.npv.low}
          high={financials.npv.high}
          formatRange={(n) => `€${(n / 1_000_000).toFixed(1)}M`}
          color="#10B981"
          bgColor="rgba(16,185,129,0.06)"
          delay={25}
          barPercent={financials.npv.high > 0 ? (financials.npv.expected / financials.npv.high) * 100 : 50}
        />

        <KPICard
          label="Payback Period"
          value={financials.paybackPeriodMonths.expected}
          format={(n) => `${Math.round(n)} mo`}
          low={financials.paybackPeriodMonths.low}
          high={financials.paybackPeriodMonths.high}
          formatRange={(n) => `${n} mo`}
          color="#8B5CF6"
          bgColor="rgba(139,92,246,0.06)"
          delay={40}
          barPercent={
            financials.paybackPeriodMonths.high !== financials.paybackPeriodMonths.low
              ? ((financials.paybackPeriodMonths.high - financials.paybackPeriodMonths.expected) /
                  (financials.paybackPeriodMonths.high - financials.paybackPeriodMonths.low)) *
                100
              : 50
          }
        />
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
