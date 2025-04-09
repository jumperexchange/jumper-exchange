import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import { WidgetContainer, Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import App from '../../ui/app/App';

export async function generateStaticParams() {
  const partnerThemes = await getPartnerThemes();

  let customPath = [
    { partnerTheme: 'memecoins' },
    ...partnerThemes.data.map((d) => ({ partnerTheme: d?.uid })),
  ];

  return customPath;
}

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
