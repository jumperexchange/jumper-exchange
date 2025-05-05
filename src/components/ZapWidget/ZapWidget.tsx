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
import { useEffect, useMemo, useState } from 'react';
import { useThemeStore } from 'src/stores/theme';
import { formatUnits, http, type Hex, createWalletClient, custom } from 'viem';
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
  mcUSDC,
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
  const { openWalletMenu } = useWalletMenu();
  const { address, chain } = useAccount();

  const [widgetTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);

  const {
    data: [
      { result: depositTokenData } = {},
      { result: depositTokenDecimals } = {},
    ] = [],
    isLoading: isLoadingDepositTokenData,
    refetch,
  } = useReadContracts({
    contracts: [
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
        ],
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
        ],
        address: (projectData.tokenAddress ||
          projectData.address) as `0x${string}`,
        chainId: projectData.chainId,
        functionName: 'decimals',
      },
    ],
  });

  useEffect(() => {
    const initMeeClient = async () => {
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
  }, [isSuccess, projectData, data]);

  useEffect(() => {
    if (window.ethereum && typeof window.ethereum.request === 'function') {
      const originalRequest = window.ethereum.request;
      window.ethereum.request = async (args: {
        method: string;
        params?: any[];
      }) => {
        // override wallet_getCapabilities to always use atomic transaction
        if (args.method === 'wallet_getCapabilities') {
          const mockCapabilities = {
            '0x1': {
              atomic: {
                status: 'supported',
              },
            },
            '0xa': {
              atomic: {
                status: 'supported',
              },
            },
            '0x2105': {
              atomic: {
                status: 'supported',
              },
            },
            '0x1a4': {
              atomic: {
                status: 'supported',
              },
            },
          };
          return Promise.resolve(mockCapabilities);
          // override wallet_sendCalls to use biconomy
        } else if (args.method === 'wallet_sendCalls') {
          try {
            // validate incoming sendCalls params
            if (
              !args.params ||
              !Array.isArray(args.params) ||
              args.params.length === 0
            ) {
              throw new Error(
                'Invalid args.params structure for wallet_sendCalls',
              );
            }
            const paramsObject = args.params[0];
            if (
              typeof paramsObject !== 'object' ||
              paramsObject === null ||
              !Array.isArray(paramsObject.calls)
            ) {
              throw new Error(
                "Invalid params object structure: Missing or invalid 'calls' array",
              );
            }
            const { calls } = paramsObject;
            if (calls.length === 0) {
              throw new Error("'calls' array is empty");
            }

            // validate current chain id
            const currentChainIdString = window.ethereum.chainId;
            if (!currentChainIdString) {
              throw new Error('Cannot determine current chain ID from wallet.');
            }
            const currentChainId = parseInt(currentChainIdString, 16);
            if (isNaN(currentChainId)) {
              throw new Error('Invalid chain ID from wallet.');
            }

            // build composable instructions
            // These are the "Instructions" for the orchestration sequence.
            // Each item in the `calls` array is converted into a raw calldata instruction.
            // See: https://docs.biconomy.io/multichain-orchestration/comprehensive#instructions
            const instructions = await Promise.all(
              calls.map(async (call: any) => {
                if (!call.data) {
                  throw new Error('Invalid call structure: Missing data field');
                }

                return await oNexus.buildComposable({
                  type: 'rawCalldata',
                  data: {
                    to: call.to,
                    calldata: call.data,
                    chainId: currentChainId,
                  },
                });
              }),
            );

            if (!currentRoute) {
              throw new Error(
                'Cannot process transaction: Route is undefined.',
              );
            }

            // Add Ionic deposit instruction
            const depositAddress = projectData?.address as `0x${string}`;
            const depositChainId = projectData?.chainId;

            // Approve ionic to spend USDC
            const approveInstruction = await oNexus?.buildComposable({
              type: 'default',
              data: {
                abi: [
                  {
                    inputs: [
                      { name: 'spender', type: 'address' },
                      { name: 'amount', type: 'uint256' },
                    ],
                    name: 'approve',
                    outputs: [{ name: '', type: 'bool' }],
                    stateMutability: 'nonpayable',
                    type: 'function',
                  },
                ],
                to: mcUSDC.addressOn(depositChainId),
                chainId: depositChainId,
                functionName: 'approve',
                args: [
                  depositAddress,
                  runtimeERC20BalanceOf({
                    targetAddress: oNexus?.addressOn(
                      depositChainId,
                    ) as `0x${string}`,
                    tokenAddress: mcUSDC.addressOn(depositChainId),
                  }),
                ],
              },
            });
            instructions.push(approveInstruction);

            // Deposit instruction
            const ionicDepositInstruction = await oNexus?.buildComposable({
              type: 'default',
              data: {
                abi: [
                  {
                    inputs: [{ name: 'amount', type: 'uint256' }],
                    name: 'mint',
                    outputs: [],
                    stateMutability: 'nonpayable',
                    type: 'function',
                  },
                ],
                to: depositAddress,
                chainId: depositChainId,
                functionName: 'mint',
                args: [
                  runtimeERC20BalanceOf({
                    targetAddress: oNexus?.addressOn(
                      depositChainId,
                    ) as `0x${string}`,
                    tokenAddress: mcUSDC.addressOn(depositChainId),
                  }),
                ],
              },
            });
            instructions.push(ionicDepositInstruction);

            // Add instruction to transfer LP tokens back to EOA
            const transferLpInstruction = await oNexus?.buildComposable({
              type: 'default',
              data: {
                abi: [
                  {
                    constant: false,
                    inputs: [
                      { name: 'to', type: 'address' },
                      { name: 'value', type: 'uint256' },
                    ],
                    name: 'transfer',
                    outputs: [{ name: '', type: 'bool' }],
                    payable: false,
                    stateMutability: 'nonpayable',
                    type: 'function',
                  },
                ],
                to: depositAddress,
                chainId: depositChainId,
                functionName: 'transfer',
                args: [
                  address, // Recipient is the user's EOA
                  runtimeERC20BalanceOf({
                    targetAddress: oNexus?.addressOn(
                      depositChainId,
                    ) as `0x${string}`,
                    tokenAddress: depositAddress,
                  }),
                ],
              },
            });
            instructions.push(transferLpInstruction); // Add transfer as the last instruction

            // get fusion quote
            // Fetches a "Fusion Quote" from Biconomy.
            // This quote includes the transaction cost and requires the trigger transaction details
            // (source token, amount, chain) and the sequence of instructions.
            // The `feeToken` specifies which token will be used to pay for gas.
            // See: https://docs.biconomy.io/multichain-orchestration/comprehensive#get-a-quote-and-execute
            const quote = await meeClient?.getFusionQuote({
              trigger: {
                tokenAddress: currentRoute?.fromToken.address as `0x${string}`,
                amount: BigInt(currentRoute?.fromAmount),
                chainId: currentChainId,
              },
              feeToken: toFeeToken({
                chainId: currentChainId,
                mcToken: mcUSDT,
              }),
              instructions,
            });

            // execute fusion quote
            // Initiates the execution of the obtained Fusion Quote.
            // This generates the actual transaction for the user to sign.
            // See: https://docs.biconomy.io/multichain-orchestration/comprehensive#understanding-fusion-execution
            const { hash } = await meeClient?.executeFusionQuote({
              fusionQuote: quote,
            });

            console.log('--- hash ---', hash);

            return { id: hash };
          } catch (error) {
            console.error('Error processing wallet_sendCalls:', error);
            if (
              typeof error === 'object' &&
              error !== null &&
              'message' in error
            ) {
              console.error('Error message:', error.message);
            }
            if (
              typeof error === 'object' &&
              error !== null &&
              'details' in error
            ) {
              console.error('Error details:', error.details);
            }
            throw error;
          }
        } else if (args.method === 'wallet_getCallsStatus') {
          try {
            const paramsObject = args?.params[0];
            const hash = paramsObject?.id;
            // wait for supertransaction receipt
            // Waits for the entire multi-step, potentially cross-chain transaction sequence to complete.
            // See: https://docs.biconomy.io/multichain-orchestration/comprehensive#get-a-quote-and-execute
            const receipt = await meeClient.waitForSupertransactionReceipt({
              hash,
            });

            console.log('--- receipt ---', receipt);

            return {
              atomic: true,
              chainId: receipt.paymentInfo.chainId,
              id: hash,
              statusCode: receipt.transactionStatus.includes('success')
                ? 200
                : 400,
              status: receipt.transactionStatus,
              receipts: [receipt],
            };
          } catch (error) {
            console.error('Error processing wallet_getCallsStatus:', error);
            throw error;
          }
        } else {
          return originalRequest(args);
        }
      };
    } else {
      console.error(
        '[PATCH] window.ethereum or window.ethereum.request not found. Cannot apply patch.',
      );
    }
  }, [currentRoute]);

  const widgetConfig: WidgetConfig = useMemo(() => {
    const baseConfig: WidgetConfig = {
      toAddress: {
        ...data?.data?.meta,
        name: data?.data?.market?.lpToken.symbol,
        address: data?.data?.market?.address,
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
    return baseConfig;
  }, [isSuccess, widgetTheme.config, projectData, data, openWalletMenu]);

  const analytics = {
    ...data?.data?.analytics,
    position: depositTokenData
      ? formatUnits(depositTokenData, lpTokenDecimals)
      : 0,
  };

  return (
    <Box display="flex" justifyContent="center">
      {type === 'deposit' &&
        (token ? (
          <LiFiWidget
            contractComponent={
              <DepositCard
                underlyingToken={data?.data?.market?.depositToken}
                token={token}
                chainId={projectData?.chainId}
                contractTool={data?.data?.meta}
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
