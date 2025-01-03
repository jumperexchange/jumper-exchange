import type { WidgetConfig, TokenAmount } from '@lifi/widget';
import { ChainType, DisabledUI, HiddenUI, LiFiWidget } from '@lifi/widget';
import { formatUnits } from 'viem';
import { useEffect, useMemo, useState } from 'react';
import { useZaps } from '@/hooks/useZaps';
import { useWalletMenu, type Account } from '@lifi/wallet-management';
import { DepositCard } from './Deposit/DepositCard';
import { useContractRead } from 'src/hooks/useReadContractData';
import WidgetLikeField from '../Zap/WidgetLikeField/WidgetLikeField';
import { Divider } from '@mui/material';
import { useThemeStore } from 'src/stores/theme';
import { Box } from '@mui/material';
import { WithdrawWidget } from './Withdraw/WithdrawWidget';
import { Skeleton } from '@mui/material';
import { Breakpoint } from '@mui/material';
import { useTheme } from '@mui/material';

export interface ProjectData {
  chain: string;
  chainId: number;
  project: string;
  integrator: string;
  address: string;
  withdrawAddress?: string;
  tokenAddress?: string;
}

interface CustomWidgetProps {
  account: Account;
  projectData: ProjectData;
  type: 'deposit' | 'withdraw';
}

export function ZapWidget({ account, projectData, type }: CustomWidgetProps) {
  const theme = useTheme();
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
    address: (projectData.tokenAddress || projectData.address) as `0x${string}`,
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
      theme: {
        ...widgetTheme.config.theme,
        container: {
          maxHeight: 820,
        },
      },
      useRecommendedRoute: true,
      contractCompactComponent: <></>,
      walletConfig: {
        onConnect() {
          openWalletMenu();
        },
      },
    };
    return baseConfig;
  }, [isSuccess, widgetTheme.config.theme, widgetTheme.config.appearance]);

  const analytics = {
    ...data?.data?.analytics,
    position: depositTokenData
      ? formatUnits(depositTokenData, lpTokenDecimals)
      : 0,
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        [theme.breakpoints.down('md' as Breakpoint)]: {
          maxWidth: 316,
        },
        [theme.breakpoints.up('md' as Breakpoint)]: {
          maxWidth: 416,
        },
      }}
    >
      {type === 'deposit' &&
        (token ? (
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
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{
              marginTop: '32px',
              height: 592,
              borderRadius: '16px',
              [theme.breakpoints.down('md' as Breakpoint)]: {
                maxWidth: 316,
              },
              [theme.breakpoints.up('md' as Breakpoint)]: {
                maxWidth: 416,
              },
            }}
          />
        ))}

      {!isLoadingDepositTokenData && type === 'withdraw' && token && (
        <WithdrawWidget
          token={token}
          lpTokenDecimals={lpTokenDecimals}
          projectData={projectData}
          depositTokenData={depositTokenData}
        />
      )}
    </Box>
  );
}
