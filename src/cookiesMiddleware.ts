import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

const defaultTheme = 'jumper';

export function cookiesMiddleware(response: NextResponse) {
  const cookiesHandler = cookies();
  const themeCookie = cookiesHandler.get('theme');
  const themeModeCookie = cookiesHandler.get('themeMode');

  // Cookies already migrated
  if (themeModeCookie) {
    return;
  }

  // Setting default theme, would be good to use a const
  if (!themeCookie) {
    response.cookies.set('theme', defaultTheme);
    // cookiesHandler.set('themeMode', 'jumper');
  }

  // Migrating themeMode to the correct cookie
  if (['dark', 'light', 'system'].includes(themeCookie?.value as string)) {
    response.cookies.set('themeMode', themeCookie?.value as string);
    response.cookies.set('theme', defaultTheme);
  }

  return response;
}
