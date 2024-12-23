import type { WidgetConfig, TokenAmount } from '@lifi/widget';
import { ChainType, DisabledUI, HiddenUI, LiFiWidget } from '@lifi/widget';
import { formatUnits } from 'viem';
import { useEffect, useMemo, useState } from 'react';
import { useZaps } from '@/hooks/useZaps';
import { useWalletMenu, type Account } from '@lifi/wallet-management';
import { DepositCard } from './DepositCard';
import { useContractRead } from 'src/hooks/useReadContractData';
import WidgetLikeField from '../Zap/WidgetLikeField/WidgetLikeField';
import { Divider } from '@mui/material';

export interface ProjectData {
  chain: string;
  project: string;
  address: string;
}

interface CustomWidgetProps {
  account: Account;
  projectData: ProjectData;
}

export function CustomWidget({ account, projectData }: CustomWidgetProps) {
  const [token, setToken] = useState<TokenAmount>();
  const { data, isSuccess } = useZaps(projectData);
  const { openWalletMenu } = useWalletMenu();

  const { data: depositTokenData, isLoading: isLoadingDepositTokenData } =
    useContractRead({
      address: projectData.address as `0x${string}`,
      chainId: projectData.chain === 'ethereum' ? 1 : 8453,
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
        chainId: projectData.chain === 'ethereum' ? 1 : 8453,
        address: data?.data?.market?.address as `0x${string}`,
        symbol: data?.data?.market?.lpToken.symbol,
        name: data?.data?.market?.lpToken.name,
        decimals: data?.data?.market?.lpToken.decimals,
        priceUSD: '0',
        coinKey: data?.data?.market?.lpToken.name as any,
        logoURI: data?.data?.meta?.logoURI,
        amount: '0' as any,
      });
    }
  }, [isSuccess]);

  const widgetConfig: WidgetConfig = useMemo(() => {
    const baseConfig: WidgetConfig = {
      toAddress: {
        ...data?.data?.meta,
        address: data?.data?.market?.address,
        chainType: ChainType.EVM,
      },
      subvariant: 'custom',
      subvariantOptions: { custom: 'deposit' },
      integrator: projectData.project === 'mellow' ? 'zap.mellow' : 'zap.ionic',
      disabledUI: [DisabledUI.ToAddress],
      hiddenUI: [HiddenUI.Appearance, HiddenUI.Language],
      useRecommendedRoute: true,
      theme: {
        container: {
          border: '1px solid rgb(234, 234, 234)',
          borderRadius: '16px',
        },
      },
      walletConfig: {
        onConnect() {
          openWalletMenu();
        },
      },
    };
    return baseConfig;
  }, [isSuccess]);

  const analytics = {
    ...data?.data?.analytics,
    position: depositTokenData ? formatUnits(depositTokenData, 18) : 0,
  };

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

      {!isLoadingDepositTokenData && analytics.position > 0 && (
        <>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <WidgetLikeField
            contractCalls={[
              {
                data: '0x',
                type: 'send',
                label: 'Redeem',
                onVerify: () => Promise.resolve(true),
              },
            ]}
            label="Redeem"
            image={{
              url: token?.logoURI || '',
              name: token?.name || '',
            }}
            placeholder="0.00"
            helperText={{
              left: 'Available balance',
              right: depositTokenData
                ? formatUnits(depositTokenData, 18)
                : '0.00',
            }}
            balance={
              depositTokenData ? formatUnits(depositTokenData, 18) : '0.00'
            }
            projectData={projectData}
          />
        </>
      )}
    </>
  );
}
