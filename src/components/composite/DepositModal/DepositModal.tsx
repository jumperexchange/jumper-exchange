import { FC } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ClientOnly } from 'src/components/ClientOnly';
import { ZapDepositBackendWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapDepositBackendWidget';
import { WidgetTrackingProvider } from 'src/providers/WidgetTrackingProvider';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { TaskType } from 'src/types/strapi';
import {
  ModalContainer,
  ModalContainerProps,
} from 'src/components/core/modals/ModalContainer/ModalContainer';
import { useProjectLikeDataFromEarnOpportunity } from 'src/hooks/earn/useProjectLikeDataFromEarnOpportunity';
import { useZapEarnOpportunitySlugStorage } from 'src/providers/hooks';
import { useDepositFlowStore } from 'src/stores/depositFlow/DepositFlowStore';
import { useTheme } from '@mui/material/styles';
interface DepositModalProps extends ModalContainerProps {
  earnOpportunity: Pick<
    EarnOpportunityWithLatestAnalytics,
    'name' | 'asset' | 'protocol' | 'url' | 'lpToken' | 'latest' | 'slug'
  > & {
    minFromAmountUSD: number;
    positionUrl: string;
    address: string;
  };
}

export const DepositModal: FC<DepositModalProps> = ({
  onClose,
  isOpen,
  earnOpportunity,
}) => {
  useZapEarnOpportunitySlugStorage(earnOpportunity.slug);
  const theme = useTheme();
  const { projectData, zapData } =
    useProjectLikeDataFromEarnOpportunity(earnOpportunity);

  const refetchCallback = useDepositFlowStore((state) => state.refetchCallback);

  return (
    <WidgetTrackingProvider>
      <ModalContainer isOpen={isOpen} onClose={onClose}>
        <ClientOnly>
          <ZapDepositBackendWidget
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
              overrideHeader: 'Quick deposit',
            }}
            customInformation={{ projectData }}
            zapData={zapData}
            isZapDataSuccess={true}
            refetchDepositToken={refetchCallback}
            depositSuccessMessageKey="widget.earn.depositSuccess"
          />
        </ClientOnly>
      </ModalContainer>
    </WidgetTrackingProvider>
  );
};
