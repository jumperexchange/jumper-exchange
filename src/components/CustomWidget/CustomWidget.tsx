import type { ContractCall, WidgetConfig, TokenAmount } from '@lifi/widget';
import { ChainType, DisabledUI, HiddenUI, LiFiWidget } from '@lifi/widget';
import { formatUnits } from 'viem';
import { useEffect, useMemo, useState } from 'react';
import { useZaps } from '@/hooks/useZaps';
import type { Account } from '@lifi/wallet-management';
import { DepositCard } from './DepositCard';
import { useContractRead } from 'src/hooks/useReadContractData';

const CHAINS: Record<string, number> = {
  ethereum: 1,
  base: 8453,
};

interface CustomWidgetProps {
  account: Account;
}

// TODO: abstract this to JSON file
const projectData = {
  chain: 'ethereum',
  project: 'mellow',
  product: 'ethereum-steaklrt',
  method: 'deposit',
  params: {
    to: '0x0000000000000000000000000000000000000000',
    amounts: ['0'],
    minLpAmount: '0',
    deadline: '1717334400',
  }, // TODO: take this from input
  displayName: 'Mellow Finance',
};

export function CustomWidget({ account }: CustomWidgetProps) {
  const [token, setToken] = useState<TokenAmount>();
  const { data, isSuccess } = useZaps(projectData);
  const { data: depositTokenData } = useContractRead({
    address: data?.data?.marketAddress,
    functionName: 'balanceOf',
    abi: [
      {
        inputs: [{ name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    args: [account.address],
  });

  useEffect(() => {
    if (isSuccess) {
      setToken({
        chainId: 1,
        address: data?.data?.depositToken.address,
        symbol: data?.data?.depositToken.symbol,
        name: data?.data?.depositToken.name,
        decimals: data?.data?.depositToken.decimals,
        priceUSD: data?.data?.depositToken.priceUSD,
        coinKey: 'wstETH',
        logoURI: data?.data?.depositToken.logoURI,
        amount: '0',
      });
    }
  }, [isSuccess]);

  const widgetConfig: WidgetConfig = useMemo(() => {
    const baseConfig: WidgetConfig = {
      toAddress: {
        ...data?.data?.meta,
        address: data?.data?.marketAddress,
        chainType: ChainType.EVM,
      },
      subvariant: 'custom',
      subvariantOptions: { custom: 'deposit' },
      integrator: 'jumper.exchange',
      disabledUI: [DisabledUI.ToAddress],
      hiddenUI: [HiddenUI.Appearance, HiddenUI.Language],
      useRecommendedRoute: true,
      theme: {
        container: {
          border: '1px solid rgb(234, 234, 234)',
          borderRadius: '16px',
        },
      },
    };
    return baseConfig;
  }, [isSuccess]);

  let analytics = data?.data?.analytics?.find(
    (item: any) => item.id === projectData.product,
  );

  if (depositTokenData) {
    analytics.position = formatUnits(depositTokenData, 18);
  }

  return (
    <>
      {token && (
        <LiFiWidget
          contractComponent={
            <DepositCard
              token={token}
              contractTool={data?.data?.meta}
              analytics={analytics}
              contractCalls={[]}
            />
          }
          config={widgetConfig}
          integrator={widgetConfig.integrator}
        />
      )}
    </>
  );
}
