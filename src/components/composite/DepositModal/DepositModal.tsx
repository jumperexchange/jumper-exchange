import { useMemo, type FC } from 'react';
import { ClientOnly } from 'src/components/ClientOnly';
import { ZapDepositBackendWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapDepositBackendWidget';
import { TaskType } from 'src/types/strapi';
import type { ModalContainerProps } from 'src/components/core/modals/ModalContainer/ModalContainer';
import { ModalContainer } from 'src/components/core/modals/ModalContainer/ModalContainer';
import { useProjectLikeDataFromEarnOpportunity } from 'src/hooks/earn/useProjectLikeDataFromEarnOpportunity';
import { useZapEarnOpportunitySlugStorage } from 'src/providers/hooks';
import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import { useDepositFlowStore } from 'src/stores/depositFlow/DepositFlowStore';
import { useTheme } from '@mui/material/styles';

import envConfig from 'src/config/env-config';
import { useChainTypeData } from '@/hooks/chains/useChainTypeData';
import { ZapPlaceholderWidget } from '@/components/Widgets/variants/base/ZapWidget/ZapPlaceholderWidget';
import { Trans, useTranslation } from 'react-i18next';
interface DepositModalProps extends ModalContainerProps {
  earnOpportunity: EarnOpportunityExtended;
}

export const DepositModal: FC<DepositModalProps> = ({
  onClose,
  isOpen,
  earnOpportunity,
}) => {
  useZapEarnOpportunitySlugStorage(earnOpportunity.slug);
  const { t } = useTranslation();
  const theme = useTheme();
  const { projectData, zapData } =
    useProjectLikeDataFromEarnOpportunity(earnOpportunity);

  const refetchCallback = useDepositFlowStore((state) => state.refetchCallback);

  const chainTypeData = useChainTypeData(
    earnOpportunity?.lpToken?.chain?.chainId,
  );

  const ctx = useMemo(() => {
    return {
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
      taskType: TaskType.Zap as const,
      overrideHeader: t('widget.deposit.title'),
      allowChains: chainTypeData.chainIds,
    };
  }, [t, theme, chainTypeData.chainIds]);

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      {chainTypeData.isAccountConnected ? (
        <ClientOnly>
          <ZapDepositBackendWidget
            ctx={ctx}
            customInformation={{ projectData }}
            zapData={zapData}
            isZapDataSuccess={true}
            refetchDepositToken={refetchCallback}
            depositSuccessMessageKey="widget.earn.depositSuccess"
            integrator={envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_EARN}
          />
        </ClientOnly>
      ) : (
        <ZapPlaceholderWidget
          title={t('widget.zap.placeholder.not-supported.title')}
          description={
            <Trans
              i18nKey="widget.zap.placeholder.not-supported.description"
              values={{
                type: chainTypeData.chain?.chainType ?? '',
              }}
            />
          }
          sx={ctx.theme.container}
        />
      )}
    </ModalContainer>
  );
};
