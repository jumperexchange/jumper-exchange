import { fallbackLng } from '@/i18n/i18next-settings';

export const replaceLocaleInUrl = (pathname: string, locale: string): void => {
  const newPath = locale === fallbackLng ? pathname : `/${locale}${pathname}`;
  window.history.replaceState(
    null,
    '',
    newPath + window.location.search + window.location.hash,
  );
};
