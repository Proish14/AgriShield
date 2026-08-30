import { createFileRoute } from "@tanstack/react-router";
import {
  CloudSun,
  HeartPulse,
  Lightbulb,
  ScanLine,
  Sprout,
  UserCheck,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { HealthRing } from "@/components/agri/HealthRing";
import { PageHeader } from "@/components/agri/PageHeader";
import { Card } from "@/components/ui/card";
import { DEFAULT_FARM, HEALTH_TIMELINE, HEALTH_TREND } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/health")({
  head: () => ({
    meta: [
      { title: "My Crop Health — AgriShield AI" },
      {
        name: "description",
        content:
          "Track your farm health score over time with a full timeline of scans, weather alerts and expert advice.",
      },
      { property: "og:title", content: "My Crop Health — AgriShield AI" },
      {
        property: "og:description",
        content: "Health score trend and complete crop history for your farm.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HealthPage,
});

const ICONS = {
  scan: ScanLine,
  weather: CloudSun,
  advice: Lightbulb,
  expert: UserCheck,
} as const;

const TONES = {
  good: "bg-fresh/15 text-forest",
  warn: "bg-warn/20 text-warn-foreground",
  bad: "bg-danger/12 text-danger",
} as const;

function HealthPage() {
  const first = HEALTH_TREND[0].score;
  const last = HEALTH_TREND[HEALTH_TREND.length - 1].score;
  const delta = last - first;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={HeartPulse}
        title="My Crop Health"
        description={`${DEFAULT_FARM.farmName} · ${DEFAULT_FARM.location}`}
      />

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="animate-rise flex flex-col items-center gap-3 p-6 shadow-soft">
          <HealthRing score={DEFAULT_FARM.healthScore} />
          <p className="text-sm font-semibold text-forest">Overall health score</p>
          <p className="text-center text-xs text-muted-foreground">
            {delta >= 0 ? "Improved" : "Dropped"} {Math.abs(delta)} points in the last 30 days
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {DEFAULT_FARM.crops.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full bg-fresh/15 px-3 py-1 text-xs font-semibold text-forest"
              >
                <Sprout className="h-3.5 w-3.5" />
                {c}
              </span>
            ))}
          </div>
        </Card>

        <Card className="animate-rise p-5 shadow-soft">
          <h2 className="text-base font-semibold text-forest">Health score trend</h2>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HEALTH_TREND}>
                <defs>
                  <linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142 55% 40%)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="hsl(142 55% 40%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis domain={[40, 100]} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  formatter={(v: number) => [`${v}`, "Score"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(0 0% 90%)" }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(142 55% 32%)"
                  strokeWidth={2.5}
                  fill="url(#healthFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="animate-rise p-5 shadow-soft">
        <h2 className="text-base font-semibold text-forest">Crop history timeline</h2>
        <ol className="mt-5 space-y-5 border-l border-border/70 pl-5">
          {HEALTH_TIMELINE.map((item) => {
            const Icon = ICONS[item.type];
            return (
              <li key={`${item.date}-${item.title}`} className="relative">
                <span
                  className={cn(
                    "absolute -left-[38px] grid h-8 w-8 place-items-center rounded-full ring-4 ring-background",
                    TONES[item.tone],
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {item.date}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-forest">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}
