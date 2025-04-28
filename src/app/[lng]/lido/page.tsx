import { WidgetContainer, Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import App from '../../ui/app/App';

export default async function Page() {
  const variant = 'default'; // exchange
  return (
    <App>
      <WidgetContainer welcomeScreenClosed={true}>
        <Widget starterVariant={variant} />
        <Widgets widgetVariant={variant} />
      </WidgetContainer>
    </App>
  );
}
