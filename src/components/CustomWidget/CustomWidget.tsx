import type { ContractCall, WidgetConfig } from '@lifi/widget';
import { ChainType, DisabledUI, HiddenUI, ItemPrice, LiFiWidget } from '@lifi/widget';
import { useEffect, useMemo, useState } from 'react';
import { useZaps } from '@/hooks/useZaps';
import type { Account } from '@lifi/wallet-management';
// import { useIonicData } from 'src/hooks/useIonicData';
import { DepositCard } from './DepositCard';

interface CustomWidgetProps {
  account: Account;
}

// TODO: add zap from input
const projectData = {
  chain: 'base',
  project: 'ionic',
  product: 'ionWETH',
  method: 'mint',
  params: { amount: '1000000000000000' },
  displayName: 'Ionic Money',
}

export function CustomWidget({ account }: CustomWidgetProps) {
  const [contractCalls, setContractCalls] = useState<ContractCall[]>([]);
  const { data, token, isSuccess } = useZaps(projectData);

  // Ionic data
  // const { data: ionicData, isSuccess: ionicDataSuccess } = useIonicData();

  useEffect(() => {
    if (isSuccess) {
      setContractCalls([
        {
          fromAmount: token.amount?.toString() || '0',
          fromTokenAddress: token.address,
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
      integrator: projectData.displayName,
      disabledUI: [DisabledUI.ToAddress],
      hiddenUI: [HiddenUI.Appearance, HiddenUI.Language],
      useRecommendedRoute: true,
      theme: {
        container: {
          border: '1px solid rgb(234, 234, 234)',
          borderRadius: '16px',
        },
      },
    }
    return baseConfig
  }, [])

  return (
    <LiFiWidget
      contractComponent={
        <DepositCard
          token={token}
          contractCalls={contractCalls}
          contractTool={data?.data?.meta}
        />
      }
      contractTool={data?.data?.meta}
      config={widgetConfig}
      integrator={widgetConfig.integrator}
    />
  );
}
