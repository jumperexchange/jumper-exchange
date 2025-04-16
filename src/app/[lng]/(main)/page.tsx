import { Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';

export default async function Page() {
  const variant = 'default'; // exchange
  return (
    <>
      <Widget
        activeTheme={variant}
        starterVariant={variant}
      />
      <Widgets widgetVariant={variant} />
    </>
  );
}
