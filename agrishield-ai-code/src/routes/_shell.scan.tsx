import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ImageUp,
  Loader2,
  RefreshCw,
  ScanLine,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";

import leafSample from "@/assets/leaf-sample.jpg";
import { PageHeader } from "@/components/agri/PageHeader";
import { RiskBadge } from "@/components/agri/RiskBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { CROPS, MOCK_RESULTS, PRICE_OPTIONS, TREATMENT_PLAN } from "@/lib/mock-data";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/scan")({
  head: () => ({
    meta: [
      { title: "Scan My Crop — AgriShield AI" },
      {
        name: "description",
        content:
          "Upload or capture a crop leaf photo and get disease detection, severity, treatment guidance and product price comparison.",
      },
      { property: "og:title", content: "Scan My Crop — AgriShield AI" },
      {
        property: "og:description",
        content: "AI-assisted crop disease detection with treatment and prevention guidance.",
      },
    ],
  }),
  component: ScanPage,
});

type Stage = "input" | "analyzing" | "result";

function ScanPage() {
  const { scanResult, setScanResult, feedback, setFeedback } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [crop, setCrop] = useState("tomato");
  const [variety, setVariety] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>(scanResult ? "result" : "input");
  const [note, setNote] = useState("");
  const [sort, setSort] = useState<"price" | "availability" | "value">("price");

  const cropMeta = CROPS.find((c) => c.id === crop)!;

  const onFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  const analyze = () => {
    const image = preview ?? leafSample;
    setStage("analyzing");
    setFeedback(null);
    setTimeout(() => {
      const base = MOCK_RESULTS[crop];
      setScanResult({ ...base, crop: cropMeta.name, variety: variety || undefined, image });
      setPreview(image);
      setStage("result");
    }, 2200);
  };

  const reset = () => {
    setScanResult(null);
    setPreview(null);
    setStage("input");
    setFeedback(null);
  };

  const sorted = [...PRICE_OPTIONS].sort((a, b) => {
    if (sort === "price") return a.price - b.price;
    if (sort === "availability")
      return Number(a.availability !== "In Stock") - Number(b.availability !== "In Stock");
    return b.rating / b.price - a.rating / a.price;
  });
  const lowest = Math.min(...PRICE_OPTIONS.map((p) => p.price));

  return (
    <>
      <PageHeader
        icon={ScanLine}
        title="Scan My Crop"
        description="Take or upload a clear leaf photo in daylight for the best result."
        action={
          stage === "result" ? (
            <Button variant="outline" onClick={reset} className="rounded-xl border-leaf/40 text-leaf">
              <RefreshCw className="mr-2 h-4 w-4" /> New scan
            </Button>
          ) : undefined
        }
      />

      {stage !== "result" && (
        <Card className="animate-rise gap-5 rounded-3xl border-border bg-card p-5 shadow-soft sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Select crop</Label>
              <Select
                value={crop}
                onValueChange={(v) => {
                  setCrop(v);
                  setVariety("");
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CROPS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Crop variety (optional)</Label>
              <Select value={variety} onValueChange={setVariety}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select variety" />
                </SelectTrigger>
                <SelectContent>
                  {cropMeta.varieties.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
            <div className="grid place-items-center rounded-3xl border-2 border-dashed border-leaf/35 bg-sage/50 p-6 text-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Uploaded crop leaf preview"
                  className="max-h-64 w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="space-y-2">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-card text-leaf shadow-soft">
                    <ImageUp className="h-6 w-6" />
                  </span>
                  <p className="font-semibold text-forest">Add a crop or leaf photo</p>
                  <p className="text-xs text-muted-foreground">
                    JPG or PNG · close-up of the affected leaf
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <Button
                variant="outline"
                className="h-12 w-full justify-start rounded-2xl"
                onClick={() => cameraRef.current?.click()}
              >
                <Camera className="mr-3 h-5 w-5 text-leaf" /> Take a photo
              </Button>
              <Button
                variant="outline"
                className="h-12 w-full justify-start rounded-2xl"
                onClick={() => fileRef.current?.click()}
              >
                <ImageUp className="mr-3 h-5 w-5 text-leaf" /> Upload from device
              </Button>
              <Button
                variant="ghost"
                className="w-full rounded-2xl text-sm text-muted-foreground"
                onClick={() => setPreview(leafSample)}
              >
                Use sample leaf image
              </Button>
              <Button
                className="h-13 w-full rounded-2xl py-4 text-base"
                disabled={stage === "analyzing"}
                onClick={analyze}
              >
                {stage === "analyzing" ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                Analyze Crop
              </Button>
            </div>
          </div>

          {stage === "analyzing" && (
            <div className="space-y-3 rounded-3xl bg-gradient-forest p-5 text-forest-foreground">
              <p className="flex items-center gap-2 font-display font-semibold">
                <Loader2 className="h-4 w-4 animate-spin" /> AI is analyzing your crop image...
              </p>
              <Progress value={72} className="h-2 bg-forest-foreground/20" />
              <p className="text-xs opacity-85">
                Checking leaf texture, spot pattern and colour signature against known disease
                profiles.
              </p>
            </div>
          )}
        </Card>
      )}

      {stage === "result" && scanResult && (
        <div className="space-y-6">
          {/* Result */}
          <Card className="animate-rise gap-0 overflow-hidden rounded-3xl border-border bg-card p-0 shadow-soft">
            <div className="grid gap-0 md:grid-cols-[minmax(0,320px)_1fr]">
              <img
                src={scanResult.image}
                alt={`${scanResult.crop} leaf analysed`}
                className="h-56 w-full object-cover md:h-full"
              />
              <div className="space-y-4 p-5 sm:p-6">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {scanResult.crop}
                      {scanResult.variety ? ` · ${scanResult.variety}` : ""}
                    </p>
                    <h2 className="text-2xl font-bold text-forest">{scanResult.disease}</h2>
                  </div>
                  <RiskBadge level={scanResult.riskLevel} />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-sage p-3">
                    <p className="text-[11px] font-semibold uppercase text-sage-foreground/70">
                      Confidence
                    </p>
                    <p className="font-display text-xl font-bold text-forest">
                      {scanResult.confidence}%
                    </p>
                    <Progress value={scanResult.confidence} className="mt-2 h-1.5" />
                  </div>
                  <div className="rounded-2xl bg-sage p-3">
                    <p className="text-[11px] font-semibold uppercase text-sage-foreground/70">
                      Severity
                    </p>
                    <p className="font-display text-xl font-bold text-forest">
                      {scanResult.severity}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-sage p-3">
                    <p className="text-[11px] font-semibold uppercase text-sage-foreground/70">
                      Disease risk
                    </p>
                    <p className="font-display text-xl font-bold text-forest">
                      {scanResult.riskLevel}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-forest">Possible cause</p>
                  <p className="text-sm text-muted-foreground">{scanResult.cause}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-forest">Symptoms</p>
                  <ul className="mt-1 space-y-1">
                    {scanResult.symptoms.map((s) => (
                      <li key={s} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fresh" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="flex gap-2 rounded-2xl bg-earth/50 p-3 text-xs text-earth-foreground">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  Image-based results are decision-support recommendations, not a final diagnosis.
                  Uncertain cases can be sent for expert review.
                </p>
              </div>
            </div>
          </Card>

          {/* Field confirmation */}
          <Card className="gap-3 rounded-3xl border-border bg-card p-5 shadow-soft">
            <h3 className="font-display text-lg font-bold text-forest">
              Was this detection helpful?
            </h3>
            <p className="text-sm text-muted-foreground">
              Your field confirmation trains better detection and recommendations for farmers in your
              region.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={feedback === "helpful" ? "default" : "outline"}
                className="rounded-xl"
                onClick={() => {
                  setFeedback("helpful");
                  toast.success("Thanks — confirmation recorded");
                }}
              >
                <ThumbsUp className="mr-2 h-4 w-4" /> Correct / Helpful
              </Button>
              <Button
                variant={feedback === "review" ? "default" : "outline"}
                className="rounded-xl"
                onClick={() => {
                  setFeedback("review");
                  toast.info("Marked for review — you can request expert help");
                }}
              >
                <ThumbsDown className="mr-2 h-4 w-4" /> Incorrect / Needs review
              </Button>
            </div>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              placeholder="Tell us what you observed in your field (optional)"
              className="rounded-2xl"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="rounded-xl"
                onClick={() => toast.success("Field observation saved to your crop history")}
              >
                Submit observation
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-leaf/40 text-leaf">
                <Link to="/expert">Request expert review</Link>
              </Button>
            </div>
          </Card>

          {/* Treatment */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-forest">Treatment & Management</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <PlanCard
                title="Immediate Actions"
                tone="danger"
                icon={AlertTriangle}
                items={TREATMENT_PLAN.immediate}
              />
              <PlanCard
                title="Recommended Management"
                tone="leaf"
                icon={Sparkles}
                items={TREATMENT_PLAN.management}
              />
              <PlanCard
                title="Prevention Tips"
                tone="fresh"
                icon={CheckCircle2}
                items={TREATMENT_PLAN.prevention}
              />
              <PlanCard
                title="Cultural Practices & IPM"
                tone="earth"
                icon={ScanLine}
                items={[...TREATMENT_PLAN.cultural, ...TREATMENT_PLAN.ipm]}
              />
            </div>
            <Card className="gap-2 rounded-3xl border-border bg-sage p-5">
              <h3 className="font-display font-bold text-forest">When to Consult an Expert</h3>
              <ul className="space-y-1">
                {TREATMENT_PLAN.consultExpert.map((c) => (
                  <li key={c} className="flex gap-2 text-sm text-sage-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-2 flex gap-2 rounded-2xl bg-card/70 p-3 text-xs text-muted-foreground">
                <ShieldAlert className="h-4 w-4 shrink-0 text-warn-foreground" />
                Safety reminder: always follow official agricultural guidance, approved dosage and
                the product label. Wear protective gear while spraying.
              </p>
            </Card>
          </section>

          {/* Price comparison */}
          <section className="space-y-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-forest">Compare Options</h2>
                <p className="text-sm text-muted-foreground">
                  Sample marketplace data for prototype demonstration.
                </p>
              </div>
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger className="w-40 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Lowest Price</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                  <SelectItem value="value">Best Value</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {sorted.map((p) => (
                <Card
                  key={p.platform}
                  className={cn(
                    "card-hover gap-2 rounded-3xl border-border bg-card p-5 shadow-soft",
                    p.price === lowest && "border-fresh/60 bg-fresh/10",
                  )}
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {p.platform}
                    </p>
                    {p.price === lowest && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-fresh px-2 py-0.5 text-[10px] font-bold text-fresh-foreground">
                        <Trophy className="h-3 w-3" /> Best Price
                      </span>
                    )}
                  </div>
                  <p className="font-display font-bold text-forest">{p.product}</p>
                  <p className="text-sm text-muted-foreground">
                    Pack size: {p.pack} · ⭐ {p.rating}
                  </p>
                  <p className="font-display text-2xl font-extrabold text-forest">₹{p.price}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-semibold",
                        p.availability === "In Stock"
                          ? "bg-fresh/25 text-forest"
                          : p.availability === "Limited Stock"
                            ? "bg-warn/30 text-warn-foreground"
                            : "bg-danger/12 text-danger",
                      )}
                    >
                      {p.availability}
                    </span>
                    <span className="text-muted-foreground">{p.delivery}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-2 rounded-xl border-leaf/40 text-leaf"
                    onClick={() => toast.info("Sample listing — no external store in the prototype")}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> View Product
                  </Button>
                </Card>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-xl">
              <Link to="/reports">Generate farm report</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-leaf/40 text-leaf">
              <Link to="/forecast">View disease risk forecast</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

const tones = {
  danger: "border-l-danger bg-danger/8",
  leaf: "border-l-leaf bg-leaf/8",
  fresh: "border-l-fresh bg-fresh/12",
  earth: "border-l-warn bg-earth/40",
} as const;

function PlanCard({
  title,
  items,
  tone,
  icon: Icon,
}: {
  title: string;
  items: string[];
  tone: keyof typeof tones;
  icon: typeof AlertTriangle;
}) {
  return (
    <Card className={cn("gap-3 rounded-3xl border-l-4 p-5 shadow-soft", tones[tone])}>
      <h3 className="flex items-center gap-2 font-display font-bold text-forest">
        <Icon className="h-4 w-4" /> {title}
      </h3>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground/80">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
            {i}
          </li>
        ))}
      </ul>
    </Card>
  );
}
