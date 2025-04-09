import { OnRamper } from '@/components/OnRamper';
import { Widgets } from '@/components/Widgets';

const Page = async () => {
  const variant = 'buy';

  return (
    <>
      <OnRamper activeTheme={"default"} />
      <Widgets widgetVariant={variant} />
    </>
  );
};

export default Page;
