import React from "react";
import { AbsoluteFill } from "remotion";
import { FadeIn } from "../components/FadeIn";
import { colors as TOKENS } from "@/style/tokens";
import type { SceneScript } from "@/lib/video-script";

interface Props {
  script: SceneScript;
  initiativeName: string;
  goals: string[];
}

export const InitiativeScene: React.FC<Props> = ({
  script,
  initiativeName,
  goals,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f172a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "0 100px",
      }}
    >
      {/* Badge */}
      <FadeIn delay={0} direction="down" distance={10}>
        <div
          style={{
            background: `rgba(139,92,246,0.15)`,
            border: `1px solid rgba(139,92,246,0.3)`,
            borderRadius: 20,
            padding: "8px 24px",
            marginBottom: 30,
          }}
        >
          <span
            style={{
              color: TOKENS.accentPurple,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Initiative
          </span>
        </div>
      </FadeIn>

      {/* Initiative name */}
      <FadeIn delay={5} direction="up" distance={30}>
        <h2
          style={{
            color: "#fff",
            fontSize: 52,
            fontWeight: 800,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          {initiativeName}
        </h2>
      </FadeIn>

      {/* Goals */}
      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 20 }}>
        {goals.map((goal, i) => (
          <FadeIn key={i} delay={20 + i * 12} direction="left" distance={40}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  background: [TOKENS.mainPurple, TOKENS.green, TOKENS.accentPurple][i % 3],
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: "rgba(226,232,240,0.9)",
                  fontSize: 24,
                  fontWeight: 500,
                }}
              >
                {goal}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Narration */}
      <FadeIn delay={60} direction="none">
        <p
          style={{
            color: "rgba(148,163,184,0.5)",
            fontSize: 18,
            fontStyle: "italic",
            marginTop: 50,
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
