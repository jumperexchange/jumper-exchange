import { MainWidgetContainer } from 'src/components/Containers/MainWidgetContainer';
import { Widget } from '@/components/Widgets/Widget';
import { Widgets } from '@/components/Widgets/Widgets';

const Page = async () => {
  const variant = 'private';
  const allowedExchanges = ['houdini'];
  const allowBridges: string[] = ['houdini'];
  return (
    <MainWidgetContainer>
      <Widget
        starterVariant={variant}
        allowExchanges={allowedExchanges}
        allowBridges={allowBridges}
      />
      <Widgets widgetVariant={variant} />
    </MainWidgetContainer>
  );
};

export default Page;
