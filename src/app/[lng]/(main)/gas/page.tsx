import { Widgets } from '@/components/Widgets';
import { BouncedWidget } from '@/jumperFlags/bouncer/BouncedWidget';
import { MainWidgetContainer } from 'src/components/Containers/MainWidgetContainer';

const Page = async () => {
  const variant = 'refuel';
  return (
    <MainWidgetContainer>
      <BouncedWidget starterVariant={variant} />
      <Widgets widgetVariant={variant} />
    </MainWidgetContainer>
  );
};

export default Page;
