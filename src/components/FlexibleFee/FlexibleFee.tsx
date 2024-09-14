import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  FormControl,
  Input,
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar } from 'src/components/Avatar';
import { useAccounts } from 'src/hooks/useAccounts';
import { useChains } from 'src/hooks/useChains';

import type { RouteExtended } from '@lifi/sdk';
import { useTranslation } from 'react-i18next';
import { ThemeProviderV2 } from 'src/providers/ThemeProviderV2';
import { formatInputAmount } from 'src/utils/formatInputAmount';
import {
  FlexibleFeeContainer as Container,
  FlexibleFeeContent as Content,
  FlexibleFeeAmountDetails,
  FlexibleFeeAmountsBadge,
  FlexibleFeeAmountsBox,
  FlexibleFeeChainAvatar,
  FlexibleFeeChainBadge,
  FlexibleFeeHeader as Header,
} from './FlexibleFee.style';
import FlexibleFeeButton from './FlexibleFeeButton';
import { SAFE_CONTRACTS } from 'src/const/safeContracts';
import {
  useAccount,
  // useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useBalance,
  useSendTransaction,
} from 'wagmi';
import { getToken, getTokenBalance } from '@lifi/sdk';
import { ExtendedChain } from '@lifi/widget';
import { parseEther } from 'viem';

interface FlexibleFeeProps {
  route: RouteExtended;
}

const MIN_AMOUNT = 0.0005;

// implement getTokenBalance from Widget as a hook
// implement click to send to the decided token

export const FlexibleFee: FC<{ route: RouteExtended }> = ({
  route,
}: FlexibleFeeProps) => {
  console.log('FlexibleFee-ROUTE....', route);
  const [activeChain, setActiveChain] = useState<ExtendedChain | undefined>(
    undefined,
  );
  const [balance, setBalance] = useState<number>(0);
  const [balanceUSD, setBalanceUSD] = useState<number>(0);
  const [amount, setAmount] = useState<string>('0');
  const [rate, setRate] = useState<string>('0.3');
  const { accounts } = useAccounts();
  const activeAccount = accounts.filter((account) => account.isConnected);
  const theme = useTheme();
  const ref = useRef<HTMLInputElement>(null);
  const { chains } = useChains();
  const { t } = useTranslation();
  const { switchChainAsync } = useSwitchChain();
  const {
    data: transactionHash,
    isPending,
    sendTransaction,
  } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: transactionHash,
    });

  const { data: sourceBalance, isLoading: isSourceBalanceLoading } = useBalance(
    {
      address: activeAccount[0]?.address as `0x${string}`,
      chainId: route.fromChainId,
    },
  );

  const { data: destinationBalance, isLoading: isDestinationBalanceLoading } =
    useBalance({
      address: activeAccount[0]?.address as `0x${string}`,
      chainId: route.toChainId,
    });

  useEffect(() => {
    console.log('destinationBalance', destinationBalance);
    console.log('sourceBalance', sourceBalance);
    if (sourceBalance && sourceBalance.value >= MIN_AMOUNT) {
      setBalance(Number(sourceBalance.value) / 10 ** 18);
      setActiveChain(
        chains?.find((chainEl) => chainEl.id === route.fromChainId),
      );
    } else if (destinationBalance && destinationBalance.value >= MIN_AMOUNT) {
      setBalance(Number(destinationBalance.value) / 10 ** 18);
      setActiveChain(chains?.find((chainEl) => chainEl.id === route.toChainId));
    }
  }, [destinationBalance, sourceBalance]);

  const handleRateClick = () => {
    const txPercentageUSDValue =
      (Number(rate) / 100) * parseFloat(route.fromAmountUSD);
    const ethPrice = balanceUSD / balance;
    const txPercentageNativeValue = txPercentageUSDValue / ethPrice;
    setAmount(txPercentageNativeValue.toString());
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    const formattedAmount = formatInputAmount(value, 6, true);
    setAmount(formattedAmount);
  };

  const handleButtonClick = async () => {
    if (!activeChain) return;
    try {
      const { id } = await switchChainAsync({
        chainId: activeChain?.id,
      });
      const destinationAddress = SAFE_CONTRACTS[activeChain?.id];

      if (
        id === activeChain?.id &&
        !!destinationAddress &&
        parseFloat(amount) > 0
      ) {
        try {
          sendTransaction({
            to: destinationAddress as `0x${string}`,
            value: parseEther(amount),
          });
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {activeChain && activeAccount.length > 0 && (
        <ThemeProviderV2 themes={[]}>
          <Container>
            <Header>
              <Typography variant="bodyMediumStrong">
                {t('flexibleFee.title')}
              </Typography>
              <Tooltip
                title={t('flexibleFee.description')}
                placement="top"
                enterTouchDelay={0}
                arrow
              >
                <InfoIcon sx={{ color: theme.palette.grey[500] }} />
              </Tooltip>
            </Header>
            <Content>
              <Box
                display="flex"
                alignItems="center"
                sx={{ width: '100%', color: theme.palette.text.secondary }}
              >
                <FlexibleFeeChainBadge
                  overlap="circular"
                  className="badge"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    activeChain?.logoURI ? (
                      <Avatar
                        size="small"
                        src={activeChain?.logoURI || ''}
                        alt={'wallet-avatar'}
                      ></Avatar>
                    ) : (
                      <Skeleton variant="circular" />
                    )
                  }
                >
                  <FlexibleFeeChainAvatar src={activeChain?.logoURI} />
                </FlexibleFeeChainBadge>
                <FlexibleFeeAmountsBox>
                  <FormControl fullWidth>
                    <Input
                      disableUnderline
                      inputRef={ref}
                      size="small"
                      autoComplete="off"
                      placeholder="0"
                      inputProps={{
                        inputMode: 'decimal',
                      }}
                      onChange={handleChange}
                      value={amount}
                      name={'flexible-fee-amount'}
                      style={{
                        height: '24px',
                        fontSize: '24px',
                        fontWeight: 700,
                        color:
                          amount === '0'
                            ? theme.palette.grey[500]
                            : theme.palette.text.primary,
                      }}
                      required
                      // startAdornment={startAdornment}
                      // endAdornment={endAdornment}
                      // onBlur={handleBlur}
                      // disabled={disabled}
                    />
                  </FormControl>
                  <FlexibleFeeAmountDetails variant="bodyXSmall">
                    {t('flexibleFee.availableAmount', {
                      amountUsd: '20$',
                      amount: balance,
                      baseToken: 'ETH',
                    })}
                  </FlexibleFeeAmountDetails>
                </FlexibleFeeAmountsBox>
              </Box>
              <FlexibleFeeAmountsBadge onClick={handleRateClick}>
                <Typography
                  variant="bodyXSmallStrong"
                  color={theme.palette.primary.main}
                >
                  {rate}%
                </Typography>
              </FlexibleFeeAmountsBadge>
            </Content>
            <FlexibleFeeButton
              isLoading={isConfirming}
              isSuccess={isConfirmed}
              onClick={handleButtonClick}
            />
          </Container>
        </ThemeProviderV2>
      )}
    </>
  );
};
