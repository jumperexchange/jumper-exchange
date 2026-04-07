import { useMemo, type FC } from 'react';
import { ZapWithdrawWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapWithdrawWidget';
import { TaskType } from 'src/types/strapi';
import type { ModalContainerProps } from 'src/components/core/modals/ModalContainer/ModalContainer';
import { ModalContainer } from 'src/components/core/modals/ModalContainer/ModalContainer';
import { useProjectLikeDataFromEarnOpportunity } from 'src/hooks/earn/useProjectLikeDataFromEarnOpportunity';
import { useTheme } from '@mui/material/styles';
import { Trans, useTranslation } from 'react-i18next';
import type { EarnOpportunityExtended } from '@/stores/withdrawFlow/WithdrawFlowStore';
import { useZapEarnOpportunitySlugStorage } from '@/providers/hooks';
import { useWithdrawFlowStore } from '@/stores/withdrawFlow/WithdrawFlowStore';
import { useChainTypeData } from '@/hooks/chains/useChainTypeData';
import { ZapPlaceholderWidget } from '@/components/Widgets/variants/base/ZapWidget/ZapPlaceholderWidget';

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
      overrideHeader: t('widget.withdraw.title'),
      allowChains: chainTypeData.chainIds,
    };
  }, [t, theme, chainTypeData.chainIds]);

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      {chainTypeData.isAccountConnected ? (
        <ZapWithdrawWidget
          customInformation={{ projectData }}
          zapData={zapData}
          refetchWithdrawToken={refetchCallback}
          ctx={ctx}
        />
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
