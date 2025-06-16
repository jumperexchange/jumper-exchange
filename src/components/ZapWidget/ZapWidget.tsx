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
  AbiFunction,
} from 'viem';
import { optimism, base, mainnet } from 'viem/chains';
import { useReadContracts, useAccount } from 'wagmi';
import { DepositCard } from './Deposit/DepositCard';
import { WithdrawWidget } from './Withdraw/WithdrawWidget';

import type { MeeClient, MultichainSmartAccount } from '@biconomy/abstractjs';
import {
  createMeeClient,
  toMultichainNexusAccount,
  runtimeERC20BalanceOf,
  greaterThanOrEqualTo,
} from '@biconomy/abstractjs';

// Type definitions for better type safety
interface AbiInput {
  name: string;
  type: string;
  indexed?: boolean;
}

interface WalletCall {
  to: `0x${string}`;
  data: `0x${string}`;
  value?: string;
}

interface WalletSendCallsParams {
  calls: WalletCall[];
  chainId?: string;
}

interface WalletMethodArgs {
  method: string;
  params?: unknown[];
}

interface WalletSendCallsArgs extends WalletMethodArgs {
  method: 'wallet_sendCalls';
  params: [WalletSendCallsParams];
}

interface WalletGetCallsStatusArgs extends WalletMethodArgs {
  method: 'wallet_getCallsStatus';
  params: [string]; // hash
}

interface WalletCapabilitiesArgs extends WalletMethodArgs {
  method: 'wallet_getCapabilities';
  params?: never;
}

type EthereumRequestArgs = WalletSendCallsArgs | WalletGetCallsStatusArgs | WalletCapabilitiesArgs | WalletMethodArgs;

interface ContractComposableConfig {
  address: string;
  chainId: number;
  abi: AbiFunction;
  functionName: string;
  args: unknown[];
  gasLimit?: bigint;
}

const buildContractComposable = async (
  oNexus: MultichainSmartAccount,
  contractConfig: ContractComposableConfig
) => {
  return oNexus.buildComposable({
    type: 'default',
    data: {
      abi: [contractConfig.abi],
      to: contractConfig.address as `0x${string}`,
      chainId: contractConfig.chainId,
      functionName: contractConfig.functionName,
      gasLimit: contractConfig.gasLimit,
      args: contractConfig.args,
    },
  });
};

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
      onRouteExecutionStarted,
    );

    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );

    return () => {
      widgetEvents.off(
        WidgetEvent.RouteExecutionStarted,
        onRouteExecutionStarted,
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
        coinKey: zapData.market?.depositToken.symbol || zapData.market?.depositToken.name || '',
        logoURI: zapData.market?.depositToken.logoURI,
        amount: BigInt(0),
      });
    }
  }, [isSuccess, projectData, zapData]);

  // Helper function to handle 'wallet_sendCalls'
  const handleWalletSendCalls = useCallback(
    async (args: WalletSendCallsArgs) => {
      if (!meeClient || !oNexus) {
        throw new Error('MEE client or oNexus not initialized');
      }
      if (!args.params || !Array.isArray(args.params)) {
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
        calls.map(async (call: WalletCall) => {
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
      const approveInstruction = await buildContractComposable(oNexus, {
        address: depositToken,
        chainId: depositChainId,
        abi: integrationData.abi.approve,
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
      });
      instructions.push(approveInstruction);

      // Deposit instruction (dynamic ABI-driven args)
      const depositInputs = integrationData.abi.deposit.inputs;
      const depositArgs = depositInputs.map((input: AbiInput) => {
        if (input.type === 'uint256') {
          return runtimeERC20BalanceOf({
            targetAddress: oNexus.addressOn(
              depositChainId,
              true,
            ) as `0x${string}`,
            tokenAddress: depositToken,
            constraints,
          });
        } else if (input.type === 'address') {
          // Use the user's EOA address or another relevant address
          return address;
        }
        throw new Error(`Unsupported deposit input type: ${input.type}`);
      });
      const depositInstruction = await buildContractComposable(oNexus, {
        address: depositAddress,
        chainId: depositChainId,
        abi: integrationData.abi.deposit,
        functionName: integrationData.abi.deposit.name,
        gasLimit: 1000000n,
        args: depositArgs,
      });
      instructions.push(depositInstruction);

      // Only add transferLpInstruction if deposit ABI does NOT have an address input
      const depositHasAddressArg = depositInputs.some((input: AbiInput) => input.type === 'address');

      if (!depositHasAddressArg) {
        if (!address) {
          throw new Error('User address (EOA) is not available.');
        }
        const transferLpInstruction = await buildContractComposable(oNexus, {
          address: depositAddress,
          chainId: depositChainId,
          abi: integrationData.abi.transfer,
          functionName: integrationData.abi.transfer.name,
          gasLimit: 200000n,
          args: [
            address,
            runtimeERC20BalanceOf({
              targetAddress: oNexus.addressOn(
                depositChainId,
                true,
              ) as `0x${string}`,
              tokenAddress: depositAddress,
              constraints,
            }),
          ],
        });
        instructions.push(transferLpInstruction);
      }

      const quote = await meeClient.getFusionQuote({
        trigger: {
          tokenAddress: currentRoute.fromToken.address as `0x${string}`,
          amount: BigInt(currentRoute.fromAmount),
          chainId: currentChainId,
        },
        cleanUps: [
          {
            tokenAddress: depositToken,
            chainId: depositChainId,
            recipientAddress: account.address as `0x${string}`,
          },
        ],
        feeToken: {
          address: currentRoute.fromToken.address as `0x${string}`,
          chainId: currentChainId,
        },
        instructions,
      });

      const { hash } = await meeClient.executeFusionQuote({
        fusionQuote: quote,
      });
      
      return { id: hash };
    },
    [meeClient, oNexus, chain, currentRoute, zapData, projectData, address],
  );

  // Helper function to handle 'wallet_getCallsStatus'
  const handleWalletGetCallsStatus = useCallback(
    async (args: WalletGetCallsStatusArgs) => {
      if (!meeClient) {
        // oNexus is not directly used here but its initialization is tied to meeClient
        throw new Error('MEE client not initialized');
      }
      if (!args.params || !Array.isArray(args.params)) {
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

      const originalReceipts = receipt?.receipts;
      originalReceipts[originalReceipts.length - 1].transactionHash = `biconomy:${hash}` as `0x${string}`;

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
        receipts: originalReceipts,
      };
    },
    [meeClient],
  );

  useEffect(() => {
    if (window.ethereum && typeof window.ethereum.request === 'function') {
      const originalRequest = window.ethereum.request;
      window.ethereum.request = async (args: EthereumRequestArgs) => {
        try {
          if (args.method === 'wallet_getCapabilities') {
            // Use the same explorerChainIds that are defined in widgetConfig
            const mockCapabilities = widgetConfig.explorerUrls ? 
              Object.keys(widgetConfig.explorerUrls).reduce((acc: Record<string, { atomic: { status: 'supported' } }>, chainIdStr) => {
                const chainId = parseInt(chainIdStr);
                acc[`0x${chainId.toString(16)}`] = { atomic: { status: 'supported' } };
                return acc;
              }, {}) : 
              {
                '0x1': { atomic: { status: 'supported' } },  // mainnet
                '0xa': { atomic: { status: 'supported' } },  // optimism
                '0x2105': { atomic: { status: 'supported' } }, // base
                '0x1a4': { atomic: { status: 'supported' } },  // optimism-sepolia
              };
            return Promise.resolve(mockCapabilities);
          } else if (args.method === 'wallet_sendCalls') {
            return await handleWalletSendCalls(args as WalletSendCallsArgs);
          } else if (args.method === 'wallet_getCallsStatus') {
            return await handleWalletGetCallsStatus(args as WalletGetCallsStatusArgs);
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
            console.error('Error details:', (error as Record<string, unknown>).details);
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
    const explorerConfig = [{
      url: 'https://meescan.biconomy.io',
      txPath: 'details',
      addressPath: 'address',
    }];
    const explorerChainIds = [
      56, 1399811149, 1, 8453, 42161, 130, 101, 43114, 137, 728126428, 999, 146, 10, 49705, 5000, 80094, 531, 369, 2741, 59144, 42220, 100, 81457, 2020, 57420037, 480, 25, 57073, 534352, 324, 98866, 1116, 1088, 1284, 169, 747, 250, 34443, 1514, 13371, 204, 288, 1285, 50104, 48900, 1923, 153153, 4689, 7700, 1480, 88888, 1101, 55244, 33139, 888, 1313161554, 592, 53935, 2001, 428962, 122, 2000, 109, 106, 7777777, 42262, 660279, 10000, 54176, 321, 20, 246, 666666666, 1996, 24, 4321, 9001, 5112, 57, 10143, 50312, 11155111, 84532
    ];
    const explorerUrls = explorerChainIds.reduce((acc, id) => {
      acc[String(id)] = explorerConfig;
      return acc;
    }, {} as Record<string, typeof explorerConfig>);
    const baseConfig: WidgetConfig = {
      toAddress: {
        name: 'Smart Account',
        address: address as `0x${string}` || '0x',
        chainType: ChainType.EVM,
      },
      bridges: {
        allow: ['across', 'stargateV2', 'symbiosis'],
      },
      apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
      sdkConfig: {
        apiUrl: process.env.NEXT_PUBLIC_LIFI_API_URL,
      },
      explorerUrls,
      subvariant: 'custom',
      subvariantOptions: { custom: 'deposit' },
      integrator: projectData.integrator,
      disabledUI: [DisabledUI.ToAddress],
      hiddenUI: [
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
        HiddenUI.ToAddress,
        HiddenUI.ReverseTokensButton
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
          withdrawAbi={zapData?.abi?.withdraw}
        />
      )}
      <WidgetEvents />
    </Box>
  );
}
