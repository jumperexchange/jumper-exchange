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

import { ChainId, type RouteExtended } from '@lifi/sdk';
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

interface TokenBalance {
  amount?: bigint;
  decimals: number;
  priceUSD: string;
}

const MIN_AMOUNT_USD = 2;
const NATIVE_TOKEN = '0x0000000000000000000000000000000000000000';

export const FlexibleFee: FC<{ route: RouteExtended }> = ({
  route,
}: FlexibleFeeProps) => {
  const [activeChain, setActiveChain] = useState<ExtendedChain | undefined>(
    undefined,
  );
  const [balanceNative, setBalanceNative] = useState<number>(0);
  const [balanceNativeInUSD, setBalanceNativeInUSD] = useState<number>(0);
  const [isTxSuccess, setIsTxSuccess] = useState<boolean>(false);
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

  // STATE

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
      tokenAddress: NATIVE_TOKEN,
      walletAddress: activeAccount[0]?.address as `0x${string}`,
      chainId: route.fromChainId,
    });

  const { data: destinationBalance, isLoading: isDestinationBalanceLoading } =
    useTokenBalance({
      tokenAddress: NATIVE_TOKEN,
      walletAddress: activeAccount[0]?.address as `0x${string}`,
      chainId: route.toChainId,
    });

  useEffect(() => {
    const updateBalanceAndChain = (balance: TokenBalance, chainId: number) => {
      if (!balance.amount) return;
      const amount = parseFloat(formatUnits(balance.amount, balance.decimals));
      const amountUSD = amount * parseFloat(balance.priceUSD);

      setBalanceNative(amount);
      setBalanceNativeInUSD(amountUSD);
      setActiveChain(chains?.find((chainEl) => chainEl.id === chainId));
    };

    if (sourceBalance?.amount) {
      const sourceAmount = parseFloat(
        formatUnits(sourceBalance.amount, sourceBalance.decimals),
      );
      const sourceAmountUSD = sourceAmount * parseFloat(sourceBalance.priceUSD);

      if (sourceAmountUSD >= MIN_AMOUNT_USD) {
        updateBalanceAndChain(sourceBalance, route.fromChainId);
        return;
      }
    }

    if (destinationBalance?.amount) {
      const destAmount = parseFloat(
        formatUnits(destinationBalance.amount, destinationBalance.decimals),
      );
      const destAmountUSD =
        destAmount * parseFloat(destinationBalance.priceUSD);

      if (destAmountUSD >= MIN_AMOUNT_USD) {
        updateBalanceAndChain(destinationBalance, route.toChainId);
        return;
      }
    }
  }, [chains, route, sourceBalance, destinationBalance]);

  useEffect(() => {
    if (isConfirmed) {
      setIsTxSuccess(true);
    }
  }, [isConfirmed]);

  // USER INTERACTION FUNCTIONS

  const handleRateClick = () => {
    const rateAsDecimal = Number(rate) / 100;
    const routeAmountUSD = parseFloat(route.fromAmountUSD);

    const feeAmountUSD = rateAsDecimal * routeAmountUSD;
    const ethPrice = balanceNativeInUSD / balanceNative;
    const feeAmountNative = feeAmountUSD / ethPrice;
    setEthPrice(ethPrice);
    setAmount(feeAmountNative.toString());
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    const formattedAmount = formatInputAmount(value, 6, true);
    setAmount(formattedAmount);
  };

  const switchToActiveChain = async () => {
    if (!activeChain) return;
    const { id } = await switchChainAsync({
      chainId: activeChain.id,
    });
    if (id !== activeChain?.id) {
      throw new Error('Failed to switch to the correct chain');
    }
  };

  const sendFlexibleFee = () => {
    if (!activeChain) return;
    const destinationAddress = SAFE_CONTRACTS[activeChain.id];
    if (!destinationAddress || parseFloat(amount) <= 0) {
      throw new Error('Invalid destination address or amount');
    }

    sendTransaction({
      to: destinationAddress as `0x${string}`,
      value: parseEther(amount),
    });
  };

  const handleButtonClick = async () => {
    try {
      await switchToActiveChain();
      sendFlexibleFee();
    } catch (error) {
      console.error('Error in flexible fee transaction:', error);
    }
  };

  // RETURN

  return balanceNative > 0 &&
    route.fromChainId !== ChainId.SOL &&
    route.toChainId !== ChainId.SOL ? (
    <ThemeProviderV2 themes={[]}>
      <Container>
        <Header>
          <Typography variant="bodyMediumStrong">
            Help us grow Jumper!
          </Typography>
          <Tooltip
            title={`Jumper is free to use. Any contribution, no matter the size, goes a long way in accelerating our growth 💜`}
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
              <FlexibleFeeChainAvatar src={activeChain?.nativeToken.logoURI} />
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
          isSuccess={isTxSuccess}
          isDissabled={parseFloat(amount) === 0}
          onClick={handleButtonClick}
        />
      </Container>
    </ThemeProviderV2>
  ) : isDestinationBalanceLoading || isSourceBalanceLoading ? (
    <ThemeProviderV2 themes={[]}>
      <Container>
        <Header>
          <Skeleton variant="text" width="70%" height={24} />
          <Skeleton variant="circular" width={24} height={24} />
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
                <Skeleton variant="circular" width={16} height={16} />
              }
            >
              <Skeleton variant="circular" width={40} height={40} />
            </FlexibleFeeChainBadge>
            <FlexibleFeeAmountsBox>
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="80%" height={16} />
            </FlexibleFeeAmountsBox>
          </Box>
          <Skeleton
            variant="rectangular"
            width={48}
            height={24}
            sx={{ borderRadius: '12px' }}
          />
        </Content>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          sx={{ borderRadius: '20px' }}
        />
      </Container>
    </ThemeProviderV2>
  ) : null;
};
