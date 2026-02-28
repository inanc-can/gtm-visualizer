import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FadeIn } from "../components/FadeIn";
import type { SceneScript } from "@/lib/video-script";

interface Props {
  script: SceneScript;
}

export const TitleScene: React.FC<Props> = ({ script }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale animation
  const logoScale = spring({ frame, fps, config: { damping: 8 } });
  const logoRotate = interpolate(logoScale, [0, 1], [-10, 0]);

  // Background glow pulse
  const glowOpacity = interpolate(
    Math.sin(frame / 20),
    [-1, 1],
    [0.15, 0.35]
  );

  // Typewriter effect for subtitle — starts after delay, 2 frames per character
  const SUBTITLE_DELAY = 30;
  const CHAR_FRAMES = 2;
  const CURSOR_BLINK = 16;
  const subtitleText = script.title;
  const subtitleChars = Math.min(
    subtitleText.length,
    Math.max(0, Math.floor((frame - SUBTITLE_DELAY) / CHAR_FRAMES))
  );
  const typedSubtitle = subtitleText.slice(0, subtitleChars);
  const cursorOpacity = frame >= SUBTITLE_DELAY
    ? interpolate(frame % CURSOR_BLINK, [0, CURSOR_BLINK / 2, CURSOR_BLINK], [1, 0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Typewriter for narration — starts after subtitle finishes
  const NARRATION_DELAY = SUBTITLE_DELAY + subtitleText.length * CHAR_FRAMES + 15;
  const narrationText = script.narration;
  const narrationChars = Math.min(
    narrationText.length,
    Math.max(0, Math.floor((frame - NARRATION_DELAY) / CHAR_FRAMES))
  );
  const typedNarration = narrationText.slice(0, narrationChars);
  const narrationCursorOpacity = frame >= NARRATION_DELAY
    ? interpolate(frame % CURSOR_BLINK, [0, CURSOR_BLINK / 2, CURSOR_BLINK], [1, 0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 40%, #0d1b2a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
          opacity: glowOpacity,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
          marginBottom: 40,
        }}
      >
        <svg viewBox="0 0 32 32" width={100} height={100} fill="none">
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

      {/* Title */}
      <FadeIn delay={10} direction="up" distance={40}>
        <h1
          style={{
            color: "#fff",
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -2,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Bayes Case
        </h1>
      </FadeIn>

      {/* Subtitle — typewriter effect */}
      <p
        style={{
          color: "rgba(148,163,184,0.9)",
          fontSize: 28,
          fontWeight: 400,
          marginTop: 16,
          letterSpacing: 2,
          textTransform: "uppercase",
          textAlign: "center",
          minHeight: 40,
        }}
      >
        <span>{typedSubtitle}</span>
        <span style={{ opacity: cursorOpacity }}>▌</span>
      </p>

      {/* Narration — typewriter effect */}
      <p
        style={{
          color: "rgba(148,163,184,0.6)",
          fontSize: 20,
          fontWeight: 400,
          marginTop: 50,
          textAlign: "center",
          maxWidth: 700,
          lineHeight: 1.5,
          minHeight: 60,
        }}
      >
        <span>{typedNarration}</span>
        {frame >= NARRATION_DELAY && narrationChars < narrationText.length && (
          <span style={{ opacity: narrationCursorOpacity }}>▌</span>
        )}
      </p>
    </AbsoluteFill>
  );
};
