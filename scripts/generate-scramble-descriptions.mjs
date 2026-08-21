import fs from "node:fs";
import data from "../data.json" with { type: "json" };

const KARMA_DESCRIPTIONS = {
  jnanavaraniya: {
    en: "Ghāti karma that obscures knowledge (jñāna) of the soul.",
    hi: "घाती कर्म जो आत्मा के ज्ञान को आवृत करता है।",
    gu: "ઘાતી કર્મ જે આત્માના જ્ઞાનને આવૃત કરે છે.",
  },
  darshanavaraniya: {
    en: "Ghāti karma that obscures perception (darśana) of reality.",
    hi: "घाती कर्म जो वास्तविकता के दर्शन को आवृत करता है।",
    gu: "ઘાતી કર્મ જે વાસ્તવિકતાના દર્શનને આવૃત કરે છે.",
  },
  mohaniya: {
    en: "Ghāti karma that deludes the soul through passions and wrong belief.",
    hi: "घाती कर्म जो कषाय और मिथ्यात्व से आत्मा को मोहित करता है।",
    gu: "ઘાતી કર્મ જે કષાય અને મિથ્યાત્વથી આત્માને મોહિત કરે છે.",
  },
  antaraya: {
    en: "Ghāti karma that obstructs meritorious spiritual effort.",
    hi: "घाती कर्म जो पुण्य की आध्यात्मिक साधना में अन्तराय करता है।",
    gu: "ઘાતી કર્મ જે પુણ્યની આધ્યાત્મિક સાધનામાં અંતરાય કરે છે.",
  },
  vedaniya: {
    en: "Aghāti karma that determines pleasant or painful experience.",
    hi: "अघाती कर्म जो साता या असाता अनुभव निर्धारित करता है।",
    gu: "અઘાતી કર્મ જે સાતા અથવા અસાતા અનુભવ નક્કી કરે છે.",
  },
  ayushya: {
    en: "Aghāti karma that fixes the lifespan in a given realm.",
    hi: "अघाती कर्म जो किसी योनि में आयु निर्धारित करता है।",
    gu: "અઘાતી કર્મ જે કોઈ યોનિમાં આయુષ્ય નક્કી કરે છે.",
  },
  nama: {
    en: "Aghāti karma that shapes the body, senses, and worldly status.",
    hi: "अघाती कर्म जो शरीर, इन्द्रिय और लौकिक स्थिति बनाता है।",
    gu: "અઘાતી કર્મ જે શરીર, ઇન્દ્રિય અને સાંસારિક સ્થિતિ બનાવે છે.",
  },
  gotra: {
    en: "Aghāti karma that determines high or low worldly status.",
    hi: "अघाती कर्म जो उच्च या नीच गोत्र (स्थिति) निर्धारित करता है।",
    gu: "અઘાતી કર્મ જે ઉચ્ચ અથવા નીચ ગોત્ર (સ્થિતિ) નક્કી કરે છે.",
  },
};

const PRAKRITI_EN = {
  mati_jnanavaraniya: "Obscures mati (ordinary sensory) knowledge.",
  shruta_jnanavaraniya: "Obscures śruta (scriptural) knowledge.",
  avadhi_jnanavaraniya: "Obscures avadhi (clairvoyant) knowledge.",
  manahparyaya_jnanavaraniya: "Obscures manahparyaya (mind-reading) knowledge.",
  kevala_jnanavaraniya: "Obscures kevala (omniscient) knowledge.",
  chakshu_darshanavaraniya: "Obscures chakṣu (ocular) perception.",
  achakshu_darshanavaraniya: "Obscures perception without eyes.",
  avadhi_darshanavaraniya: "Obscures avadhi (clairvoyant) perception.",
  kevala_darshanavaraniya: "Obscures kevala (omniscient) perception.",
  nidra: "Light sleep that veils perception.",
  nidra_nidra: "Deep sleep that heavily veils perception.",
  prachala: "Drowsiness that disturbs perception.",
  prachala_prachala: "Heavy drowsiness that disturbs perception.",
  sata_vedaniya: "Causes pleasant (sāta) feeling.",
  asata_vedaniya: "Causes unpleasant (asāta) feeling.",
  mithyatva_mohaniya: "Wrong belief (mithyātva) that deludes the soul.",
  samyaktva_mohaniya: "Right belief mixed with slight delusion.",
  mishra_mohaniya: "Mixed right and wrong belief.",
  anantanubandhi_krodha: "Intense anger bound for an entire life.",
  anantanubandhi_mana: "Intense pride bound for an entire life.",
  anantanubandhi_maya: "Intense deceit bound for an entire life.",
  anantanubandhi_lobha: "Intense greed bound for an entire life.",
  apratyakhyana_krodha: "Anger that resists renouncing harmful acts.",
  apratyakhyana_mana: "Pride that resists renouncing harmful acts.",
  apratyakhyana_maya: "Deceit that resists renouncing harmful acts.",
  apratyakhyana_lobha: "Greed that resists renouncing harmful acts.",
  pratyakhyana_krodha: "Anger that can still be renounced with effort.",
  pratyakhyana_mana: "Pride that can still be renounced with effort.",
  pratyakhyana_maya: "Deceit that can still be renounced with effort.",
  pratyakhyana_lobha: "Greed that can still be renounced with effort.",
  sanjvalana_krodha: "Flaring anger that is easier to overcome.",
  sanjvalana_mana: "Flaring pride that is easier to overcome.",
  sanjvalana_maya: "Flaring deceit that is easier to overcome.",
  sanjvalana_lobha: "Flaring greed that is easier to overcome.",
  hasya: "Laughter born of mohaniya passion.",
  rati: "Attachment and liking toward objects.",
  arati: "Dislike and aversion toward objects.",
  shoka: "Sorrow and grief that binds the soul.",
  bhaya: "Fear that agitates the soul.",
  jugupsa: "Disgust or repulsion toward objects.",
  stri_veda: "Sexual desire toward women.",
  purusha_veda: "Sexual desire toward men.",
  napumsaka_veda: "Sexual desire toward neutral gender.",
  naraka_ayushya: "Lifespan fixed in the naraka realm.",
  tiryanch_ayushya: "Lifespan fixed in the animal realm.",
  manushya_ayushya: "Lifespan fixed in the human realm.",
  deva_ayushya: "Lifespan fixed in the celestial realm.",
  uchcha_gotra: "High worldly status and noble birth.",
  nicha_gotra: "Low worldly status and humble birth.",
  dana_antaraya: "Obstructs giving and charity.",
  labha_antaraya: "Obstructs gain of merit or wealth.",
  bhoga_antaraya: "Obstructs enjoyment of owned objects.",
  upabhoga_antaraya: "Obstructs use of shared or borrowed objects.",
  virya_antaraya: "Obstructs spiritual vigor and effort.",
  tirthankara: "Marks the soul destined to become a Tirthankara.",
};

function describePrakritiEn(id, karmaId, nameEn) {
  if (PRAKRITI_EN[id]) {
    return PRAKRITI_EN[id];
  }

  if (nameEn.endsWith(" Gati")) {
    return `Determines rebirth in the ${nameEn.replace(" Gati", "")} realm.`;
  }
  if (nameEn.endsWith(" Jati")) {
    return `Fixes the number of senses in ${nameEn.replace(" Jati", "").toLowerCase()} beings.`;
  }
  if (nameEn.endsWith(" Sharira")) {
    return `Determines the ${nameEn.replace(" Sharira", "")} body type.`;
  }
  if (nameEn.endsWith(" Angopanga")) {
    return `Fixes limbs and body parts of the ${nameEn.replace(" Angopanga", "")} body.`;
  }
  if (nameEn.endsWith(" Bandhana")) {
    return `Binds particles into the ${nameEn.replace(" Bandhana", "")} body.`;
  }
  if (nameEn.endsWith(" Sanghata")) {
    return `Aggregates particles in the ${nameEn.replace(" Sanghata", "")} body.`;
  }
  if (nameEn.endsWith(" Anupurvi")) {
    return `Sequential rebirth tendency toward the ${nameEn.replace(" Anupurvi", "")} realm.`;
  }
  if (nameEn.endsWith(" Varna")) {
    return `Determines ${nameEn.replace(" Varna", "")} bodily color.`;
  }
  if (nameEn.endsWith(" Gandha")) {
    return `Determines ${nameEn.replace(" Gandha", "")} bodily smell.`;
  }
  if (nameEn.endsWith(" Rasa")) {
    return `Determines ${nameEn.replace(" Rasa", "")} taste quality of the body.`;
  }
  if (nameEn.endsWith(" Sparsha")) {
    return `Determines ${nameEn.replace(" Sparsha", "")} touch quality of the body.`;
  }
  if (nameEn.endsWith(" Vihayogati")) {
    return `Aerial movement tendency: ${nameEn.replace(" Vihayogati", "")}.`;
  }
  if (nameEn.endsWith(" Kirti")) {
    return `Reputation and fame quality: ${nameEn.replace(" Kirti", "")}.`;
  }
  if (nameEn === "Nirmana") {
    return "Fixes the overall structure and formation of the body.";
  }
  if (nameEn === "Agurulaghu") {
    return "Determines whether the body is heavy or light.";
  }
  if (nameEn === "Upaghata") {
    return "Self-injuring capacity of the body.";
  }
  if (nameEn === "Paraghata") {
    return "Capacity to injure other living beings.";
  }
  if (nameEn === "Atapa") {
    return "Radiance or heat emitted by the body.";
  }
  if (nameEn === "Udyota") {
    return "Light or glow emitted by the body.";
  }
  if (nameEn === "Ucchvasa") {
    return "Breathing function of the living body.";
  }
  if (nameEn === "Trasa") {
    return "Mobile (trasa) nature of the living being.";
  }
  if (nameEn === "Sthavara") {
    return "Immobile (sthāvara) nature of the living being.";
  }
  if (nameEn === "Badara") {
    return "Gross (badara) physical constitution.";
  }
  if (nameEn === "Sukshma") {
    return "Subtle (sūkṣma) physical constitution.";
  }
  if (nameEn === "Paryapta") {
    return "Fully developed and complete bodily capacities.";
  }
  if (nameEn === "Aparyapta") {
    return "Incomplete or undeveloped bodily capacities.";
  }
  if (nameEn === "Pratyeka") {
    return "Individual (pratyeka) embodiment, not shared.";
  }
  if (nameEn === "Sadharana") {
    return "Shared (sādhāraṇa) embodiment among beings.";
  }
  if (nameEn === "Sthira") {
    return "Stable and steady bodily condition.";
  }
  if (nameEn === "Asthira") {
    return "Unstable and changing bodily condition.";
  }
  if (nameEn === "Shubha") {
    return "Auspicious bodily appearance.";
  }
  if (nameEn === "Ashubha") {
    return "Inauspicious bodily appearance.";
  }
  if (nameEn === "Subhaga") {
    return "Attractive and pleasing bodily form.";
  }
  if (nameEn === "Durbhaga") {
    return "Unattractive bodily form.";
  }
  if (nameEn === "Susvara") {
    return "Pleasant voice and speech quality.";
  }
  if (nameEn === "Dusvara") {
    return "Harsh or unpleasant voice quality.";
  }
  if (nameEn === "Adeya") {
    return "Body that inspires trust and respect.";
  }
  if (nameEn === "Anadeya") {
    return "Body that fails to inspire trust.";
  }
  if (nameEn === "Samachaturasra") {
    return "Symmetrical square-like body proportions.";
  }
  if (nameEn === "Nyagrodha Parimandala") {
    return "Body broad at top like a banyan tree crown.";
  }
  if (nameEn === "Sadi") {
    return "Body tapering downward like a winnowing basket.";
  }
  if (nameEn === "Kubja") {
    return "Hunchbacked bodily formation.";
  }
  if (nameEn === "Vamana") {
    return "Dwarf-like short bodily formation.";
  }
  if (nameEn === "Hunda") {
    return "Pot-shaped bodily formation.";
  }
  if (nameEn.includes("Naracha")) {
    return `Bone-joint structure prakriti: ${nameEn}.`;
  }
  if (nameEn === "Kilika") {
    return "Interlocking joint structure of the body.";
  }
  if (nameEn === "Sevarta") {
    return "Joint structure related to bodily movement.";
  }
  if (nameEn === "Varna") {
    return "General bodily color prakriti.";
  }
  if (nameEn === "Gandha") {
    return "General bodily smell prakriti.";
  }
  if (nameEn === "Rasa") {
    return "General taste-related bodily prakriti.";
  }
  if (nameEn === "Sparsha") {
    return "General touch-related bodily prakriti.";
  }

  const karmaName = data.find((k) => k.id === karmaId)?.name.en ?? karmaId;
  return `Prakriti of ${karmaName}: ${nameEn}.`;
}

const prakritiEntries = {};
for (const karma of data) {
  for (const prakriti of karma.prakritis) {
    if (prakriti.active === 0) continue;
    prakritiEntries[prakriti.id] = describePrakritiEn(
      prakriti.id,
      karma.id,
      prakriti.name.en,
    );
  }
}

const out = `import type { Lang } from "@/lib/language";

export type LocalizedText = Record<Lang, string>;

const KARMA_DESCRIPTIONS: Record<string, LocalizedText> = ${JSON.stringify(KARMA_DESCRIPTIONS, null, 2)};

const PRAKRITI_DESCRIPTIONS_EN: Record<string, string> = ${JSON.stringify(prakritiEntries, null, 2)};

function pickText(text: Partial<LocalizedText>, lang: Lang): string {
  return text[lang] ?? text.en ?? text.hi ?? text.gu ?? "";
}

export function getKarmaDescription(karmaId: string, lang: Lang): string {
  return pickText(KARMA_DESCRIPTIONS[karmaId] ?? {}, lang);
}

export function getPrakritiDescription(
  prakritiId: string,
  karmaId: string,
  lang: Lang,
  jsonDescription?: Partial<LocalizedText>,
): string {
  if (jsonDescription) {
    const fromJson = pickText(jsonDescription, lang);
    if (fromJson) return fromJson;
  }
  if (lang !== "en") {
    const en = PRAKRITI_DESCRIPTIONS_EN[prakritiId];
    if (en) return en;
  }
  return (
    PRAKRITI_DESCRIPTIONS_EN[prakritiId] ??
    getKarmaDescription(karmaId, lang)
  );
}

export function buildScrambleDescription(
  kind: "karma" | "prakriti",
  karmaId: string,
  entityId: string,
  lang: Lang,
  jsonDescription?: Partial<LocalizedText>,
): string {
  if (kind === "karma") {
    if (jsonDescription) {
      const fromJson = pickText(jsonDescription, lang);
      if (fromJson) return fromJson;
    }
    return getKarmaDescription(karmaId, lang);
  }
  return getPrakritiDescription(entityId, karmaId, lang, jsonDescription);
}
`;

fs.writeFileSync(
  new URL("../src/lib/karma-scramble-descriptions.ts", import.meta.url),
  out,
);
console.log("Wrote karma-scramble-descriptions.ts");
