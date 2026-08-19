import type { KarmaEntry, Lang, WordEntry } from "./types";

export const COLORS = {
  ink: "#0a0806",
  hair: "#4a3f2a",
  gold: "#f0c85a",
  goldHi: "#fff0c8",
  parch: "#faf3e4",
  ghati: "#e8943a",
  aghati: "#dcc896",
  rust: "#d46545",
  mute: "#b8a574",
} as const;

export const KARMAS: KarmaEntry[] = [
  {
    g: 1,
    glyph: "veil",
    n: {
      en: ["JÑĀNA", "VARAṆĪYA"],
      hi: ["ज्ञाना", "वरणीय"],
      gu: ["જ્ઞાના", "વરણીય"],
    },
    s: {
      en: "A blindfold tied over the eyes",
      hi: "आँखों पर बँधी पट्टी",
      gu: "આંખો પર બાંધેલી પટ્ટી",
    },
    f: {
      en: "Obscures knowledge. The soul knows all — this karma covers that knowing.",
      hi: "ज्ञान को ढकता है। आत्मा सर्वज्ञ है, यह कर्म उस ज्ञान को आवृत करता है।",
      gu: "જ્ઞાનને ઢાંકે છે. આત્મા સર્વજ્ઞ છે, આ કર્મ તે જ્ઞાનને આવરે છે.",
    },
  },
  {
    g: 1,
    glyph: "gate",
    n: {
      en: ["DARŚANA", "VARAṆĪYA"],
      hi: ["दर्शना", "वरणीय"],
      gu: ["દર્શના", "વરણીય"],
    },
    s: {
      en: "A gatekeeper barring the king’s door",
      hi: "राजा के द्वार पर खड़ा द्वारपाल",
      gu: "રાજાના દ્વારે ઊભેલો દ્વારપાળ",
    },
    f: {
      en: "Obscures perception. You are kept from even seeing what is there.",
      hi: "दर्शन को ढकता है। जो सामने है, उसे देखने से भी रोकता है।",
      gu: "દર્શનને ઢાંકે છે. જે સામે છે તે જોવાથી પણ રોકે છે.",
    },
  },
  {
    g: 1,
    glyph: "cup",
    n: { en: ["MOHANĪYA"], hi: ["मोहनीय"], gu: ["મોહનીય"] },
    s: {
      en: "Wine that clouds the mind",
      hi: "मदिरा जो बुद्धि को भ्रमित करे",
      gu: "મદિરા જે બુદ્ધિને ભ્રમિત કરે",
    },
    f: {
      en: "Deludes. The hardest of the eight — it distorts faith and conduct alike.",
      hi: "मोहित करता है। आठों में सबसे प्रबल — श्रद्धा और चारित्र दोनों को विकृत करता है।",
      gu: "મોહિત કરે છે. આઠમાં સૌથી પ્રબળ — શ્રદ્ધા અને ચારિત્ર બંનેને વિકૃત કરે છે.",
    },
  },
  {
    g: 1,
    glyph: "chest",
    n: { en: ["ANTARĀYA"], hi: ["अंतराय"], gu: ["અંતરાય"] },
    s: {
      en: "A treasurer who blocks the king’s gift",
      hi: "राजा का दान रोकने वाला भंडारी",
      gu: "રાજાનું દાન રોકતો ભંડારી",
    },
    f: {
      en: "Obstructs. The will is there, the power is there — the act is prevented.",
      hi: "बाधा डालता है। इच्छा है, शक्ति है — फिर भी कार्य रुक जाता है।",
      gu: "બાધા નાખે છે. ઇચ્છા છે, શક્તિ છે — છતાં કાર્ય અટકે છે.",
    },
  },
  {
    g: 0,
    glyph: "sword",
    n: { en: ["VEDANĪYA"], hi: ["वेदनीय"], gu: ["વેદનીય"] },
    s: {
      en: "Honey on a sword’s edge",
      hi: "तलवार की धार पर लगा शहद",
      gu: "તલવારની ધાર પરનું મધ",
    },
    f: {
      en: "Gives pleasure and pain. Every sweetness carries its cut.",
      hi: "सुख और दुःख देता है। हर मिठास अपने साथ चोट लाती है।",
      gu: "સુખ અને દુઃખ આપે છે. દરેક મીઠાશ પોતાની સાથે ઘા લાવે છે.",
    },
  },
  {
    g: 0,
    glyph: "brush",
    n: { en: ["NĀMA"], hi: ["नाम"], gu: ["નામ"] },
    s: {
      en: "A painter shaping every form",
      hi: "हर रूप गढ़ने वाला चित्रकार",
      gu: "દરેક રૂપ ઘડનારો ચિત્રકાર",
    },
    f: {
      en: "Decides the body — species, form, senses, voice. The painter of birth.",
      hi: "शरीर निर्धारित करता है — गति, रूप, इन्द्रिय, स्वर।",
      gu: "શરીર નક્કી કરે છે — ગતિ, રૂપ, ઇન્દ્રિય, સ્વર.",
    },
  },
  {
    g: 0,
    glyph: "pots",
    n: { en: ["GOTRA"], hi: ["गोत्र"], gu: ["ગોત્ર"] },
    s: {
      en: "A potter turning high and low pots",
      hi: "ऊँचे-नीचे घड़े बनाता कुम्हार",
      gu: "ઊંચા-નીચા ઘડા બનાવતો કુંભાર",
    },
    f: {
      en: "Decides status of birth. Same clay, different vessels.",
      hi: "जन्म का कुल निर्धारित करता है। मिट्टी एक, पात्र अनेक।",
      gu: "જન્મનું કુળ નક્કી કરે છે. માટી એક, પાત્ર અનેક.",
    },
  },
  {
    g: 0,
    glyph: "shackle",
    n: { en: ["ĀYUṢYA"], hi: ["आयुष्य"], gu: ["આયુષ્ય"] },
    s: {
      en: "A fetter that holds for a fixed term",
      hi: "नियत अवधि तक बाँधने वाली बेड़ी",
      gu: "નિયત સમય સુધી બાંધતી બેડી",
    },
    f: {
      en: "Fixes the lifespan of this birth. Not one breath more, not one less.",
      hi: "इस जन्म की आयु निश्चित करता है। एक श्वास न अधिक, न कम।",
      gu: "આ જન્મનું આયુષ્ય નક્કી કરે છે. એક શ્વાસ ન વધુ, ન ઓછો.",
    },
  },
];

export const WORDS: WordEntry[] = [
  ["KNOWLEDGE", 0, "veil"],
  ["LEARNING", 0, "veil"],
  ["MEMORY", 0, "veil"],
  ["SIGHT", 1, "veil"],
  ["PERCEPTION", 1, "veil"],
  ["SLEEP", 1, "veil"],
  ["ANGER", 2, "pulse"],
  ["PRIDE", 2, "pulse"],
  ["DECEIT", 2, "shift"],
  ["GREED", 2, "echo"],
  ["ATTACHMENT", 2, "echo"],
  ["OBSTRUCTION", 3, "bars"],
  ["CHARITY DENIED", 3, "bars"],
  ["WILLPOWER", 3, "bars"],
  ["PLEASURE", 4, "glow"],
  ["PAIN", 4, "pulse"],
  ["COMFORT", 4, "glow"],
  ["BODY", 5, "shift"],
  ["FORM", 5, "shift"],
  ["THE SENSES", 5, "shift"],
  ["STATUS", 6, "echo"],
  ["LINEAGE", 6, "echo"],
  ["LIFESPAN", 7, "glow"],
  ["LONGEVITY", 7, "glow"],
];

export const LABELS: Record<
  Lang,
  {
    ghati: string;
    aghati: string;
    released: string;
    bound: string;
    coach: string;
    reached: string;
    next: string;
    begin: string;
  }
> = {
  en: {
    ghati: "GHĀTI · SOUL-HARMING",
    aghati: "AGHĀTI · NON-HARMING",
    released: "RELEASED",
    bound: "BOUND",
    coach: "DRAG THE BOND TO ITS KARMA — OR TAP",
    reached: "THE BOND REACHED THE JĪVA",
    next: "NEXT",
    begin: "BEGIN",
  },
  hi: {
    ghati: "घाती · आत्मघातक",
    aghati: "अघाती · अघातक",
    released: "मुक्त",
    bound: "बंध",
    coach: "बंध को उसके कर्म तक खींचें — या स्पर्श करें",
    reached: "बंध जीव तक पहुँचा",
    next: "आगे",
    begin: "प्रारंभ",
  },
  gu: {
    ghati: "ઘાતી · આત્મઘાતક",
    aghati: "અઘાતી · અઘાતક",
    released: "મુક્ત",
    bound: "બંધ",
    coach: "બંધને તેના કર્મ સુધી ખેંચો — અથવા સ્પર્શ કરો",
    reached: "બંધ જીવ સુધી પહોંચ્યો",
    next: "આગળ",
    begin: "શરૂ",
  },
};

export function formatKarmaName(enName: string[]): string {
  const joined = enName.join("");
  return joined.charAt(0) + joined.slice(1).toLowerCase();
}
