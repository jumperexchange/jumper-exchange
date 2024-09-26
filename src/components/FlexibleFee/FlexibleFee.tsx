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
import { useFlexibleFeeStore } from 'src/stores/flexibleFee';
import { FlexibleFeePercentBox } from './FlexibleFeePercentBox';

interface FlexibleFeeProps {
  route: RouteExtended;
}

const roundToFiveDecimals = (n: number) => {
  return Math.floor(n * 100000) / 100000;
};

export const FlexibleFee: FC<{ route: RouteExtended }> = ({
  route,
}: FlexibleFeeProps) => {
  const {
    balanceNative,
    balanceNativeInUSD,
    ethPrice,
    isEligible,
    activeChain,
  } = useFlexibleFeeStore();
  const [isTxSuccess, setIsTxSuccess] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('0');
  const [rate, setRate] = useState<string>('0.3');
  const theme = useTheme();
  const ref = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { switchChainAsync } = useSwitchChain();

  // TX STATE

  const {
    data: transactionHash,
    isPending: isPendingSendTransaction,
    sendTransaction,
  } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: transactionHash,
    });

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
    setAmount(roundToFiveDecimals(feeAmountNative).toString());
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

  return isEligible ? (
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FlexibleFeeAmountDetails variant="bodyXSmall">
                  {`$${ethPrice && parseFloat(amount) > 0 ? parseFloat(String(ethPrice * parseFloat(amount))).toFixed(2) : 0}`}
                </FlexibleFeeAmountDetails>
                <FlexibleFeeAmountDetails variant="bodyXSmall">
                  {`${parseFloat(String(balanceNative)).toFixed(4)} ${activeChain?.nativeToken.symbol} available`}
                </FlexibleFeeAmountDetails>
              </Box>
            </FlexibleFeeAmountsBox>
          </Box>
        </Content>
        <FlexibleFeePercentBox handleRateClick={handleRateClick} />
        <FlexibleFeeButton
          isLoading={isConfirming || isPendingSendTransaction}
          isSuccess={isTxSuccess}
          isDisabled={
            parseFloat(amount) === 0 || Number.isNaN(parseFloat(amount))
          }
          onClick={handleButtonClick}
        />
      </Container>
    </ThemeProviderV2>
  ) : null;
};
