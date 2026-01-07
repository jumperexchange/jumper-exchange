'use client';

import { Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import { BlockedAccountCallout } from '@/jumperFlags/bouncer/BlockedAccountCallout';
import { BouncedWidget } from '@/jumperFlags/bouncer/BouncedWidget';
import { MainWidgetContainer } from 'src/components/Containers/MainWidgetContainer';

export default function Page() {
  const variant = 'default'; // exchange
  return (
    <MainWidgetContainer>
      <BouncedWidget activeTheme={variant} starterVariant={variant} />
      <Widgets widgetVariant={variant} />
    </MainWidgetContainer>
  );
}
