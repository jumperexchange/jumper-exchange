import { getCookies } from 'src/app/lib/getCookies';
import App from 'src/app/ui/app/App';

export const dynamic = 'force-dynamic';

const Page = () => {
  const { activeTheme, welcomeScreenClosed } = getCookies();

  return (
    <App
      starterVariant="refuel"
      activeTheme={activeTheme}
      welcomeScreenClosedCookie={welcomeScreenClosed === 'true' ? true : false}
    />
  );
};

export default Page;
