import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  BarChart3,
  CloudSun,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  ScanLine,
  Settings,
  Sprout,
  UserCheck,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AgriAssistant } from "./AgriAssistant";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

const NAV: { to: string; key: TranslationKey; icon: typeof Sprout }[] = [
  { to: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { to: "/scan", key: "scan", icon: ScanLine },
  { to: "/advisor", key: "advisor", icon: Sprout },
  { to: "/forecast", key: "forecast", icon: CloudSun },
  { to: "/health", key: "health", icon: HeartPulse },
  { to: "/expert", key: "expert", icon: UserCheck },
  { to: "/reports", key: "reports", icon: BarChart3 },
  { to: "/settings", key: "settings", icon: Settings },
];

const MOBILE_NAV = NAV.slice(0, 5);

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const { farmer, logout } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const initials = (farmer?.name ?? "Demo Farmer")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-field">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-sidebar px-4 py-6 text-sidebar-foreground md:flex">
        <Link to="/dashboard" className="px-2">
          <Logo />
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map(({ to, key, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                    : "hover:bg-sidebar-accent",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{t(key)}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur md:pl-64">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-forest md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 md:hidden">
              <Logo subtitle={false} className="text-forest" />
            </div>
            <p className="hidden truncate text-sm text-muted-foreground md:block">
              {t("tagline")}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
            <Link
              to="/settings"
              className="grid h-10 w-10 place-items-center rounded-full bg-gradient-forest text-sm font-semibold text-forest-foreground"
            >
              {initials}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-forest/50"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 animate-rise flex-col bg-sidebar px-4 py-6 text-sidebar-foreground">
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-6 flex flex-1 flex-col gap-1">
              {NAV.map(({ to, key, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium",
                    pathname === to
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(key)}
                </Link>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </button>
          </div>
        </div>
      )}

      <main className="px-4 pb-28 pt-5 sm:px-6 md:pb-12 md:pl-70">
        <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {MOBILE_NAV.map(({ to, key, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                pathname === to ? "text-leaf" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="max-w-full truncate px-1">{t(key).split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </nav>

      <AgriAssistant />
    </div>
  );
}
