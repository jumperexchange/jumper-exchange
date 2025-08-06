import { Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import { MainWidgetContainer } from 'src/components/Containers/MainWidgetContainer';

export default async function Page() {
  const variant = 'default'; // exchange
  return (
    <MainWidgetContainer>
      <Widget activeTheme={variant} starterVariant={variant} />
      <Widgets widgetVariant={variant} />
    </MainWidgetContainer>
  );
}
