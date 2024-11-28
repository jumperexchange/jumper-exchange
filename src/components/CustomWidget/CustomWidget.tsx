import type { ContractCall, WidgetConfig, TokenAmount } from '@lifi/widget';
import { ChainType, DisabledUI, HiddenUI, LiFiWidget } from '@lifi/widget';
import { useEffect, useMemo, useState } from 'react';
import { useZaps } from '@/hooks/useZaps';
import type { Account } from '@lifi/wallet-management';
import { DepositCard } from './DepositCard';

const CHAINS: Record<string, number> = {
  ethereum: 1,
  base: 8453,
};

interface CustomWidgetProps {
  account: Account;
}

// TODO: abstract this to JSON file
const projectData = {
  chain: 'base',
  project: 'ionic',
  product: 'ionWETH',
  method: 'mint',
  params: { amount: '1000000000000000' }, // TODO: take this from input
  displayName: 'Ionic Money',
};

export function CustomWidget({ account }: CustomWidgetProps) {
  const [contractCalls, setContractCalls] = useState<ContractCall[]>([]);
  const [token, setToken] = useState<TokenAmount>();
  const { data, isSuccess } = useZaps(projectData);

  useEffect(() => {
    if (isSuccess) {
      setToken({
        chainId: CHAINS[projectData.chain],
        address: data?.data?.depositToken.address,
        symbol: data?.data?.depositToken.symbol,
        name: data?.data?.depositToken.name,
        decimals: data?.data?.depositToken.decimals,
        priceUSD: data?.data?.depositToken.priceUSD,
        coinKey: undefined,
        logoURI: data?.data?.depositToken.logoURI,
        amount: BigInt(projectData.params.amount),
      });
      setContractCalls([
        {
          fromAmount: projectData.params.amount, // TODO: take this from input
          fromTokenAddress: data?.data?.depositToken.address,
          toContractAddress: data?.data?.marketAddress,
          toContractCallData: data?.data?.payload,
          toContractGasLimit: '500000', // not sure what is the best value here
          toTokenAddress: data?.data?.marketAddress,
        },
      ]);
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
  }, []);

  return (
    <>
      {token && contractCalls && (
        <LiFiWidget
          contractComponent={
            <DepositCard
              token={token}
              contractCalls={contractCalls}
              contractTool={data?.data?.meta}
            />
          }
          config={widgetConfig}
          integrator={widgetConfig.integrator}
        />
      )}
    </>
  );
}
