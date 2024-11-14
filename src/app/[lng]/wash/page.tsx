'use client';

import type { ReactElement } from 'react';
import { WashTradingContextApp } from '../../../wash/contexts/useWashTrading';
import { WashPageRootLayout } from '../../../wash/layouts/WashPageRootLayout';

export default function WithRevealContext(): ReactElement {
  return (
    <WashTradingContextApp>
      <WashPageRootLayout />
    </WashTradingContextApp>
  );
}
