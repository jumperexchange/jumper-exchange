import { getCookies } from '@/app/lib/getCookies';
import { Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';

export default async function Page() {
  const variant = 'default'; // exchange
  const { activeThemeMode, activeTheme } = await getCookies();
  return (
    <>
      <Widget
        activeTheme={activeTheme}
        starterVariant={variant}
        activeThemeMode={activeThemeMode}
      />
      <Widgets widgetVariant={variant} />
    </>
  );
}
