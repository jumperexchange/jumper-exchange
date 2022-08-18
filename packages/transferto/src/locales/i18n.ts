import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
// config
import { defaultLang } from "../../../shared/src/config";
//
import deLocales from "./de";
import enLocales from "./en";
// ----------------------------------------------------------------------

let lng = defaultLang.value;

if (typeof window !== "undefined") {
  lng = localStorage.getItem("i18nextLng") || defaultLang.value;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translations: enLocales },
      de: { translations: deLocales },
      // fr: { translations: frLocales },
    },
    lng,
    fallbackLng: defaultLang.value,
    debug: false,
    ns: ["translations"],
    defaultNS: "translations",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
