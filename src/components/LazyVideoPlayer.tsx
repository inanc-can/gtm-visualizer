"use client";

import dynamic from "next/dynamic";
import type { GTMData } from "@/lib/gtm-data";
import type { VideoScript } from "@/lib/video-script";

// Heavy @remotion/player bundle — lazy-loaded client-side only (never SSR)
const VideoPlayer = dynamic(
  () => import("@/components/VideoPlayer").then((m) => ({ default: m.VideoPlayer })),
  { ssr: false, loading: () => <div className="aspect-video w-full rounded-2xl bg-slate-900 animate-pulse" /> }
);

export function LazyVideoPlayer(props: { data: GTMData; initialScript?: VideoScript }) {
  return <VideoPlayer {...props} />;
}
