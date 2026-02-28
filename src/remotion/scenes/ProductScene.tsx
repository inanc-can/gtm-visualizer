import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FadeIn } from "../components/FadeIn";
import { colors as TOKENS, linearGradient } from "@/style/tokens";
import type { SceneScript } from "@/lib/video-script";

interface Props {
  script: SceneScript;
  productName: string;
  productDescription: string;
}

export const ProductScene: React.FC<Props> = ({
  script,
  productName,
  productDescription,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Product name spring
  const nameScale = spring({ frame, fps, config: { damping: 20, stiffness: 200 } });

  // Decorative line width
  const lineWidth = interpolate(
    spring({ frame, fps, delay: 10, config: { damping: 200 } }),
    [0, 1],
    [0, 300]
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #0f172a 50%, #1e1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "0 120px",
      }}
    >
      {/* Badge */}
      <FadeIn delay={0} direction="down" distance={10}>
        <div
          style={{
              background: `rgba(59,130,246,0.15)`,
              border: `1px solid rgba(59,130,246,0.3)`,
              borderRadius: 20,
              padding: "8px 24px",
              marginBottom: 30,
            }}
        >
            <span style={{ color: TOKENS.mainPurple, fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>
            Product
          </span>
        </div>
      </FadeIn>

      {/* Product name */}
      <h2
        style={{
          color: "#fff",
          fontSize: 64,
          fontWeight: 800,
          transform: `scale(${nameScale})`,
          textAlign: "center",
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        {productName}
      </h2>

      {/* Decorative line */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          background: linearGradient("transparent", TOKENS.mainPurple, "transparent"),
          marginTop: 20,
          marginBottom: 30,
          borderRadius: 2,
        }}
      />

      {/* Description */}
      <FadeIn delay={20} direction="up" distance={25}>
        <p
          style={{
            color: "rgba(203,213,225,0.85)",
            fontSize: 24,
            fontWeight: 400,
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.6,
          }}
        >
          {productDescription.length > 200
            ? productDescription.slice(0, 200) + "…"
            : productDescription}
        </p>
      </FadeIn>

      {/* Narration */}
      <FadeIn delay={40} direction="none">
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
