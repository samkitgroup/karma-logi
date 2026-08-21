import type { Lang } from "@/lib/language";

/** Localized puzzle copy only; buttons and chrome use GAME_UI. */
export const SCRAMBLE_CONTENT: Record<
  Lang,
  {
    subtitle: string;
    steps: readonly string[];
    timerNote: string;
    kindKarma: string;
    kindPrakriti: string;
  }
> = {
  en: {
    subtitle: "Unscramble the letters. Discover the word.",
    steps: [
      "Read the clue about a Jain concept.",
      "Some letters may already be filled in — tap the rest in order.",
      "Use Hint if you need help, Clear to reset, or Skip.",
    ],
    timerNote: "Timer starts when you tap Begin.",
    kindKarma: "Eight karmas",
    kindPrakriti: "Prakriti",
  },
  hi: {
    subtitle: "अक्षर सही क्रम में लगाएँ। शब्द खोजें।",
    steps: [
      "जैन अवधारणा के बारे में संकेत पढ़ें।",
      "कुछ अक्षर पहले से भरे हो सकते हैं — बाकी सही क्रम में टैप करें।",
      "जरूरत हो तो Hint लें, Clear से साफ़ करें, या Skip करें।",
    ],
    timerNote: "टाइमर Begin दबाने पर ही शुरू होगा।",
    kindKarma: "आठ कर्म",
    kindPrakriti: "प्रकृति",
  },
  gu: {
    subtitle: "અક્ષરો ગોઠવો. શબ્દ શોધો.",
    steps: [
      "જૈન ખ્યાલ વિશેની સંકેત વાંચો.",
      "કેટલાક અક્ષરો પહેલેથી ભરેલા હોઈ શકે — બાકીના સાચા ક્રમમાં ટેપ કરો.",
      "જરૂર પડે તો Hint લો, Clear થી સાફ કરો, અથવા Skip કરો.",
    ],
    timerNote: "ટાઇમર Begin દબાવ્યા પછી જ શરૂ થશે.",
    kindKarma: "આઠ કર્મ",
    kindPrakriti: "પ્રકૃતિ",
  },
};
