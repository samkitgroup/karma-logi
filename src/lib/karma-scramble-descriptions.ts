import type { Lang } from "@/lib/language";

export type LocalizedText = Record<Lang, string>;

const KARMA_DESCRIPTIONS: Record<string, LocalizedText> = {
  "jnanavaraniya": {
    "en": "Ghāti karma that obscures knowledge (jñāna) of the soul.",
    "hi": "घाती कर्म जो आत्मा के ज्ञान को आवृत करता है।",
    "gu": "ઘાતી કર્મ જે આત્માના જ્ઞાનને આવૃત કરે છે."
  },
  "darshanavaraniya": {
    "en": "Ghāti karma that obscures perception (darśana) of reality.",
    "hi": "घाती कर्म जो वास्तविकता के दर्शन को आवृत करता है।",
    "gu": "ઘાતી કર્મ જે વાસ્તવિકતાના દર્શનને આવૃત કરે છે."
  },
  "mohaniya": {
    "en": "Ghāti karma that deludes the soul through passions and wrong belief.",
    "hi": "घाती कर्म जो कषाय और मिथ्यात्व से आत्मा को मोहित करता है।",
    "gu": "ઘાતી કર્મ જે કષાય અને મિથ્યાત્વથી આત્માને મોહિત કરે છે."
  },
  "antaraya": {
    "en": "Ghāti karma that obstructs meritorious spiritual effort.",
    "hi": "घाती कर्म जो पुण्य की आध्यात्मिक साधना में अन्तराय करता है।",
    "gu": "ઘાતી કર્મ જે પુણ્યની આધ્યાત્મિક સાધનામાં અંતરાય કરે છે."
  },
  "vedaniya": {
    "en": "Aghāti karma that determines pleasant or painful experience.",
    "hi": "अघाती कर्म जो साता या असाता अनुभव निर्धारित करता है।",
    "gu": "અઘાતી કર્મ જે સાતા અથવા અસાતા અનુભવ નક્કી કરે છે."
  },
  "ayushya": {
    "en": "Aghāti karma that fixes the lifespan in a given realm.",
    "hi": "अघाती कर्म जो किसी योनि में आयु निर्धारित करता है।",
    "gu": "અઘાતી કર્મ જે કોઈ યોનિમાં આయુષ્ય નક્કી કરે છે."
  },
  "nama": {
    "en": "Aghāti karma that shapes the body, senses, and worldly status.",
    "hi": "अघाती कर्म जो शरीर, इन्द्रिय और लौकिक स्थिति बनाता है।",
    "gu": "અઘાતી કર્મ જે શરીર, ઇન્દ્રિય અને સાંસારિક સ્થિતિ બનાવે છે."
  },
  "gotra": {
    "en": "Aghāti karma that determines high or low worldly status.",
    "hi": "अघाती कर्म जो उच्च या नीच गोत्र (स्थिति) निर्धारित करता है।",
    "gu": "અઘાતી કર્મ જે ઉચ્ચ અથવા નીચ ગોત્ર (સ્થિતિ) નક્કી કરે છે."
  }
};

const PRAKRITI_DESCRIPTIONS_EN: Record<string, string> = {
  "mati_jnanavaraniya": "Obscures mati (ordinary sensory) knowledge.",
  "shruta_jnanavaraniya": "Obscures śruta (scriptural) knowledge.",
  "avadhi_jnanavaraniya": "Obscures avadhi (clairvoyant) knowledge.",
  "manahparyaya_jnanavaraniya": "Obscures manahparyaya (mind-reading) knowledge.",
  "kevala_jnanavaraniya": "Obscures kevala (omniscient) knowledge.",
  "chakshu_darshanavaraniya": "Obscures chakṣu (ocular) perception.",
  "achakshu_darshanavaraniya": "Obscures perception without eyes.",
  "avadhi_darshanavaraniya": "Obscures avadhi (clairvoyant) perception.",
  "kevala_darshanavaraniya": "Obscures kevala (omniscient) perception.",
  "nidra": "Light sleep that veils perception.",
  "nidra_nidra": "Deep sleep that heavily veils perception.",
  "prachala": "Drowsiness that disturbs perception.",
  "prachala_prachala": "Heavy drowsiness that disturbs perception.",
  "sata_vedaniya": "Causes pleasant (sāta) feeling.",
  "asata_vedaniya": "Causes unpleasant (asāta) feeling.",
  "mithyatva_mohaniya": "Wrong belief (mithyātva) that deludes the soul.",
  "samyaktva_mohaniya": "Right belief mixed with slight delusion.",
  "mishra_mohaniya": "Mixed right and wrong belief.",
  "anantanubandhi_krodha": "Intense anger bound for an entire life.",
  "anantanubandhi_mana": "Intense pride bound for an entire life.",
  "anantanubandhi_maya": "Intense deceit bound for an entire life.",
  "anantanubandhi_lobha": "Intense greed bound for an entire life.",
  "apratyakhyana_krodha": "Anger that resists renouncing harmful acts.",
  "apratyakhyana_mana": "Pride that resists renouncing harmful acts.",
  "apratyakhyana_maya": "Deceit that resists renouncing harmful acts.",
  "apratyakhyana_lobha": "Greed that resists renouncing harmful acts.",
  "pratyakhyana_krodha": "Anger that can still be renounced with effort.",
  "pratyakhyana_mana": "Pride that can still be renounced with effort.",
  "pratyakhyana_maya": "Deceit that can still be renounced with effort.",
  "pratyakhyana_lobha": "Greed that can still be renounced with effort.",
  "sanjvalana_krodha": "Flaring anger that is easier to overcome.",
  "sanjvalana_mana": "Flaring pride that is easier to overcome.",
  "sanjvalana_maya": "Flaring deceit that is easier to overcome.",
  "sanjvalana_lobha": "Flaring greed that is easier to overcome.",
  "hasya": "Laughter born of mohaniya passion.",
  "rati": "Attachment and liking toward objects.",
  "arati": "Dislike and aversion toward objects.",
  "shoka": "Sorrow and grief that binds the soul.",
  "bhaya": "Fear that agitates the soul.",
  "jugupsa": "Disgust or repulsion toward objects.",
  "stri_veda": "Sexual desire toward women.",
  "purusha_veda": "Sexual desire toward men.",
  "napumsaka_veda": "Sexual desire toward neutral gender.",
  "naraka_ayushya": "Lifespan fixed in the naraka realm.",
  "tiryanch_ayushya": "Lifespan fixed in the animal realm.",
  "manushya_ayushya": "Lifespan fixed in the human realm.",
  "deva_ayushya": "Lifespan fixed in the celestial realm.",
  "naraka_gati": "Determines rebirth in the Naraka realm.",
  "tiryanch_gati": "Determines rebirth in the Tiryanch realm.",
  "manushya_gati": "Determines rebirth in the Manushya realm.",
  "deva_gati": "Determines rebirth in the Deva realm.",
  "ekendriya_jati": "Fixes the number of senses in ekendriya beings.",
  "dvindriya_jati": "Fixes the number of senses in dvindriya beings.",
  "trindriya_jati": "Fixes the number of senses in trindriya beings.",
  "chaturindriya_jati": "Fixes the number of senses in chaturindriya beings.",
  "panchendriya_jati": "Fixes the number of senses in panchendriya beings.",
  "audarika_sharira": "Determines the Audarika body type.",
  "vaikriya_sharira": "Determines the Vaikriya body type.",
  "aharaka_sharira": "Determines the Aharaka body type.",
  "taijasa_sharira": "Determines the Taijasa body type.",
  "karmana_sharira": "Determines the Karmana body type.",
  "audarika_angopanga": "Fixes limbs and body parts of the Audarika body.",
  "vaikriya_angopanga": "Fixes limbs and body parts of the Vaikriya body.",
  "aharaka_angopanga": "Fixes limbs and body parts of the Aharaka body.",
  "nirmana": "Fixes the overall structure and formation of the body.",
  "audarika_bandhana": "Binds particles into the Audarika body.",
  "vaikriya_bandhana": "Binds particles into the Vaikriya body.",
  "aharaka_bandhana": "Binds particles into the Aharaka body.",
  "taijasa_bandhana": "Binds particles into the Taijasa body.",
  "karmana_bandhana": "Binds particles into the Karmana body.",
  "audarika_sanghata": "Aggregates particles in the Audarika body.",
  "vaikriya_sanghata": "Aggregates particles in the Vaikriya body.",
  "aharaka_sanghata": "Aggregates particles in the Aharaka body.",
  "taijasa_sanghata": "Aggregates particles in the Taijasa body.",
  "karmana_sanghata": "Aggregates particles in the Karmana body.",
  "vajra_rishabha_naracha": "Bone-joint structure prakriti: Vajra Rishabha Naracha.",
  "rishabha_naracha": "Bone-joint structure prakriti: Rishabha Naracha.",
  "naracha": "Bone-joint structure prakriti: Naracha.",
  "ardha_naracha": "Bone-joint structure prakriti: Ardha Naracha.",
  "kilika": "Interlocking joint structure of the body.",
  "sevarta": "Joint structure related to bodily movement.",
  "samachaturasra": "Symmetrical square-like body proportions.",
  "nyagrodha_parimandala": "Body broad at top like a banyan tree crown.",
  "sadi": "Body tapering downward like a winnowing basket.",
  "kubja": "Hunchbacked bodily formation.",
  "vamana": "Dwarf-like short bodily formation.",
  "hunda": "Pot-shaped bodily formation.",
  "varna": "General bodily color prakriti.",
  "gandha": "General bodily smell prakriti.",
  "rasa": "General taste-related bodily prakriti.",
  "sparsha": "General touch-related bodily prakriti.",
  "naraka_anupurvi": "Sequential rebirth tendency toward the Naraka realm.",
  "tiryanch_anupurvi": "Sequential rebirth tendency toward the Tiryanch realm.",
  "manushya_anupurvi": "Sequential rebirth tendency toward the Manushya realm.",
  "deva_anupurvi": "Sequential rebirth tendency toward the Deva realm.",
  "agurulaghu": "Determines whether the body is heavy or light.",
  "upaghata": "Self-injuring capacity of the body.",
  "paraghata": "Capacity to injure other living beings.",
  "atap": "Radiance or heat emitted by the body.",
  "udyota": "Light or glow emitted by the body.",
  "ucchvasa": "Breathing function of the living body.",
  "vihayogati_prashasta": "Aerial movement tendency: Prashasta.",
  "vihayogati_aprashasta": "Aerial movement tendency: Aprashasta.",
  "tras": "Mobile (trasa) nature of the living being.",
  "sthavara": "Immobile (sthāvara) nature of the living being.",
  "badara": "Gross (badara) physical constitution.",
  "sukshma": "Subtle (sūkṣma) physical constitution.",
  "paryapta": "Fully developed and complete bodily capacities.",
  "aparyapta": "Incomplete or undeveloped bodily capacities.",
  "pratyeka": "Individual (pratyeka) embodiment, not shared.",
  "sadharana": "Shared (sādhāraṇa) embodiment among beings.",
  "sthira": "Stable and steady bodily condition.",
  "asthira": "Unstable and changing bodily condition.",
  "shubha": "Auspicious bodily appearance.",
  "ashubha": "Inauspicious bodily appearance.",
  "subhaga": "Attractive and pleasing bodily form.",
  "durbhaga": "Unattractive bodily form.",
  "susvara": "Pleasant voice and speech quality.",
  "dusvara": "Harsh or unpleasant voice quality.",
  "adeya": "Body that inspires trust and respect.",
  "anadeya": "Body that fails to inspire trust.",
  "yashah_kirti": "Reputation and fame quality: Yashah.",
  "ayashah_kirti": "Reputation and fame quality: Ayashah.",
  "tirthankara": "Marks the soul destined to become a Tirthankara.",
  "krishna_varna": "Determines Krishna bodily color.",
  "nila_varna": "Determines Nila bodily color.",
  "rakta_varna": "Determines Rakta bodily color.",
  "pita_varna": "Determines Pita bodily color.",
  "shukla_varna": "Determines Shukla bodily color.",
  "surabhi_gandha": "Determines Surabhi bodily smell.",
  "durabhi_gandha": "Determines Durabhi bodily smell.",
  "tikta_rasa": "Determines Tikta taste quality of the body.",
  "katu_rasa": "Determines Katu taste quality of the body.",
  "kashaya_rasa": "Determines Kashaya taste quality of the body.",
  "amla_rasa": "Determines Amla taste quality of the body.",
  "madhura_rasa": "Determines Madhura taste quality of the body.",
  "karkasha_sparsha": "Determines Karkasha touch quality of the body.",
  "mridu_sparsha": "Determines Mridu touch quality of the body.",
  "guru_sparsha": "Determines Guru touch quality of the body.",
  "laghu_sparsha": "Determines Laghu touch quality of the body.",
  "uchcha_gotra": "High worldly status and noble birth.",
  "nicha_gotra": "Low worldly status and humble birth.",
  "dana_antaraya": "Obstructs giving and charity.",
  "labha_antaraya": "Obstructs gain of merit or wealth.",
  "bhoga_antaraya": "Obstructs enjoyment of owned objects.",
  "upabhoga_antaraya": "Obstructs use of shared or borrowed objects.",
  "virya_antaraya": "Obstructs spiritual vigor and effort."
};

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
