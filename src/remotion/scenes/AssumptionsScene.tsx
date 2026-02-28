import React from "react";
import { AbsoluteFill } from "remotion";
import { FadeIn } from "../components/FadeIn";
import { AnimatedBar } from "../components/AnimatedBar";
import type { SceneScript } from "@/lib/video-script";
import type { Assumption } from "@/lib/gtm-data";

interface Props {
  script: SceneScript;
  assumptions: Assumption[];
}

function formatValue(value: number): string {
  if (value > 0 && value < 1) return `${(value * 100).toFixed(0)}%`;
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  if (value >= 10) return `€${value}`;
  return String(value);
}

export const AssumptionsScene: React.FC<Props> = ({ script, assumptions }) => {
  const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #0f172a 50%, #1a1a2e 100%)",
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
            color: "#F59E0B",
            fontSize: 16,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 3,
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Model Assumptions
        </p>
        <h2
          style={{
            color: "#fff",
            fontSize: 44,
            fontWeight: 800,
            textAlign: "center",
            margin: "0 0 40px 0",
          }}
        >
          Key Assumptions
        </h2>
      </FadeIn>

      {/* 2x2 grid of assumption cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          width: "100%",
          maxWidth: 1400,
        }}
      >
        {assumptions.slice(0, 4).map((a, i) => {
          const color = colors[i % colors.length];
          return (
            <FadeIn key={i} delay={10 + i * 12} direction={i % 2 === 0 ? "left" : "right"} distance={40}>
              <div
                style={{
                  background: `${color}08`,
                  border: `1px solid ${color}25`,
                  borderLeft: `4px solid ${color}`,
                  borderRadius: 14,
                  padding: "24px 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <span style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 700 }}>
                  {a.name}
                </span>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#F59E0B", fontSize: 16, fontWeight: 600 }}>
                    {formatValue(a.range.low)}
                  </span>
                  <span style={{ color: "rgba(148,163,184,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>
                    conservative → optimistic
                  </span>
                  <span style={{ color: "#10B981", fontSize: 16, fontWeight: 600 }}>
                    {formatValue(a.range.high)}
                  </span>
                </div>

                <AnimatedBar
                  widthPercent={100}
                  height={8}
                  color="linear-gradient(90deg, #F59E0B, #3B82F6, #10B981)"
                  delay={20 + i * 12}
                />
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Narration */}
      <FadeIn delay={70} direction="none">
        <p
          style={{
            color: "rgba(148,163,184,0.5)",
            fontSize: 18,
            fontStyle: "italic",
            marginTop: 36,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          {script.narration}
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
};
