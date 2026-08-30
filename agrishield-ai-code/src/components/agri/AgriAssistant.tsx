import { useState } from "react";
import { Leaf, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHAT_FAQS } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Msg = { from: "bot" | "user"; text: string };

const FALLBACK =
  "I can help with crop disease detection, weather-based risk, treatment steps and crop selection. Try one of the suggested questions, or open Scan My Crop to check a leaf photo.";

function answerFor(question: string) {
  const q = question.toLowerCase();
  const match = CHAT_FAQS.find((f) =>
    f.q
      .toLowerCase()
      .split(" ")
      .filter((w) => w.length > 4)
      .some((w) => q.includes(w.replace(/[?]/g, ""))),
  );
  return match?.a ?? FALLBACK;
}

export function AgriAssistant() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text: "Namaste! I am your Agri Assistant. Ask me about crop diseases, weather risk or what to grow next.",
    },
  ]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", text }, { from: "bot", text: answerFor(text) }]);
    setInput("");
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[30rem] w-[min(22rem,calc(100vw-2rem))] animate-rise flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lift md:bottom-24">
          <div className="flex items-center gap-3 bg-gradient-forest px-4 py-3 text-forest-foreground">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-fresh/25">
              <Leaf className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-semibold">{t("assistant")}</p>
              <p className="text-[11px] opacity-80">Online · sample responses</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-background px-3 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  m.from === "bot"
                    ? "bg-sage text-sage-foreground"
                    : "ml-auto bg-leaf text-primary-foreground",
                )}
              >
                {m.text}
              </div>
            ))}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Suggested questions
              </p>
              {CHAT_FAQS.map((f) => (
                <button
                  key={f.q}
                  onClick={() => send(f.q)}
                  className="block w-full rounded-xl border border-border bg-card px-3 py-2 text-left text-xs font-medium text-forest transition-colors hover:bg-sage"
                >
                  {f.q}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your crop..."
              className="rounded-full"
            />
            <Button type="submit" size="icon" className="shrink-0 rounded-full">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t("assistant")}
        className="fixed bottom-20 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-leaf text-primary-foreground shadow-lift transition-transform hover:scale-105 md:bottom-6"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
