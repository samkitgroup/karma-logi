import type { Lang } from "@/lib/language";

export type LocalizedText = Record<Lang, string>;

const KARMA_DESCRIPTIONS: Record<string, LocalizedText> = {
  "gyanavarniya": {
    "en": "Ghati karma that obscures the soul's knowledge.",
    "hi": "घाती कर्म जो आत्मा के ज्ञान को आवृत करता है।",
    "gu": "ઘાતી કર્મ જે આત્માના જ્ઞાનને આવૃત કરે છે."
  },
  "darshnavarniya": {
    "en": "Ghati karma that obscures true perception of reality.",
    "hi": "घाती कर्म जो वास्तविकता के दर्शन को आवृत करता है।",
    "gu": "ઘાતી કર્મ જે વાસ્તવિકતાના દર્શનને આવૃત કરે છે."
  },
  "mohaniya": {
    "en": "Ghati karma that deludes the soul through passions and false belief.",
    "hi": "घाती कर्म जो कषाय और मिथ्यात्व से आत्मा को मोहित करता है।",
    "gu": "ઘાતી કર્મ જે કષાય અને મિથ્યાત્વથી આત્માને મોહિત કરે છે."
  },
  "antaraya": {
    "en": "Ghati karma that obstructs meritorious spiritual practice.",
    "hi": "घाती कर्म जो पुण्य की आध्यात्मिक साधना में अन्तराय करता है।",
    "gu": "ઘાતી કર્મ જે પુણ્યની આધ્યાત્મિક સાધનામાં અંતરાય કરે છે."
  },
  "vedaniya": {
    "en": "Aghati karma that determines pleasant or unpleasant feeling.",
    "hi": "अघाती कर्म जो साता या असाता अनुभव निर्धारित करता है।",
    "gu": "અઘાતી કર્મ જે સાતા અથવા અસાતા અનુભવ નક્કી કરે છે."
  },
  "ayushya": {
    "en": "Aghati karma that fixes lifespan in a given realm of birth.",
    "hi": "अघाती कर्म जो किसी योनि में आयु निर्धारित करता है।",
    "gu": "અઘાતી કર્મ જે કોઈ યોનિમાં આયુષ્ય નક્કી કરે છે."
  },
  "nama": {
    "en": "Aghati karma that determines body, senses, and worldly status.",
    "hi": "अघाती कर्म जो शरीर, इन्द्रिय और लौकिक स्थिति बनाता है।",
    "gu": "અઘાતી કર્મ જે શરીર, ઇન્દ્રિય અને સાંસારિક સ્થિતિ બનાવે છે."
  },
  "gotra": {
    "en": "Aghati karma that fixes high or low family and social status.",
    "hi": "अघाती कर्म जो उच्च या नीच गोत्र (स्थिति) निर्धारित करता है।",
    "gu": "અઘાતી કર્મ જે ઉચ્ચ અથવા નીચ ગોત્ર (સ્થિતિ) નક્કી કરે છે."
  }
};

const PRAKRITI_DESCRIPTIONS_EN: Record<string, string> = {
  "mati_gyanavarniya": "Obscures ordinary, everyday understanding of things.",
  "shruta_gyanavarniya": "Obscures knowledge gained from scriptures and teachings.",
  "avadhi_gyanavarniya": "Obscures clairvoyant knowledge of distant objects and events.",
  "manahparyaya_gyanavarniya": "Obscures knowledge of another being's thoughts.",
  "kevala_gyanavarniya": "Obscures omniscient, complete knowledge of reality.",
  "chakshu_darshnavarniya": "Obscures perception through the physical eyes.",
  "achakshu_darshnavarniya": "Obscures perception without reliance on the eyes.",
  "avadhi_darshnavarniya": "Obscures clairvoyant perception of distant things.",
  "kevala_darshnavarniya": "Obscures perfect, unobstructed perception of truth.",
  "nidra": "Light sleep that slightly veils perception.",
  "nidra_nidra": "Deep sleep that more strongly veils perception.",
  "prachala": "Drowsiness that disturbs steady perception.",
  "prachala_prachala": "Heavy drowsiness that greatly veils perception.",
  "sata_vedaniya": "Produces pleasant, peaceful experience and feeling.",
  "asata_vedaniya": "Produces painful, restless experience and feeling.",
  "mithyatva_mohaniya": "False belief that deludes the soul about reality.",
  "samyaktva_mohaniya": "Right belief mixed with some remaining delusion.",
  "mishra_mohaniya": "Mixed true and false belief that still deludes.",
  "anantanubandhi_krodha": "Anger bound so tightly it lasts through the entire life.",
  "anantanubandhi_mana": "Pride bound so tightly it lasts through the entire life.",
  "anantanubandhi_maya": "Deceit bound so tightly it lasts through the entire life.",
  "anantanubandhi_lobha": "Greed bound so tightly it lasts through the entire life.",
  "apratyakhyana_krodha": "Anger that is very hard to give up.",
  "apratyakhyana_mana": "Pride that is very hard to give up.",
  "apratyakhyana_maya": "Deceit that is very hard to give up.",
  "apratyakhyana_lobha": "Greed that is very hard to give up.",
  "pratyakhyana_krodha": "Anger that can be given up with effort.",
  "pratyakhyana_mana": "Pride that can be given up with effort.",
  "pratyakhyana_maya": "Deceit that can be given up with effort.",
  "pratyakhyana_lobha": "Greed that can be given up with effort.",
  "sanjvalana_krodha": "Anger that can subside relatively quickly.",
  "sanjvalana_mana": "Pride that can subside relatively quickly.",
  "sanjvalana_maya": "Deceit that can subside relatively quickly.",
  "sanjvalana_lobha": "Greed that can subside relatively quickly.",
  "hasya": "Laughter and mirth as a deluding passion.",
  "rati": "Attachment and fondness toward an object.",
  "arati": "Dislike and aversion toward an object.",
  "shoka": "Sorrow and grief that bind the soul.",
  "bhaya": "Fear and anxiety that disturb the soul.",
  "jugupsa": "Disgust or repulsion toward something.",
  "stri_veda": "Sexual desire directed toward women.",
  "purusha_veda": "Sexual desire directed toward men.",
  "napumsaka_veda": "Sexual desire directed toward neutral gender.",
  "naraka_ayushya": "Fixes lifespan in the hellish realm of birth.",
  "tiryanch_ayushya": "Fixes lifespan in the animal realm of birth.",
  "manushya_ayushya": "Fixes lifespan in the human realm of birth.",
  "deva_ayushya": "Fixes lifespan in the heavenly realm of birth.",
  "naraka_gati": "Fixes rebirth in the hellish realm.",
  "tiryanch_gati": "Fixes rebirth in the animal realm.",
  "manushya_gati": "Fixes rebirth in the human realm.",
  "deva_gati": "Fixes rebirth in the heavenly realm.",
  "ekendriya_jati": "Fixes how many senses a one-sense life has.",
  "dvindriya_jati": "Fixes how many senses a two-sense life has.",
  "trindriya_jati": "Fixes how many senses a three-sense life has.",
  "chaturindriya_jati": "Fixes how many senses a four-sense life has.",
  "panchendriya_jati": "Fixes how many senses a five-sense life has.",
  "audarika_sharira": "Fixes an earthly, physical type of body.",
  "vaikriya_sharira": "Fixes a transformable, non-earthly body.",
  "aharaka_sharira": "Fixes a subtle body used by advanced ascetics.",
  "taijasa_sharira": "Fixes a luminous, fiery subtle body.",
  "karmana_sharira": "Fixes the subtle karmic body that carries karma.",
  "audarika_angopanga": "Fixes limbs and body parts of an earthly body.",
  "vaikriya_angopanga": "Fixes limbs and body parts of a transformable body.",
  "aharaka_angopanga": "Fixes limbs and body parts of the ascetic body.",
  "nirmana": "Fixes the overall structure and shape of a body.",
  "audarika_bandhana": "Binds the particles of an earthly body together.",
  "vaikriya_bandhana": "Binds the particles of a transformable body together.",
  "aharaka_bandhana": "Binds the particles of the ascetic body together.",
  "taijasa_bandhana": "Binds the particles of a luminous body together.",
  "karmana_bandhana": "Binds the particles of the karmic body together.",
  "audarika_sanghata": "Joins the particles of an earthly body together.",
  "vaikriya_sanghata": "Joins the particles of a transformable body together.",
  "aharaka_sanghata": "Joins the particles of the ascetic body together.",
  "taijasa_sanghata": "Joins the particles of a luminous body together.",
  "karmana_sanghata": "Joins the particles of the karmic body together.",
  "vajra_rishabha_naracha": "Fixes the strongest bone-and-joint bodily structure.",
  "rishabha_naracha": "Fixes a strong bone-and-joint bodily structure.",
  "naracha": "Fixes a moderate bone-and-joint bodily structure.",
  "ardha_naracha": "Fixes a weaker bone-and-joint bodily structure.",
  "kilika": "Fixes how the body's joints are connected.",
  "sevarta": "Fixes bodily structure suited for movement.",
  "samachaturasra": "Fixes a symmetrical, square-shaped body.",
  "nyagrodha_parimandala": "Fixes a broad upper body tapering downward.",
  "sadi": "Fixes a body tapering toward the lower part.",
  "kubja": "Fixes a hunchbacked bodily form.",
  "vamana": "Fixes a short, dwarf-like bodily form.",
  "hunda": "Fixes a pot-shaped bodily form.",
  "varna": "Fixes the color of the body.",
  "gandha": "Fixes the smell of the body.",
  "rasa": "Fixes the taste associated with the body.",
  "sparsha": "Fixes the touch or texture of the body.",
  "naraka_anupurvi": "Fixes the manner of rebirth toward the hellish realm.",
  "tiryanch_anupurvi": "Fixes the manner of rebirth toward the animal realm.",
  "manushya_anupurvi": "Fixes the manner of rebirth toward the human realm.",
  "deva_anupurvi": "Fixes the manner of rebirth toward the heavenly realm.",
  "agurulaghu": "Fixes whether the body is heavy or light.",
  "upaghata": "Power to harm one's own body.",
  "paraghata": "Power to harm other living beings.",
  "atap": "Radiates heat and brilliance from the body.",
  "udyota": "Radiates light or glow from the body.",
  "ucchvasa": "Fixes breathing in the body.",
  "vihayogati_prashasta": "Fixes a good mode of movement through space.",
  "vihayogati_aprashasta": "Fixes a poor mode of movement through space.",
  "tras": "Fixes a mobile living being, not stationary.",
  "sthavara": "Fixes a stationary living being, like a plant.",
  "badara": "Fixes a large, coarse body.",
  "sukshma": "Fixes a fine, subtle body.",
  "paryapta": "Fixes a complete, fully developed body.",
  "aparyapta": "Fixes an incomplete or underdeveloped body.",
  "pratyeka": "Fixes a body belonging to one soul alone.",
  "sadharana": "Fixes a shared body used by many souls.",
  "sthira": "Fixes a stable, lasting body.",
  "asthira": "Fixes a changing, unstable body.",
  "shubha": "Fixes an auspicious bodily appearance.",
  "ashubha": "Fixes an inauspicious bodily appearance.",
  "subhaga": "Fixes an attractive, pleasing body.",
  "durbhaga": "Fixes an unattractive, less pleasing body.",
  "susvara": "Fixes a sweet, pleasant voice.",
  "dusvara": "Fixes a harsh, unpleasant voice.",
  "adeya": "Fixes deep respect and trust toward the body.",
  "anadeya": "Fixes little respect and trust toward the body.",
  "yashah_kirti": "Fixes fame and good reputation.",
  "ayashah_kirti": "Fixes lack of fame and poor reputation.",
  "tirthankara": "Qualifies a soul to become a Tirthankara.",
  "krishna_varna": "Fixes a dark bodily color.",
  "nila_varna": "Fixes a blue bodily color.",
  "rakta_varna": "Fixes a red bodily color.",
  "pita_varna": "Fixes a yellow bodily color.",
  "shukla_varna": "Fixes a white bodily color.",
  "surabhi_gandha": "Fixes a fragrant bodily smell.",
  "durabhi_gandha": "Fixes an unpleasant bodily smell.",
  "tikta_rasa": "Fixes a bitter bodily taste.",
  "katu_rasa": "Fixes a pungent bodily taste.",
  "kashaya_rasa": "Fixes an astringent bodily taste.",
  "amla_rasa": "Fixes a sour bodily taste.",
  "madhura_rasa": "Fixes a sweet bodily taste.",
  "karkasha_sparsha": "Fixes a rough bodily touch.",
  "mridu_sparsha": "Fixes a soft bodily touch.",
  "guru_sparsha": "Fixes a heavy bodily touch.",
  "laghu_sparsha": "Fixes a light bodily touch.",
  "uchcha_gotra": "Fixes birth in a high, respected family.",
  "nicha_gotra": "Fixes birth in a low, less respected family.",
  "dana_antaraya": "Obstructs the ability to give charity.",
  "labha_antaraya": "Obstructs gain and meritorious benefit.",
  "bhoga_antaraya": "Obstructs enjoyment of one's own possessions.",
  "upabhoga_antaraya": "Obstructs enjoyment of shared or common things.",
  "virya_antaraya": "Obstructs spiritual energy and vigor in practice."
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
  if (lang === "en") {
    return (
      PRAKRITI_DESCRIPTIONS_EN[prakritiId] ??
      getKarmaDescription(karmaId, "en")
    );
  }
  return getKarmaDescription(karmaId, lang);
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
