import { getCookies } from '@/app/lib/getCookies';
import { WidgetContainer, Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import App from '../../ui/app/App';

export default function Page() {
  const variant = 'default'; // exchange
  const { activeThemeMode, activeTheme, welcomeScreenClosed } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';
  console.log('activeTheme', activeTheme);
  return (
    <App
      starterVariant={variant}
      isWelcomeScreenClosed={isWelcomeScreenClosed}
      activeTheme={activeTheme}
    >
      <WidgetContainer welcomeScreenClosed={isWelcomeScreenClosed}>
        <Widget
          starterVariant={variant}
          activeThemeMode={activeThemeMode}
          isWelcomeScreenClosed={isWelcomeScreenClosed}
        />
        <Widgets
          closedWelcomeScreen={isWelcomeScreenClosed}
          widgetVariant={variant}
        />
      </WidgetContainer>
    </App>
  );
}
