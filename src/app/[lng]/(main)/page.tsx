import { getCookies } from '@/app/lib/getCookies';
import { Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import App from '../../ui/app/App';
import { FlexibleFee } from 'src/components/FlexibleFee/FlexibleFee';

export default function Page() {
  const variant = 'default'; // exchange
  const { activeThemeMode, activeTheme, welcomeScreenClosed } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';
  return (
    <App
      starterVariant={variant}
      isWelcomeScreenClosed={isWelcomeScreenClosed}
      activeTheme={activeTheme}
    >
      <Widget
        activeTheme={activeTheme}
        starterVariant={variant}
        activeThemeMode={activeThemeMode}
        isWelcomeScreenClosed={isWelcomeScreenClosed}
      />
      <Widgets
        closedWelcomeScreen={isWelcomeScreenClosed}
        widgetVariant={variant}
      />
    </App>
  );
}
