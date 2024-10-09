import { getCookies } from '@/app/lib/getCookies';
import { OnRamper } from '@/components/OnRamper';
import { Widgets } from '@/components/Widgets';

const Page = () => {
  const variant = 'buy';
  const { activeTheme } = getCookies();

  return (
    <>
      <OnRamper activeTheme={activeTheme} />
      <Widgets widgetVariant={variant} />
    </>
  );
};

export default Page;
