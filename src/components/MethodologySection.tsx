"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Methodology } from "@/lib/gtm-data";

interface Props {
  methodology: Methodology;
}

// Inline markdown renderer — only renders links / code / bold / italic, no block elements
function InlineMd({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Render everything as an inline <span> wrapper so datasource lines stay on one line
        p: ({ children }) => <span>{children}</span>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {children}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

export function MethodologySection({ methodology }: Props) {
  return (
    <section className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Badge variant="outline" className="mb-2">
            Model Methodology
          </Badge>
          <h2 className="text-2xl font-bold text-balance">How This Business Case Was Built</h2>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            {methodology.summary}
          </p>
        </div>
      </div>

      <div className="space-y-6">
          {/* Steps */}
          <Card>
            <CardContent className="pt-6 pb-6">
              <h3 className="text-base font-semibold mb-5 text-foreground">Modelling Steps</h3>
              <ol className="space-y-5">
                {methodology.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    {/* Step number bubble */}
                    <span
                      className="flex-none flex items-center justify-center rounded-full text-xs font-bold text-white bg-primary w-6 h-6 mt-0.5 tabular-nums shrink-0"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm leading-snug mb-1">{step.title}</p>
                      <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                        <InlineMd>{step.description}</InlineMd>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Data sources */}
          {methodology.dataSources.length > 0 && (
            <Card>
              <CardContent className="pt-6 pb-6">
                <h3 className="text-base font-semibold mb-4 text-foreground">Data Sources</h3>
                <ul className="space-y-2">
                  {methodology.dataSources.map((src, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                      <span className="mt-1.5 flex-none w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" aria-hidden="true" />
                      <span>
                        <InlineMd>{src}</InlineMd>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
      </div>
    </section>
  );
}
