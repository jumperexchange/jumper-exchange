import {
  Avatar as MuiAvatar,
  Box,
  FormHelperText,
  Input,
  Typography,
  useTheme,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
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
import { useTranslation } from 'react-i18next';
import ConnectButton from '@/components/Navbar/ConnectButton';
import { TxConfirmation } from '../TxConfirmation';
import {
  BerachainDepositInputBackground,
  BoxForm,
} from './WidgetDeposit.style';
import DepositInfo from '@/components/Berachain/components/BerachainWidget/DepositWidget/DepositInfo';

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
      return `Not enough positions left. Still available to deposit: ${Intl.NumberFormat(
        'en-US',
        {
          notation: 'standard',
          useGrouping: true,
          minimumFractionDigits: 0,
          maximumFractionDigits: 5,
        },
      ).format(maxInputValue)}.`;
    }

    if ((parseFloat(inputValue) ?? 0) > balance) {
      return `You have not enough tokens. Current balance: ${balance}.`;
    }

    if (isTxConfirmError) {
      return 'Impossible to confirm the transaction.';
    }

    if (isTxError) {
      return 'An error occurred during the execution. Please check your wallet.';
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

      if (
        contractCallIndex === 0 &&
        writeContractOptions.length > 0 &&
        writeContractOptions?.[0]?.args.length === 2 &&
        !!writeContractOptions?.[0].requiredApprovalAmount
      ) {
        writeContractOptions[0].args[1] =
          writeContractOptions?.[0]?.requiredApprovalAmount;
      }

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
    <>
      <BoxForm noValidate autoComplete="off" onSubmit={onSubmit}>
        <DepositInfo market={market} />
        <BerachainDepositInputBackground>
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
              <Typography component="span" sx={{ fontWeight: 'bold' }}>
                Deposit
              </Typography>
            </FormHelperText>
            <Input
              autoComplete="off"
              id="component"
              value={inputValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeValue(event.target.value);
              }}
              placeholder={placeholder}
              aria-describedby="component-text"
              disableUnderline={true}
              sx={{
                borderRadius: theme.spacing(2),
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
                '& .MuiInput-underline:before': { borderBottom: 'none' },
                '& .MuiInput-underline:after': { borderBottom: 'none' },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  borderBottom: 'none',
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
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
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
                balance > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '20px',
                      width: '96px',
                      alignItems: 'flex-end',
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
                )
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
              {hasErrorText && (
                <Typography
                  component="span"
                  variant="bodySmall"
                  sx={(theme) => ({
                    marginBottom: theme.spacing(1),
                    typography: {
                      xs: theme.typography.bodyXSmall,
                      sm: theme.typography.bodySmall,
                    },
                  })}
                >
                  {hasErrorText}
                </Typography>
              )}
            </FormHelperText>
          </FormControl>
        </BerachainDepositInputBackground>
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
                {writeContractOptions[contractCallIndex].label.toLowerCase() ===
                'fill ip offers'
                  ? 'Deposit'
                  : writeContractOptions[contractCallIndex].label}
              </Typography>
            </CustomLoadingButton>
          )
        )}

        {contractCallIndex !== 0 &&
        contractCallIndex > writeContractOptions.length - 1 &&
        txHash ? (
          <TxConfirmation
            s={'Deposit successful'}
            link={`${chain?.metamask.blockExplorerUrls?.[0] ?? 'https://etherscan.io'}/tx/${txHash}`}
            success={true}
          />
        ) : (
          txHash && (
            <TxConfirmation
              s={'Approval transaction link'}
              link={`${chain?.metamask.blockExplorerUrls?.[0] ?? 'https://etherscan.io/'}tx/${txHash}`}
            />
          )
        )}
      </BoxForm>
    </>
  );
}

export default DepositWidget;
