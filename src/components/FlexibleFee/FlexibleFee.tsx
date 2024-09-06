import InfoIcon from '@mui/icons-material/Info';
import { Box, Skeleton, Tooltip, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { Avatar } from 'src/components/Avatar';
import { useAccounts } from 'src/hooks/useAccounts';
import { useChains } from 'src/hooks/useChains';

import { useTranslation } from 'react-i18next';
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
  rate: string;
  onClick: () => void;
}

export const FlexibleFee = ({
  isLoading,
  isSuccess,
  rate,
  onClick,
}: FlexibleFeeProps) => {
  const { accounts } = useAccounts();
  const activeAccount = accounts.filter((account) => account.isConnected);
  const theme = useTheme();
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
        <Box display="flex" alignItems="center">
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
            <Typography variant="bodyXLargeStrong">0</Typography>
            <FlexibleFeeAmountDetails variant="bodyXSmall">
              {t('flexibleFee.availableAmount', {
                amountUsd: '20$',
                amount: 0,
                chain: 'ETH',
              })}
            </FlexibleFeeAmountDetails>
          </FlexibleFeeAmountsBox>
        </Box>
        <FlexibleFeeAmountsBadge>
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
        onClick={onClick}
      />
    </Container>
  );
};
