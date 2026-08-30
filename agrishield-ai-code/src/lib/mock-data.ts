/**
 * All prototype data lives here so the demo stays easy to explain and extend.
 * Replace these objects with real API responses during productisation.
 */

export const CROPS = [
  { id: "tomato", name: "Tomato", varieties: ["Pusa Ruby", "Arka Rakshak", "Local Hybrid"] },
  { id: "wheat", name: "Wheat", varieties: ["HD 2967", "Lok-1", "Sharbati"] },
  { id: "rice", name: "Rice", varieties: ["Basmati 370", "IR-64", "Indrayani"] },
  { id: "cotton", name: "Cotton", varieties: ["Bt Hybrid", "Suraj", "Local"] },
  { id: "soybean", name: "Soybean", varieties: ["JS-9560", "MACS-1188"] },
  { id: "onion", name: "Onion", varieties: ["N-53", "Bhima Super"] },
];

export type Severity = "Low" | "Moderate" | "High";

export type DiseaseResult = {
  crop: string;
  variety?: string;
  disease: string;
  confidence: number;
  severity: Severity;
  cause: string;
  symptoms: string[];
  riskLevel: Severity;
  image?: string;
};

/** Rule-based mock detection: keeps the demo deterministic and explainable. */
export const MOCK_RESULTS: Record<string, Omit<DiseaseResult, "crop" | "variety" | "image">> = {
  tomato: {
    disease: "Early Blight",
    confidence: 91,
    severity: "Moderate",
    cause: "Fungal infection (Alternaria solani) favoured by warm, humid weather and leaf wetness.",
    symptoms: [
      "Dark brown concentric ring spots on lower leaves",
      "Yellow halo around the spots",
      "Progressive leaf drop from the bottom upward",
    ],
    riskLevel: "Moderate",
  },
  wheat: {
    disease: "Yellow Rust",
    confidence: 88,
    severity: "High",
    cause: "Puccinia striiformis spores spreading in cool, moist mornings with dew.",
    symptoms: [
      "Yellow-orange powdery stripes along leaf veins",
      "Powder rubs off on fingers",
      "Reduced grain filling in severe cases",
    ],
    riskLevel: "High",
  },
  rice: {
    disease: "Bacterial Leaf Blight",
    confidence: 84,
    severity: "Moderate",
    cause: "Xanthomonas oryzae entering through wounds after heavy rain and standing water.",
    symptoms: [
      "Water-soaked stripes turning yellow at leaf edges",
      "Wilting of young seedlings",
      "Milky ooze on leaves in early morning",
    ],
    riskLevel: "High",
  },
  cotton: {
    disease: "Leaf Curl (Whitefly transmitted)",
    confidence: 79,
    severity: "Moderate",
    cause: "Virus transmitted by whitefly populations rising in dry, hot spells.",
    symptoms: ["Upward leaf curling", "Thickened veins", "Stunted plant growth"],
    riskLevel: "Moderate",
  },
  soybean: {
    disease: "Rust",
    confidence: 82,
    severity: "Low",
    cause: "Phakopsora pachyrhizi favoured by long dew periods and dense canopy.",
    symptoms: ["Small reddish-brown pustules on the underside", "Early leaf yellowing"],
    riskLevel: "Low",
  },
  onion: {
    disease: "Purple Blotch",
    confidence: 86,
    severity: "Moderate",
    cause: "Alternaria porri spreading during humid weather with frequent irrigation.",
    symptoms: ["Small white sunken lesions", "Purple centres with yellow margins", "Tip dieback"],
    riskLevel: "Moderate",
  },
};

export const TREATMENT_PLAN = {
  immediate: [
    "Remove and destroy heavily infected lower leaves — do not leave them in the field.",
    "Stop overhead irrigation; switch to morning drip or furrow watering.",
    "Isolate the affected patch and avoid moving through it when leaves are wet.",
  ],
  management: [
    "Apply a recommended protective fungicide (e.g. Mancozeb 75% WP) as per label dose.",
    "Repeat the spray after 8–10 days only if fresh spots keep appearing.",
    "Rotate active ingredients to avoid resistance build-up.",
  ],
  prevention: [
    "Use certified, disease-tolerant seed or seedlings.",
    "Maintain plant spacing for airflow and stake tomato plants.",
    "Mulch to stop soil splash onto lower leaves.",
    "Follow 2–3 year rotation with non-host crops such as maize.",
  ],
  cultural: [
    "Deep summer ploughing to bury crop residue.",
    "Balanced nutrition — avoid excess nitrogen which softens foliage.",
    "Field sanitation after every harvest cycle.",
  ],
  ipm: [
    "Scout the field twice a week and record spot counts.",
    "Use biological options such as Trichoderma or neem formulations first.",
    "Escalate to chemical control only when threshold damage is crossed.",
  ],
  consultExpert: [
    "Confidence is below 70% or symptoms look different from the description.",
    "Disease keeps spreading after two correctly applied sprays.",
    "More than 30% of the field shows symptoms.",
  ],
};

export type PriceOption = {
  platform: string;
  product: string;
  pack: string;
  price: number;
  availability: "In Stock" | "Limited Stock" | "Out of Stock";
  delivery: string;
  rating: number;
};

export const PRICE_OPTIONS: PriceOption[] = [
  {
    platform: "AgriMart (sample)",
    product: "Mancozeb 75% WP",
    pack: "500 g",
    price: 285,
    availability: "In Stock",
    delivery: "Delivery in 2 days",
    rating: 4.4,
  },
  {
    platform: "KisanStore (sample)",
    product: "Mancozeb 75% WP",
    pack: "500 g",
    price: 249,
    availability: "In Stock",
    delivery: "Delivery in 3 days",
    rating: 4.2,
  },
  {
    platform: "FarmBazaar (sample)",
    product: "Copper Oxychloride 50% WP",
    pack: "500 g",
    price: 310,
    availability: "Limited Stock",
    delivery: "Delivery in 1 day",
    rating: 4.6,
  },
  {
    platform: "GreenGrow (sample)",
    product: "Neem Oil 1500 ppm",
    pack: "1 L",
    price: 399,
    availability: "In Stock",
    delivery: "Delivery in 4 days",
    rating: 4.5,
  },
  {
    platform: "Local Agro Dealer (sample)",
    product: "Mancozeb 75% WP",
    pack: "250 g",
    price: 165,
    availability: "Out of Stock",
    delivery: "Pickup only",
    rating: 3.9,
  },
];

export const WEATHER = {
  condition: "Humid & Cloudy",
  temperature: 29,
  humidity: 84,
  rainfall: 26,
  wind: 9,
  soilMoisture: 72,
};

export type RiskLevel = "Low" | "Moderate" | "High";

export const RISK_FORECAST: { day: string; risk: number; level: RiskLevel; temp: number; humidity: number }[] = [
  { day: "Today", risk: 68, level: "Moderate", temp: 29, humidity: 84 },
  { day: "Tue", risk: 76, level: "High", temp: 30, humidity: 88 },
  { day: "Wed", risk: 81, level: "High", temp: 28, humidity: 90 },
  { day: "Thu", risk: 54, level: "Moderate", temp: 31, humidity: 74 },
  { day: "Fri", risk: 38, level: "Low", temp: 32, humidity: 62 },
  { day: "Sat", risk: 31, level: "Low", temp: 33, humidity: 58 },
];

export const RISK_FACTORS = [
  { factor: "Humidity above 80%", weight: 35, note: "Leaf wetness stays long enough for fungal spores to germinate." },
  { factor: "Rainfall 26 mm in 48 hrs", weight: 25, note: "Splash spreads spores from soil to lower leaves." },
  { factor: "Night temperature 22–26°C", weight: 20, note: "Ideal range for blight and rust development." },
  { factor: "Dense canopy / close spacing", weight: 12, note: "Reduces airflow and slows leaf drying." },
  { factor: "Last detection 4 days ago", weight: 8, note: "Existing inoculum is already present in the field." },
];

export const HEALTH_TREND = [
  { date: "Jul 26", score: 64 },
  { date: "Aug 02", score: 68 },
  { date: "Aug 09", score: 72 },
  { date: "Aug 14", score: 70 },
  { date: "Aug 18", score: 74 },
  { date: "Aug 21", score: 78 },
  { date: "Aug 24", score: 76 },
];

export type TimelineItem = {
  date: string;
  type: "scan" | "weather" | "advice" | "expert";
  title: string;
  detail: string;
  tone: "good" | "warn" | "bad";
};

export const HEALTH_TIMELINE: TimelineItem[] = [
  {
    date: "24 Aug",
    type: "scan",
    title: "Tomato — Early Blight detected",
    detail: "Confidence 91% · Moderate severity · Treatment plan generated",
    tone: "warn",
  },
  {
    date: "22 Aug",
    type: "expert",
    title: "Expert advice received",
    detail: "Dr. A. Deshmukh confirmed early blight and advised protective spray",
    tone: "good",
  },
  {
    date: "20 Aug",
    type: "scan",
    title: "Crop scan — Healthy",
    detail: "No disease signature found · Confidence 94%",
    tone: "good",
  },
  {
    date: "18 Aug",
    type: "weather",
    title: "Weather alert — High humidity",
    detail: "Humidity 88% for 3 days · Preventive spray suggested",
    tone: "warn",
  },
  {
    date: "14 Aug",
    type: "advice",
    title: "Recommendation followed",
    detail: "Mulching applied to reduce soil splash",
    tone: "good",
  },
];

export const CROP_RECOMMENDATIONS = [
  {
    rank: 1,
    crop: "Soybean",
    suitability: 92,
    why: "Fits a medium-water black soil field after a cereal crop and matches the current kharif window.",
    weather: "Current rainfall pattern is ideal for soybean germination and pod filling.",
    water: "Medium water need — matches your stated availability.",
    rotation: "Excellent rotation after wheat; fixes nitrogen and breaks rust cycles.",
    precautions: ["Treat seed before sowing", "Ensure field drainage after heavy rain"],
  },
  {
    rank: 2,
    crop: "Pigeon Pea (Tur)",
    suitability: 86,
    why: "Deep-rooted pulse that tolerates dry spells and improves soil structure.",
    weather: "Handles the forecasted humid spell with good canopy airflow if spaced well.",
    water: "Low to medium water need — safe if rainfall reduces.",
    rotation: "Good break crop; reduces soil-borne pathogens of cereals.",
    precautions: ["Watch for pod borer at flowering", "Avoid waterlogged patches"],
  },
  {
    rank: 3,
    crop: "Maize",
    suitability: 78,
    why: "Reliable market demand and fast growth in the current season window.",
    weather: "Needs assured moisture in the first 40 days — currently available.",
    water: "Medium to high water need — plan one supplementary irrigation.",
    rotation: "Non-host for tomato and pulse diseases; useful rotation choice.",
    precautions: ["Fall armyworm scouting weekly", "Balanced nitrogen scheduling"],
  },
];

export const EXPERT_REQUESTS = [
  {
    id: "ER-1042",
    crop: "Tomato",
    issue: "Brown ring spots spreading on lower leaves after rain",
    status: "Advice Received" as const,
    date: "22 Aug 2026",
    expert: "Dr. A. Deshmukh — Plant Pathologist",
    advice:
      "Confirmed early blight. Remove affected leaves, apply Mancozeb as per label and re-scan after 8 days.",
  },
  {
    id: "ER-1051",
    crop: "Onion",
    issue: "White sunken spots on leaf tips",
    status: "Under Review" as const,
    date: "24 Aug 2026",
    expert: "Assigned to district extension officer",
    advice: "",
  },
];

export const CHAT_FAQS = [
  {
    q: "How can I prevent crop diseases?",
    a: "Start with certified seed, keep proper plant spacing for airflow, mulch to stop soil splash, rotate crops every 2–3 years, and scan your field twice a week. Early removal of a few infected leaves prevents most outbreaks.",
  },
  {
    q: "What does high disease risk mean?",
    a: "High risk means the weather right now strongly favours disease development — usually humidity above 80%, recent rainfall and warm nights. It does not mean your crop is infected. Take preventive action within 24–48 hours.",
  },
  {
    q: "Which crop should I grow?",
    a: "Open Crop Advisor and fill the short farm form (soil, water, previous crop, season). You will get the top 3 crops with a suitability score and a clear reason for each recommendation.",
  },
  {
    q: "How do I use the crop scanner?",
    a: "Go to Scan My Crop, choose your crop, take or upload a clear photo of the affected leaf in daylight, then tap Analyze Crop. You get the disease, confidence, severity and a treatment plan.",
  },
  {
    q: "What should I do after heavy rainfall?",
    a: "Drain standing water, avoid walking through wet foliage, hold off nitrogen fertiliser for a few days, and check lower leaves for new spots. If humidity stays high, a protective spray is advisable.",
  },
];

export const DEFAULT_FARM = {
  farmName: "Shivneri Farm",
  location: "Nashik, Maharashtra",
  landSize: "4.5 acres",
  crops: ["Tomato", "Onion", "Wheat"],
  soil: "Black soil (Vertisol)",
  healthScore: 76,
};
