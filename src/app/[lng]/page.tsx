import { cookies } from 'next/headers';
// import type { Viewport } from 'next';
import type { ThemeModesSupported } from 'src/types/settings';
import App from '../ui/app/App';

// export const viewport: Viewport = {
//   width: 'device-width',
//   initialScale: 1,
// };

export const dynamic = 'force-dynamic';

export default function Page() {
  const activeTheme = cookies().get('theme')?.value as
    | ThemeModesSupported
    | undefined;
  const welcomeScreenClosed = cookies().get('welcomeScreenClosed')?.value as
    | 'false'
    | 'true'
    | undefined;

  return (
    <App
      starterVariant="default"
      activeTheme={activeTheme}
      welcomeScreenClosedCookie={welcomeScreenClosed === 'true' ? true : false}
    />
  );
}
