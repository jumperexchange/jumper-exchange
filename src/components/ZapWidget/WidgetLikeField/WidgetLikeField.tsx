import { useAccount } from '@lifi/wallet-management';
import {
  alpha,
  Box,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  Stack,
  Typography,
  Button,
  buttonClasses,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { parseUnits } from 'ethers';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ConnectButton } from 'src/components/ConnectButton';
import { TxConfirmation } from 'src/components/ZapWidget/Confirmation/TxConfirmation';
import {
  useConfig,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import WithdrawInputEndAdornment from '../Withdraw/WithdrawInputEndAdornment';
import { WidgetFormHelperText } from './WidgetLikeField.style';
import { useChains } from '@/hooks/useChains';
import type { TokenAmount } from '@lifi/sdk';
import { useUserTracking } from '@/hooks/userTracking';
import { TrackingCategory } from 'src/const/trackingKeys';
import { useToken } from '@/hooks/useToken';
import type { AbiFunction, AbiParameter } from 'viem';
import { ProjectData } from 'src/types/questDetails';
import { SelectCard } from 'src/components/Cards/SelectCard/SelectCard';
import { SelectCardMode } from 'src/components/Cards/SelectCard/SelectCard.styles';
import { formatInputAmount } from '@lifi/widget';

interface WithdrawTrackingData {
  protocol_name: string;
  chain_id: number;
  withdrawn_token: string;
  amount_withdrawn: string;
  amount_withdrawn_usd: number;
  timestamp: Date;
  [key: string]: string | number | boolean | Date;
}

interface Image {
  url: string;
  name: string;
}

interface BaseContractCall {
  label: string;
  onVerify: <T>(args: T | unknown) => Promise<boolean>;
}

interface SignContractCall extends BaseContractCall {
  type: 'sign';
  message: string;
}

interface SendContractCall extends BaseContractCall {
  type: 'send';
  data: string;
}

type ContractCall = SignContractCall | SendContractCall;

interface WidgetLikeFieldProps {
  contractCalls: ContractCall[];
  label: string;
  placeholder?: string;
  image?: React.ReactNode;
  hasMaxButton?: boolean;
  helperText?: {
    left?: string;
    right?: string;
  };
  overrideStyle?: {
    mainColor?: string;
  };
  balance?: string;
  projectData: ProjectData;
  writeDecimals: number;
  token: TokenAmount;
  refetch: () => void;
  withdrawAbi?: AbiFunction;
}

const NUM_DECIMALS = 1;

function WidgetLikeField({
  contractCalls,
  label,
  image,
  placeholder,
  hasMaxButton = true,
  helperText,
  token,
  overrideStyle = {},
  balance,
  projectData,
  writeDecimals,
  refetch,
  withdrawAbi,
}: WidgetLikeFieldProps) {
  const { trackEvent } = useUserTracking();
  const chains = useChains();
  const chain = useMemo(
    () => chains.getChainById(projectData?.chainId),
    [projectData?.chainId],
  );
  const wagmiConfig = useConfig();
  const { account } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const {
    writeContract,
    data,
    isPending,
    isError,
    error,
    isSuccess: isSuccessWriteContract,
  } = useWriteContract();
  const { token: tokenInfo } = useToken(token.chainId, token.address);

  const [value, setValue] = useState<string>('');
  const tokenUSDAmount = useMemo<string>(() => {
    if (!value || !tokenInfo?.priceUSD) {
      return '0';
    }
    return (parseFloat(tokenInfo?.priceUSD) * parseFloat(value)).toString();
  }, [value, tokenInfo]);

  const {
    data: transactionReceiptData,
    isLoading,
    isSuccess,
  } = useWaitForTransactionReceipt({
    chainId: projectData?.chainId,
    hash: data,
    confirmations: 5,
    pollingInterval: 1_000,
    query: {
      enabled: !!projectData?.chainId && !!data,
    },
  });

  // When the transaction is done, triggering the refetch
  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    setValue('');
    refetch();

    const trackingData = {
      protocol_name: projectData.integrator,
      chain_id: token.chainId,
      withdrawn_token: token.address,
      amount_withdrawn: value ?? 'NA',
      amount_withdrawn_usd:
        parseFloat(value ?? '0') * parseFloat(tokenInfo?.priceUSD ?? '0'),
      timestamp: new Date().toISOString(),
    };

    trackEvent({
      category: TrackingCategory.WidgetEvent,
      action: 'zap_withdraw',
      label: 'execution_success',
      data: trackingData,
      isConversion: true,
    });
  }, [transactionReceiptData]);

  const shouldSwitchChain = useMemo(() => {
    if (!!projectData?.address && account?.chainId !== projectData?.chainId) {
      return true;
    }
    return false;
  }, [account?.chainId, projectData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatInputAmount(rawValue, NUM_DECIMALS, true);
    setValue(formattedValue);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatInputAmount(rawValue, NUM_DECIMALS);
    setValue(formattedValue);
  };

  async function onSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();

      // Generate dynamic args based on ABI inputs
      const abi = withdrawAbi || {
        inputs: [{ name: 'amount', type: 'uint256' }],
        name: 'redeem',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
      };

      const dynamicArgs = abi.inputs?.map((input: AbiParameter) => {
        if (input.type === 'uint256') {
          return parseUnits(value, writeDecimals);
        } else if (input.type === 'address') {
          // Use the user's account address
          return account?.address as `0x${string}`;
        }
      }) || [parseUnits(value, writeDecimals)];

      writeContract({
        address: (projectData?.withdrawAddress ||
          projectData?.address) as `0x${string}`,
        chainId: projectData?.chainId,
        functionName: (withdrawAbi?.name || 'redeem') as 'redeem',
        abi: withdrawAbi
          ? [withdrawAbi]
          : [
              {
                inputs: [{ name: 'amount', type: 'uint256' }],
                name: 'redeem',
                outputs: [{ name: '', type: 'uint256' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
            ],
        args: dynamicArgs as unknown as readonly [bigint],
      });
    } catch (e) {
      console.error(e);
    }
  }

  const hasErrorText = useMemo(() => {
    if (balance && (parseFloat(value) ?? 0) > parseFloat(balance)) {
      return `You have not enough tokens. Current balance: ${balance}.`;
    }

    if (error?.message) {
      return `An error occurred during the execution: ${error?.name}. Please check your wallet.`;
    }

    return null;
  }, [value, balance, error]);

  const handleSwitchChain = async (chainId: number) => {
    try {
      const { id } = await switchChainAsync({
        chainId: chainId,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Grid container justifyContent={'center'}>
      <Grid
        p={3}
        borderRadius={1}
        sx={(theme) => ({
          backgroundColor: (theme.vars || theme).palette.surface1.main,
          padding: theme.spacing(2, 3),
        })}
        size={{
          xs: 12,
          md: 12,
        }}
      >
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
          noValidate
          autoComplete="off"
          onSubmit={onSubmit}
        >
          <InputLabel htmlFor="component" sx={{ marginBottom: 2 }}>
            <Typography
              variant="titleSmall"
              sx={(theme) => ({
                color: (theme.vars || theme).palette.text.primary,
              })}
            >
              {label}
            </Typography>
          </InputLabel>

          {/** @TODO change font size and weight */}
          <SelectCard
            id="component"
            name="component"
            mode={SelectCardMode.Input}
            placeholder="0"
            value={value}
            description={
              tokenUSDAmount
                ? Intl.NumberFormat('en-US', {
                    style: 'currency',
                    notation: 'compact',
                    currency: 'USD',
                    useGrouping: true,
                    minimumFractionDigits: 2,
                    maximumFractionDigits:
                      parseFloat(tokenUSDAmount) > 2 ? 2 : 4,
                  }).format(parseFloat(tokenUSDAmount))
                : 'NA'
            }
            startAdornment={image}
            endAdornment={
              !!account?.isConnected &&
              !!balance &&
              parseFloat(balance) > 0 && (
                <WithdrawInputEndAdornment
                  balance={'200'}
                  mainColor={overrideStyle?.mainColor}
                  setValue={setValue}
                />
              )
            }
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
          {hasErrorText && (
            <WidgetFormHelperText>{hasErrorText}</WidgetFormHelperText>
          )}

          {!account?.isConnected ? (
            <ConnectButton sx={(theme) => ({ marginTop: theme.spacing(2) })} />
          ) : shouldSwitchChain ? (
            <Button
              sx={(theme) => ({ marginTop: theme.spacing(2) })}
              type="button"
              variant="contained"
              onClick={() => handleSwitchChain(projectData?.chainId)}
            >
              <Typography variant="bodyMediumStrong">Switch chain</Typography>
            </Button>
          ) : (
            <Button
              type="submit"
              loading={isPending || isLoading}
              disabled={balance === '0' || isPending}
              variant="contained"
              sx={(theme) => ({
                marginTop: theme.spacing(2),
                borderColor: alpha(theme.palette.surface2.main, 0.08),
                [`&.${buttonClasses.loading}`]: {
                  border: `1px solid ${overrideStyle?.mainColor ?? theme.palette.primary.main}`,
                },
                [`&.${buttonClasses.loadingIndicator}`]: {
                  color: overrideStyle?.mainColor ?? theme.palette.primary.main,
                },
              })}
            >
              <Typography variant="bodyMediumStrong">
                {contractCalls[0].label}
              </Typography>
            </Button>
          )}

          {isSuccess && (
            <TxConfirmation
              description={'Withdraw successful'}
              link={`${chain?.metamask.blockExplorerUrls?.[0] ?? 'https://etherscan.io/'}tx/${data}`}
              success={!!isSuccessWriteContract && !isPending ? true : false}
            />
          )}

          {!isSuccess && data && (
            <TxConfirmation
              description={'Check on explorer'}
              link={`${chain?.metamask.blockExplorerUrls?.[0] ?? 'https://etherscan.io/'}tx/${data}`}
              success={false}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default WidgetLikeField;
