import {
  Avatar as MuiAvatar,
  Box,
  Button,
  FormHelperText,
  InputLabel,
  Typography,
  useTheme,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import {
  WalletAvatar,
  WalletCardBadge,
} from '@/components/Menus/WalletMenu/WalletCard.style';
import TokenImage from '@/components/Portfolio/TokenImage';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getEthersSigner } from '@/components/WidgetLikeField/utils';
import { MaxButton } from '@/components/WidgetLikeField/WidgetLikeField.style';
import type { TransactionOptionsType } from 'royco/types';
import { usePrepareMarketAction } from 'royco/hooks';
import {
  parseRawAmount,
  parseRawAmountToTokenAmount,
  parseTokenAmountToRawAmount,
} from 'royco/utils';
import { DEFAULT_WALLET_ADDRESS } from '@/const/urls';
import type { EnrichedMarketDataType } from 'royco/queries';

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

interface HelperText {
  left: string | React.ReactNode;
  right: string | React.ReactNode;
}

interface WidgetLikeFieldProps {
  market: EnrichedMarketDataType;
  contractCalls: TransactionOptionsType[];
  label: string;
  placeholder?: string;
  image?: Image & { badge?: Image };
  maxButtonHandlerValue?: number | string | null;
  helperText?: {
    before?: Partial<HelperText>;
    after?: Partial<HelperText>;
  };
  overrideStyle?: {
    mainColor?: string;
  };
}

function WidgetLikeField({
  contractCalls = [],
  label,
  image,
  placeholder,
  maxButtonHandlerValue,
  helperText,
  market,
  overrideStyle = {},
}: WidgetLikeFieldProps) {
  const theme = useTheme();
  const { account } = useAccount();
  const [inputValue, setInputValue] = useState<string | number | null>(null);

  const userType = 'ap';
  const offerType = 'market';
  const fundingType = 'wallet';
  const vaultIncentiveActionType = 'add';
  const {
    isValid,
    isLoading,
    isReady,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
    incentiveData,
  } = usePrepareMarketAction({
    chain_id: market.chain_id!,
    market_id: market.market_id!,
    market_type: 'recipe',
    user_type: userType,
    offer_type: offerType,
    account: account?.address,
    quantity: parseTokenAmountToRawAmount(
      String(inputValue) ?? '0',
      market?.input_token_data.decimals ?? 0,
    ),
    funding_vault: DEFAULT_WALLET_ADDRESS,
    token_ids: [],
    token_amounts: [],
    expiry: '0',
    token_rates: [],
    start_timestamps: [],
    end_timestamps: [],

    vault_incentive_action: vaultIncentiveActionType,
    offer_validation_url: `/api/validate`,
    frontend_fee_recipient:
      process.env.NEXT_PUBLIC_ROYCO_FRONTEND_FEE_RECIPIENT,
  });

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('prep', {
    chain_id: market.chain_id,
    market_id: market.market_id,
    market_type: 'recipe',
    user_type: userType,
    offer_type: offerType,
    account: account?.address,
    quantity: parseTokenAmountToRawAmount(
      String(inputValue) ?? '0',
      market?.input_token_data.decimals ?? 0,
    ),
    funding_vault: DEFAULT_WALLET_ADDRESS,
    token_ids: [],
    token_amounts: [],
    expiry: '0',
    token_rates: [],
    start_timestamps: [],
    end_timestamps: [],

    vault_incentive_action: vaultIncentiveActionType,
    offer_validation_url: `/api/validate`,
    frontend_fee_recipient:
      process.env.NEXT_PUBLIC_ROYCO_FRONTEND_FEE_RECIPIENT,
  });

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('result', {
    isValid,
    isLoading,
    isReady,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
    incentiveData,
  });

  const [contractCallIndex, setContractCallIndex] = useState(0);

  const contractMutations = [];

  function onClickMaxButton() {
    onChangeValue(maxButtonHandlerValue);
  }

  const {
    status: txStatus,
    data: txHash,
    isIdle: isTxIdle,
    isPending: isTxPending,
    isError: isTxError,
    error: txError,
    writeContract,
    reset: resetTx,
  } = useWriteContract();

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log(
    'writecontract',
    {
      status: txStatus,
      data: txHash,
      isIdle: isTxIdle,
      isPending: isTxPending,
      isError: isTxError,
      error: txError,
      writeContract,
      reset: resetTx,
    },
    writeContractOptions,
  );

  const {
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    isError: isTxConfirmError,
    status: confirmationStatus,
  } = useWaitForTransactionReceipt({
    chainId: market.chain_id ?? undefined,
    hash: txHash,
    confirmations: 2,
    query: {
      enabled: !txHash,
    },
  });

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('waitTransactionReceipt', {
    txHash,
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    isError: isTxConfirmError,
    status: confirmationStatus,
  });

  useEffect(() => {
    if (txStatus === 'success') {
      setContractCallIndex(contractCallIndex + 1);
    }
  }, [txStatus]);

  function onChangeValue(value: string | number | null = '0') {
    setInputValue(value);
  }

  // return <div>TOTO</div>
  /*
  contractCalls.forEach((contractCall, index) => {
    contractMutations.push(useMutation({
      mutationKey: ['signMessage', account.address],
      mutationFn: async (value) => {
        console.log('value:', value)
        let result;
        switch (contractCall.type) {
          case 'sign': {
            const signer = await getEthersSigner(config);
            const message = contractCall.message;
           result = await signer.signMessage(message);
           break;
          }
          case 'send': {
            // To be implemented
           result = contractCall.data;
            break;
          }
          default: {
            throw new Error('Case not implemented');
          }
        }

        return contractCall.onVerify(result);
      },
      onSuccess: () => {
        console.log('onSuccess triggered');
        setContractCallIndex(index + 1);
      },
    }));
  });*/

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('index', contractCallIndex);
  /* TODO: enable completed state when finishing all transactions
  if (contractCalls.length === contractCallIndex) {
    return (
      <Button
        disabled
        type="button"
        variant="contained"
        fullWidth
        sx={{
          '&.MuiButtonBase-root': {
            backgroundColor: overrideStyle?.mainColor ?? theme.palette.primary.main,
            color: theme.palette.text.primary,
          }
        }}
      >
        <Typography variant="bodyMediumStrong">Completed</Typography>
      </Button>
    );
  }*/

  async function onSubmit(e: React.FormEvent) {
    try {
      // TODO: to remove
      // eslint-disable-next-line no-console
      console.log('submitted', inputValue);
      e.preventDefault();

      resetTx();
      writeContract({
        ...writeContractOptions[contractCallIndex],
      });
    } catch (e) {
      // TODO: to remove
      // eslint-disable-next-line no-console
      console.error('ERROR SENDING', e);
    }
  }

  return (
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
        error={isTxError}
        variant="standard"
        aria-autocomplete="none"
      >
        {helperText?.before && (
          <FormHelperText
            id="component-text"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 1,
            }}
          >
            <Typography component="span">{helperText.before?.left}</Typography>
            <Typography component="span">{helperText.before?.right}</Typography>
          </FormHelperText>
        )}
        <OutlinedInput
          autoComplete="off"
          id="component"
          defaultValue=""
          value={inputValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeValue(event.target.value);
          }}
          placeholder={placeholder}
          aria-describedby="component-text"
          sx={{ padding: '0.6rem 1rem' }}
          startAdornment={
            image && (
              <WalletCardBadge
                sx={{ marginRight: '10px' }}
                overlap="circular"
                className="badge"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  image.badge && (
                    <MuiAvatar
                      alt={image.badge.name}
                      sx={(theme) => ({
                        width: '18px',
                        height: '18px',
                        border: `2px solid ${theme.palette.surface2.main}`,
                      })}
                    >
                      <TokenImage
                        token={{
                          name: image.badge.name,
                          logoURI: image.badge.url,
                        }}
                      />
                    </MuiAvatar>
                  )
                }
              >
                <WalletAvatar>
                  <TokenImage
                    token={{
                      name: image.name,
                      logoURI: image.url,
                    }}
                  />
                </WalletAvatar>
              </WalletCardBadge>
            )
          }
          endAdornment={
            maxButtonHandlerValue && (
              <MaxButton
                sx={{ p: '5px 10px' }}
                aria-label="menu"
                mainColor={overrideStyle?.mainColor}
                onClick={onClickMaxButton}
              >
                max
              </MaxButton>
            )
          }
        />
        {helperText?.after && (
          <FormHelperText
            id="component-text"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 1,
            }}
          >
            <Typography component="span">{helperText.after?.left}</Typography>
            <Typography component="span">{helperText.after?.right}</Typography>
          </FormHelperText>
        )}
      </FormControl>
      {writeContractOptions[contractCallIndex] && (
        <LoadingButton
          type="submit"
          loading={isLoading || isTxPending || isTxConfirming}
          variant="contained"
          sx={{
            '&.MuiLoadingButton-loading': {
              border: `1px solid ${overrideStyle?.mainColor ?? theme.palette.primary.main}`,
            },
            '.MuiLoadingButton-loadingIndicator': {
              color: overrideStyle?.mainColor ?? theme.palette.primary.main,
            },
          }}
        >
          <Typography variant="bodyMediumStrong">
            {writeContractOptions[contractCallIndex].label}
          </Typography>
        </LoadingButton>
      )}
    </Box>
  );
}

export default WidgetLikeField;
