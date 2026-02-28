import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface AnimatedCounterProps {
  /** Target value to count up to */
  value: number;
  /** Format function (e.g., add suffix, currency) */
  format?: (n: number) => string;
  /** Delay in frames before counting starts */
  delay?: number;
  /** Duration in frames for the count animation */
  duration?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  format = (n) => String(n),
  delay = 0,
  duration = 40,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: duration,
  });

  const currentValue = interpolate(progress, [0, 1], [0, value]);

  // Scale pop effect at the end
  const scale = interpolate(
    progress,
    [0, 0.8, 1],
    [0.8, 1.05, 1],
    { extrapolateRight: "clamp" }
  );

  const opacity = interpolate(adjustedFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        opacity,
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {format(currentValue)}
    </span>
  );
};
