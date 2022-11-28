// config
import { defaultSettings, localStorageKey } from '../config';

// ----------------------------------------------------------------------

export const getSettings = (cookies: any) => {
  const themeMode =
    getData(cookies[localStorageKey.themeMode]) || defaultSettings.themeMode;

  return {
    themeMode,
  };
};

// ----------------------------------------------------------------------

const getData = (value: string) => {
  if (value === 'true' || value === 'false') {
    return JSON.parse(value);
  }
  if (value === 'undefined' || !value) {
    return '';
  }
  return value;
};
