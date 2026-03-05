import type { RedeemableClaimData } from '@/hooks/earn/useRedeemableClaims';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useFormatRedeemClaimData = (
  claimData: RedeemableClaimData | undefined,
) => {
  const { t } = useTranslation();
  return useMemo(
    () =>
      claimData?.claimData?.map((claim, index) => {
        return {
          id: claim.id ?? index.toString(),
          status:
            claim.status === 'pending'
              ? 'pending'
              : claim.status === 'ready'
                ? 'success'
                : 'failed',
          timestamp: claim.timestamp,
          title:
            claim.status === 'pending'
              ? t('earn.requestRedeemFlow.requests.pending.title')
              : claim.status === 'ready'
                ? t('earn.requestRedeemFlow.requests.approved.title')
                : t('earn.requestRedeemFlow.requests.failed.title'),
          description:
            claim.status === 'pending'
              ? t('earn.requestRedeemFlow.requests.pending.description')
              : claim.status === 'ready'
                ? t('earn.requestRedeemFlow.requests.approved.description')
                : t('earn.requestRedeemFlow.requests.failed.description'),
          assetAmount: claim.assetAmount,
          lpTokenAmount: claim.lpTokenAmount,
        };
      }) ?? [],
    [claimData, t],
  );
};
