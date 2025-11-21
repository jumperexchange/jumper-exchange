import type { FC } from 'react';
import { ZapWithdrawWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapWithdrawWidget';
import { WidgetTrackingProvider } from 'src/providers/WidgetTrackingProvider';
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { TaskType } from 'src/types/strapi';
import type { ModalContainerProps } from 'src/components/core/modals/ModalContainer/ModalContainer';
import { ModalContainer } from 'src/components/core/modals/ModalContainer/ModalContainer';
import { useProjectLikeDataFromEarnOpportunity } from 'src/hooks/earn/useProjectLikeDataFromEarnOpportunity';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
interface WithdrawModalProps extends ModalContainerProps {
  earnOpportunity: Pick<
    EarnOpportunityWithLatestAnalytics,
    'name' | 'asset' | 'protocol' | 'url' | 'lpToken' | 'latest' | 'slug'
  > & {
    minFromAmountUSD: number;
    positionUrl: string;
    address: string;
  };
}

export const WithdrawModal: FC<WithdrawModalProps> = ({
  onClose,
  isOpen,
  earnOpportunity,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { projectData, zapData } =
    useProjectLikeDataFromEarnOpportunity(earnOpportunity);

  //   const refetchCallback = useDepositFlowStore((state) => state.refetchCallback);

  return (
    <WidgetTrackingProvider>
      <ModalContainer isOpen={isOpen} onClose={onClose}>
        <ZapWithdrawWidget
          customInformation={{ projectData }}
          zapData={zapData}
          ctx={{
            theme: {
              container: {
                maxHeight: 'calc(100vh - 6rem)',
                minWidth: '100%',
                maxWidth: 400,
                borderRadius: '24px',
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
    </WidgetTrackingProvider>
  );
};
