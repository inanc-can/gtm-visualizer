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
}

export const CTAScene: React.FC<Props> = ({ script }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo pulse
  const pulse = interpolate(Math.sin(frame / 12), [-1, 1], [0.95, 1.05]);

  // Button scale
  const btnScale = spring({
    frame,
    fps,
    delay: 30,
    config: { damping: 8 },
  });

  // Background gradient animation
  const gradientAngle = interpolate(frame, [0, 240], [135, 180]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Badge */}
      <FadeIn delay={0} direction="down" distance={10}>
        <p
          style={{
            color: "#3B82F6",
            fontSize: 16,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 30,
          }}
        >
          Ready to close faster?
        </p>
      </FadeIn>

      {/* Main CTA text */}
      <FadeIn delay={10} direction="up" distance={30}>
        <h2
          style={{
            color: "#fff",
            fontSize: 56,
            fontWeight: 800,
            textAlign: "center",
            margin: 0,
            maxWidth: 900,
            lineHeight: 1.2,
          }}
        >
          Simulate your GTM strategy with Bayes Case
        </h2>
      </FadeIn>

      {/* CTA button */}
      <FadeIn delay={30} direction="up" distance={20}>
        <div
          style={{
            marginTop: 50,
            background: "#3B82F6",
            borderRadius: 14,
            padding: "18px 60px",
            transform: `scale(${btnScale})`,
            boxShadow: "0 20px 60px rgba(59,130,246,0.3)",
          }}
        >
          <span style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>Book a Demo</span>
        </div>
      </FadeIn>

      {/* Subtext */}
      <FadeIn delay={45} direction="none">
        <p
          style={{
            color: "rgba(100,116,139,0.8)",
            fontSize: 16,
            marginTop: 20,
          }}
        >
          No credit card required · Setup in under 5 minutes
        </p>
      </FadeIn>

      {/* Logo + narration */}
      <FadeIn delay={55} direction="none">
        <div
          style={{
            marginTop: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ transform: `scale(${pulse})` }}>
            <svg viewBox="0 0 32 32" width={48} height={48} fill="none">
              <circle cx="16" cy="16" r="14" fill="#3B82F6" />
              <path
                d="M10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="16" cy="20" r="3" fill="white" />
            </svg>
          </div>
          <p
            style={{
              color: "rgba(148,163,184,0.5)",
              fontSize: 16,
              fontStyle: "italic",
              textAlign: "center",
              maxWidth: 600,
              lineHeight: 1.5,
            }}
          >
            {script.narration}
          </p>
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};
