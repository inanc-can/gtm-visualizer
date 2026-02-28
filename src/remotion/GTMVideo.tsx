import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import type { GTMData } from "@/lib/gtm-data";
import type { VideoScript } from "@/lib/video-script";
import { fallbackScript } from "@/lib/video-script";

import { TitleScene } from "./scenes/TitleScene";
import { SellerBuyerScene } from "./scenes/SellerBuyerScene";
import { ProductScene } from "./scenes/ProductScene";
import { InitiativeScene } from "./scenes/InitiativeScene";
import { KPIDashboardScene } from "./scenes/KPIDashboardScene";
import { FinancialRangeScene } from "./scenes/FinancialRangeScene";
import { AssumptionsScene } from "./scenes/AssumptionsScene";
import { CTAScene } from "./scenes/CTAScene";

// ---------------------------------------------------------------------------
// Props type — passed via `<Player inputProps={...}>`
// ---------------------------------------------------------------------------

export interface GTMVideoProps {
  data: GTMData;
  script?: VideoScript;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const FPS = 30;

/** Frames dedicated to each transition between scenes */
export const TRANSITION_FRAMES = 15;

/**
 * Compute total composition frames accounting for TransitionSeries overlaps.
 * Each transition shortens total duration by TRANSITION_FRAMES.
 */
export function computeTotalFrames(videoScript: VideoScript): number {
  const scenesFrames = videoScript.scenes.reduce(
    (sum, s) => sum + s.durationSeconds * FPS,
    0
  );
  const transitionCount = Math.max(0, videoScript.scenes.length - 1);
  return scenesFrames - transitionCount * TRANSITION_FRAMES;
}

// Transition definitions for each cut point (index = gap between scene i and i+1)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: { presentation: any; label: string }[] = [
  { presentation: fade(), label: "title→seller" },
  { presentation: slide({ direction: "from-right" }), label: "seller→product" },
  { presentation: fade(), label: "product→initiative" },
  { presentation: slide({ direction: "from-bottom" }), label: "initiative→kpi" },
  { presentation: wipe({ direction: "from-left" }), label: "kpi→financial" },
  { presentation: fade(), label: "financial→assumptions" },
  { presentation: slide({ direction: "from-right" }), label: "assumptions→cta" },
];

/**
 * Extract initiative goals from the markdown description.
 * Looks for lines starting with `- **...**: ...`
 */
function extractGoals(description: string): string[] {
  const goals: string[] = [];
  const lines = description.split("\n");
  for (const line of lines) {
    const match = line.match(/^-\s+\*\*([^*]+)\*\*[:\s]+(.*)/);
    if (match) {
      goals.push(`${match[1]}: ${match[2].trim()}`);
    }
  }
  return goals.length > 0
    ? goals.slice(0, 3)
    : ["Personalized marketing", "Product feedback loops", "Omnichannel consistency"];
}

// ---------------------------------------------------------------------------
// Root composition
// ---------------------------------------------------------------------------

export const GTMVideo: React.FC<GTMVideoProps> = ({ data, script }) => {
  const videoScript = script ?? fallbackScript;

  // Map scene IDs to components. If a scene is missing from the script,
  // fall back to the matching fallback scene or skip.
  const sceneMap = new Map(videoScript.scenes.map((s) => [s.sceneId, s]));

  const getScene = (id: string) => {
    return sceneMap.get(id) ?? fallbackScript.scenes.find((s) => s.sceneId === id)!;
  };

  const goals = extractGoals(data.initiative.description);

  // Build the ordered scene list with their duration in frames
  const orderedScenes: {
    id: string;
    durationFrames: number;
    component: React.ReactNode;
  }[] = [
    {
      id: "title",
      durationFrames: getScene("title").durationSeconds * FPS,
      component: <TitleScene script={getScene("title")} />,
    },
    {
      id: "seller-buyer",
      durationFrames: getScene("seller-buyer").durationSeconds * FPS,
      component: (
        <SellerBuyerScene
          script={getScene("seller-buyer")}
          sellerName={data.seller.name}
          buyerName={data.buyer.name}
        />
      ),
    },
    {
      id: "product",
      durationFrames: getScene("product").durationSeconds * FPS,
      component: (
        <ProductScene
          script={getScene("product")}
          productName={data.product.name}
          productDescription={data.product.description}
        />
      ),
    },
    {
      id: "initiative",
      durationFrames: getScene("initiative").durationSeconds * FPS,
      component: (
        <InitiativeScene
          script={getScene("initiative")}
          initiativeName={data.initiative.name}
          goals={goals}
        />
      ),
    },
    {
      id: "kpi-dashboard",
      durationFrames: getScene("kpi-dashboard").durationSeconds * FPS,
      component: (
        <KPIDashboardScene
          script={getScene("kpi-dashboard")}
          financials={data.financials}
        />
      ),
    },
    {
      id: "financial-range",
      durationFrames: getScene("financial-range").durationSeconds * FPS,
      component: (
        <FinancialRangeScene
          script={getScene("financial-range")}
          financials={data.financials}
        />
      ),
    },
    {
      id: "assumptions",
      durationFrames: getScene("assumptions").durationSeconds * FPS,
      component: (
        <AssumptionsScene
          script={getScene("assumptions")}
          assumptions={data.assumptions}
        />
      ),
    },
    {
      id: "cta",
      durationFrames: getScene("cta").durationSeconds * FPS,
      component: <CTAScene script={getScene("cta")} />,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a1a" }}>
      <TransitionSeries>
        {orderedScenes.flatMap(({ id, durationFrames, component }, i) => {
          const elements: React.ReactNode[] = [
            <TransitionSeries.Sequence key={id} durationInFrames={durationFrames}>
              {component}
            </TransitionSeries.Sequence>,
          ];

          // Add transition after each scene except the last
          if (i < orderedScenes.length - 1 && TRANSITIONS[i]) {
            elements.push(
              <TransitionSeries.Transition
                key={`t-${id}`}
                presentation={TRANSITIONS[i].presentation}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            );
          }

          return elements;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
