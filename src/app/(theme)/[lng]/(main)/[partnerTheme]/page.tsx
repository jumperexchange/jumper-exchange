import App from '../../../ui/app/App';
import { WidgetContainer, Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import { getCookies } from '@/app/lib/getCookies';

export const dynamicParams = false;

export async function generateStaticParams() {
  const apiUrl = process.env.NEXT_PUBLIC_LIFI_API_URL;
  const response = await fetch(`${apiUrl}/tools`);
  const result = await response.json();
  const bridges = result?.bridges;
  const exchanges = result?.exchanges;
  let filteredBridges = [];
  let filteredDexes = [];
  if (bridges) {
    filteredBridges = Object.values(bridges).map((elem: any) => elem.key);
  }
  if (exchanges) {
    filteredDexes = Object.values(exchanges).map((elem: any) => elem.key);
  }
  const res = filteredBridges.concat(filteredDexes);
  const path = res.map((partnerTheme) => ({ partnerTheme }));
  const customPath = [{ partnerTheme: 'memecoins' }];
  return [...path, ...customPath];
}

export default function Page() {
  const variant = 'default'; // exchange
  const { activeThemeMode, welcomeScreenClosed } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';

  return (
    <App starterVariant={variant} isWelcomeScreenClosed={isWelcomeScreenClosed}>
      <WidgetContainer welcomeScreenClosed={true}>
        <Widgets
          closedWelcomeScreen={isWelcomeScreenClosed}
          widgetVariant={variant}
        />
        <Widget starterVariant={variant} activeThemeMode={activeThemeMode} />
      </WidgetContainer>
    </App>
  );
}
