import { Widgets } from '@/components/Widgets/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import { MainWidgetContainer } from 'src/components/Containers/MainWidgetContainer';

export default async function Page() {
  return (
    <MainWidgetContainer>
      <Widget starterVariant="advanced" />
      <Widgets />
    </MainWidgetContainer>
  );
}
