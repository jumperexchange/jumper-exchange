import { Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';

const Page = async () => {
  const variant = 'refuel';
  return (
    <>
      <Widget starterVariant={variant} />
      <Widgets widgetVariant={variant} />
    </>
  );
};

export default Page;
