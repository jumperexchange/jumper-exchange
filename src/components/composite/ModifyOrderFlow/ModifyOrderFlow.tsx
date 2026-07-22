'use client';

import { HeightAnimatedContainer } from '@jumperexchange/shared-ui/components';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Widget as BaseWidget } from '@/components/Widgets/variants/base/Widget';
import { WidgetTrackingProvider } from '@/providers/WidgetTrackingProvider';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { StatusBottomSheet } from '@/components/composite/StatusBottomSheet/StatusBottomSheet';
import { useCancelOrder } from '@/components/composite/CancelOrderFlow/hooks/useCancelOrder';
import { useCancelOrderStatusSheet } from '@/components/composite/CancelOrderFlow/hooks/useCancelOrderStatusSheet';
import { Button } from '@/components/core/buttons/Button/Button';
import { Variant } from '@/components/core/buttons/types';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import { useModifyOrderFlowStore } from '@/stores/limitOrderFlow/ModifyOrderFlowStore';
import type { LimitOrdersWidgetContext } from '@/components/Widgets/variants/widgetConfig/types';
import {
  buildOrderFlowFormData,
  getOrderFlowWidgetContainerStyle,
} from '@/components/Widgets/variants/widgetConfig/utils';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { useTheme } from '@mui/material';
import { useAccount } from '@jumperexchange/wallet-management';

const CONTAINER_ID = 'modify-order-modal';
const BOTTOM_SHEET_TOP_OFFSET = 24;
const ANIMATION_DURATION_SECONDS = 0.3;

type Step = 'cancel' | 'place';

export const ModifyOrderFlowModal = () => {
  const { t } = useTranslation();
  const { toAmount } = useTokenAmountInput();
  const theme = useTheme();
  const { isModalOpen, selectedOrder, closeModal } = useModifyOrderFlowStore(
    (state) => state,
  );
  const { account } = useAccount();
  const address = account.address;

  const [step, setStep] = useState<Step>('cancel');

  const { cancelOrderAsync, result, isPending, isSuccess, isError, reset } =
    useCancelOrder();

  useEffect(() => {
    if (isSuccess) {
      setStep('place');
    }
  }, [isSuccess]);

  const handleClose = () => {
    reset();
    setStep('cancel');
    closeModal();
  };

  const previousAddressRef = useRef(address);
  useEffect(() => {
    if (previousAddressRef.current === address) {
      return;
    }
    previousAddressRef.current = address;
    reset();
    setStep('cancel');
    closeModal();
  }, [address, reset, closeModal]);

  const handleConfirm = () => {
    if (!selectedOrder) {
      return;
    }
    cancelOrderAsync(selectedOrder).catch(() => {});
  };

  const statusSheet = useCancelOrderStatusSheet({
    isSuccess,
    isError,
    result,
    onRetry: handleConfirm,
    onDone: () => setStep('place'),
    onCloseError: handleClose,
  });

  const context = useMemo((): LimitOrdersWidgetContext | null => {
    if (!selectedOrder) {
      return null;
    }
    return {
      overrideHeader: t('limitOrders.modifyModal.title'),
      disabledUI: { fromToken: true, toToken: true },
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

  if (!selectedOrder) {
    return null;
  }

  if (step === 'place' && context) {
    return (
      <ModalContainer isOpen={isModalOpen} onClose={handleClose}>
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
  }

  return (
    <ModalContainer isOpen={isModalOpen} onClose={handleClose}>
      <div id={CONTAINER_ID} style={{ position: 'relative' }}>
        <HeightAnimatedContainer
          isOpen={statusSheet.isOpen}
          offsetHeight={BOTTOM_SHEET_TOP_OFFSET}
          animationDuration={ANIMATION_DURATION_SECONDS}
          defaultHeight="auto"
        >
          {({ onHeightChange, motionProps }) => (
            <motion.div {...motionProps} style={{ x: 0, y: 0 }}>
              <SectionCard sx={{ width: 'min(90vw, 400px)' }}>
                <Stack sx={{ gap: 2 }}>
                  <Typography variant="titleSmall">
                    {t('limitOrders.modifyModal.cancelStep.title')}
                  </Typography>
                  <Typography variant="bodySmall" color="textSecondary">
                    {t('limitOrders.modifyModal.cancelStep.description')}
                  </Typography>
                  <Stack direction="row" sx={{ gap: 1.5 }}>
                    <Button
                      variant={Variant.AlphaDark}
                      sx={{ flex: 1 }}
                      onClick={handleClose}
                      disabled={isPending}
                    >
                      {t('limitOrders.cancelModal.keepOrder')}
                    </Button>
                    <Button
                      variant={Variant.Primary}
                      sx={{
                        flex: 1,
                        '& .MuiButton-buttonLabel': {
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        },
                      }}
                      onClick={handleConfirm}
                      loading={isPending}
                      loadingPosition="start"
                    >
                      {t('limitOrders.modifyModal.cancelStep.confirm')}
                    </Button>
                  </Stack>
                </Stack>
              </SectionCard>

              <StatusBottomSheet
                containerId={CONTAINER_ID}
                isOpen={statusSheet.isOpen}
                onClose={statusSheet.onClose}
                onHeightChange={onHeightChange}
                {...statusSheet.content}
              />
            </motion.div>
          )}
        </HeightAnimatedContainer>
      </div>
    </ModalContainer>
  );
};
