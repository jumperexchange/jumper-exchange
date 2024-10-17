import { getCookies } from '@/app/lib/getCookies';
import { Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';

const Page = () => {
  const variant = 'refuel';
  const { activeThemeMode } = getCookies();
  return (
    <>
      <Widget starterVariant={variant} activeThemeMode={activeThemeMode} />
      <Widgets widgetVariant={variant} />
    </>
  );
};

export default Page;
