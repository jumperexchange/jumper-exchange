'use client';

import { AnimatePresence, motion } from 'motion/react';
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
      <AnimatePresence mode="popLayout">
        {isLoading && (
          <motion.div
            key="market-price-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <MarketPriceSectionSkeleton />
          </motion.div>
        )}
      </AnimatePresence>
    </ActionableSection>
  );
};
