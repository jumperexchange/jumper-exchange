'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/Badge/Badge';
import { BadgeVariant } from '@/components/Badge/Badge.styles';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import { useRepeatOrderFlowStore } from '@/stores/limitOrderFlow/RepeatOrderFlowStore';

/**
 * Stand-in for the real repeat-order widget, which doesn't exist yet.
 * Swap this out once the limit-order widget supports pre-filling from a
 * cancelled/expired order.
 */
export const RepeatOrderFlowModal = () => {
  const { t } = useTranslation();
  const { isModalOpen, selectedOrder, closeModal } = useRepeatOrderFlowStore(
    (state) => state,
  );

  if (!selectedOrder) {
    return null;
  }

  return (
    <ModalContainer isOpen={isModalOpen} onClose={closeModal}>
      <SectionCard sx={{ width: 'min(90vw, 400px)' }}>
        <Stack sx={{ gap: 3 }}>
          <Badge
            startIcon={<AccessTimeIcon />}
            label={t('limitOrders.repeatModal.placeholderTitle')}
            variant={BadgeVariant.Secondary}
          />
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="bodyLargeStrong">
              {t('limitOrders.repeatModal.title')}
            </Typography>
            <Typography variant="bodySmall" color="textSecondary">
              {t('limitOrders.repeatModal.placeholderDescription')}
            </Typography>
          </Stack>
        </Stack>
      </SectionCard>
    </ModalContainer>
  );
};
