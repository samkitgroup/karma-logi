import fs from "node:fs";
import data from "../data.json" with { type: "json" };

const KARMA_DESCRIPTIONS = {
  gyanavarniya: {
    en: "Ghati karma — dhakhe che aatma nu gyan (knowledge).",
    hi: "घाती कर्म जो आत्मा के ज्ञान को आवृत करता है।",
    gu: "ઘાતી કર્મ જે આત્માના જ્ઞાનને આવૃત કરે છે.",
  },
  darshnavarniya: {
    en: "Ghati karma — dhakhe che sachu darshan (truth-seeing).",
    hi: "घाती कर्म जो वास्तविकता के दर्शन को आवृत करता है।",
    gu: "ઘાતી કર્મ જે વાસ્તવિકતાના દર્શનને આવૃત કરે છે.",
  },
  mohaniya: {
    en: "Ghati karma — kashay thi aatma ne mohit kare che.",
    hi: "घाती कर्म जो कषाय और मिथ्यात्व से आत्मा को मोहित करता है।",
    gu: "ઘાતી કર્મ જે કષાય અને મિથ્યાત્વથી આત્માને મોહિત કરે છે.",
  },
  antaraya: {
    en: "Ghati karma — punya ane sadhana ma antaraya kare che.",
    hi: "घाती कर्म जो पुण्य की आध्यात्मिक साधना में अन्तराय करता है।",
    gu: "ઘાતી કર્મ જે પુણ્યની આધ્યાત્મિક સાધનામાં અંતરાય કરે છે.",
  },
  vedaniya: {
    en: "Aghati karma — sata ke asata vedaniya (feeling) aape che.",
    hi: "अघाती कर्म जो साता या असाता अनुभव निर्धारित करता है।",
    gu: "અઘાતી કર્મ જે સાતા અથવા અસાતા અનુભવ નક્કી કરે છે.",
  },
  ayushya: {
    en: "Aghati karma — yoni ma ayushya (lifespan) fix kare che.",
    hi: "अघाती कर्म जो किसी योनि में आयु निर्धारित करता है।",
    gu: "અઘાતી કર્મ જે કોઈ યોનિમાં આయુષ્ય નક્કી કરે છે.",
  },
  nama: {
    en: "Aghati karma — sharir, indriya ane sthiti banave che.",
    hi: "अघाती कर्म जो शरीर, इन्द्रिय और लौकिक स्थिति बनाता है।",
    gu: "અઘાતી કર્મ જે શરીર, ઇન્દ્રિય અને સાંસારિક સ્થિતિ બનાવે છે.",
  },
  gotra: {
    en: "Aghati karma — ucha ke nicha gotra (family status) fix kare che.",
    hi: "अघाती कर्म जो उच्च या नीच गोत्र (स्थिति) निर्धारित करता है।",
    gu: "અઘાતી કર્મ જે ઉચ્ચ અથવા નીચ ગોત્ર (સ્થિતિ) નક્કી કરે છે.",
  },
};

const PRAKRITI_EN = {
  mati_gyanavarniya: "Mati gyan dhakay che — roj nu simple samaj.",
  shruta_gyanavarniya: "Shruta gyan dhakay che — shastra mathi malta gyan.",
  avadhi_gyanavarniya: "Avadhi gyan dhakay che — dur nu jovu gyan.",
  manahparyaya_gyanavarniya: "Manahparyaya gyan dhakay che — bija na vichar samaj.",
  kevala_gyanavarniya: "Keval gyan dhakay che — sampurn gyan.",
  chakshu_darshnavarniya: "Chakshu darshan dhakay che — aankh thi jovu.",
  achakshu_darshnavarniya: "Aankh vagar nu darshan dhakay che.",
  avadhi_darshnavarniya: "Avadhi darshan dhakay che — dur nu jovu.",
  kevala_darshnavarniya: "Keval darshan dhakay che — sampurn darshan.",
  nidra: "Nidra — thodi neend, darshan ochhu dhake che.",
  nidra_nidra: "Ghani nidra — ghani neend, darshan ochhu dhake che.",
  prachala: "Prachala — jhapat, darshan ma antaray kare che.",
  prachala_prachala: "Ghani prachala — ghani jhapat, darshan bhari dhake che.",
  sata_vedaniya: "Sata vedaniya — sukh ane shant anubhav.",
  asata_vedaniya: "Asata vedaniya — dukh ane asant anubhav.",
  mithyatva_mohaniya: "Mithyatva — khoto vishwas, aatma ne mohit kare che.",
  samyaktva_mohaniya: "Samyaktva — sacho vishwas, thodu moh sathe.",
  mishra_mohaniya: "Mishra vishwas — sacho ane khoto vishwas mix.",
  anantanubandhi_krodha: "Anantanubandhi krodh — krodh akhi jivan sudhi bandh.",
  anantanubandhi_mana: "Anantanubandhi man — man akhi jivan sudhi bandh.",
  anantanubandhi_maya: "Anantanubandhi maya — maya akhi jivan sudhi bandh.",
  anantanubandhi_lobha: "Anantanubandhi lobh — lobh akhi jivan sudhi bandh.",
  apratyakhyana_krodha: "Apratyakhyan krodh — krodh chhodva mushkel.",
  apratyakhyana_mana: "Apratyakhyan man — man chhodva mushkel.",
  apratyakhyana_maya: "Apratyakhyan maya — maya chhodva mushkel.",
  apratyakhyana_lobha: "Apratyakhyan lobh — lobh chhodva mushkel.",
  pratyakhyana_krodha: "Pratyakhyan krodh — prayatn thi krodh chhodi shakay.",
  pratyakhyana_mana: "Pratyakhyan man — prayatn thi man chhodi shakay.",
  pratyakhyana_maya: "Pratyakhyan maya — prayatn thi maya chhodi shakay.",
  pratyakhyana_lobha: "Pratyakhyan lobh — prayatn thi lobh chhodi shakay.",
  sanjvalana_krodha: "Sanjvalan krodh — krodh jaldi shant thai shake.",
  sanjvalana_mana: "Sanjvalan man — man jaldi shant thai shake.",
  sanjvalana_maya: "Sanjvalan maya — maya jaldi shant thai shake.",
  sanjvalana_lobha: "Sanjvalan lobh — lobh jaldi shant thai shake.",
  hasya: "Hasya — hansva, mohaniya kashay.",
  rati: "Rati — vastu prati rag ane lagav.",
  arati: "Arati — vastu prati anraga ane durag.",
  shoka: "Shok — dukh ane shok, aatma ne bandhe che.",
  bhaya: "Bhay — dar, aatma ne khabhar kare che.",
  jugupsa: "Jugupsa — ghin ke durag vastu prati.",
  stri_veda: "Stri ved — stri prati kam.",
  purusha_veda: "Purush ved — purush prati kam.",
  napumsaka_veda: "Napumsak ved — napumsak prati kam.",
  naraka_ayushya: "Naraka ayushya — naraka yoni ma jivan fix.",
  tiryanch_ayushya: "Tiryanch ayushya — pashu yoni ma jivan fix.",
  manushya_ayushya: "Manushya ayushya — manushya yoni ma jivan fix.",
  deva_ayushya: "Deva ayushya — dev yoni ma jivan fix.",
  uchcha_gotra: "Uchcha gotra — uchi kul ane pratishtha.",
  nicha_gotra: "Nicha gotra — nichi kul ane ochhi pratishtha.",
  dana_antaraya: "Dana antaraya — daan aapva ma antaray.",
  labha_antaraya: "Labha antaraya — labh ke punya ma antaray.",
  bhoga_antaraya: "Bhoga antaraya — potanu bhogva ma antaray.",
  upabhoga_antaraya: "Upbhog antaraya — upbhog ma antaray.",
  virya_antaraya: "Virya antaraya — sadhana ni urja ma antaray.",
  tirthankara: "Tirthankar prakriti — tirthankar banva mate no yogya jiv.",
};

function describePrakritiEn(id, karmaId, nameEn) {
  if (PRAKRITI_EN[id]) {
    return PRAKRITI_EN[id];
  }

  if (nameEn.endsWith(" Gati")) {
    const realm = nameEn.replace(" Gati", "");
    return `${realm} gati — aa yoni ma punarjanma fix kare che.`;
  }
  if (nameEn.endsWith(" Jati")) {
    const kind = nameEn.replace(" Jati", "");
    return `${kind} jati — ketli indriya hoy te fix kare che.`;
  }
  if (nameEn.endsWith(" Sharira")) {
    const kind = nameEn.replace(" Sharira", "");
    return `${kind} sharir — sharir no prakar fix kare che.`;
  }
  if (nameEn.endsWith(" Angopanga")) {
    const kind = nameEn.replace(" Angopanga", "");
    return `${kind} angopang — ang ane angda fix kare che.`;
  }
  if (nameEn.endsWith(" Bandhana")) {
    const kind = nameEn.replace(" Bandhana", "");
    return `${kind} bandhan — sharir na kan bandhe che.`;
  }
  if (nameEn.endsWith(" Sanghata")) {
    const kind = nameEn.replace(" Sanghata", "");
    return `${kind} sanghat — sharir na kan jode che.`;
  }
  if (nameEn.endsWith(" Anupurvi")) {
    const realm = nameEn.replace(" Anupurvi", "");
    return `${realm} anupurvi — aa yoni taraf punarjanma ni riti.`;
  }
  if (nameEn.endsWith(" Varna")) {
    const kind = nameEn.replace(" Varna", "");
    return `${kind} varna — sharir no rang fix kare che.`;
  }
  if (nameEn.endsWith(" Gandha")) {
    const kind = nameEn.replace(" Gandha", "");
    return `${kind} gandh — sharir ni vaas fix kare che.`;
  }
  if (nameEn.endsWith(" Rasa")) {
    const kind = nameEn.replace(" Rasa", "");
    return `${kind} ras — sharir no svad fix kare che.`;
  }
  if (nameEn.endsWith(" Sparsha")) {
    const kind = nameEn.replace(" Sparsha", "");
    return `${kind} sparsh — sharir nu sparsh fix kare che.`;
  }
  if (nameEn.endsWith(" Vihayogati")) {
    const kind = nameEn.replace(" Vihayogati", "");
    return `${kind} vihayogati — akash ma gati ni riti.`;
  }
  if (nameEn.endsWith(" Kirti")) {
    const kind = nameEn.replace(" Kirti", "");
    return `${kind} kirti — yash ane khyati ni prakriti.`;
  }
  if (nameEn === "Nirmana") {
    return "Nirman — sharir ni rachna ane akar fix kare che.";
  }
  if (nameEn === "Agurulaghu") {
    return "Agurulaghu — sharir bhari ke halku hoy te fix kare che.";
  }
  if (nameEn === "Upaghata") {
    return "Upaghata — potana sharir ne nuksan pahochadva ni shakti.";
  }
  if (nameEn === "Paraghata") {
    return "Paraghata — bija jivo ne nuksan pahochadva ni shakti.";
  }
  if (nameEn === "Atapa") {
    return "Atap — sharir thi tap ane tej nikle che.";
  }
  if (nameEn === "Udyota") {
    return "Udyot — sharir thi prakash ke tej nikle che.";
  }
  if (nameEn === "Ucchvasa") {
    return "Ucchvas — sharir nu shvasan (breathing).";
  }
  if (nameEn === "Trasa") {
    return "Trasa — chalta prani, sthavar nathi.";
  }
  if (nameEn === "Sthavara") {
    return "Sthavar — sthir prani, jem vanaspati.";
  }
  if (nameEn === "Badara") {
    return "Badar — motu ane sthul sharir.";
  }
  if (nameEn === "Sukshma") {
    return "Sukshma — nano ane sukshma sharir.";
  }
  if (nameEn === "Paryapta") {
    return "Paryapt — sharir puru ane vikasit che.";
  }
  if (nameEn === "Aparyapta") {
    return "Aparyapt — sharir adhuru ke ochhu vikasit che.";
  }
  if (nameEn === "Pratyeka") {
    return "Pratyek — ek jiv mate alag sharir.";
  }
  if (nameEn === "Sadharana") {
    return "Sadharan — vahli sharir, vahli jivo share kare che.";
  }
  if (nameEn === "Sthira") {
    return "Sthir — sharir sthir ane sthayi che.";
  }
  if (nameEn === "Asthira") {
    return "Asthir — sharir badlata ane asthir che.";
  }
  if (nameEn === "Shubha") {
    return "Shubh — shubh ane shant sharir darshan.";
  }
  if (nameEn === "Ashubha") {
    return "Ashubh — ashubh sharir darshan.";
  }
  if (nameEn === "Subhaga") {
    return "Subhag — manbhav ane sundar sharir.";
  }
  if (nameEn === "Durbhaga") {
    return "Durbhag — ochhu manbhav sharir.";
  }
  if (nameEn === "Susvara") {
    return "Susvar — madhur ane shant awaz.";
  }
  if (nameEn === "Dusvara") {
    return "Dusvar — kathor ane apriya awaz.";
  }
  if (nameEn === "Adeya") {
    return "Adey — sharir prati vishwas ane samman.";
  }
  if (nameEn === "Anadeya") {
    return "Anadey — sharir prati vishwas ochho.";
  }
  if (nameEn === "Samachaturasra") {
    return "Sam chaturasra — sharir chaturasra akar nu.";
  }
  if (nameEn === "Nyagrodha Parimandala") {
    return "Nyagrodh parimandal — upar thi choda sharir.";
  }
  if (nameEn === "Sadi") {
    return "Sadi — niche taraf sankuchit sharir.";
  }
  if (nameEn === "Kubja") {
    return "Kubj — kubyar sharir.";
  }
  if (nameEn === "Vamana") {
    return "Vaman — nanu sharir.";
  }
  if (nameEn === "Hunda") {
    return "Hund — matka jem sharir akar.";
  }
  if (nameEn.includes("Naracha")) {
    return `${nameEn} — had ane sandhi ni rachna.`;
  }
  if (nameEn === "Kilika") {
    return "Kilika — sharir na sandhi jode che.";
  }
  if (nameEn === "Sevarta") {
    return "Sevarta — sharir ni halchal mate ni rachna.";
  }
  if (nameEn === "Varna") {
    return "Varna — sharir no rang.";
  }
  if (nameEn === "Gandha") {
    return "Gandh — sharir ni vaas.";
  }
  if (nameEn === "Rasa") {
    return "Ras — sharir no svad.";
  }
  if (nameEn === "Sparsha") {
    return "Sparsh — sharir nu sparsh.";
  }

  const karmaName = data.find((k) => k.id === karmaId)?.name.en ?? karmaId;
  return `${nameEn} — ${karmaName} ni prakriti.`;
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
`;

fs.writeFileSync(
  new URL("../src/lib/karma-scramble-descriptions.ts", import.meta.url),
  out,
);
console.log("Wrote karma-scramble-descriptions.ts");
