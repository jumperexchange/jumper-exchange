import { FC, useMemo } from 'react';
import { WidgetProps } from '../Widget.types';
import { WithdrawWidget } from 'src/components/ZapWidget/WithdrawWidget/WithdrawWidget';
import { WidgetSkeleton } from '../WidgetSkeleton';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';
import { useZapQuestIdStorage } from 'src/providers/hooks';

interface ZapWithdrawWidgetProps extends Omit<WidgetProps, 'type'> {}

export const ZapWithdrawWidget: FC<ZapWithdrawWidgetProps> = ({
  customInformation,
  ctx,
}) => {
  useZapQuestIdStorage();

  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const {
    zapData,
    isSuccess: isZapDataSuccess,
    isLoadingDepositTokenData,
    depositTokenData,
    depositTokenDecimals,
    refetchDepositToken,
  } = useEnhancedZapData(projectData);

  const poolName = useMemo(() => {
    return `${zapData?.meta.name} ${zapData?.market?.depositToken?.symbol.toUpperCase()} Pool`;
  }, [zapData?.meta.name, zapData?.market?.depositToken?.symbol]);

  const token = useMemo(
    () =>
      isZapDataSuccess && zapData
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
    [isZapDataSuccess, zapData],
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
    />
  ) : (
    <WidgetSkeleton />
  );
};
