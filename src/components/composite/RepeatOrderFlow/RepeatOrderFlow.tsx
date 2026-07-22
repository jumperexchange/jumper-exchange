'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Widget as BaseWidget } from '@/components/Widgets/variants/base/Widget';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import { useRepeatOrderFlowStore } from '@/stores/limitOrderFlow/RepeatOrderFlowStore';
import type { LimitOrdersWidgetContext } from '@/components/Widgets/variants/widgetConfig/types';
import {
  buildOrderFlowFormData,
  getOrderFlowWidgetContainerStyle,
} from '@/components/Widgets/variants/widgetConfig/utils';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { useTheme } from '@mui/material';
import { WidgetTrackingProvider } from '@/providers/WidgetTrackingProvider';
import { useAccount } from '@jumperexchange/wallet-management';

export const RepeatOrderFlowModal = () => {
  const { t } = useTranslation();
  const { toAmount } = useTokenAmountInput();
  const theme = useTheme();
  const { isModalOpen, selectedOrder, closeModal } = useRepeatOrderFlowStore(
    (state) => state,
  );
  const { account } = useAccount();
  const address = account.address;

  const context = useMemo((): LimitOrdersWidgetContext | null => {
    if (!selectedOrder) {
      return null;
    }
    return {
      overrideHeader: t('limitOrders.repeatModal.title'),
      allowExchange: selectedOrder.tool,
      theme: {
        container: getOrderFlowWidgetContainerStyle(theme),
      },
      formData: buildOrderFlowFormData(selectedOrder, toAmount),
    };
  }, [selectedOrder, toAmount, t, theme]);

  useEffect(() => {
    return () => {
      closeModal();
    };
  }, [closeModal]);

  const previousAddressRef = useRef(address);
  useEffect(() => {
    if (previousAddressRef.current === address) {
      return;
    }
    previousAddressRef.current = address;
    closeModal();
  }, [address, closeModal]);

  if (!context || !selectedOrder) {
    return null;
  }

  return (
    <ModalContainer isOpen={isModalOpen} onClose={closeModal}>
      <WidgetTrackingProvider
        variant="limit"
        initialSourceToken={{
          chainId: selectedOrder.fromToken.chainId,
          tokenAddress: selectedOrder.fromToken.address,
        }}
        initialDestinationToken={{
          chainId: selectedOrder.toToken.chainId,
          tokenAddress: selectedOrder.toToken.address,
        }}
      >
        <BaseWidget type="limit" ctx={context} />
      </WidgetTrackingProvider>
    </ModalContainer>
  );
};
