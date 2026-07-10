'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/Badge/Badge';
import { BadgeVariant } from '@/components/Badge/Badge.styles';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import { useModifyOrderFlowStore } from '@/stores/limitOrderFlow/ModifyOrderFlowStore';

/**
 * Stand-in for the real modify-order widget, which doesn't exist yet.
 * Swap this out once the limit-order widget supports editing an order.
 */
export const ModifyOrderFlowModal = () => {
  const { t } = useTranslation();
  const { isModalOpen, selectedOrder, closeModal } = useModifyOrderFlowStore(
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
            label={t('limitOrders.modifyModal.placeholderTitle')}
            variant={BadgeVariant.Secondary}
          />
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="bodyLargeStrong">
              {t('limitOrders.modifyModal.title')}
            </Typography>
            <Typography variant="bodySmall" color="textSecondary">
              {t('limitOrders.modifyModal.placeholderDescription')}
            </Typography>
          </Stack>
        </Stack>
      </SectionCard>
    </ModalContainer>
  );
};
