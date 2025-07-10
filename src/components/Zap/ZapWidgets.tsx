'use client';

import { FC } from 'react';
import { CustomInformation } from 'src/types/loyaltyPass';
import { ZapWidgetTabs } from './ZapWidgetTabs';
import { ZapWidget } from './ZapWidget';

interface ZapWidgetsProps {
  detailInformation?: CustomInformation;
}
export const ZapWidgets: FC<ZapWidgetsProps> = ({ detailInformation }) => {
  return (
    <ZapWidgetTabs
      renderChildren={(activeTab) => {
        if (activeTab === 0) {
          return (
            <ZapWidget customInformation={detailInformation} type="deposit" />
          );
        }
        return (
          <ZapWidget customInformation={detailInformation} type="withdraw" />
        );
      }}
    />
  );
};
