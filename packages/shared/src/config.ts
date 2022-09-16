// @mui
import { deDE, enUS } from "@mui/material/locale";
import { SettingsValueProps } from "./types/settings";

export const cookiesExpires = 3;

export const cookiesKey = {
  themeMode: "themeMode",
};

export const defaultSettings: SettingsValueProps = {
  themeMode: "light",
};

// MULTI LANGUAGES
// Please remove `localStorage` when you change settings.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: "English",
    value: "en",
    systemValue: enUS,
    // icon: "/assets/icons/flags/ic_flag_en.svg",
  },
  {
    label: "Deutsch",
    value: "de",
    systemValue: deDE,
    // icon: "/assets/icons/flags/ic_flag_de.svg",
  },
];

export const defaultLang = allLangs[0]; // English
