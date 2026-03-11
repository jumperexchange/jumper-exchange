import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useToken } from '@/hooks/useToken';
import { useGetZapInPoolBalance } from '@/hooks/zaps/useGetZapInPoolBalance';
import type { EarnOpportunityExtended } from '@/stores/requestRedeemFlow/RequestRedeemFlowStore';
import { createExtendedToken } from '@/types/tokens';
import { useMemo } from 'react';
import type { Address } from 'viem';

export function useEarnOpportunityTokens(
  earnOpportunity: EarnOpportunityExtended,
) {
  const accountAddress = useAccountAddress();

  const {
    depositTokenData: lpTokenAmount,
    refetchDepositToken: refetchLpTokenAmount,
  } = useGetZapInPoolBalance(
    accountAddress as Address,
    earnOpportunity.lpToken.address as Address,
    earnOpportunity.lpToken.chain.chainId,
  );

  const { token: extendedLpToken } = useToken(
    earnOpportunity.lpToken.chain.chainId,
    earnOpportunity.lpToken.address as Address,
    { extended: true },
  );

  const { token: extendedAssetToken } = useToken(
    earnOpportunity.asset.chain.chainId,
    earnOpportunity.asset.address as Address,
    { extended: true },
  );

  const lpToken = useMemo(
    () =>
      createExtendedToken(
        earnOpportunity.lpToken,
        extendedLpToken?.priceUSD ?? '0',
      ),
    [earnOpportunity.lpToken, extendedLpToken?.priceUSD],
  );

  const assetToken = useMemo(
    () =>
      createExtendedToken(
        earnOpportunity.asset,
        extendedAssetToken?.priceUSD ?? '0',
      ),
    [earnOpportunity.asset, extendedAssetToken?.priceUSD],
  );

  return { lpToken, lpTokenAmount, assetToken, refetchLpTokenAmount };
}
