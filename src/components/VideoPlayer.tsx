"use client";

import React, { useState } from "react";
import { Player } from "@remotion/player";
import { GTMVideo } from "@/remotion/GTMVideo";
import { computeTotalFrames, FPS } from "@/remotion/GTMVideo";
import type { GTMData } from "@/lib/gtm-data";
import type { VideoScript } from "@/lib/video-script";
import { buildFallbackScript } from "@/lib/video-agent";

interface VideoPlayerProps {
  data: GTMData;
  initialScript?: VideoScript;
}

export function VideoPlayer({ data, initialScript }: VideoPlayerProps) {
  const [script] = useState<VideoScript>(() => initialScript ?? buildFallbackScript(data));

  const totalFrames = computeTotalFrames(script);
  const inputProps = { data, script };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Player */}
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.06)",
          aspectRatio: "16 / 9",
        }}
      >
        <Player
          component={GTMVideo}
          inputProps={inputProps}
          durationInFrames={totalFrames}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={FPS}
          controls
          acknowledgeRemotionLicense
          style={{ width: "100%", height: "100%" }}
          autoPlay={false}
        />
      </div>
    </div>
  );
}
