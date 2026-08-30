import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "hi" | "mr";

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

/** Simple flat translation dictionary — easy to extend with real content later. */
const dict = {
  en: {
    tagline: "Detect Early. Act Smart. Grow Better.",
    dashboard: "Dashboard",
    scan: "Scan My Crop",
    advisor: "Crop Advisor",
    forecast: "Disease Risk Forecast",
    health: "My Crop Health",
    expert: "Expert Review",
    reports: "Reports",
    settings: "Settings",
    goodMorning: "Good Morning",
    cropHealthScore: "Crop Health Score",
    diseaseRisk: "Current Disease Risk",
    quickActions: "Quick Actions",
    todaysInsights: "Today's Farm Insights",
    analyze: "Analyze Crop",
    lowRisk: "Low Risk",
    moderateRisk: "Moderate Risk",
    highRisk: "High Risk",
    logout: "Logout",
    language: "Language",
    assistant: "Agri Assistant",
  },
  hi: {
    tagline: "जल्दी पहचानें। समझदारी से कार्य करें। बेहतर उगाएँ।",
    dashboard: "डैशबोर्ड",
    scan: "फसल स्कैन करें",
    advisor: "फसल सलाहकार",
    forecast: "रोग जोखिम पूर्वानुमान",
    health: "मेरी फसल स्वास्थ्य",
    expert: "विशेषज्ञ समीक्षा",
    reports: "रिपोर्ट",
    settings: "सेटिंग्स",
    goodMorning: "सुप्रभात",
    cropHealthScore: "फसल स्वास्थ्य स्कोर",
    diseaseRisk: "वर्तमान रोग जोखिम",
    quickActions: "त्वरित कार्य",
    todaysInsights: "आज की खेत जानकारी",
    analyze: "फसल विश्लेषण करें",
    lowRisk: "कम जोखिम",
    moderateRisk: "मध्यम जोखिम",
    highRisk: "उच्च जोखिम",
    logout: "लॉग आउट",
    language: "भाषा",
    assistant: "कृषि सहायक",
  },
  mr: {
    tagline: "लवकर ओळखा. हुशारीने कृती करा. उत्तम पिकवा.",
    dashboard: "डॅशबोर्ड",
    scan: "पीक स्कॅन करा",
    advisor: "पीक सल्लागार",
    forecast: "रोग धोका अंदाज",
    health: "माझे पीक आरोग्य",
    expert: "तज्ज्ञ पुनरावलोकन",
    reports: "अहवाल",
    settings: "सेटिंग्ज",
    goodMorning: "सुप्रभात",
    cropHealthScore: "पीक आरोग्य गुण",
    diseaseRisk: "सध्याचा रोग धोका",
    quickActions: "झटपट कृती",
    todaysInsights: "आजची शेती माहिती",
    analyze: "पिकाचे विश्लेषण करा",
    lowRisk: "कमी धोका",
    moderateRisk: "मध्यम धोका",
    highRisk: "जास्त धोका",
    logout: "बाहेर पडा",
    language: "भाषा",
    assistant: "कृषी सहाय्यक",
  },
} as const;

export type TranslationKey = keyof (typeof dict)["en"];

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = (key: TranslationKey) => dict[lang][key] ?? dict.en[key];
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
