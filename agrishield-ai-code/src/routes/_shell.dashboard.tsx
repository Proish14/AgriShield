import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  CloudSun,
  Droplets,
  HeartPulse,
  Info,
  ScanLine,
  Sprout,
  Thermometer,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { PageHeader } from "@/components/agri/PageHeader";
import { HealthRing } from "@/components/agri/HealthRing";
import { RiskBadge } from "@/components/agri/RiskBadge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DEFAULT_FARM, HEALTH_TREND, WEATHER } from "@/lib/mock-data";
import { DEMO_FARMER, useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({
    meta: [
      { title: "Farmer Dashboard — AgriShield AI" },
      {
        name: "description",
        content:
          "Personalised farm dashboard with crop health score, disease risk, weather alerts and quick actions.",
      },
      { property: "og:title", content: "Farmer Dashboard — AgriShield AI" },
      {
        property: "og:description",
        content: "Track crop health score, disease risk and today's farm insights.",
      },
    ],
  }),
  component: DashboardPage,
});

const QUICK_ACTIONS = [
  { to: "/scan", label: "Scan My Crop", desc: "Photo-based disease check", icon: ScanLine },
  { to: "/advisor", label: "Crop Advisor", desc: "What should I grow?", icon: Sprout },
  { to: "/forecast", label: "Disease Risk Forecast", desc: "Weather-driven risk", icon: CloudSun },
  { to: "/health", label: "My Crop Health", desc: "Score & history", icon: HeartPulse },
  { to: "/expert", label: "Expert Review", desc: "Get human confirmation", icon: UserCheck },
  { to: "/reports", label: "Reports", desc: "Farm analysis report", icon: BarChart3 },
];

const INSIGHTS = [
  {
    tone: "warn" as const,
    text: "High humidity (84%) may increase fungal disease risk in tomato over the next 3 days.",
  },
  { tone: "warn" as const, text: "Your last scan on 24 Aug showed moderate risk — recheck lower leaves." },
  { tone: "good" as const, text: "Check the 4 recommended preventive actions in your treatment plan." },
];

function DashboardPage() {
  const { farmer, scanResult } = useApp();
  const { t } = useI18n();
  const name = (farmer ?? DEMO_FARMER).name;
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        icon={Sprout}
        title={`${t("goodMorning")}, ${name.split(" ")[0]}`}
        description={today}
        action={<RiskBadge level="Moderate" className="hidden sm:inline-flex" />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="animate-rise gap-0 rounded-3xl border-border bg-card p-5 shadow-soft lg:col-span-2">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("cropHealthScore")}
              </p>
              <h2 className="mt-1 text-lg font-bold text-forest">{DEFAULT_FARM.farmName}</h2>
              <p className="text-sm text-muted-foreground">
                {DEFAULT_FARM.location} · {DEFAULT_FARM.landSize} · {DEFAULT_FARM.soil}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {DEFAULT_FARM.crops.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-sage-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <HealthRing score={DEFAULT_FARM.healthScore} />
          </div>

          <div className="mt-5 h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HEALTH_TREND} margin={{ left: 0, right: 0, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--leaf)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--leaf)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--leaf)"
                  strokeWidth={2.5}
                  fill="url(#healthFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-fresh" /> Trend: improving over the last 4 weeks
          </p>
        </Card>

        <div className="space-y-4">
          <Card className="animate-rise gap-3 rounded-3xl border-border bg-gradient-forest p-5 text-forest-foreground shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
              {t("diseaseRisk")}
            </p>
            <p className="font-display text-2xl font-bold">Moderate — 68%</p>
            <Progress value={68} className="h-2 bg-forest-foreground/20" />
            <p className="text-xs opacity-85">
              Humidity and recent rainfall favour fungal spread. Preventive action advised within 48
              hours.
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: Thermometer, v: `${WEATHER.temperature}°C`, l: "Temp" },
                { icon: Droplets, v: `${WEATHER.humidity}%`, l: "Humidity" },
                { icon: CloudSun, v: `${WEATHER.rainfall}mm`, l: "Rain 48h" },
              ].map(({ icon: Icon, v, l }) => (
                <div key={l} className="rounded-2xl bg-forest-foreground/10 py-2">
                  <Icon className="mx-auto h-4 w-4" />
                  <p className="mt-1 text-sm font-bold">{v}</p>
                  <p className="text-[10px] opacity-80">{l}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="animate-rise gap-2 rounded-3xl border-border bg-card p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recent disease scan
            </p>
            <p className="font-display text-lg font-bold text-forest">
              {scanResult ? `${scanResult.crop} — ${scanResult.disease}` : "Tomato — Early Blight"}
            </p>
            <p className="text-sm text-muted-foreground">
              Confidence {scanResult?.confidence ?? 91}% · Severity{" "}
              {scanResult?.severity ?? "Moderate"} · 24 Aug
            </p>
            <Button asChild variant="outline" className="mt-2 rounded-xl border-leaf/40 text-leaf">
              <Link to="/scan">Open scan & treatment</Link>
            </Button>
          </Card>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-forest">{t("quickActions")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map(({ to, label, desc, icon: Icon }) => (
            <Link key={to} to={to}>
              <Card className="card-hover h-full gap-2 rounded-3xl border-border bg-card p-5 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage text-forest">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-1 font-display font-bold text-forest">{label}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-forest">{t("todaysInsights")}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {INSIGHTS.map((i) => (
            <Card
              key={i.text}
              className={`gap-2 rounded-3xl border-l-4 p-4 shadow-soft ${
                i.tone === "warn" ? "border-l-warn bg-warn/10" : "border-l-fresh bg-fresh/10"
              }`}
            >
              <Info className={`h-4 w-4 ${i.tone === "warn" ? "text-warn-foreground" : "text-forest"}`} />
              <p className="text-sm font-medium text-forest">{i.text}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
