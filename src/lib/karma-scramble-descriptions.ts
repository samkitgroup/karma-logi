import type { Lang } from "@/lib/language";

export type LocalizedText = Record<Lang, string>;

const KARMA_DESCRIPTIONS: Record<string, LocalizedText> = {
  "jnanavaraniya": {
    "en": "Ghati karma — dhakhe che aatma nu gyan (knowledge).",
    "hi": "घाती कर्म जो आत्मा के ज्ञान को आवृत करता है।",
    "gu": "ઘાતી કર્મ જે આત્માના જ્ઞાનને આવૃત કરે છે."
  },
  "darshanavaraniya": {
    "en": "Ghati karma — dhakhe che sachu darshan (truth-seeing).",
    "hi": "घाती कर्म जो वास्तविकता के दर्शन को आवृत करता है।",
    "gu": "ઘાતી કર્મ જે વાસ્તવિકતાના દર્શનને આવૃત કરે છે."
  },
  "mohaniya": {
    "en": "Ghati karma — kashay thi aatma ne mohit kare che.",
    "hi": "घाती कर्म जो कषाय और मिथ्यात्व से आत्मा को मोहित करता है।",
    "gu": "ઘાતી કર્મ જે કષાય અને મિથ્યાત્વથી આત્માને મોહિત કરે છે."
  },
  "antaraya": {
    "en": "Ghati karma — punya ane sadhana ma antaraya kare che.",
    "hi": "घाती कर्म जो पुण्य की आध्यात्मिक साधना में अन्तराय करता है।",
    "gu": "ઘાતી કર્મ જે પુણ્યની આધ્યાત્મિક સાધનામાં અંતરાય કરે છે."
  },
  "vedaniya": {
    "en": "Aghati karma — sata ke asata vedaniya (feeling) aape che.",
    "hi": "अघाती कर्म जो साता या असाता अनुभव निर्धारित करता है।",
    "gu": "અઘાતી કર્મ જે સાતા અથવા અસાતા અનુભવ નક્કી કરે છે."
  },
  "ayushya": {
    "en": "Aghati karma — yoni ma ayushya (lifespan) fix kare che.",
    "hi": "अघाती कर्म जो किसी योनि में आयु निर्धारित करता है।",
    "gu": "અઘાતી કર્મ જે કોઈ યોનિમાં આయુષ્ય નક્કી કરે છે."
  },
  "nama": {
    "en": "Aghati karma — sharir, indriya ane sthiti banave che.",
    "hi": "अघाती कर्म जो शरीर, इन्द्रिय और लौकिक स्थिति बनाता है।",
    "gu": "અઘાતી કર્મ જે શરીર, ઇન્દ્રિય અને સાંસારિક સ્થિતિ બનાવે છે."
  },
  "gotra": {
    "en": "Aghati karma — ucha ke nicha gotra (family status) fix kare che.",
    "hi": "अघाती कर्म जो उच्च या नीच गोत्र (स्थिति) निर्धारित करता है।",
    "gu": "અઘાતી કર્મ જે ઉચ્ચ અથવા નીચ ગોત્ર (સ્થિતિ) નક્કી કરે છે."
  }
};

const PRAKRITI_DESCRIPTIONS_EN: Record<string, string> = {
  "mati_jnanavaraniya": "Mati gyan dhakay che — roj nu simple samaj.",
  "shruta_jnanavaraniya": "Shruta gyan dhakay che — shastra mathi malta gyan.",
  "avadhi_jnanavaraniya": "Avadhi gyan dhakay che — dur nu jovu gyan.",
  "manahparyaya_jnanavaraniya": "Manahparyaya gyan dhakay che — bija na vichar samaj.",
  "kevala_jnanavaraniya": "Keval gyan dhakay che — sampurn gyan.",
  "chakshu_darshanavaraniya": "Chakshu darshan dhakay che — aankh thi jovu.",
  "achakshu_darshanavaraniya": "Aankh vagar nu darshan dhakay che.",
  "avadhi_darshanavaraniya": "Avadhi darshan dhakay che — dur nu jovu.",
  "kevala_darshanavaraniya": "Keval darshan dhakay che — sampurn darshan.",
  "nidra": "Nidra — thodi neend, darshan ochhu dhake che.",
  "nidra_nidra": "Ghani nidra — ghani neend, darshan ochhu dhake che.",
  "prachala": "Prachala — jhapat, darshan ma antaray kare che.",
  "prachala_prachala": "Ghani prachala — ghani jhapat, darshan bhari dhake che.",
  "sata_vedaniya": "Sata vedaniya — sukh ane shant anubhav.",
  "asata_vedaniya": "Asata vedaniya — dukh ane asant anubhav.",
  "mithyatva_mohaniya": "Mithyatva — khoto vishwas, aatma ne mohit kare che.",
  "samyaktva_mohaniya": "Samyaktva — sacho vishwas, thodu moh sathe.",
  "mishra_mohaniya": "Mishra vishwas — sacho ane khoto vishwas mix.",
  "anantanubandhi_krodha": "Anantanubandhi krodh — krodh akhi jivan sudhi bandh.",
  "anantanubandhi_mana": "Anantanubandhi man — man akhi jivan sudhi bandh.",
  "anantanubandhi_maya": "Anantanubandhi maya — maya akhi jivan sudhi bandh.",
  "anantanubandhi_lobha": "Anantanubandhi lobh — lobh akhi jivan sudhi bandh.",
  "apratyakhyana_krodha": "Apratyakhyan krodh — krodh chhodva mushkel.",
  "apratyakhyana_mana": "Apratyakhyan man — man chhodva mushkel.",
  "apratyakhyana_maya": "Apratyakhyan maya — maya chhodva mushkel.",
  "apratyakhyana_lobha": "Apratyakhyan lobh — lobh chhodva mushkel.",
  "pratyakhyana_krodha": "Pratyakhyan krodh — prayatn thi krodh chhodi shakay.",
  "pratyakhyana_mana": "Pratyakhyan man — prayatn thi man chhodi shakay.",
  "pratyakhyana_maya": "Pratyakhyan maya — prayatn thi maya chhodi shakay.",
  "pratyakhyana_lobha": "Pratyakhyan lobh — prayatn thi lobh chhodi shakay.",
  "sanjvalana_krodha": "Sanjvalan krodh — krodh jaldi shant thai shake.",
  "sanjvalana_mana": "Sanjvalan man — man jaldi shant thai shake.",
  "sanjvalana_maya": "Sanjvalan maya — maya jaldi shant thai shake.",
  "sanjvalana_lobha": "Sanjvalan lobh — lobh jaldi shant thai shake.",
  "hasya": "Hasya — hansva, mohaniya kashay.",
  "rati": "Rati — vastu prati rag ane lagav.",
  "arati": "Arati — vastu prati anraga ane durag.",
  "shoka": "Shok — dukh ane shok, aatma ne bandhe che.",
  "bhaya": "Bhay — dar, aatma ne khabhar kare che.",
  "jugupsa": "Jugupsa — ghin ke durag vastu prati.",
  "stri_veda": "Stri ved — stri prati kam.",
  "purusha_veda": "Purush ved — purush prati kam.",
  "napumsaka_veda": "Napumsak ved — napumsak prati kam.",
  "naraka_ayushya": "Naraka ayushya — naraka yoni ma jivan fix.",
  "tiryanch_ayushya": "Tiryanch ayushya — pashu yoni ma jivan fix.",
  "manushya_ayushya": "Manushya ayushya — manushya yoni ma jivan fix.",
  "deva_ayushya": "Deva ayushya — dev yoni ma jivan fix.",
  "naraka_gati": "Naraka gati — aa yoni ma punarjanma fix kare che.",
  "tiryanch_gati": "Tiryanch gati — aa yoni ma punarjanma fix kare che.",
  "manushya_gati": "Manushya gati — aa yoni ma punarjanma fix kare che.",
  "deva_gati": "Deva gati — aa yoni ma punarjanma fix kare che.",
  "ekendriya_jati": "Ekendriya jati — ketli indriya hoy te fix kare che.",
  "dvindriya_jati": "Dvindriya jati — ketli indriya hoy te fix kare che.",
  "trindriya_jati": "Trindriya jati — ketli indriya hoy te fix kare che.",
  "chaturindriya_jati": "Chaturindriya jati — ketli indriya hoy te fix kare che.",
  "panchendriya_jati": "Panchendriya jati — ketli indriya hoy te fix kare che.",
  "audarika_sharira": "Audarika sharir — sharir no prakar fix kare che.",
  "vaikriya_sharira": "Vaikriya sharir — sharir no prakar fix kare che.",
  "aharaka_sharira": "Aharaka sharir — sharir no prakar fix kare che.",
  "taijasa_sharira": "Taijasa sharir — sharir no prakar fix kare che.",
  "karmana_sharira": "Karmana sharir — sharir no prakar fix kare che.",
  "audarika_angopanga": "Audarika angopang — ang ane angda fix kare che.",
  "vaikriya_angopanga": "Vaikriya angopang — ang ane angda fix kare che.",
  "aharaka_angopanga": "Aharaka angopang — ang ane angda fix kare che.",
  "nirmana": "Nirman — sharir ni rachna ane akar fix kare che.",
  "audarika_bandhana": "Audarika bandhan — sharir na kan bandhe che.",
  "vaikriya_bandhana": "Vaikriya bandhan — sharir na kan bandhe che.",
  "aharaka_bandhana": "Aharaka bandhan — sharir na kan bandhe che.",
  "taijasa_bandhana": "Taijasa bandhan — sharir na kan bandhe che.",
  "karmana_bandhana": "Karmana bandhan — sharir na kan bandhe che.",
  "audarika_sanghata": "Audarika sanghat — sharir na kan jode che.",
  "vaikriya_sanghata": "Vaikriya sanghat — sharir na kan jode che.",
  "aharaka_sanghata": "Aharaka sanghat — sharir na kan jode che.",
  "taijasa_sanghata": "Taijasa sanghat — sharir na kan jode che.",
  "karmana_sanghata": "Karmana sanghat — sharir na kan jode che.",
  "vajra_rishabha_naracha": "Vajra Rishabha Naracha — had ane sandhi ni rachna.",
  "rishabha_naracha": "Rishabha Naracha — had ane sandhi ni rachna.",
  "naracha": "Naracha — had ane sandhi ni rachna.",
  "ardha_naracha": "Ardha Naracha — had ane sandhi ni rachna.",
  "kilika": "Kilika — sharir na sandhi jode che.",
  "sevarta": "Sevarta — sharir ni halchal mate ni rachna.",
  "samachaturasra": "Sam chaturasra — sharir chaturasra akar nu.",
  "nyagrodha_parimandala": "Nyagrodh parimandal — upar thi choda sharir.",
  "sadi": "Sadi — niche taraf sankuchit sharir.",
  "kubja": "Kubj — kubyar sharir.",
  "vamana": "Vaman — nanu sharir.",
  "hunda": "Hund — matka jem sharir akar.",
  "varna": "Varna — sharir no rang.",
  "gandha": "Gandh — sharir ni vaas.",
  "rasa": "Ras — sharir no svad.",
  "sparsha": "Sparsh — sharir nu sparsh.",
  "naraka_anupurvi": "Naraka anupurvi — aa yoni taraf punarjanma ni riti.",
  "tiryanch_anupurvi": "Tiryanch anupurvi — aa yoni taraf punarjanma ni riti.",
  "manushya_anupurvi": "Manushya anupurvi — aa yoni taraf punarjanma ni riti.",
  "deva_anupurvi": "Deva anupurvi — aa yoni taraf punarjanma ni riti.",
  "agurulaghu": "Agurulaghu — sharir bhari ke halku hoy te fix kare che.",
  "upaghata": "Upaghata — potana sharir ne nuksan pahochadva ni shakti.",
  "paraghata": "Paraghata — bija jivo ne nuksan pahochadva ni shakti.",
  "atap": "Atap — sharir thi tap ane tej nikle che.",
  "udyota": "Udyot — sharir thi prakash ke tej nikle che.",
  "ucchvasa": "Ucchvas — sharir nu shvasan (breathing).",
  "vihayogati_prashasta": "Prashasta vihayogati — akash ma gati ni riti.",
  "vihayogati_aprashasta": "Aprashasta vihayogati — akash ma gati ni riti.",
  "tras": "Trasa — chalta prani, sthavar nathi.",
  "sthavara": "Sthavar — sthir prani, jem vanaspati.",
  "badara": "Badar — motu ane sthul sharir.",
  "sukshma": "Sukshma — nano ane sukshma sharir.",
  "paryapta": "Paryapt — sharir puru ane vikasit che.",
  "aparyapta": "Aparyapt — sharir adhuru ke ochhu vikasit che.",
  "pratyeka": "Pratyek — ek jiv mate alag sharir.",
  "sadharana": "Sadharan — vahli sharir, vahli jivo share kare che.",
  "sthira": "Sthir — sharir sthir ane sthayi che.",
  "asthira": "Asthir — sharir badlata ane asthir che.",
  "shubha": "Shubh — shubh ane shant sharir darshan.",
  "ashubha": "Ashubh — ashubh sharir darshan.",
  "subhaga": "Subhag — manbhav ane sundar sharir.",
  "durbhaga": "Durbhag — ochhu manbhav sharir.",
  "susvara": "Susvar — madhur ane shant awaz.",
  "dusvara": "Dusvar — kathor ane apriya awaz.",
  "adeya": "Adey — sharir prati vishwas ane samman.",
  "anadeya": "Anadey — sharir prati vishwas ochho.",
  "yashah_kirti": "Yashah kirti — yash ane khyati ni prakriti.",
  "ayashah_kirti": "Ayashah kirti — yash ane khyati ni prakriti.",
  "tirthankara": "Tirthankar prakriti — tirthankar banva mate no yogya jiv.",
  "krishna_varna": "Krishna varna — sharir no rang fix kare che.",
  "nila_varna": "Nila varna — sharir no rang fix kare che.",
  "rakta_varna": "Rakta varna — sharir no rang fix kare che.",
  "pita_varna": "Pita varna — sharir no rang fix kare che.",
  "shukla_varna": "Shukla varna — sharir no rang fix kare che.",
  "surabhi_gandha": "Surabhi gandh — sharir ni vaas fix kare che.",
  "durabhi_gandha": "Durabhi gandh — sharir ni vaas fix kare che.",
  "tikta_rasa": "Tikta ras — sharir no svad fix kare che.",
  "katu_rasa": "Katu ras — sharir no svad fix kare che.",
  "kashaya_rasa": "Kashaya ras — sharir no svad fix kare che.",
  "amla_rasa": "Amla ras — sharir no svad fix kare che.",
  "madhura_rasa": "Madhura ras — sharir no svad fix kare che.",
  "karkasha_sparsha": "Karkasha sparsh — sharir nu sparsh fix kare che.",
  "mridu_sparsha": "Mridu sparsh — sharir nu sparsh fix kare che.",
  "guru_sparsha": "Guru sparsh — sharir nu sparsh fix kare che.",
  "laghu_sparsha": "Laghu sparsh — sharir nu sparsh fix kare che.",
  "uchcha_gotra": "Uchcha gotra — uchi kul ane pratishtha.",
  "nicha_gotra": "Nicha gotra — nichi kul ane ochhi pratishtha.",
  "dana_antaraya": "Dana antaraya — daan aapva ma antaray.",
  "labha_antaraya": "Labha antaraya — labh ke punya ma antaray.",
  "bhoga_antaraya": "Bhoga antaraya — potanu bhogva ma antaray.",
  "upabhoga_antaraya": "Upbhog antaraya — upbhog ma antaray.",
  "virya_antaraya": "Virya antaraya — sadhana ni urja ma antaray."
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
