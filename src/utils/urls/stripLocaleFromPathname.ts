import { locales } from '@/i18n/i18next-locales';

export const stripLocaleFromPathname = (pathname: string): string => {
  const segments = pathname.split('/');
  if (segments.length > 1 && locales.includes(segments[1])) {
    return '/' + segments.slice(2).join('/') || '/';
  }
  return pathname;
};
