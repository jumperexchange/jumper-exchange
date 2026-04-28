import { Widgets } from '@/components/Widgets/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import { MainWidgetContainer } from 'src/components/Containers/MainWidgetContainer';

export const revalidate = 5 * 60; // Revalidate every 5 minutes

export default async function Page() {
  const variant = 'default'; // exchange
  return (
    <MainWidgetContainer>
      <Widget activeTheme={variant} starterVariant={variant} />
      <Widgets widgetVariant={variant} />
    </MainWidgetContainer>
  );
}
