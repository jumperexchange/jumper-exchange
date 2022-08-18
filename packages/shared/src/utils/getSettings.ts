// next
import { NextApiRequestCookies } from "next/dist/server/api-utils";
// config
import { cookiesKey, defaultSettings } from "@transferto/shared/config";

// ----------------------------------------------------------------------

export const getSettings = (cookies: NextApiRequestCookies) => {
  const themeMode =
    getData(cookies[cookiesKey.themeMode]) || defaultSettings.themeMode;

  return {
    themeMode,
  };
};

// ----------------------------------------------------------------------

const getData = (value: string) => {
  if (value === "true" || value === "false") {
    return JSON.parse(value);
  }
  if (value === "undefined" || !value) {
    return "";
  }
  return value;
};
