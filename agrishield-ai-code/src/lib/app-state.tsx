import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_FARM, EXPERT_REQUESTS, type DiseaseResult } from "./mock-data";

export type Farmer = {
  name: string;
  mobile: string;
  email: string;
  location: string;
};

export type ExpertRequest = {
  id: string;
  crop: string;
  issue: string;
  status: "Submitted" | "Under Review" | "Advice Received";
  date: string;
  expert: string;
  advice: string;
};

type AppValue = {
  farmer: Farmer | null;
  login: (farmer: Farmer) => void;
  logout: () => void;
  farm: typeof DEFAULT_FARM;
  scanResult: DiseaseResult | null;
  setScanResult: (r: DiseaseResult | null) => void;
  feedback: "helpful" | "review" | null;
  setFeedback: (f: "helpful" | "review" | null) => void;
  expertRequests: ExpertRequest[];
  addExpertRequest: (r: Omit<ExpertRequest, "id" | "status" | "date" | "expert" | "advice">) => void;
  recommendationsReady: boolean;
  setRecommendationsReady: (v: boolean) => void;
};

const AppContext = createContext<AppValue | null>(null);

export const DEMO_FARMER: Farmer = {
  name: "Ramesh Patil",
  mobile: "+91 98765 43210",
  email: "ramesh.patil@example.com",
  location: "Nashik, Maharashtra",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [scanResult, setScanResult] = useState<DiseaseResult | null>(null);
  const [feedback, setFeedback] = useState<"helpful" | "review" | null>(null);
  const [recommendationsReady, setRecommendationsReady] = useState(false);
  const [expertRequests, setExpertRequests] = useState<ExpertRequest[]>(EXPERT_REQUESTS as ExpertRequest[]);

  const value = useMemo<AppValue>(
    () => ({
      farmer,
      login: setFarmer,
      logout: () => setFarmer(null),
      farm: DEFAULT_FARM,
      scanResult,
      setScanResult,
      feedback,
      setFeedback,
      expertRequests,
      addExpertRequest: (r) =>
        setExpertRequests((prev) => [
          {
            ...r,
            id: `ER-${1060 + prev.length}`,
            status: "Submitted",
            date: new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            expert: "Awaiting assignment",
            advice: "",
          },
          ...prev,
        ]),
      recommendationsReady,
      setRecommendationsReady,
    }),
    [farmer, scanResult, feedback, expertRequests, recommendationsReady],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
