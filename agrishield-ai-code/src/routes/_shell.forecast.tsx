import { createFileRoute } from "@tanstack/react-router";
import { CloudSun, Droplets, Info, ShieldAlert, Thermometer, Wind } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/agri/PageHeader";
import { RiskBadge } from "@/components/agri/RiskBadge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RISK_FACTORS, RISK_FORECAST, WEATHER } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/forecast")({
  head: () => ({
    meta: [
      { title: "Disease Risk Forecast — AgriShield AI" },
      {
        name: "description",
        content:
          "Six-day crop disease risk outlook driven by humidity, rainfall and temperature, with the reasoning behind every score.",
      },
      { property: "og:title", content: "Disease Risk Forecast — AgriShield AI" },
      {
        property: "og:description",
        content: "See when disease pressure peaks on your farm and act 48 hours early.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForecastPage,
});

const COLORS: Record<string, string> = {
  Low: "hsl(var(--chart-fresh, 142 60% 45%))",
  Moderate: "hsl(45 92% 52%)",
  High: "hsl(8 78% 52%)",
};

const WEATHER_TILES = [
  { icon: Thermometer, label: "Temperature", value: `${WEATHER.temperature}°C` },
  { icon: Droplets, label: "Humidity", value: `${WEATHER.humidity}%` },
  { icon: CloudSun, label: "Rain (48h)", value: `${WEATHER.rainfall} mm` },
  { icon: Wind, label: "Wind", value: `${WEATHER.wind} km/h` },
];

function ForecastPage() {
  const peak = RISK_FORECAST.reduce((a, b) => (b.risk > a.risk ? b : a));

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CloudSun}
        title="Disease Risk Forecast"
        description="Weather-driven outbreak pressure for the next six days"
        action={<RiskBadge level={RISK_FORECAST[0].level} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WEATHER_TILES.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="animate-rise p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-fresh/15 text-forest">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-semibold text-forest">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="animate-rise p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-forest">6-day risk index</h2>
          <p className="text-sm text-muted-foreground">
            Peak risk on <span className="font-semibold text-forest">{peak.day}</span> ({peak.risk}%)
          </p>
        </div>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RISK_FORECAST}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                formatter={(v: number) => [`${v}%`, "Risk"]}
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(0 0% 90%)" }}
              />
              <Bar dataKey="risk" radius={[10, 10, 0, 0]}>
                {RISK_FORECAST.map((d) => (
                  <Cell key={d.day} fill={COLORS[d.level]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="animate-rise p-5 shadow-soft">
          <h2 className="text-base font-semibold text-forest">Daily outlook</h2>
          <ul className="mt-4 space-y-3">
            {RISK_FORECAST.map((d) => (
              <li
                key={d.day}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/70 px-3 py-2.5"
              >
                <span className="w-14 text-sm font-semibold text-forest">{d.day}</span>
                <div className="min-w-0">
                  <Progress value={d.risk} className="h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {d.temp}°C · {d.humidity}% humidity
                  </p>
                </div>
                <RiskBadge level={d.level} label={`${d.risk}%`} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="animate-rise p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-base font-semibold text-forest">
            <Info className="h-4 w-4" /> Why this risk level
          </h2>
          <ul className="mt-4 space-y-4">
            {RISK_FACTORS.map((f) => (
              <li key={f.factor}>
                <div className="flex items-center justify-between gap-2 text-sm font-medium text-forest">
                  <span>{f.factor}</span>
                  <span className="text-muted-foreground">{f.weight}%</span>
                </div>
                <Progress value={f.weight * 2} className="mt-1.5 h-1.5" />
                <p className="mt-1 text-xs text-muted-foreground">{f.note}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="animate-rise border-warn/40 bg-warn/10 p-5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-warn-foreground">
          <ShieldAlert className="h-4 w-4" /> Preventive action for the next 48 hours
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-warn-foreground/90">
          <li>Apply a protective spray before the Wednesday humidity peak.</li>
          <li>Irrigate early morning so foliage dries before evening.</li>
          <li>Scout lower leaves daily and remove the first spotted leaves.</li>
          <li>Hold back nitrogen top-dressing until risk drops below 50%.</li>
        </ul>
      </Card>
    </div>
  );
}
