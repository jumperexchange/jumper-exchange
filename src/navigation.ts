import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales as availableLocales } from './i18n';

export const locales = availableLocales;
export const localePrefix = 'as-needed';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
