// Centralized design tokens derived from the brand guideline.
// Colors use current project palette as fallbacks; prefer these tokens
// across React components and Remotion scenes to avoid hardcoded hexes.
export const colors = {
  mainPurple: "#3B82F6",
  green: "#10B981",
  accentPurple: "#8B5CF6",
  amber: "#F59E0B",
  white: "#FFFFFF",
  slate900: "#0f172a",
};

export function linearGradient(...cols: string[]) {
  return `linear-gradient(90deg, ${cols.join(", ")})`;
}

export function radialGradientHex(hex: string, alpha = 0.3) {
  // Convert #rrggbb to rgba(r,g,b,a)
  const hexClean = hex.replace(/^#/, "");
  const r = parseInt(hexClean.slice(0, 2), 16);
  const g = parseInt(hexClean.slice(2, 4), 16);
  const b = parseInt(hexClean.slice(4, 6), 16);
  return `radial-gradient(circle, rgba(${r},${g},${b},${alpha}) 0%, transparent 70%)`;
}

export const spacing = {
  defaultRadius: 12,
};

export const typography = {
  brandFont: "Inter, system-ui, sans-serif",
};

export default {
  colors,
  linearGradient,
  radialGradientHex,
  spacing,
  typography,
};
