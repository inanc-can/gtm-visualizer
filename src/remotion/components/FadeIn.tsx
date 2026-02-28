import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface FadeInProps {
  children: React.ReactNode;
  /** Delay in frames before the animation starts */
  delay?: number;
  /** Direction the element slides from */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Distance in pixels */
  distance?: number;
  /** Use spring physics instead of linear interpolation */
  useSpring?: boolean;
  style?: React.CSSProperties;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  direction = "up",
  distance = 30,
  useSpring: useSpringAnim = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  const progress = useSpringAnim
    ? spring({ frame: adjustedFrame, fps, config: { damping: 200 } })
    : interpolate(adjustedFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  let translateX = 0;
  let translateY = 0;

  switch (direction) {
    case "up":
      translateY = interpolate(progress, [0, 1], [distance, 0]);
      break;
    case "down":
      translateY = interpolate(progress, [0, 1], [-distance, 0]);
      break;
    case "left":
      translateX = interpolate(progress, [0, 1], [distance, 0]);
      break;
    case "right":
      translateX = interpolate(progress, [0, 1], [-distance, 0]);
      break;
    case "none":
      break;
  }

  return (
    <div
      style={{
        opacity,
        transform: `translate(${translateX}px, ${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
