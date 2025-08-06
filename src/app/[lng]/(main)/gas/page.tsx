import { Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import { MainWidgetContainer } from 'src/components/Containers/MainWidgetContainer';

const Page = async () => {
  const variant = 'refuel';
  return (
    <MainWidgetContainer>
      <Widget starterVariant={variant} />
      <Widgets widgetVariant={variant} />
    </MainWidgetContainer>
  );
};

export default Page;
