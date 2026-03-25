import { match } from '@formatjs/intl-localematcher';
import type { Config } from 'next-i18n-router/dist/types';
import type { NextRequest } from 'next/server';
import Negotiator from 'negotiator';

export const lookupI18nLocaleDetector = (
  request: NextRequest,
  config: Config,
): string => {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });
  try {
    const languages = new Negotiator({
      headers: negotiatorHeaders,
    }).languages();

    const primaryLanguage = languages[0];
    if (!primaryLanguage || primaryLanguage === '*') {
      return config.defaultLocale;
    }

    return match([primaryLanguage], [...config.locales], config.defaultLocale, {
      algorithm: 'lookup',
    });
  } catch {
    return config.defaultLocale;
  }
};
