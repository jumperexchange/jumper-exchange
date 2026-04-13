import { MainWidgetContainer } from 'src/components/Containers/MainWidgetContainer';
import { Widget } from '@/components/Widgets/Widget';
import { Widgets } from '@/components/Widgets/Widgets';

const Page = async () => {
  const variant = 'private';
  return (
    <MainWidgetContainer>
      <Widget starterVariant={variant} />
      <Widgets widgetVariant={variant} />
    </MainWidgetContainer>
  );
};

export default Page;
