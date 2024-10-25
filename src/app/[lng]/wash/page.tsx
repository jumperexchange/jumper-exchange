'use client';

import type { ReactElement } from 'react';
import { WashTradingContextApp } from 'src/wash/contexts/useWashTrading';
import { WashPageRootLayout } from 'src/wash/layouts/WashPageRootLayout';

export default function WithRevealContext(): ReactElement {
  return (
    <WashTradingContextApp>
      <WashPageRootLayout />
    </WashTradingContextApp>
  );
}
