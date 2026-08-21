import type { Lang } from "@/lib/language";

/** Localized instructional copy only; buttons and chrome use GAME_UI. */
export const QUEST_CONTENT: Record<
  Lang,
  {
    subtitle: string;
    steps: readonly string[];
    timerNote: string;
  }
> = {
  en: {
    subtitle: "Read the situation. Identify the karma.",
    steps: [
      "Read the everyday situation on screen.",
      "Tap the karma that best matches it.",
      "Use Skip if you're unsure — wrong answers break your streak.",
    ],
    timerNote: "Timer starts when you tap Begin.",
  },
  hi: {
    subtitle: "परिस्थिति पढ़ें। सही कर्म चुनें।",
    steps: [
      "स्क्रीन पर दिखाई देने वाली परिस्थिति पढ़ें।",
      "सबसे मेल खाने वाला कर्म टैप करें।",
      "अनिश्चित हों तो Skip दबाएँ — गलत उत्तर से स्ट्रीक टूटती है।",
    ],
    timerNote: "टाइमर Begin दबाने पर ही शुरू होगा।",
  },
  gu: {
    subtitle: "પરિસ્થિતિ વાંચો. સાચું કર્મ પસંદ કરો.",
    steps: [
      "સ્ક્રીન પરની પરિસ્થિતિ વાંચો.",
      "સૌથી સારું મળતું કર્મ ટેપ કરો.",
      "ખાતરી ન હોય તો Skip દબાવો — ખોટા જવાબથી સ્ટ્રીક તૂટે છે.",
    ],
    timerNote: "ટાઇમર Begin દબાવ્યા પછી જ શરૂ થશે.",
  },
};
