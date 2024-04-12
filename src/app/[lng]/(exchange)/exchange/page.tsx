import { cookies } from 'next/headers';
import App from 'src/app/ui/app/App';
import type { ThemeModesSupported } from 'src/types/settings';

const Page = () => {
  const activeTheme = cookies().get('theme')?.value as
    | ThemeModesSupported
    | undefined;

  return <App starterVariant="default" activeTheme={activeTheme} />;
};

export default Page;
