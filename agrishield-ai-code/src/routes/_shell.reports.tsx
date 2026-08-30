import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, FileText, Printer, ScanLine, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/agri/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEFAULT_FARM, HEALTH_TIMELINE, HEALTH_TREND, RISK_FORECAST } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Insights — AgriShield AI" },
      {
        name: "description",
        content:
          "Season summary of crop scans, detected diseases, treatment adherence and health score movement for your farm.",
      },
      { property: "og:title", content: "Reports & Insights — AgriShield AI" },
      {
        property: "og:description",
        content: "Downloadable season report with scan history and disease trends.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

const DISEASE_COUNTS = [
  { name: "Early Blight", count: 6 },
  { name: "Purple Blotch", count: 3 },
  { name: "Yellow Rust", count: 2 },
  { name: "Leaf Curl", count: 1 },
];

const STATS = [
  { icon: ScanLine, label: "Scans this season", value: "18" },
  { icon: FileText, label: "Diseases detected", value: "12" },
  { icon: TrendingUp, label: "Health score change", value: "+12" },
  { icon: BarChart3, label: "Avg. risk index", value: "58%" },
];

function ReportsPage() {
  const notify = (what: string) => toast.success(`${what} — prototype demo action.`);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BarChart3}
        title="Reports & Insights"
        description={`Season summary for ${DEFAULT_FARM.farmName}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => notify("Report printed")}>
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button className="gap-2" onClick={() => notify("PDF download started")}>
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="animate-rise p-4 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-leaf text-primary-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-bold text-forest">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="animate-rise p-5 shadow-soft">
          <h2 className="text-base font-semibold text-forest">Most frequent diseases</h2>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISEASE_COUNTS} layout="vertical">
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <Tooltip
                  formatter={(v: number) => [`${v} detections`, ""]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(0 0% 90%)" }}
                />
                <Bar dataKey="count" radius={[0, 10, 10, 0]} fill="hsl(142 55% 36%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="animate-rise p-5 shadow-soft">
          <h2 className="text-base font-semibold text-forest">Health score log</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2">Date</th>
                  <th className="py-2">Score</th>
                  <th className="py-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {HEALTH_TREND.map((row, i) => {
                  const prev = i === 0 ? row.score : HEALTH_TREND[i - 1].score;
                  const diff = row.score - prev;
                  return (
                    <tr key={row.date} className="border-t border-border/60">
                      <td className="py-2.5 font-medium text-forest">{row.date}</td>
                      <td className="py-2.5">{row.score}</td>
                      <td className="py-2.5 text-muted-foreground">
                        {diff === 0 ? "—" : diff > 0 ? `▲ ${diff}` : `▼ ${Math.abs(diff)}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="animate-rise p-5 shadow-soft">
        <h2 className="text-base font-semibold text-forest">Activity log</h2>
        <ul className="mt-4 space-y-3">
          {HEALTH_TIMELINE.map((item) => (
            <li
              key={`${item.date}-${item.title}`}
              className="rounded-2xl border border-border/70 p-3"
            >
              <p className="text-sm font-semibold text-forest">
                {item.date} · {item.title}
              </p>
              <p className="text-sm text-muted-foreground">{item.detail}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Next week average forecast risk:{" "}
          {Math.round(RISK_FORECAST.reduce((s, d) => s + d.risk, 0) / RISK_FORECAST.length)}% ·
          Prototype data for demonstration only.
        </p>
      </Card>
    </div>
  );
}
