import { getCookies } from '@/app/lib/getCookies';
import App from '@/app/ui/app/App';

export const dynamic = 'force-dynamic';

const Page = () => {
  const { activeTheme } = getCookies();

  return (
    <App
      starterVariant="default"
      activeTheme={activeTheme}
      welcomeScreenClosedCookie={true}
    />
  );
};

export default Page;
