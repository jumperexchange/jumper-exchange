'use client';

import { useAccount } from '@jumperexchange/wallet-management';
import { useWidgetEvents, WidgetEvent } from '@jumperexchange/widget';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionableSection } from '@/components/composite/ActionableSection/ActionableSection';
import { CancelOrderFlowModal } from '@/components/composite/CancelOrderFlow/CancelOrderFlow';
import { ModifyOrderFlowModal } from '@/components/composite/ModifyOrderFlow/ModifyOrderFlow';
import { RepeatOrderFlowModal } from '@/components/composite/RepeatOrderFlow/RepeatOrderFlow';
import { useLimitOrders } from '@/hooks/useLimitOrders';
import { getQueryKey } from '@/utils/queries/getQueryKey';
import { ORDERS_PAGE_SIZE } from './constants';
import { OrdersTable } from './OrdersTable';

interface OrdersSectionProps {
  isSidePanelExpanded: boolean;
  action: ReactNode;
}

export const OrdersSection = ({
  isSidePanelExpanded,
  action,
}: OrdersSectionProps) => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const [page, setPage] = useState(0);
  const { data, isLoading } = useLimitOrders(page);
  const widgetEvents = useWidgetEvents();
  const queryClient = useQueryClient();

  // Refresh the order list shortly after a limit order is placed. The delay
  // gives the backend time to index the newly created order before we refetch.
  useEffect(() => {
    const onRouteExecutionCompleted = () => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [getQueryKey('limit-orders')],
        });
      }, 1500);
    };
    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );
    return () => {
      widgetEvents.off(
        WidgetEvent.RouteExecutionCompleted,
        onRouteExecutionCompleted,
      );
    };
  }, [widgetEvents, queryClient]);

  const shouldShow = !!account?.address && !isLoading && !!data?.total;

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
              action={action}
              sx={{ flexShrink: 0 }}
            >
              <OrdersTable
                orders={data?.orders ?? []}
                total={data?.total ?? 0}
                pageSize={data?.pageSize ?? ORDERS_PAGE_SIZE}
                pageCount={data?.pageCount ?? 0}
                page={page}
                setPage={setPage}
                isExpanded={isSidePanelExpanded}
                stickyHeader
              />
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
