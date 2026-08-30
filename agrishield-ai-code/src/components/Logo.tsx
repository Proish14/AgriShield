import { cn } from "@/lib/utils";

/** Original AgriShield AI mark: a shield formed around a leaf. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("h-9 w-9", className)} aria-hidden="true">
      <path
        d="M24 3 41 9v15c0 10-7.3 18.4-17 21C14.3 42.4 7 34 7 24V9L24 3Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M24 3 41 9v15c0 10-7.3 18.4-17 21C14.3 42.4 7 34 7 24V9L24 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M24 34c0-8 4-13 10-15-.5 9-4.5 14-10 15Zm0 0c0-8-4-13-10-15 .5 9 4.5 14 10 15Z"
        fill="currentColor"
      />
      <path d="M24 34v-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  className,
  subtitle = true,
}: {
  className?: string;
  subtitle?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <LogoMark />
      <div className="min-w-0 leading-tight">
        <p className="truncate font-display text-lg font-bold tracking-tight">AgriShield AI</p>
        {subtitle && <p className="truncate text-[11px] opacity-70">Crop Disease Intelligence</p>}
      </div>
    </div>
  );
}
