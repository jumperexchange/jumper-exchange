import { WidgetEvents } from '@/components/Widgets';
import { useZaps } from '@/hooks/useZaps';
import { useWalletMenu, type Account } from '@lifi/wallet-management';
import type { TokenAmount, WidgetConfig, Route } from '@lifi/widget';
import {
  ChainType,
  DisabledUI,
  HiddenUI,
  LiFiWidget,
  RequiredUI,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import type { Breakpoint } from '@mui/material';
import { Box, Skeleton } from '@mui/material';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useThemeStore } from 'src/stores/theme';
import {
  formatUnits,
  http,
  createWalletClient,
  custom,
  parseUnits,
} from 'viem';
import { optimism, base, mainnet } from 'viem/chains';
import { useReadContracts, useAccount } from 'wagmi';
import { DepositCard } from './Deposit/DepositCard';
import { WithdrawWidget } from './Withdraw/WithdrawWidget';

import type { MeeClient, MultichainSmartAccount } from '@biconomy/abstractjs';
import {
  createMeeClient,
  mcUSDT,
  toFeeToken,
  toMultichainNexusAccount,
  runtimeERC20BalanceOf,
  greaterThanOrEqualTo,
} from '@biconomy/abstractjs';

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
  claimingIds?: string[] | undefined;
}

export function ZapWidget({
  account,
  projectData,
  type,
  claimingIds,
}: CustomWidgetProps) {
  const [token, setToken] = useState<TokenAmount>();
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [oNexus, setONexus] = useState<MultichainSmartAccount | null>(null);
  const [meeClient, setMeeClient] = useState<MeeClient | null>(null);

  const { data, isSuccess } = useZaps(projectData);
  const zapData = data?.data;
  const { openWalletMenu } = useWalletMenu();
  const { address, chain } = useAccount();

  const [widgetTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);

  const contractsConfig = useMemo(() => {
    return [
      {
        address: projectData.address as `0x${string}`,
        abi: [
          {
            inputs: [{ name: 'owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        functionName: 'balanceOf',
        args: [account.address as `0x${string}`],
      },
      {
        abi: [
          {
            inputs: [],
            name: 'decimals',
            outputs: [{ name: '', type: 'uint8' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        address: (projectData.tokenAddress ||
          projectData.address) as `0x${string}`,
        chainId: projectData.chainId,
        functionName: 'decimals',
      },
    ];
  }, [
    projectData.address,
    projectData.tokenAddress,
    projectData.chainId,
    account.address,
  ]);

  const {
    data: [
      { result: depositTokenData } = {},
      { result: depositTokenDecimals } = {},
    ] = [],
    isLoading: isLoadingDepositTokenData,
    refetch,
  } = useReadContracts({
    contracts: contractsConfig,
  });

  useEffect(() => {
    const initMeeClient = async () => {
      if (!chain) {
        console.warn('Chain is undefined, skipping MEE client initialization.');
        return;
      }
      // create multichain nexus account
      // Creates the Biconomy "Multichain Nexus Account", a smart contract account
      // that orchestrates actions across multiple chains.
      // See: https://docs.biconomy.io/multichain-orchestration/comprehensive#multichain-nexus-account
      const oNexusInit = await toMultichainNexusAccount({
        signer: createWalletClient({
          chain,
          transport: custom(global?.window?.ethereum ?? ''),
        }),
        chains: [mainnet, optimism, base],
        transports: [http(), http(), http()],
      });

      // create mee client
      // Initializes the Biconomy "MEE (Modular Execution Environment) Client".
      // This client interacts with Biconomy's backend to manage the orchestration.
      // See: https://docs.biconomy.io/multichain-orchestration/comprehensive#modular-execution-environment-mee
      const meeClientInit = await createMeeClient({
        account: oNexusInit,
      });

      console.log('--- oNexusInit ---', oNexusInit);
      setONexus(oNexusInit);
      setMeeClient(meeClientInit);
    };
    initMeeClient();
  }, [chain]);

  const widgetEvents = useWidgetEvents();
  // Custom effect to refetch the balance
  useEffect(() => {
    function onRouteExecutionCompleted() {
      refetch();
    }

    function onRouteExecutionStarted(route: Route) {
      setCurrentRoute(route);
    }

    widgetEvents.on(
      WidgetEvent.RouteExecutionStarted,
      onRouteExecutionStarted as any,
    );

    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );

    return () => {
      widgetEvents.off(
        WidgetEvent.RouteExecutionStarted,
        onRouteExecutionStarted as any,
      );
      widgetEvents.off(
        WidgetEvent.RouteExecutionCompleted,
        onRouteExecutionCompleted,
      );
    };
  }, [widgetEvents, refetch]);

  const lpTokenDecimals = Number(depositTokenDecimals ?? 18);

  useEffect(() => {
    if (isSuccess && zapData) {
      setToken({
        chainId: zapData.market?.depositToken.chainId,
        address: zapData.market?.depositToken.address as `0x${string}`,
        symbol: zapData.market?.depositToken.symbol,
        name: zapData.market?.depositToken.name,
        decimals: zapData.market?.depositToken.decimals,
        priceUSD: '0',
        coinKey: zapData.market?.depositToken.name as any,
        logoURI: zapData.market?.depositToken.logoURI,
        amount: '0' as any,
      });
    }
  }, [isSuccess, projectData, zapData]);

  // Helper function to handle 'wallet_sendCalls'
  const handleWalletSendCalls = useCallback(
    async (args: { method: string; params?: any[] }) => {
      if (!meeClient || !oNexus) {
        throw new Error('MEE client or oNexus not initialized');
      }
      if (
        !args.params ||
        !Array.isArray(args.params) ||
        args.params.length === 0
      ) {
        throw new Error('Invalid args.params structure for wallet_sendCalls');
      }
      const paramsObject = args.params[0];
      if (
        typeof paramsObject !== 'object' ||
        paramsObject === null ||
        !Array.isArray(paramsObject.calls)
      ) {
        throw new Error(
          "Invalid params object structure: Missing or invalid 'calls' array at sendCalls",
        );
      }
      const { calls } = paramsObject;
      if (calls.length === 0) {
        throw new Error("'calls' array is empty");
      }

      if (!chain) {
        throw new Error('Cannot determine current chain ID from wallet.');
      }
      const currentChainId = chain.id;

      if (!currentRoute) {
        throw new Error('Cannot process transaction: Route is undefined.');
      }
      if (!zapData) {
        throw new Error('Integration data is not available.');
      }

      const integrationData = zapData;
      const depositAddress = integrationData.market?.address as `0x${string}`;
      const depositToken = integrationData.market?.depositToken?.address;
      const depositChainId = projectData.chainId;

      if (!depositAddress || !depositToken) {
        throw new Error('Deposit address or token is undefined.');
      }

      // raw calldata from the widget
      const instructions = await Promise.all(
        calls.map(async (call: any) => {
          if (!call.to || !call.data) {
            throw new Error('Invalid call structure: Missing to or data field');
          }
          return oNexus.buildComposable({
            type: 'rawCalldata',
            data: {
              to: call.to,
              calldata: call.data,
              chainId: currentChainId,
            },
          });
        }),
      );

      // constraints
      const depositTokenDecimals = zapData.market?.depositToken.decimals;
      const constraints = [
        greaterThanOrEqualTo(parseUnits('0.1', depositTokenDecimals)), // TODO: Remove hardcoded value
      ];

      // token approval
      const approveInstruction = await oNexus.buildComposable({
        type: 'default',
        data: {
          abi: [integrationData.abi.approve],
          to: depositToken,
          chainId: depositChainId,
          functionName: integrationData.abi.approve.name,
          gasLimit: 100000n,
          args: [
            depositAddress,
            runtimeERC20BalanceOf({
              targetAddress: oNexus.addressOn(
                depositChainId,
                true,
              ) as `0x${string}`,
              tokenAddress: depositToken,
              constraints,
            }),
          ],
        },
      });
      instructions.push(approveInstruction);

      // Deposit instruction
      const depositInstruction = await oNexus.buildComposable({
        type: 'default',
        data: {
          abi: [integrationData.abi.deposit],
          to: depositAddress,
          chainId: depositChainId,
          functionName: integrationData.abi.deposit.name,
          gasLimit: 1000000n,
          args: [
            runtimeERC20BalanceOf({
              targetAddress: oNexus.addressOn(
                depositChainId,
                true,
              ) as `0x${string}`,
              tokenAddress: depositToken,
              constraints,
            }),
          ],
        },
      });
      instructions.push(depositInstruction);

      // Add instruction to transfer LP tokens back to EOA
      if (!address) {
        throw new Error('User address (EOA) is not available.');
      }
      const transferLpInstruction = await oNexus.buildComposable({
        type: 'default',
        data: {
          abi: [integrationData.abi.transfer],
          to: depositAddress, // This should be the LP token address
          chainId: depositChainId,
          functionName: integrationData.abi.transfer.name,
          gasLimit: 200000n,
          args: [
            address, // Recipient is the user's EOA
            runtimeERC20BalanceOf({
              targetAddress: oNexus.addressOn(
                depositChainId,
                true,
              ) as `0x${string}`,
              tokenAddress: depositAddress, // LP token address
              constraints,
            }),
          ],
        },
      });
      instructions.push(transferLpInstruction);

      const quote = await meeClient.getFusionQuote({
        trigger: {
          tokenAddress: currentRoute.fromToken.address as `0x${string}`,
          amount: BigInt(currentRoute.fromAmount),
          chainId: currentChainId,
        },
        feeToken: toFeeToken({
          chainId: currentChainId,
          mcToken: mcUSDT, // TODO: Hardcoded
        }),
        instructions,
      });

      const { hash } = await meeClient.executeFusionQuote({
        fusionQuote: quote,
      });

      console.log('--- hash ---', hash);

      const hashFormatted = `biconomy:${hash}`;

      return { id: hashFormatted };
    },
    [meeClient, oNexus, chain, currentRoute, zapData, projectData, address],
  );

  // Helper function to handle 'wallet_getCallsStatus'
  const handleWalletGetCallsStatus = useCallback(
    async (args: { method: string; params?: any[] }) => {
      if (!meeClient) {
        // oNexus is not directly used here but its initialization is tied to meeClient
        throw new Error('MEE client not initialized');
      }
      if (
        !args.params ||
        !Array.isArray(args.params) ||
        args.params.length === 0
      ) {
        throw new Error(
          'Invalid args.params structure for wallet_getCallsStatus',
        );
      }
      const hash = args.params[0];
      if (typeof hash !== 'string' || !hash) {
        throw new Error('Missing or invalid hash in params object');
      }

      const receipt = await meeClient.waitForSupertransactionReceipt({
        hash: hash as `0x${string}`,
      });
      console.log('--- receipt ---', receipt);

      const chainIdAsNumber = receipt?.paymentInfo?.chainId;
      const hexChainId = chainIdAsNumber
        ? `0x${Number(chainIdAsNumber).toString(16)}`
        : undefined;

      return {
        atomic: true,
        chainId: hexChainId,
        id: hash,
        status: receipt?.transactionStatus?.toLowerCase().includes('success')
          ? 200
          : 400,
        receipts: receipt?.receipts,
      };
    },
    [meeClient],
  );

  useEffect(() => {
    if (window.ethereum && typeof window.ethereum.request === 'function') {
      const originalRequest = window.ethereum.request;
      window.ethereum.request = async (args: {
        method: string;
        params?: any[];
      }) => {
        try {
          if (args.method === 'wallet_getCapabilities') {
            const mockCapabilities = {
              '0x1': { atomic: { status: 'supported' } },
              '0xa': { atomic: { status: 'supported' } },
              '0x2105': { atomic: { status: 'supported' } },
              '0x1a4': { atomic: { status: 'supported' } },
            };
            return Promise.resolve(mockCapabilities);
          } else if (args.method === 'wallet_sendCalls') {
            return await handleWalletSendCalls(args);
          } else if (args.method === 'wallet_getCallsStatus') {
            console.log('--- TERA ---', args);
            return await handleWalletGetCallsStatus(args);
          } else {
            return originalRequest(args);
          }
        } catch (error) {
          console.error(`Error processing ${args.method}:`, error);
          if (
            typeof error === 'object' &&
            error !== null &&
            'message' in error
          ) {
            console.error('Error message:', (error as Error).message);
          }
          if (
            typeof error === 'object' &&
            error !== null &&
            'details' in error
          ) {
            console.error('Error details:', (error as any).details);
          }
          // Re-throw the error so it can be caught by the caller if necessary
          throw error;
        }
      };
    } else {
      console.error(
        '[PATCH] window.ethereum or window.ethereum.request not found. Cannot apply patch.',
      );
    }
  }, [
    currentRoute,
    meeClient,
    oNexus,
    chain,
    zapData,
    projectData,
    address,
    handleWalletSendCalls,
    handleWalletGetCallsStatus,
  ]);

  const widgetConfig: WidgetConfig = useMemo(() => {
    const baseConfig: WidgetConfig = {
      toAddress: {
        name: '',
        address: '',
        chainType: ChainType.EVM,
      },
      bridges: {
        allow: ['across', 'stargateV2', 'stargate', 'symbiosis'],
      },
      apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
      sdkConfig: {
        apiUrl: process.env.NEXT_PUBLIC_ZAP_API_URL,
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
          maxWidth: 'unset',
        },
      },
      useRecommendedRoute: true,
      contractCompactComponent: <></>,
      requiredUI: [RequiredUI.ToAddress],
      walletConfig: {
        onConnect() {
          openWalletMenu();
        },
      },
    };
    if (oNexus && baseConfig.toAddress) {
      baseConfig.toAddress.address = oNexus.addressOn(
        projectData.chainId,
        true,
      ) as `0x${string}`;
    }
    return baseConfig;
  }, [widgetTheme.config, projectData, openWalletMenu, oNexus]);

  const analytics = {
    ...(zapData?.analytics || {}), // Provide default empty object
    position: depositTokenData
      ? formatUnits(depositTokenData as bigint, lpTokenDecimals)
      : 0,
  };

  return (
    <Box display="flex" justifyContent="center">
      {type === 'deposit' &&
        (token ? (
          <LiFiWidget
            contractComponent={
              <DepositCard
                underlyingToken={zapData?.market?.depositToken}
                token={token}
                chainId={zapData?.market?.depositToken.chainId}
                contractTool={zapData?.meta}
                analytics={analytics}
                contractCalls={[]}
                claimingIds={claimingIds}
              />
            }
            config={widgetConfig}
            integrator={widgetConfig.integrator}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            sx={(theme) => ({
              marginTop: '32px',
              height: 592,
              borderRadius: '16px',
              [theme.breakpoints.down('md' as Breakpoint)]: {
                maxWidth: 316,
              },
              [theme.breakpoints.up('md' as Breakpoint)]: {
                maxWidth: '100%',
              },
            })}
          />
        ))}

      {!isLoadingDepositTokenData && type === 'withdraw' && token && (
        <WithdrawWidget
          refetchPosition={refetch}
          token={token}
          lpTokenDecimals={lpTokenDecimals}
          projectData={projectData}
          depositTokenData={depositTokenData}
        />
      )}
      <WidgetEvents />
    </Box>
  );
}
