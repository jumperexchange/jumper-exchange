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
import type { ChangeEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import { Avatar } from 'src/components/Avatar';
import { useAccounts } from 'src/hooks/useAccounts';
import { useChains } from 'src/hooks/useChains';

import { useTranslation } from 'react-i18next';
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

interface FlexibleFeeProps {
  isLoading?: boolean;
  isSuccess?: boolean;
  rate: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const FlexibleFee = ({
  isLoading,
  isSuccess,
  rate,
  onClick,
}: FlexibleFeeProps) => {
  const [amount, setAmount] = useState<string>('0');
  const { accounts } = useAccounts();
  const activeAccount = accounts.filter((account) => account.isConnected);
  const theme = useTheme();
  const ref = useRef<HTMLInputElement>(null);
  const { chains } = useChains();
  const { t } = useTranslation();
  const activeChain = useMemo(
    () =>
      activeAccount[0] &&
      chains?.find((chainEl) => chainEl.id === activeAccount[0].chainId),
    [chains, activeAccount],
  );
  if (activeAccount.length === 0) {
    return null;
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    const formattedAmount = formatInputAmount(value, 6, true);
    setAmount(formattedAmount);
  };

  const handleDefaultRate = () => {
    // todo: replace amount?
    const result = parseFloat(amount) * rate;
    setAmount(`${result}`);
  };

  return (
    <Container>
      <Header>
        <Typography variant="bodyMediumStrong">
          {t('flexibleFee.title')}
        </Typography>
        <Tooltip
          title={t('flexibleFee.tooltip')}
          placement="top"
          enterTouchDelay={0}
          arrow
        >
          <InfoIcon sx={{ color: theme.palette.grey[500] }} />
        </Tooltip>
      </Header>
      <Content>
        <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
          <FlexibleFeeChainBadge
            overlap="circular"
            className="badge"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              activeChain?.logoURI ? (
                <Avatar
                  size="small"
                  src={activeChain?.logoURI || ''} //* Replace logoURI with from / to chain logo *//
                  alt={'wallet-avatar'}
                ></Avatar>
              ) : (
                <Skeleton variant="circular" />
              )
            }
          >
            <FlexibleFeeChainAvatar src={activeChain?.logoURI} />
            {
              //* Replace logoURI with from / to chain logo *//
            }
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
                  fontSize: '24px',
                  fontWeight: 500,
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
              {
                //* todo:  replace amount, amountUsd and chain with dynamic inputs *//
              }
              {t('flexibleFee.availableAmount', {
                amountUsd: '20$',
                amount: 0,
                baseToken: 'ETH',
              })}
            </FlexibleFeeAmountDetails>
          </FlexibleFeeAmountsBox>
        </Box>
        <FlexibleFeeAmountsBadge onClick={handleDefaultRate}>
          <Typography
            variant="bodyXSmallStrong"
            color={theme.palette.primary.main}
          >
            {rate}
          </Typography>
        </FlexibleFeeAmountsBadge>
      </Content>
      <FlexibleFeeButton
        isLoading={isLoading}
        isSuccess={isSuccess}
        onClick={(event) => onClick(event)}
      />
    </Container>
  );
};
