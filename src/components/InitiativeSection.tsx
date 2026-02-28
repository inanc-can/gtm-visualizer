"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Initiative } from "@/lib/gtm-data";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Prose({ children }: { children: string }) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-headings:text-foreground prose-p:leading-relaxed prose-p:text-foreground/80 prose-li:my-0.5 prose-li:text-foreground/80 prose-blockquote:border-l-blue-400 prose-blockquote:text-muted-foreground prose-strong:text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

interface Props {
  initiative: Initiative;
  sellerName: string;
  buyerName: string;
}

export function InitiativeSection({ initiative, sellerName, buyerName }: Props) {
  const sections = [
    {
      label: "Initiative Overview",
      shortLabel: "Overview",
      icon: "📋",
      content: initiative.description,
      value: "overview",
    },
    {
      label: "Corporate Objective",
      shortLabel: "Corporate",
      icon: "🏢",
      content: initiative.corporateObjective,
      value: "corporate",
    },
    {
      label: "Strategic Intent",
      shortLabel: "Strategic",
      icon: "🎯",
      content: initiative.strategicIntent,
      value: "strategic",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-2">Initiative Deep-Dive</Badge>
        <h2 className="text-2xl font-bold">{initiative.name}</h2>
        <p className="text-muted-foreground mt-1">
          {sellerName} &times; {buyerName}
        </p>
      </div>

      {/* Desktop: 3-column horizontal grid — all panels visible at once */}
      <div className="hidden lg:grid grid-cols-3 gap-5">
        {sections.map((s) => (
          <Card key={s.value} className="flex flex-col">
            <CardContent className="pt-6 flex-1">
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                <span>{s.icon}</span> {s.label}
              </h3>
              <Prose>{s.content}</Prose>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile/tablet: tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            {sections.map((s) => (
              <TabsTrigger key={s.value} value={s.value} className="flex-1 text-xs sm:text-sm">
                <span className="mr-1">{s.icon}</span>{s.shortLabel}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((s) => (
            <TabsContent key={s.value} value={s.value}>
              <Card>
                <CardContent className="pt-6">
                  <Prose>{s.content}</Prose>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
