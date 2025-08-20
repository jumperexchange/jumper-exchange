import { usePathname } from 'next/navigation';
import { locales } from 'src/i18n/i18next-locales';

export const usePathnameWithoutLocale = () => {
  const pathname = usePathname();

  const segments = pathname.split('/');
  if (segments.length > 1 && locales.includes(segments[1])) {
    return '/' + segments.slice(2).join('/') || '/';
  }

  return pathname;
};
