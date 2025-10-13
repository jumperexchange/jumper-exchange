import { FC } from 'react';
import { ClientOnly } from 'src/components/ClientOnly';
import { ZapDepositBackendWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapDepositBackendWidget';
import { WidgetTrackingProvider } from 'src/providers/WidgetTrackingProvider';
import { ZapInitProvider } from 'src/providers/ZapInitProvider/ZapInitProvider';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { TaskType } from 'src/types/strapi';
import {
  ModalContainer,
  ModalContainerProps,
} from 'src/components/core/modals/ModalContainer/ModalContainer';
import { useProjectLikeDataFromEarnOpportunity } from 'src/hooks/earn/useProjectLikeDataFromEarnOpportunity';

interface DepositModalProps extends ModalContainerProps {
  earnOpportunity: Pick<
    EarnOpportunityWithLatestAnalytics,
    'name' | 'asset' | 'protocol' | 'url'
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
  const customInformation =
    useProjectLikeDataFromEarnOpportunity(earnOpportunity);

  return (
    <WidgetTrackingProvider>
      <ZapInitProvider projectData={customInformation.projectData}>
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
                  },
                },
                taskType: TaskType.Zap,
                overrideHeader: 'Quick deposit',
              }}
              customInformation={customInformation}
            />
          </ClientOnly>
        </ModalContainer>
      </ZapInitProvider>
    </WidgetTrackingProvider>
  );
};
