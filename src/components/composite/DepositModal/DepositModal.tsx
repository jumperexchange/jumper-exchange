import { FC, useMemo } from 'react';
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
  const customInformation = useMemo(() => {
    return {
      projectData: {
        chain: earnOpportunity.asset.chain.chainKey,
        chainId: earnOpportunity.asset.chain.chainId,
        address: earnOpportunity.address,
        project: earnOpportunity.protocol.name,
        integrator: `zap.${earnOpportunity.protocol.name}`,
        integratorLink: earnOpportunity.url ?? 'unset',
        integratorPositionLink: earnOpportunity.positionUrl,
        minFromAmountUSD: earnOpportunity.minFromAmountUSD,
      },
    };
  }, [earnOpportunity]);

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
