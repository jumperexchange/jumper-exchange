import { FC, useMemo } from 'react';
import { WidgetProps } from '../Widget.types';
import { useInitializeZapConfig } from './useInitializeZapConfig';
import { WithdrawWidget } from 'src/components/ZapWidget/Withdraw/WithdrawWidget';
import { WidgetSkeleton } from '../WidgetSkeleton';

interface ZapWithdrawWidgetProps extends WidgetProps {}

export const ZapWithdrawWidget: FC<ZapWithdrawWidgetProps> = ({
  customInformation,
  ctx,
}) => {
  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  // @TODO here use the new hook from the deposit card PR
  const {
    zapData,
    isZapDataSuccess,
    isLoadingDepositTokenData,
    depositTokenData,
    depositTokenDecimals,
    refetchDepositToken,
  } = useInitializeZapConfig(projectData);

  const poolName = useMemo(() => {
    return `${zapData?.meta.name} ${zapData?.market?.depositToken?.symbol.toUpperCase()} Pool`;
  }, [JSON.stringify(zapData ?? {})]);

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
