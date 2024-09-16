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
import { useEffect, useRef, useState } from 'react';
import { Avatar } from 'src/components/Avatar';
import { useAccounts } from 'src/hooks/useAccounts';
import { useChains } from 'src/hooks/useChains';
import { formatUnits } from 'viem';

import type { RouteExtended } from '@lifi/sdk';
import type { ExtendedChain } from '@lifi/widget';
import { useTranslation } from 'react-i18next';
import { SAFE_CONTRACTS } from 'src/const/safeContracts';
import { useTokenBalance } from 'src/hooks/useTokenBalance';
import { ThemeProviderV2 } from 'src/providers/ThemeProviderV2';
import { formatInputAmount } from 'src/utils/formatInputAmount';
import { parseEther } from 'viem';
import {
  useSendTransaction,
  useSwitchChain,
  // useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
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

interface FlexibleFeeProps {
  route: RouteExtended;
}

const MIN_AMOUNT_USD = 2;

export const FlexibleFee: FC<{ route: RouteExtended }> = ({
  route,
}: FlexibleFeeProps) => {
  const [activeChain, setActiveChain] = useState<ExtendedChain | undefined>(
    undefined,
  );
  const [balanceNative, setBalanceNative] = useState<number>(0);
  const [balanceNativeInUSD, setBalanceNativeInUSD] = useState<number>(0);
  const [amount, setAmount] = useState<string>('0');
  const [ethPrice, setEthPrice] = useState<number | null>(null);
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
    isPending: isPendingSendTransaction,
    sendTransaction,
  } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: transactionHash,
    });

  const { data: sourceBalance, isLoading: isSourceBalanceLoading } =
    useTokenBalance({
      tokenAddress: '0x0000000000000000000000000000000000000000',
      walletAddress: activeAccount[0]?.address as `0x${string}`,
      chainId: route.fromChainId,
    });

  const { data: destinationBalance, isLoading: isDestinationBalanceLoading } =
    useTokenBalance({
      tokenAddress: '0x0000000000000000000000000000000000000000',
      walletAddress: activeAccount[0]?.address as `0x${string}`,
      chainId: route.toChainId,
    });

  useEffect(() => {
    console.log('-----------------------');
    console.log('----------------------- ACCOUNT');
    console.log(activeAccount[0]?.address);
    console.log('-----------------------');
    console.log('----------------------- SOURCE BALANCE');
    console.log(sourceBalance);
    console.log('----------------------- DESTINATION BALANCE');
    console.log(destinationBalance);
    if (
      sourceBalance?.amount &&
      parseFloat(formatUnits(sourceBalance.amount, sourceBalance.decimals)) *
        parseFloat(sourceBalance.priceUSD) >=
        MIN_AMOUNT_USD
    ) {
      setBalanceNative(
        parseFloat(formatUnits(sourceBalance.amount, sourceBalance.decimals)),
      );
      setBalanceNativeInUSD(
        parseFloat(sourceBalance.priceUSD) *
          parseFloat(formatUnits(sourceBalance.amount, sourceBalance.decimals)),
      );
      setActiveChain(
        chains?.find((chainEl) => chainEl.id === route.fromChainId),
      );
    } else if (
      destinationBalance?.amount &&
      parseFloat(
        formatUnits(destinationBalance.amount, destinationBalance.decimals),
      ) *
        parseFloat(destinationBalance.priceUSD) >=
        MIN_AMOUNT_USD
    ) {
      setBalanceNative(
        parseFloat(
          formatUnits(destinationBalance.amount, destinationBalance.decimals),
        ),
      );
      setBalanceNativeInUSD(
        parseFloat(destinationBalance.priceUSD) *
          parseFloat(
            formatUnits(destinationBalance.amount, destinationBalance.decimals),
          ),
      );
      setActiveChain(chains?.find((chainEl) => chainEl.id === route.toChainId));
    }
  }, [
    chains,
    route,
    destinationBalance,
    route.fromChainId,
    route.toChainId,
    sourceBalance,
  ]);

  const handleRateClick = () => {
    const txPercentageUSDValue =
      (Number(rate) / 100) * parseFloat(route.fromAmountUSD);
    const ethPrice = balanceNativeInUSD / balanceNative;
    const txPercentageNativeValue = txPercentageUSDValue * (1 / ethPrice);
    setEthPrice(ethPrice);
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
    if (!activeChain) {
      return;
    }
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
    activeChain &&
    activeAccount.length > 0 && (
      <ThemeProviderV2 themes={[]}>
        <Container>
          <Header>
            <Typography variant="bodyMediumStrong">
              Help us grow Jumper!
            </Typography>
            <Tooltip
              title={'Lorem ipsum...'}
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
                    />
                  ) : (
                    <Skeleton variant="circular" />
                  )
                }
              >
                <FlexibleFeeChainAvatar
                  src={activeChain?.nativeToken.logoURI}
                />
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
                  />
                </FormControl>
                <FlexibleFeeAmountDetails variant="bodyXSmall">
                  {`$${ethPrice && parseFloat(amount) > 0 ? parseFloat(String(ethPrice * parseFloat(amount))).toFixed(2) : 0}  •  ${parseFloat(String(balanceNative)).toFixed(4)} ${activeChain?.nativeToken.symbol} available`}
                </FlexibleFeeAmountDetails>
              </FlexibleFeeAmountsBox>
            </Box>
            <FlexibleFeeAmountsBadge onClick={handleRateClick}>
              <Typography
                variant="bodyXSmallStrong"
                color={
                  theme.palette.mode === 'light'
                    ? theme.palette.primary.main
                    : theme.palette.text.primary
                }
              >
                {rate}%
              </Typography>
            </FlexibleFeeAmountsBadge>
          </Content>
          <FlexibleFeeButton
            isLoading={isConfirming || isPendingSendTransaction}
            isSuccess={isConfirmed}
            onClick={handleButtonClick}
          />
        </Container>
      </ThemeProviderV2>
    )
  );
  // )
};
