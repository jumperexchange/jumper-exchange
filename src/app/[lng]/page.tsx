import { getCookies } from '../lib/getCookies';
import App from '../ui/app/App';

export const dynamic = 'force-dynamic';

export default function Page() {
  const { activeTheme, welcomeScreenClosed } = getCookies();

  return (
    <App
      starterVariant="default"
      activeTheme={activeTheme}
      welcomeScreenClosedCookie={welcomeScreenClosed === 'true' ? true : false}
    />
  );
}
