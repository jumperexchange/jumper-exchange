import type { RedeemableClaimData } from '@/hooks/earn/useRedeemableClaims';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useFormatRedeemClaimData = (
  claimData: RedeemableClaimData | undefined,
) => {
  const { t } = useTranslation();
  return useMemo(
    () =>
      claimData?.claimData?.map((claim) => {
        return {
          id: claim.id,
          status:
            claim.status === 'pending'
              ? 'pending'
              : claim.status === 'approved'
                ? 'success'
                : 'failed',
          timestamp: claim.timestamp,
          title:
            claim.status === 'pending'
              ? t('earn.requestRedeemFlow.requests.pending.title')
              : claim.status === 'approved'
                ? t('earn.requestRedeemFlow.requests.approved.title')
                : t('earn.requestRedeemFlow.requests.failed.title'),
          description:
            claim.status === 'pending'
              ? t('earn.requestRedeemFlow.requests.pending.description')
              : claim.status === 'approved'
                ? t('earn.requestRedeemFlow.requests.approved.description')
                : t('earn.requestRedeemFlow.requests.failed.description'),
          assetAmount: claim.assetAmount,
          lpTokenAmount: claim.lpTokenAmount,
        };
      }) ?? [],
    [claimData, t],
  );
};
