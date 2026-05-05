import { notFound } from 'next/navigation';
import { MainWidgetContainer } from 'src/components/Containers/MainWidgetContainer';
import { isAnonymousSwapEnabled } from '@/app/lib/getFeatureFlag';
import { Widget } from '@/components/Widgets/Widget';
import { Widgets } from '@/components/Widgets/Widgets';

const Page = async () => {
  const variant = 'private';

  if (!isAnonymousSwapEnabled()) {
    return notFound();
  }

  return (
    <MainWidgetContainer>
      <Widget starterVariant={variant} />
      <Widgets widgetVariant={variant} />
    </MainWidgetContainer>
  );
};

export default Page;
