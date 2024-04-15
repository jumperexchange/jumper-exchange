import { cookies } from 'next/headers';
import type { ThemeModesSupported } from 'src/types/settings';

export function getCookies() {
  const cookieHandler = cookies();

  const activeTheme = cookieHandler.get('theme')?.value as
    | ThemeModesSupported
    | undefined;
  const welcomeScreenClosed = cookieHandler.get('welcomeScreenClosed')
    ?.value as 'false' | 'true' | undefined;

  return {
    activeTheme,
    welcomeScreenClosed,
  };
}
