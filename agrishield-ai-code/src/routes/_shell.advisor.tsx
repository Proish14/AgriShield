import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CloudRain,
  Droplets,
  HelpCircle,
  Layers,
  Medal,
  Ruler,
  Sparkles,
  Sprout,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/agri/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CROP_RECOMMENDATIONS } from "@/lib/mock-data";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/advisor")({
  head: () => ({
    meta: [
      { title: "Crop Advisor — What Should I Grow? | AgriShield AI" },
      {
        name: "description",
        content:
          "Answer a short farm form and get the top 3 recommended crops with suitability scores and clear reasoning.",
      },
      { property: "og:title", content: "Crop Advisor — AgriShield AI" },
      {
        property: "og:description",
        content: "Explainable crop recommendations based on soil, water, weather and rotation.",
      },
    ],
  }),
  component: AdvisorPage,
});

const SOILS = ["Black soil (Vertisol)", "Red soil", "Alluvial soil", "Sandy loam", "Clay loam"];
const SEASONS = ["Kharif (Jun–Oct)", "Rabi (Nov–Mar)", "Zaid (Apr–Jun)"];
const WATER = [
  { key: "Low", note: "Rain-fed only" },
  { key: "Medium", note: "One or two irrigations" },
  { key: "High", note: "Canal / borewell assured" },
];

function AdvisorPage() {
  const { recommendationsReady, setRecommendationsReady } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    location: "Nashik, Maharashtra",
    soil: SOILS[0],
    previousCrop: "Wheat",
    lastSeason: "Rabi 2025-26",
    rainfall: "26 mm in last 48 hours",
    weather: "Humid & cloudy",
    water: "Medium",
    land: "4.5",
    season: SEASONS[0],
    notes: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const steps = ["Farm & Soil", "Season & Water", "Notes"];

  const submit = () => {
    if (!form.location.trim() || !form.land.trim() || Number(form.land) <= 0) {
      toast.error("Please enter a valid location and land size");
      return;
    }
    setRecommendationsReady(true);
    toast.success("Smart Farm Analysis ready");
  };

  if (recommendationsReady) {
    return (
      <>
        <PageHeader
          icon={Sprout}
          title="Smart Farm Analysis"
          description={`${form.location} · ${form.land} acres · ${form.season}`}
          action={
            <Button
              variant="outline"
              className="rounded-xl border-leaf/40 text-leaf"
              onClick={() => {
                setRecommendationsReady(false);
                setStep(0);
              }}
            >
              Edit inputs
            </Button>
          }
        />

        <Card className="animate-rise gap-2 rounded-3xl border-border bg-gradient-forest p-5 text-forest-foreground shadow-soft">
          <h2 className="font-display text-lg font-bold">Top 3 Recommended Crops</h2>
          <p className="text-sm opacity-85">
            Scored on soil match, water availability, current weather and rotation benefit.
          </p>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          {CROP_RECOMMENDATIONS.map((r) => (
            <Card
              key={r.crop}
              className="card-hover gap-3 rounded-3xl border-border bg-card p-5 shadow-soft"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{["🥇", "🥈", "🥉"][r.rank - 1]}</span>
                <h3 className="font-display text-lg font-bold text-forest">{r.crop}</h3>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm font-semibold text-forest">
                  <span>Suitability</span>
                  <span>{r.suitability}%</span>
                </div>
                <Progress value={r.suitability} className="mt-1 h-2" />
              </div>
              <Detail icon={Sparkles} label="Why recommended" text={r.why} />
              <Detail icon={CloudRain} label="Weather suitability" text={r.weather} />
              <Detail icon={Droplets} label="Water suitability" text={r.water} />
              <Detail icon={Layers} label="Rotation consideration" text={r.rotation} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Precautions
                </p>
                <ul className="mt-1 space-y-1">
                  {r.precautions.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-foreground/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        <Card className="gap-3 rounded-3xl border-border bg-sage p-5">
          <h3 className="flex items-center gap-2 font-display font-bold text-forest">
            <HelpCircle className="h-4 w-4" /> Why this recommendation?
          </h3>
          <p className="text-sm text-sage-foreground">
            The advisor uses a simple, explainable scoring rule — no black box:
          </p>
          <ul className="space-y-1 text-sm text-sage-foreground">
            <li>• Soil match with the crop's preferred soil type — 30%</li>
            <li>• Water availability vs the crop's requirement — 25%</li>
            <li>• Current season and rainfall window — 25%</li>
            <li>• Rotation benefit after "{form.previousCrop}" — 20%</li>
          </ul>
          <p className="text-xs text-sage-foreground/80">
            Inputs used: {form.soil}, water {form.water}, {form.weather}, {form.rainfall}.
          </p>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        icon={Sprout}
        title="Crop Advisor — What Should I Grow?"
        description="Three quick steps about your farm, then a clear recommendation."
      />

      <Card className="animate-rise gap-5 rounded-3xl border-border bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold",
                  i <= step ? "bg-leaf text-primary-foreground" : "bg-sage text-sage-foreground",
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "hidden truncate text-sm font-medium sm:block",
                  i === step ? "text-forest" : "text-muted-foreground",
                )}
              >
                {s}
              </span>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Location">
              <Input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className="rounded-xl"
              />
            </Field>
            <Field label="Soil type">
              <Select value={form.soil} onValueChange={(v) => set("soil", v)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOILS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Previous crop">
              <Input
                value={form.previousCrop}
                onChange={(e) => set("previousCrop", e.target.value)}
                className="rounded-xl"
              />
            </Field>
            <Field label="Last crop / harvest season">
              <Input
                value={form.lastSeason}
                onChange={(e) => set("lastSeason", e.target.value)}
                className="rounded-xl"
              />
            </Field>
            <Field label="Land size (acres)">
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-leaf" />
                <Input
                  value={form.land}
                  onChange={(e) => set("land", e.target.value)}
                  className="rounded-xl pl-9"
                  inputMode="decimal"
                />
              </div>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Current growing season">
                <Select value={form.season} onValueChange={(v) => set("season", v)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEASONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Current weather">
                <Input
                  value={form.weather}
                  onChange={(e) => set("weather", e.target.value)}
                  className="rounded-xl"
                />
              </Field>
              <Field label="Recent rainfall">
                <Input
                  value={form.rainfall}
                  onChange={(e) => set("rainfall", e.target.value)}
                  className="rounded-xl"
                />
              </Field>
            </div>
            <div className="space-y-2">
              <Label>Water availability</Label>
              <div className="grid gap-3 sm:grid-cols-3">
                {WATER.map((w) => (
                  <button
                    key={w.key}
                    type="button"
                    onClick={() => set("water", w.key)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-colors",
                      form.water === w.key
                        ? "border-leaf bg-leaf/10"
                        : "border-border bg-card hover:bg-sage",
                    )}
                  >
                    <Droplets className="h-5 w-5 text-leaf" />
                    <p className="mt-2 font-semibold text-forest">{w.key}</p>
                    <p className="text-xs text-muted-foreground">{w.note}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <Field label="Optional soil / farm notes">
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              maxLength={500}
              placeholder="e.g. field slopes to the east, last soil test showed low nitrogen"
              className="min-h-28 rounded-2xl"
            />
          </Field>
        )}

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            className="rounded-xl"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button className="rounded-xl" onClick={() => setStep((s) => s + 1)}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button className="rounded-xl" onClick={submit}>
              <Medal className="mr-2 h-4 w-4" /> Get recommendations
            </Button>
          )}
        </div>
      </Card>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  text,
}: {
  icon: typeof Sparkles;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-sage/60 p-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sage-foreground/80">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1 text-sm text-foreground/80">{text}</p>
    </div>
  );
}
