import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, MessageSquare, Send, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/agri/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CROPS } from "@/lib/mock-data";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/expert")({
  head: () => ({
    meta: [
      { title: "Expert Review — Ask an Agronomist | AgriShield AI" },
      {
        name: "description",
        content:
          "Send unclear crop symptoms to a plant pathologist and track the status of every expert review request.",
      },
      { property: "og:title", content: "Expert Review — AgriShield AI" },
      {
        property: "og:description",
        content: "Human expert verification when AI confidence is low or symptoms look unusual.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExpertPage,
});

const STATUS_STYLES = {
  Submitted: "bg-sage/40 text-forest",
  "Under Review": "bg-warn/20 text-warn-foreground",
  "Advice Received": "bg-fresh/20 text-forest",
} as const;

function ExpertPage() {
  const { expertRequests, addExpertRequest } = useApp();
  const [crop, setCrop] = useState("Tomato");
  const [issue, setIssue] = useState("");

  const submit = () => {
    if (issue.trim().length < 10) {
      toast.error("Please describe the problem in a little more detail.");
      return;
    }
    addExpertRequest({ crop, issue: issue.trim() });
    setIssue("");
    toast.success("Request sent to the expert panel. Typical reply within 24 hours.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UserCheck}
        title="Expert Review"
        description="Get a human agronomist to confirm difficult cases"
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="animate-rise p-5 shadow-soft">
          <h2 className="text-base font-semibold text-forest">My requests</h2>
          <div className="mt-4 space-y-3">
            {expertRequests.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-forest">
                    {r.crop} · {r.id}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                      STATUS_STYLES[r.status],
                    )}
                  >
                    {r.status === "Advice Received" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Clock className="h-3.5 w-3.5" />
                    )}
                    {r.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.issue}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {r.date} · {r.expert}
                </p>
                {r.advice ? (
                  <div className="mt-3 flex gap-2 rounded-xl bg-fresh/10 p-3 text-sm text-forest">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{r.advice}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="animate-rise p-5 shadow-soft">
            <h2 className="text-base font-semibold text-forest">Raise a new request</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Crop</Label>
                <Select value={crop} onValueChange={setCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {CROPS.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue">Describe the problem</Label>
                <Textarea
                  id="issue"
                  rows={5}
                  placeholder="Which leaves are affected, when it started, weather and sprays already used…"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                />
              </div>
              <Button onClick={submit} className="w-full gap-2">
                <Send className="h-4 w-4" /> Send to expert
              </Button>
            </div>
          </Card>

          <Card className="animate-rise bg-sage/25 p-5">
            <h3 className="text-sm font-semibold text-forest">When to ask an expert</h3>
            <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>AI confidence is below 70%.</li>
              <li>Symptoms do not match the described disease.</li>
              <li>Disease spreads after two correct sprays.</li>
              <li>More than 30% of the field is affected.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
