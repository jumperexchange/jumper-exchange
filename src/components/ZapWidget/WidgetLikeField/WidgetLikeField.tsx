import { useAccount } from '@lifi/wallet-management';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  alpha,
  Box,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { parseUnits } from 'ethers';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ConnectButton } from 'src/components/ConnectButton';
import { TxConfirmation } from 'src/components/ZapWidget/Confirmation/TxConfirmation';
import type { ProjectData } from 'src/components/ZapWidget/ZapWidget';
import {
  useConfig,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import WidgetFieldEndAdornment from './WidgetEndAdornment';
import {
  WidgetFormHelperText,
  CustomFormControl,
} from './WidgetLikeField.style';
import { useChains } from '@/hooks/useChains';
import type { TokenAmount } from '@lifi/sdk';
import { useUserTracking } from '@/hooks/userTracking';
import { TrackingCategory } from 'src/const/trackingKeys';
import { useToken } from '@/hooks/useToken';
import WidgetFieldStartAdornment from '@/components/ZapWidget/WidgetLikeField/WidgetStartAdornment';

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
}

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
  });

  // When the transaction is done, triggering the refetch
  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    setValue('');
    refetch();
    trackEvent({
      category: TrackingCategory.WidgetEvent,
      action: 'zap_withdraw',
      label: 'execution_success',
      data: {
        protocol_name: projectData.integrator,
        chain_id: token.chainId,
        withdrawn_token: token.address,
        amount_withdrawn: value ?? 'NA',
        amount_withdrawn_usd:
          parseFloat(value ?? '0') * parseFloat(tokenInfo?.priceUSD ?? '0'),
        timestamp: new Date(),
      } as any, // Shortcut
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
    const inputValue = e.target.value;
    // Only allow numbers and one decimal point
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  async function onSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();
      writeContract({
        address: (projectData?.withdrawAddress ||
          projectData?.address) as `0x${string}`,
        chainId: projectData?.chainId,
        functionName: 'redeem',
        abi: [
          {
            inputs: [{ name: 'amount', type: 'uint256' }],
            name: 'redeem',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        args: [parseUnits(value, writeDecimals)],
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
        xs={12}
        md={12}
        p={3}
        bgcolor={'#fff'}
        borderRadius={1}
        sx={(theme) => ({
          backgroundColor: theme.palette.surface1.main,
          padding: theme.spacing(2, 3),
        })}
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
            <Typography variant="titleSmall">{label}</Typography>
          </InputLabel>
          <CustomFormControl
            variant="standard"
            aria-autocomplete="none"
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <WidgetFieldStartAdornment
              tokenUSDAmount={tokenUSDAmount}
              image={image}
            />
            <Stack spacing={2} direction="column">
              <Input
                autoComplete="off"
                id="component"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                disabled={isPending || isLoading}
                aria-describedby="withdraw-component-text"
                disableUnderline={true}
              />
              <FormHelperText
                id="withdraw-component-text"
                sx={(theme) => ({
                  marginLeft: `${theme.spacing(2)}!important`,
                  marginTop: '0!important', // There's an override of that property into the main theme, !important cannot be removed yet
                })}
              >
                <Typography
                  variant="bodyXSmall"
                  color="textSecondary"
                  component="span"
                  sx={{
                    color: '#bbbbbb',
                  }}
                >
                  {tokenUSDAmount
                    ? Intl.NumberFormat('en-US', {
                        style: 'currency',
                        notation: 'compact',
                        currency: 'USD',
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits:
                          parseFloat(tokenUSDAmount) > 2 ? 2 : 4,
                      }).format(parseFloat(tokenUSDAmount))
                    : 'NA'}
                </Typography>
              </FormHelperText>
            </Stack>
            {!!account?.isConnected && !!balance && parseFloat(balance) > 0 && (
              <WidgetFieldEndAdornment
                balance={balance}
                mainColor={overrideStyle?.mainColor}
                setValue={setValue}
              />
            )}
          </CustomFormControl>
          {hasErrorText && (
            <WidgetFormHelperText>{hasErrorText}</WidgetFormHelperText>
          )}

          {!account?.isConnected ? (
            <ConnectButton sx={(theme) => ({ marginTop: theme.spacing(2) })} />
          ) : shouldSwitchChain ? (
            <LoadingButton
              sx={(theme) => ({ marginTop: theme.spacing(2) })}
              type="button"
              variant="contained"
              onClick={() => handleSwitchChain(projectData?.chainId)}
            >
              <Typography variant="bodyMediumStrong">Switch chain</Typography>
            </LoadingButton>
          ) : (
            <LoadingButton
              type="submit"
              loading={isPending || isLoading}
              disabled={balance === '0' || isPending}
              variant="contained"
              sx={(theme) => ({
                marginTop: theme.spacing(2),
                borderColor: alpha(theme.palette.surface2.main, 0.08),
                '&.MuiLoadingButton-loading': {
                  border: `1px solid ${overrideStyle?.mainColor ?? theme.palette.primary.main}`,
                },
                '.MuiLoadingButton-loadingIndicator': {
                  color: overrideStyle?.mainColor ?? theme.palette.primary.main,
                },
              })}
            >
              <Typography variant="bodyMediumStrong">
                {contractCalls[0].label}
              </Typography>
            </LoadingButton>
          )}

          {isSuccess && (
            <TxConfirmation
              s={'Withdraw successful'}
              link={`${chain?.metamask.blockExplorerUrls?.[0] ?? 'https://etherscan.io/'}tx/${data}`}
              success={!!isSuccessWriteContract && !isPending ? true : false}
            />
          )}

          {!isSuccess && data && (
            <TxConfirmation
              s={'Check on explorer'}
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
