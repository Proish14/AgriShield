import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Leaf, LogIn, ShieldCheck, Sprout, UserPlus } from "lucide-react";
import { toast } from "sonner";

import heroImage from "@/assets/farm-hero.jpg";
import { Logo, LogoMark } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/agri/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_FARMER, useApp } from "@/lib/app-state";
import { LANGUAGES, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriShield AI — Detect Early. Act Smart. Grow Better." },
      {
        name: "description",
        content:
          "Farmer login for AgriShield AI: AI crop disease detection, weather-based risk alerts, treatment guidance and crop advisory.",
      },
      { property: "og:title", content: "AgriShield AI — Crop Disease Intelligence for Farmers" },
      {
        property: "og:description",
        content:
          "Detect crop diseases early, get treatment guidance and track crop health with AgriShield AI.",
      },
    ],
  }),
  component: WelcomePage,
});

const HIGHLIGHTS = [
  { icon: Leaf, title: "Leaf-level detection", text: "Scan a photo, get disease + severity in seconds." },
  { icon: ShieldCheck, title: "Weather risk alerts", text: "Know the fungal risk before it spreads." },
  { icon: Sprout, title: "Crop advisory", text: "Choose the right crop for your soil and water." },
];

function WelcomePage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const { t, setLang } = useI18n();

  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [signup, setSignup] = useState({
    name: "",
    mobile: "",
    email: "",
    location: "",
    language: "en",
    password: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!loginId.trim()) next.loginId = "Enter your mobile number or email";
    if (password.length < 4) next.password = "Password must be at least 4 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    login({ ...DEMO_FARMER, name: "Ramesh Patil", email: loginId.includes("@") ? loginId : DEMO_FARMER.email });
    toast.success("Welcome back to AgriShield AI");
    navigate({ to: "/dashboard" });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (signup.name.trim().length < 3) next.name = "Enter your full name";
    if (!/^[0-9+\s-]{10,15}$/.test(signup.mobile)) next.mobile = "Enter a valid mobile number";
    if (!/^\S+@\S+\.\S+$/.test(signup.email)) next.email = "Enter a valid email address";
    if (!signup.location.trim()) next.location = "Enter your village / district";
    if (signup.password.length < 6) next.password = "Use at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLang(signup.language as "en" | "hi" | "mr");
    login({
      name: signup.name,
      mobile: signup.mobile,
      email: signup.email,
      location: signup.location,
    });
    toast.success("Account created — welcome to AgriShield AI");
    navigate({ to: "/dashboard" });
  };

  const continueAsDemo = () => {
    login(DEMO_FARMER);
    toast.success("Signed in as demo farmer");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-field lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Visual panel */}
      <section className="relative flex min-h-[15rem] flex-col justify-between overflow-hidden bg-forest p-6 text-forest-foreground sm:p-10">
        <img
          src={heroImage}
          alt="Green crop field at sunrise"
          width={1600}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-forest opacity-75" />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative mt-8 max-w-md space-y-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Protect every leaf of your farm.
            </h1>
            <p className="mt-3 text-base opacity-90">{t("tagline")}</p>
          </div>
          <ul className="space-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3 rounded-2xl bg-forest-foreground/10 p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-fresh/25">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs opacity-85">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative mt-8 text-xs opacity-70">
          Decision-support prototype for farmers, agri experts and extension teams.
        </p>
      </section>

      {/* Auth panel */}
      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md animate-rise space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-forest lg:hidden">
              <LogoMark className="h-8 w-8" />
              <span className="font-display font-bold">AgriShield AI</span>
            </div>
            <div className="ml-auto">
              <LanguageSwitcher />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-sage p-1">
                <TabsTrigger value="login" className="rounded-xl">
                  Farmer Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-forest">Welcome back</h2>
                  <p className="text-sm text-muted-foreground">
                    Sign in to check your crop health and alerts.
                  </p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginId">Mobile number or email</Label>
                    <Input
                      id="loginId"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="98765 43210"
                      className="rounded-xl"
                    />
                    {errors.loginId && <p className="text-xs text-danger">{errors.loginId}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        className="rounded-xl pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Checkbox defaultChecked /> Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => toast.info("A reset link would be sent to your mobile/email.")}
                      className="text-sm font-medium text-leaf hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Button type="submit" className="h-11 w-full rounded-xl text-base">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Button>
                </form>
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <Button
                  variant="outline"
                  onClick={continueAsDemo}
                  className="h-11 w-full rounded-xl border-leaf/40 text-leaf hover:bg-sage"
                >
                  <Sprout className="mr-2 h-4 w-4" /> Continue as demo farmer
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="mt-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-forest">Create your farm account</h2>
                  <p className="text-sm text-muted-foreground">
                    Takes a minute — we use it to personalise alerts.
                  </p>
                </div>
                <form onSubmit={handleSignup} className="space-y-3">
                  {(
                    [
                      { key: "name", label: "Full name", placeholder: "Ramesh Patil" },
                      { key: "mobile", label: "Mobile number", placeholder: "98765 43210" },
                      { key: "email", label: "Email", placeholder: "you@example.com" },
                      { key: "location", label: "Location", placeholder: "Village, District" },
                    ] as const
                  ).map((f) => (
                    <div key={f.key} className="space-y-2">
                      <Label htmlFor={f.key}>{f.label}</Label>
                      <Input
                        id={f.key}
                        value={signup[f.key]}
                        onChange={(e) => setSignup((s) => ({ ...s, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="rounded-xl"
                      />
                      {errors[f.key] && <p className="text-xs text-danger">{errors[f.key]}</p>}
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Label>Preferred language</Label>
                    <Select
                      value={signup.language}
                      onValueChange={(v) => setSignup((s) => ({ ...s, language: v }))}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l.code} value={l.code}>
                            {l.native} · {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      type={showPassword ? "text" : "password"}
                      value={signup.password}
                      onChange={(e) => setSignup((s) => ({ ...s, password: e.target.value }))}
                      placeholder="At least 6 characters"
                      className="rounded-xl"
                    />
                    {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
                  </div>
                  <Button type="submit" className="h-11 w-full rounded-xl text-base">
                    <UserPlus className="mr-2 h-4 w-4" /> Create account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
