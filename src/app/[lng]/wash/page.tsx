'use client';

import { WashTradingContextApp } from 'src/wash/contexts/useWashTrading';
import { WashPageRootLayout } from 'src/wash/layouts/WashPageRootLayout';
import type { ReactElement } from 'react';

export default function WithRevealContext(): ReactElement {
  return (
    <WashTradingContextApp>
      <WashPageRootLayout />
    </WashTradingContextApp>
  );
}
