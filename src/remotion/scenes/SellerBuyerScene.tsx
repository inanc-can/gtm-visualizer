import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { FadeIn } from "../components/FadeIn";
import type { SceneScript } from "@/lib/video-script";

interface Props {
  script: SceneScript;
  sellerName: string;
  buyerName: string;
}

export const SellerBuyerScene: React.FC<Props> = ({
  script,
  sellerName,
  buyerName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Seller slides in from left
  const sellerX = interpolate(
    spring({ frame, fps, config: { damping: 20, stiffness: 200 } }),
    [0, 1],
    [-400, 0]
  );

  // Buyer slides in from right
  const buyerX = interpolate(
    spring({ frame, fps, delay: 8, config: { damping: 20, stiffness: 200 } }),
    [0, 1],
    [400, 0]
  );

  // Arrow appears after both badges
  const arrowProgress = spring({
    frame,
    fps,
    delay: 20,
    config: { damping: 200 },
  });
  const arrowScale = interpolate(arrowProgress, [0, 1], [0, 1]);
  const arrowWidth = interpolate(arrowProgress, [0, 1], [0, 120]);

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
      {/* Section label */}
      <FadeIn delay={0} direction="down" distance={15}>
        <p
          style={{
            color: "#3B82F6",
            fontSize: 16,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 3,
            marginBottom: 50,
          }}
        >
          Strategic Partnership
        </p>
      </FadeIn>

      {/* Seller → Buyer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Seller badge */}
        <div
          style={{
            transform: `translateX(${sellerX}px)`,
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 16,
            padding: "28px 48px",
          }}
        >
          <span
            style={{
              color: "#93C5FD",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            {sellerName}
          </span>
        </div>

        {/* Animated arrow */}
        <div style={{ transform: `scaleX(${arrowScale})`, width: arrowWidth, position: "relative" }}>
          <svg viewBox="0 0 120 40" width={120} height={40} fill="none">
            <line x1="0" y1="20" x2="100" y2="20" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
            <polygon points="95,10 115,20 95,30" fill="#3B82F6" />
          </svg>
        </div>

        {/* Buyer badge */}
        <div
          style={{
            transform: `translateX(${buyerX}px)`,
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 16,
            padding: "28px 48px",
          }}
        >
          <span
            style={{
              color: "#6EE7B7",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            {buyerName}
          </span>
        </div>
      </div>

      {/* Narration */}
      <FadeIn delay={35} direction="up" distance={20}>
        <p
          style={{
            color: "rgba(148,163,184,0.7)",
            fontSize: 22,
            fontWeight: 400,
            marginTop: 60,
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
