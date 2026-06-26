'use client';

import { useTranslation } from 'react-i18next';
import { ActionableSection } from '@/components/composite/ActionableSection/ActionableSection';
import type { ReactNode } from 'react';
import { useLimitOrders } from '@/hooks/useLimitOrders';
import { MarketPriceSectionSkeleton } from './MarketPriceSectionSkeleton';

interface MarketPriceSectionProps {
  action: ReactNode;
}

export const MarketPriceSection = ({ action }: MarketPriceSectionProps) => {
  const { t } = useTranslation();
  const { isLoading } = useLimitOrders();

  return (
    <ActionableSection
      title={t('limitOrders.marketPrice')}
      action={action}
      sx={{ flexShrink: 0 }}
    >
      {isLoading ? <MarketPriceSectionSkeleton /> : null}
    </ActionableSection>
  );
};
