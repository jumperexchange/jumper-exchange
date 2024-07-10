import App from '../../ui/app/App';
import { WidgetContainer, Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import { getCookies } from '@/app/lib/getCookies';

export default function Page() {
  const variant = 'default'; // exchange
  const { activeThemeMode, welcomeScreenClosed } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';

  return (
    <App starterVariant={variant} isWelcomeScreenClosed={isWelcomeScreenClosed}>
      <WidgetContainer welcomeScreenClosed={true}>
        <Widgets
          activeThemeMode={activeThemeMode}
          closedWelcomeScreen={isWelcomeScreenClosed}
          widgetVariant={variant}
        />
        <Widget starterVariant={variant} activeThemeMode={activeThemeMode} />
      </WidgetContainer>
    </App>
  );
}
