import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, MapPin, Ruler, Settings as SettingsIcon, Sprout, User } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/agri/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES, useI18n } from "@/lib/i18n";
import { DEMO_FARMER, useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Farm Profile — AgriShield AI" },
      {
        name: "description",
        content:
          "Manage your farmer profile, farm details, alert preferences and app language across English, Hindi and Marathi.",
      },
      { property: "og:title", content: "Settings — AgriShield AI" },
      {
        property: "og:description",
        content: "Farm profile, notification alerts and language preferences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const ALERTS = [
  { id: "risk", label: "High disease risk alerts", detail: "Notify when risk crosses 70%" },
  { id: "weather", label: "Weather change alerts", detail: "Rain and humidity spikes" },
  { id: "expert", label: "Expert reply alerts", detail: "When an agronomist responds" },
  { id: "advisory", label: "Weekly crop advisory", detail: "Season tips every Monday" },
];

function SettingsPage() {
  const { farmer, farm, logout } = useApp();
  const { lang, setLang } = useI18n();
  const navigate = useNavigate();
  const profile = farmer ?? DEMO_FARMER;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Profile, farm details, alerts and language"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="animate-rise p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-base font-semibold text-forest">
            <User className="h-4 w-4" /> Farmer profile
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input defaultValue={profile.name} />
            </div>
            <div className="space-y-2">
              <Label>Mobile</Label>
              <Input defaultValue={profile.mobile} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Email</Label>
              <Input defaultValue={profile.email} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Location</Label>
              <Input defaultValue={profile.location} />
            </div>
          </div>
          <Button className="mt-4" onClick={() => toast.success("Profile saved (prototype).")}>
            Save profile
          </Button>
        </Card>

        <Card className="animate-rise p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-base font-semibold text-forest">
            <Sprout className="h-4 w-4" /> Farm details
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl border border-border/70 px-3 py-2.5">
              <span className="text-muted-foreground">Farm name</span>
              <span className="font-semibold text-forest">{farm.farmName}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 px-3 py-2.5">
              <span className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> Location
              </span>
              <span className="font-semibold text-forest">{farm.location}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 px-3 py-2.5">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Ruler className="h-4 w-4" /> Land size
              </span>
              <span className="font-semibold text-forest">{farm.landSize}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 px-3 py-2.5">
              <span className="text-muted-foreground">Soil type</span>
              <span className="font-semibold text-forest">{farm.soil}</span>
            </div>
            <div className="rounded-2xl border border-border/70 px-3 py-2.5">
              <p className="text-muted-foreground">Crops grown</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {farm.crops.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-fresh/15 px-3 py-1 text-xs font-semibold text-forest"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="animate-rise p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-base font-semibold text-forest">
            <Bell className="h-4 w-4" /> Alerts
          </h2>
          <ul className="mt-4 space-y-3">
            {ALERTS.map((a, i) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-forest">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.detail}</p>
                </div>
                <Switch defaultChecked={i < 3} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="animate-rise p-5 shadow-soft">
          <h2 className="text-base font-semibold text-forest">Language</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={cn(
                  "rounded-2xl border px-3 py-3 text-left transition-colors",
                  lang === l.code
                    ? "border-primary bg-fresh/15 text-forest"
                    : "border-border/70 hover:bg-sage/25",
                )}
              >
                <p className="text-sm font-semibold">{l.native}</p>
                <p className="text-xs text-muted-foreground">{l.label}</p>
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-6 gap-2"
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </Card>
      </div>
    </div>
  );
}
