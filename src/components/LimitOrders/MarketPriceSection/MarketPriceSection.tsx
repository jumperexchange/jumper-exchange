'use client';

import { useTranslation } from 'react-i18next';
import { ActionableSection } from '@/components/composite/ActionableSection/ActionableSection';
import type { ReactNode } from 'react';

interface MarketPriceSectionProps {
  action: ReactNode;
}

export const MarketPriceSection = ({ action }: MarketPriceSectionProps) => {
  const { t } = useTranslation();
  return (
    <ActionableSection
      title={t('limitOrders.marketPrice')}
      action={action}
      sx={{ flexShrink: 0 }}
    />
  );
};
