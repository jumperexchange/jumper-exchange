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
import { useThemeStore } from 'src/stores/theme';
import { Box } from '@mui/material';

export interface ProjectData {
  chain: string;
  chainId: number;
  project: string;
  integrator: string;
  address: string;
}

interface CustomWidgetProps {
  account: Account;
  projectData: ProjectData;
  type: 'deposit' | 'withdraw';
}

export function CustomWidget({
  account,
  projectData,
  type,
}: CustomWidgetProps) {
  const [token, setToken] = useState<TokenAmount>();
  const { data, isSuccess } = useZaps(projectData);
  const { openWalletMenu } = useWalletMenu();

  const [widgetTheme, configTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);

  const { data: depositTokenData, isLoading: isLoadingDepositTokenData } =
    useContractRead({
      address: projectData.address as `0x${string}`,
      chainId: projectData.chainId,
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

  const { data: depositTokenDecimals } = useContractRead({
    address: projectData.address as `0x${string}`,
    chainId: projectData.chainId,
    functionName: 'decimals',
    abi: [
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
  });

  const lpTokenDecimals = depositTokenDecimals ?? 18;

  useEffect(() => {
    if (isSuccess) {
      setToken({
        chainId: projectData.chainId,
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
      bridges: {
        allow: ['across', 'hop', 'stargateV2', 'stargate', 'symbiosis'],
      },
      subvariant: 'custom',
      subvariantOptions: { custom: 'deposit' },
      integrator: projectData.integrator,
      disabledUI: [DisabledUI.ToAddress],
      hiddenUI: [
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
      ],
      appearance: widgetTheme.config.appearance,
      theme: widgetTheme.config.theme,
      useRecommendedRoute: true,
      contractCompactComponent: <></>,
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
    position: depositTokenData
      ? formatUnits(depositTokenData, lpTokenDecimals)
      : 0,
  };

  return (
    <>
      {type === 'deposit' && token && (
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

      {!isLoadingDepositTokenData && type === 'withdraw' && (
        // <>
        //   <WidgetLikeField
        //     contractCalls={[
        //       {
        //         data: '0x',
        //         type: 'send',
        //         label: 'Redeem',
        //         onVerify: () => Promise.resolve(true),
        //       },
        //     ]}
        //     label="Redeem"
        //     image={{
        //       url: token?.logoURI || '',
        //       name: token?.name || '',
        //     }}
        //     placeholder="0.00"
        //     helperText={{
        //       left: 'Available balance',
        //       right: depositTokenData
        //         ? formatUnits(depositTokenData, 18)
        //         : '0.00',
        //     }}
        //     balance={
        //       depositTokenData
        //         ? formatUnits(depositTokenData, lpTokenDecimals)
        //         : '0.00'
        //     }
        //     projectData={projectData}
        //   />
        // </>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minWidth: 416,
          }}
        >
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
                ? formatUnits(depositTokenData, lpTokenDecimals)
                : '0.00',
            }}
            balance={
              depositTokenData
                ? formatUnits(depositTokenData, lpTokenDecimals)
                : '0.00'
            }
            projectData={projectData}
          />
        </Box>
      )}
    </>
  );
}
