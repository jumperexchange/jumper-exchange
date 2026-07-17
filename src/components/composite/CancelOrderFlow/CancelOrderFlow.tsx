'use client';

import { HeightAnimatedContainer } from '@jumperexchange/shared-ui/components';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { StatusBottomSheet } from '@/components/composite/StatusBottomSheet/StatusBottomSheet';
import { Button } from '@/components/core/buttons/Button/Button';
import { Variant } from '@/components/core/buttons/types';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import { useCancelOrderFlowStore } from '@/stores/limitOrderFlow/CancelOrderFlowStore';
import { getQueryKey } from '@/utils/queries/getQueryKey';
import { useCancelOrder } from './hooks/useCancelOrder';
import { useCancelOrderStatusSheet } from './hooks/useCancelOrderStatusSheet';
import { useAccount } from '@jumperexchange/wallet-management';

const CONTAINER_ID = 'cancel-order-modal';
const BOTTOM_SHEET_TOP_OFFSET = 24;
const ANIMATION_DURATION_SECONDS = 0.3;

export const CancelOrderFlowModal = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isModalOpen, selectedOrder, closeModal } = useCancelOrderFlowStore(
    (state) => state,
  );
  const { cancelOrderAsync, result, isPending, isSuccess, isError, reset } =
    useCancelOrder();
  const { account } = useAccount();
  const address = account.address;

  const handleClose = () => {
    reset();
    closeModal();
  };

  const previousAddressRef = useRef(address);
  useEffect(() => {
    if (previousAddressRef.current === address) {
      return;
    }
    previousAddressRef.current = address;
    reset();
    closeModal();
  }, [address, reset, closeModal]);

  const handleDone = () => {
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: [getQueryKey('limit-orders')],
      });
    }, 1500);
    handleClose();
  };

  const handleConfirm = () => {
    if (!selectedOrder) {
      return;
    }
    cancelOrderAsync(selectedOrder).catch(() => {
      // isError below surfaces the failure via the status sheet.
    });
  };

  const statusSheet = useCancelOrderStatusSheet({
    isSuccess,
    isError,
    result,
    onRetry: handleConfirm,
    onDone: handleDone,
    onCloseError: handleClose,
  });

  if (!selectedOrder) {
    return null;
  }

  return (
    <ModalContainer isOpen={isModalOpen} onClose={handleClose}>
      <Box id={CONTAINER_ID} sx={{ position: 'relative' }}>
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
                    {t('limitOrders.cancelModal.title')}
                  </Typography>
                  <Typography variant="bodySmall" color="textSecondary">
                    {t('limitOrders.cancelModal.description')}
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
                      variant={Variant.Error}
                      sx={{ flex: 1 }}
                      onClick={handleConfirm}
                      loading={isPending}
                    >
                      {t('limitOrders.cancelModal.cancelOrder')}
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
      </Box>
    </ModalContainer>
  );
};
