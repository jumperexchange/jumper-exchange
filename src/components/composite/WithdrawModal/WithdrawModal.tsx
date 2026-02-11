import type { FC } from 'react';
import { ZapWithdrawWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapWithdrawWidget';
import { TaskType } from 'src/types/strapi';
import type { ModalContainerProps } from 'src/components/core/modals/ModalContainer/ModalContainer';
import { ModalContainer } from 'src/components/core/modals/ModalContainer/ModalContainer';
import { useProjectLikeDataFromEarnOpportunity } from 'src/hooks/earn/useProjectLikeDataFromEarnOpportunity';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import type { EarnOpportunityExtended } from '@/stores/withdrawFlow/WithdrawFlowStore';
import { useZapEarnOpportunitySlugStorage } from '@/providers/hooks';
import { useWithdrawFlowStore } from '@/stores/withdrawFlow/WithdrawFlowStore';

interface WithdrawModalProps extends ModalContainerProps {
  earnOpportunity: EarnOpportunityExtended;
}

export const WithdrawModal: FC<WithdrawModalProps> = ({
  onClose,
  isOpen,
  earnOpportunity,
}) => {
  useZapEarnOpportunitySlugStorage(earnOpportunity.slug);
  const { t } = useTranslation();
  const theme = useTheme();
  const { projectData, zapData } =
    useProjectLikeDataFromEarnOpportunity(earnOpportunity);

  const refetchCallback = useWithdrawFlowStore(
    (state) => state.refetchCallback,
  );

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <ZapWithdrawWidget
        customInformation={{ projectData }}
        zapData={zapData}
        refetchWithdrawToken={refetchCallback}
        ctx={{
          theme: {
            container: {
              maxHeight: 'calc(100vh - 6rem)',
              minWidth: '100%',
              maxWidth: 400,
              borderRadius: `${theme.shape.cardBorderRadiusLarge}px`,
              [theme.breakpoints.up('sm')]: {
                minWidth: 400,
              },
            },
          },
          taskType: TaskType.Zap,
          overrideHeader: t('widget.withdraw.title'),
        }}
      />
    </ModalContainer>
  );
};
