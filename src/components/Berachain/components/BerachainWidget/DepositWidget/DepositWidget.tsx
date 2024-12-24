import {
  Avatar as MuiAvatar,
  Box,
  darken,
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
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { useEffect, useMemo, useState } from 'react';
import { MaxButton } from '@/components/WidgetLikeField/WidgetLikeField.style';
import type { TransactionOptionsType } from 'royco/types';
import { useAccountBalance, usePrepareMarketAction } from 'royco/hooks';
import {
  parseRawAmountToTokenAmount,
  parseTokenAmountToRawAmount,
} from 'royco/utils';
import { DEFAULT_WALLET_ADDRESS } from '@/const/urls';
import type { EnrichedMarketDataType } from 'royco/queries';
import { switchChain } from '@wagmi/core';
import { CustomLoadingButton } from '../LoadingButton.style';
import type { ExtendedChain } from '@lifi/sdk';
import {
  ConnectButtonWrapper,
  ConnectButtonLabel,
} from '@/components/Navbar/WalletButton.style';
import { useTranslation } from 'react-i18next';
import ConnectButton from '@/components/Navbar/ConnectButton';

interface Image {
  url?: string;
  name?: string;
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
  chain?: ExtendedChain;
  helperText?: {
    before?: Partial<HelperText>;
    after?: Partial<HelperText>;
  };
  overrideStyle?: {
    mainColor?: string;
  };
}

function DepositWidget({
  contractCalls = [],
  label,
  image,
  placeholder,
  chain,
  helperText,
  market,
  overrideStyle = {},
}: WidgetLikeFieldProps) {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { isLoading: isLoadingWallet, data: dataWallet } = useAccountBalance({
    chain_id: market.chain_id!,
    account: account?.address || '',
    tokens: market ? [market.input_token_data.contract_address] : [],
  });

  const balance = parseRawAmountToTokenAmount(
    dataWallet?.[0]?.raw_amount?.toString() ?? '0',
    market?.input_token_data.decimals ?? 0,
  );
  const wagmiConfig = useConfig();
  const theme = useTheme();
  const [inputValue, setInputValue] = useState<string>('');

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
    chain_id: market?.chain_id!,
    market_id: market?.market_id!,
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

  const [contractCallIndex, setContractCallIndex] = useState(0);
  const maxInputValue = useMemo(() => {
    return parseRawAmountToTokenAmount(
      market?.quantity_ip ?? '0', // @note: AP fills IP quantity
      market?.input_token_data.decimals ?? 0,
    );
  }, [market]);

  function onClickMaxButton() {
    onChangeValue(
      (balance > maxInputValue ? maxInputValue : balance).toString(),
    );
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

  const shouldSwitchChain = useMemo(() => {
    if (
      writeContractOptions.length > 0 &&
      account?.chainId !== writeContractOptions[0]?.chainId
    ) {
      return true;
    }
    return false;
  }, [account?.chainId, writeContractOptions]);

  const {
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    isError: isTxConfirmError,
    status: confirmationStatus,
  } = useWaitForTransactionReceipt({
    chainId: market.chain_id ?? undefined,
    hash: txHash,
    confirmations: 2,
    pollingInterval: 1_000,
  });

  const hasErrorDisablingButton = useMemo(() => {
    if (
      (parseFloat(inputValue) ?? 0) >
      parseRawAmountToTokenAmount(
        market?.quantity_ip ?? '0', // @note: AP fills IP quantity
        market?.input_token_data.decimals ?? 0,
      )
    ) {
      return true;
    }

    if ((parseFloat(inputValue) ?? 0) > balance) {
      return true;
    }

    return null;
  }, [market, inputValue, balance]);

  const hasErrorText = useMemo(() => {
    if (
      (parseFloat(inputValue) ?? 0) >
      parseRawAmountToTokenAmount(
        market?.quantity_ip ?? '0', // @note: AP fills IP quantity
        market?.input_token_data.decimals ?? 0,
      )
    ) {
      return 'Above fillable';
    }

    if ((parseFloat(inputValue) ?? 0) > balance) {
      return 'Above balance';
    }

    if (isTxConfirmError) {
      return 'Impossible to confirm tx';
    }

    if (isTxError) {
      return 'An error occurred';
    }

    return null;
  }, [market, inputValue, balance, isTxError, isTxConfirmError, txError]);

  useEffect(() => {
    if (isTxConfirmed) {
      setContractCallIndex(contractCallIndex + 1);
    }
  }, [isTxConfirmed]);

  function onChangeValue(value: string = '0') {
    setInputValue(value);
  }

  async function onSubmit(e: React.FormEvent) {
    try {
      // TODO: to remove
      // eslint-disable-next-line no-console
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
      <FormControl
        error={isTxError || !!hasErrorText}
        variant="standard"
        aria-autocomplete="none"
      >
        <FormHelperText
          id="component-text"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 1,
          }}
        >
          <Typography component="span"></Typography>
          {/* {account?.isConnected && (
            <Typography variant="body2" color="textSecondary" component="span">
              Balance: {balance}
            </Typography>
          )} */}
        </FormHelperText>
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
          sx={{
            padding: '16px',
            '& input': {
              fontSize: '24px',
              fontWeight: 700,
              lineHeight: '36px',
              marginLeft: '8px',
            },
            '& input::placeholder': {
              fontSize: '24px',
              fontWeight: 700,
              lineHeight: '36px',
              marginLeft: '8px',
            },
          }}
          startAdornment={
            image && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  width: 'auto',
                }}
              >
                <>
                  <WalletCardBadge
                    overlap="circular"
                    className="badge"
                    sx={{ maringRight: '8px' }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      image.badge && (
                        <MuiAvatar
                          alt={image.badge.name}
                          sx={(theme: any) => ({
                            width: '18px',
                            height: '18px',
                            border: `2px solid ${theme.palette.surface2.main}`,
                          })}
                        >
                          {image.badge.name && (
                            <TokenImage
                              token={{
                                name: image.badge.name,
                                logoURI: image.badge.url,
                              }}
                            />
                          )}
                        </MuiAvatar>
                      )
                    }
                  >
                    <WalletAvatar>
                      {image.name && (
                        <TokenImage
                          token={{
                            name: image.name,
                            logoURI: image.url,
                          }}
                        />
                      )}
                    </WalletAvatar>
                  </WalletCardBadge>
                </>
                {/* <Box sx={{ marginTop: '4px', minWidth: '100px' }}>
                  <Typography
                    variant="bodyXSmall"
                    color="textSecondary"
                    component="span"
                  >
                    /{' '}
                    {Intl.NumberFormat('en-US', {
                      notation: 'standard',
                      useGrouping: true,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 5,
                    }).format(maxInputValue)}{' '}
                    available
                  </Typography>
                </Box> */}
              </Box>
            )
          }
          endAdornment={
            // balance > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '20px',
                width: '96px',
              }}
            >
              <MaxButton
                sx={{ p: '5px 10px' }}
                aria-label="menu"
                mainColor={overrideStyle?.mainColor}
                onClick={onClickMaxButton}
              >
                max
              </MaxButton>
              {account?.isConnected && (
                <Box sx={{ marginTop: '4px' }}>
                  <Typography
                    variant="bodyXSmall"
                    color="textSecondary"
                    component="span"
                  >
                    /{' '}
                    {Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      useGrouping: true,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 4,
                    }).format(balance)}
                  </Typography>
                </Box>
              )}
            </Box>
          }
        />
        <FormHelperText
          id="component-text"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 1,
          }}
        >
          {/* <Typography variant="body2" color="textSecondary" component="span">
            {Intl.NumberFormat('en-US', {
              notation: 'standard',
              useGrouping: true,
              minimumFractionDigits: 0,
              maximumFractionDigits: 8,
            }).format(maxInputValue)}{' '}
            {market?.input_token_data.symbol.toUpperCase()} Fillable in Total
          </Typography> */}
          {hasErrorText && (
            <Typography component="span">{hasErrorText}</Typography>
          )}
          {txHash && (
            <Typography
              component="a"
              href={`${chain?.metamask.blockExplorerUrls?.[0] ?? 'https://etherscan.io'}/tx/${txHash}`}
              target="_blank"
            >
              Transaction link
            </Typography>
          )}
        </FormHelperText>
      </FormControl>
      {!account?.isConnected ? (
        <ConnectButton />
      ) : shouldSwitchChain ? (
        <CustomLoadingButton
          overrideStyle={overrideStyle}
          type="button"
          // loading={isLoading || isTxPending || isTxConfirming}
          variant="contained"
          onClick={async () => {
            try {
              await switchChain(wagmiConfig, {
                chainId: writeContractOptions[0]?.chainId,
              });
            } catch (error) {
              // TODO: to remove
              // eslint-disable-next-line no-console
              console.error(error);
            }
          }}
        >
          <Typography variant="bodyMediumStrong">Switch chain</Typography>
        </CustomLoadingButton>
      ) : writeContractOptions.length === 0 ? (
        <CustomLoadingButton
          type="button"
          overrideStyle={overrideStyle}
          disabled
          // loading={isLoading || isTxPending || isTxConfirming}
          variant="contained"
          onClick={() => {}}
        >
          <Typography variant="bodyMediumStrong">Deposit</Typography>
        </CustomLoadingButton>
      ) : (
        writeContractOptions[contractCallIndex] && (
          <CustomLoadingButton
            type="submit"
            loading={isLoading || isTxPending || isTxConfirming}
            variant="contained"
            disabled={!!hasErrorDisablingButton}
            overrideStyle={overrideStyle}
          >
            <Typography variant="bodyMediumStrong">
              {writeContractOptions[contractCallIndex].label}
            </Typography>
          </CustomLoadingButton>
        )
      )}

      {contractCallIndex !== 0 &&
        contractCallIndex > writeContractOptions.length - 1 && (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'grid', // 'place-content-center' is equivalent to a grid with centered content.
              placeContent: 'center', // Centers content horizontally and vertically.
              alignItems: 'start', // Aligns items at the start along the cross-axis.
            }}
          >
            {/*<div className="h-full w-full place-content-center items-start">*/}
            <Typography variant="body2" color="textSecondary">
              Deposited with success!
            </Typography>
          </Box>
        )}
    </Box>
  );
}

export default DepositWidget;
