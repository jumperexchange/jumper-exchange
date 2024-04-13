import { cookies } from 'next/headers';
import App from 'src/app/ui/app/App';
import type { ThemeModesSupported } from 'src/types/settings';

export const dynamic = 'force-dynamic';

const Page = () => {
  const activeTheme = cookies().get('theme')?.value as
    | ThemeModesSupported
    | undefined;
  const welcomeScreenClosed = cookies().get('welcomeScreenClosed')?.value as
    | 'false'
    | 'true'
    | undefined;

  return (
    <App
      starterVariant="buy"
      activeTheme={activeTheme}
      welcomeScreenClosedCookie={welcomeScreenClosed === 'true' ? true : false}
    />
  );
};

export default Page;
