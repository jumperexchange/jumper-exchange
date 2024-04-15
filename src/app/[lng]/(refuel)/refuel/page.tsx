import { getCookies } from '@/app/lib/getCookies';
import App from '@/app/ui/app/App';

const Page = async () => {
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
