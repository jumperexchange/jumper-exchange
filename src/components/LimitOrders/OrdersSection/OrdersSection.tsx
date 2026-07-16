'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import { ActionableSection } from '@/components/composite/ActionableSection/ActionableSection';
import { CancelOrderFlowModal } from '@/components/composite/CancelOrderFlow/CancelOrderFlow';
import { ModifyOrderFlowModal } from '@/components/composite/ModifyOrderFlow/ModifyOrderFlow';
import { RepeatOrderFlowModal } from '@/components/composite/RepeatOrderFlow/RepeatOrderFlow';
import { OrdersEmptyState } from './OrdersEmptyState';
import { OrdersTable } from './OrdersTable';
import { useLimitOrders } from '@/hooks/useLimitOrders';
import { useOrdersFilters } from './hooks';
import { Select } from '@/components/core/form/Select/Select';
import {
  SelectSize,
  SelectVariant,
} from '@/components/core/form/Select/Select.types';

interface OrdersSectionProps {
  isSidePanelExpanded: boolean;
  action: ReactNode;
}

export const OrdersSection = ({
  isSidePanelExpanded,
  action,
}: OrdersSectionProps) => {
  const { t } = useTranslation();

  const {
    selectedAddress,
    selectedProtocol,
    addressOptions,
    protocolOptions,
    showWalletSelect,
    setAddressFilter,
    setProtocolFilter,
  } = useOrdersFilters();

  const {
    orders,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    isLoading,
  } = useLimitOrders(selectedAddress, selectedProtocol);

  const shouldShow = !!selectedAddress && !!selectedProtocol;

  return (
    <>
      <AnimatePresence mode="popLayout">
        {shouldShow && (
          <motion.div
            key="orders-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ActionableSection
              title={t('limitOrders.orders')}
              filters={
                <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                  {showWalletSelect && (
                    <Select
                      options={addressOptions}
                      value={selectedAddress ?? ''}
                      onChange={setAddressFilter}
                      label={t('limitOrders.walletLabel')}
                      variant={SelectVariant.Single}
                      size={SelectSize.Small}
                    />
                  )}
                  <Select
                    options={protocolOptions}
                    value={selectedProtocol ?? ''}
                    onChange={setProtocolFilter}
                    label={t('limitOrders.protocolLabel')}
                    variant={SelectVariant.Single}
                    size={SelectSize.Small}
                  />
                </Stack>
              }
              action={action}
              sx={{ flexShrink: 0 }}
            >
              <AnimatePresence mode="wait">
                {isLoading || orders.length ? (
                  <motion.div
                    key="orders-table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <OrdersTable
                      orders={orders}
                      hasMore={hasNextPage}
                      canGoPrev={hasPreviousPage}
                      onNext={goToNextPage}
                      onPrev={goToPreviousPage}
                      isLoading={isLoading}
                      isExpanded={isSidePanelExpanded}
                      stickyHeader
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="orders-empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <OrdersEmptyState />
                  </motion.div>
                )}
              </AnimatePresence>
            </ActionableSection>
          </motion.div>
        )}
      </AnimatePresence>
      <CancelOrderFlowModal />
      <ModifyOrderFlowModal />
      <RepeatOrderFlowModal />
    </>
  );
};
