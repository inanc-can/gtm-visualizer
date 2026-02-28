import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { colors, linearGradient } from "@/style/tokens";

interface AnimatedBarProps {
  /** Target width percentage (0–100) */
  widthPercent: number;
  /** Bar height in pixels */
  height?: number;
  /** CSS color or gradient */
  color?: string;
  /** Delay in frames */
  delay?: number;
  /** Label shown inside the bar */
  label?: string;
  style?: React.CSSProperties;
}

export const AnimatedBar: React.FC<AnimatedBarProps> = ({
  widthPercent,
  height = 28,
  color = linearGradient(colors.mainPurple, colors.green),
  delay = 0,
  label,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 200 },
  });

  const safeWidth = Number.isFinite(widthPercent) ? Math.max(0, Math.min(100, widthPercent)) : 50;
  const width = interpolate(progress, [0, 1], [0, safeWidth]);
  const opacity = interpolate(adjustedFrame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: height / 2,
        overflow: "hidden",
        opacity,
        ...style,
      }}
    >
      <div
        style={{
          width: `${width}%`,
          height: "100%",
          background: color,
          borderRadius: height / 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 10,

        }}
      >
        {label && width > 15 && (
          <span
              style={{
                color: colors.white,
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
