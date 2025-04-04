import type { ThemeMode } from '@/types/theme';
import { cookies } from 'next/headers';

export async function getCookies() {
  const cookieHandler = await cookies();

  const activeThemeMode = cookieHandler.get('themeMode')?.value as
    | ThemeMode
    | undefined;
  const activeTheme = cookieHandler.get('theme')?.value as string | undefined;

  return {
    activeTheme,
    activeThemeMode,
  };
}
