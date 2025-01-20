import {
  Avatar as MuiAvatar,
  Box,
  FormHelperText,
  InputLabel,
  Typography,
  useTheme,
  Grid,
  Link,
  Input,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import {
  WalletAvatar,
  WalletCardBadge,
} from '@/components/Menus/WalletMenu/WalletCard.style';
import TokenImage from '@/components/Portfolio/TokenImage';
import LoadingButton from '@mui/lab/LoadingButton';
import { useConfig, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';
import {
  MaxButton,
  WidgetFormHelperText,
  WidgetLikeInput,
} from './WidgetLikeField.style';
import { useWriteContract } from 'wagmi';
import { parseUnits } from 'ethers';
import { alpha } from '@mui/material';
import type { ProjectData } from 'src/components/ZapWidget/ZapWidget';
import { ConnectButton } from 'src/components/ConnectButton';
import { switchChain } from '@wagmi/core';
import { useAccount } from '@lifi/wallet-management';
import { TxConfirmation } from 'src/components/ZapWidget/Confirmation/TxConfirmation';
import { Breakpoint } from '@mui/material';
import WidgetFieldStartAdornment from './WidgetStartAdornment';
import WidgetFieldEndAdornment from './WidgetEndAdornment';
import * as React from 'react';
import { ExtendedTokenAmount } from '@/utils/getTokens';
import { getTokenBalance, TokenAmount } from '@lifi/sdk';
import { useUserTracking } from '@/hooks/userTracking';
import { TrackingCategory } from 'src/const/trackingKeys';
import { useToken } from '@/hooks/useToken';
import { formatTokenAmount } from '@/utils/format';

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
  const theme = useTheme();
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
  const tokenUSDAmount = useMemo<string>(() => {
    return (parseFloat(tokenInfo?.priceUSD ?? '0') * parseFloat(balance ?? '0')).toString();
  }, [balance, tokenInfo]);

  const [value, setValue] = useState<string>('');

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
        project: projectData.project,
        chain_id: token.chainId,
        withdrawn_token: token.address,
        amount_withdrawn: value ?? 'NA',
        amount_withdrawn_usd: parseFloat(value ?? '0') * parseFloat(tokenInfo?.priceUSD ?? '0'),
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
    <Grid container justifyContent={'center'} maxWidth={416}>
      <Grid
        xs={12}
        md={12}
        p={3}
        bgcolor={'#fff'}
        borderRadius={1}
        sx={{
          backgroundColor: theme.palette.surface1.main,
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
          <InputLabel htmlFor="component" sx={{ marginBottom: 1 }}>
            <Typography variant="titleSmall">{label}</Typography>
          </InputLabel>
          <FormControl
            error={!!hasErrorText}
            variant="standard"
            aria-autocomplete="none"
          >
            <WidgetLikeInput
              autoComplete="off"
              id="component"
              value={value}
              onChange={handleInputChange}
              placeholder={placeholder}
              disabled={isPending || isLoading}
              aria-describedby="component-text"
              disableUnderline={true}
              // sx={{
              //   borderRadius: theme.spacing(2),
              //   padding: '16px',
              //   backgroundColor: theme.palette.surface2.main,
              //   boxShadow:
              //     theme.palette.mode === 'light'
              //       ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
              //       : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
              //   maxWidth: 416,
              //   '& input': {
              //     fontSize: '24px',
              //     fontWeight: 700,
              //     lineHeight: '36px',
              //     marginLeft: '8px',
              //   },
              //   '& input::placeholder': {
              //     fontSize: '24px',
              //     fontWeight: 700,
              //     lineHeight: '36px',
              //     marginLeft: '8px',
              //   },
              //   '& .MuiInput-underline:before': { borderBottom: 'none' },
              //   '& .MuiInput-underline:after': { borderBottom: 'none' },
              //   '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
              //     borderBottom: 'none',
              //   },
              // }}
              startAdornment={<WidgetFieldStartAdornment
                tokenUSDAmount={tokenUSDAmount}
                image={image}
              />}
              endAdornment={
                !!account?.isConnected &&
                !!balance &&
                parseFloat(balance) > 0 && (
                  <WidgetFieldEndAdornment
                    balance={balance}
                    mainColor={overrideStyle?.mainColor}
                    setValue={setValue}
                  />
                  // <Box
                  //   sx={{
                  //     display: 'flex',
                  //     flexDirection: 'column',
                  //   }}
                  // >
                  //   <MaxButton
                  //     sx={{ p: '5px 10px', marginTop: '16px' }}
                  //     aria-label="menu"
                  //     mainColor={overrideStyle?.mainColor}
                  //     onClick={() => setValue(balance ?? '0')}
                  //   >
                  //     max
                  //   </MaxButton>
                  //   <Box sx={{ marginTop: '4px' }}>
                  //     <Typography
                  //       variant="bodyXSmall"
                  //       color="textSecondary"
                  //       component="span"
                  //     >
                  //       /{' '}
                  //       {Intl.NumberFormat('en-US', {
                  //         notation: 'compact',
                  //         useGrouping: true,
                  //         minimumFractionDigits: 0,
                  //         maximumFractionDigits:
                  //           parseFloat(balance) > 1 ? 1 : 4,
                  //       }).format(parseFloat(balance))}
                  //     </Typography>
                  //   </Box>
                  // </Box>
                )
              }
            />
            {hasErrorText && (
              <WidgetFormHelperText>{hasErrorText}</WidgetFormHelperText>
            )}
          </FormControl>

          {!account?.isConnected ? (
            <ConnectButton sx={{ marginTop: theme.spacing(2) }} />
          ) : shouldSwitchChain ? (
            <LoadingButton
              sx={{ marginTop: theme.spacing(2) }}
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
              sx={{
                marginTop: theme.spacing(2),
                borderColor: alpha(theme.palette.surface2.main, 0.08),
                '&.MuiLoadingButton-loading': {
                  border: `1px solid ${overrideStyle?.mainColor ?? theme.palette.primary.main}`,
                },
                '.MuiLoadingButton-loadingIndicator': {
                  color: overrideStyle?.mainColor ?? theme.palette.primary.main,
                },
              }}
            >
              <Typography variant="bodyMediumStrong">
                {contractCalls[0].label}
              </Typography>
            </LoadingButton>
          )}

          {isSuccess && (
            <TxConfirmation
              s={'Withdraw successful'}
              link={
                projectData?.chain === 'ethereum'
                  ? 'https://etherscan.io/tx/' + data
                  : 'https://basescan.org/tx/' + data
              }
              success={!!isSuccessWriteContract && !isPending ? true : false}
            />
          )}

          {!isSuccess && data && (
            <TxConfirmation
              s={'Check on explorer'}
              link={
                projectData?.chain === 'ethereum'
                  ? 'https://etherscan.io/tx/' + data
                  : 'https://basescan.org/tx/' + data
              }
              success={false}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default WidgetLikeField;
