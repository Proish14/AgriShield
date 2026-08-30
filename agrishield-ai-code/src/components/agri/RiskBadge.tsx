import { cn } from "@/lib/utils";

export type Level = "Low" | "Moderate" | "High";

const styles: Record<Level, string> = {
  Low: "bg-fresh/20 text-forest border-fresh/40",
  Moderate: "bg-warn/25 text-warn-foreground border-warn/50",
  High: "bg-danger/12 text-danger border-danger/35",
};

const dots: Record<Level, string> = {
  Low: "bg-fresh",
  Moderate: "bg-warn",
  High: "bg-danger",
};

export function RiskBadge({
  level,
  label,
  className,
}: {
  level: Level;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        styles[level],
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", dots[level])} />
      {label ?? `${level} Risk`}
    </span>
  );
}
