'use client';

import { ActionableSection } from '@/components/composite/ActionableSection/ActionableSection';
import type { ReactNode } from 'react';

interface MarketPriceSectionProps {
  action: ReactNode;
}

export const MarketPriceSection = ({ action }: MarketPriceSectionProps) => {
  return (
    <ActionableSection
      title="Market Price"
      action={action}
      sx={{ flexShrink: 0 }}
    />
  );
};
