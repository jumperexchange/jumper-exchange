import type { FC } from 'react';
import { useMemo } from 'react';
import type { WidgetProps } from '../Widget.types';
import { WithdrawWidget } from 'src/components/ZapWidget/WithdrawWidget/WithdrawWidget';
import { WidgetSkeleton } from '../WidgetSkeleton';
import { useZapQuestIdStorage } from 'src/providers/hooks';
import type { ZapDataResponse } from '@/providers/ZapInitProvider/ModularZaps/zap.jumper-backend';
import { useAccount } from '@lifi/wallet-management';
import { useGetZapInPoolBalance } from '@/hooks/zaps/useGetZapInPoolBalance';
import type { Hex } from 'viem';

interface ZapWithdrawWidgetProps extends Omit<WidgetProps, 'type'> {
  zapData?: ZapDataResponse | null;
}

export const ZapWithdrawWidget: FC<ZapWithdrawWidgetProps> = ({
  zapData,
  customInformation,
  ctx,
}) => {
  useZapQuestIdStorage();

  const { account } = useAccount();

  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const {
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken,
  } = useGetZapInPoolBalance(
    account.address as Hex,
    (projectData.tokenAddress as Hex) || (projectData.address as Hex),
    projectData.chainId,
  );

  const poolName = useMemo(() => {
    return `${zapData?.meta.name} ${zapData?.market?.depositToken?.symbol.toUpperCase()} Pool`;
  }, [zapData?.meta.name, zapData?.market?.depositToken?.symbol]);

  const token = useMemo(
    () =>
      zapData
        ? {
            chainId: zapData.market?.depositToken.chainId,
            address: zapData.market?.depositToken.address as `0x${string}`,
            symbol: zapData.market?.depositToken.symbol,
            name: zapData.market?.depositToken.name,
            decimals: zapData.market?.depositToken.decimals,
            priceUSD: '0',
            coinKey:
              zapData.market?.depositToken.symbol ||
              zapData.market?.depositToken.name ||
              '',
            logoURI: zapData.market?.depositToken.logoURI,
            amount: BigInt(0),
          }
        : null,
    [zapData],
  );

  const lpTokenDecimals = Number(depositTokenDecimals ?? 18);

  return !isLoadingDepositTokenData && token ? (
    <WithdrawWidget
      poolName={poolName}
      refetchPosition={refetchDepositToken}
      // @ts-expect-error Not implemented yet, should be fixed in the future
      token={token}
      lpTokenDecimals={lpTokenDecimals}
      projectData={projectData}
      depositTokenData={depositTokenData}
      withdrawAbi={zapData?.abi?.withdraw}
      sx={ctx?.theme?.container}
    />
  ) : (
    <WidgetSkeleton />
  );
};
