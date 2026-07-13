'use client';

import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Widget as BaseWidget } from '@/components/Widgets/variants/base/Widget';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import { useRepeatOrderFlowStore } from '@/stores/limitOrderFlow/RepeatOrderFlowStore';
import type { LimitOrdersWidgetContext } from '@/components/Widgets/variants/widgetConfig/types';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { useTheme } from '@mui/material';
import { WidgetTrackingProvider } from '@/providers/WidgetTrackingProvider';

export const RepeatOrderFlowModal = () => {
  const { t } = useTranslation();
  const { toAmount } = useTokenAmountInput();
  const theme = useTheme();
  const { isModalOpen, selectedOrder, closeModal } = useRepeatOrderFlowStore(
    (state) => state,
  );

  const context = useMemo((): LimitOrdersWidgetContext | null => {
    if (!selectedOrder) {
      return null;
    }
    return {
      overrideHeader: t('limitOrders.repeatModal.title'),
      theme: {
        container: {
          maxHeight: 'calc(100vh - 6rem)',
          minWidth: 'min(100vw, 360px)',
          maxWidth: 400,
          borderRadius: `${theme.shape.cardBorderRadiusLarge}px`,
          [theme.breakpoints.up('sm')]: {
            maxHeight: 'calc(100vh - 6rem)',
            minWidth: 400,
          },
        },
      },
      formData: {
        sourceChain: {
          chainId: selectedOrder.fromToken.chainId.toString(),
          chainKey: '',
        },
        sourceToken: {
          tokenAddress: selectedOrder.fromToken.address,
          tokenSymbol: selectedOrder.fromToken.symbol,
        },
        destinationChain: {
          chainId: selectedOrder.toToken.chainId.toString(),
          chainKey: '',
        },
        destinationToken: {
          tokenAddress: selectedOrder.toToken.address,
          tokenSymbol: selectedOrder.toToken.symbol,
        },
        fromAmount: toAmount(
          BigInt(selectedOrder.fromAmount),
          selectedOrder.fromToken.decimals,
        ),
      },
    };
  }, [selectedOrder, toAmount, t, theme]);

  useEffect(() => {
    return () => {
      closeModal();
    };
  }, [closeModal]);

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
