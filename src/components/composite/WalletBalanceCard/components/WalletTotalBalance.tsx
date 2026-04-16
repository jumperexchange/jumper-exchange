import type { Account } from '@lifi/widget-provider';
import type { FC, PropsWithChildren } from 'react';
import { AnimatedCounter } from 'react-animated-counter';
import {
  WalletBalanceSharedContainer,
  WalletTotalBalanceValue,
} from '../WalletBalanceCard.styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import WalletTotalBalanceSkeleton from './WalletTotalBalanceSkeleton';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import RefreshBalance from './RefreshBalance';
import { getPortfolioValueInDollarParts } from '@/utils/numbers/portfolioValueInDollar';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import { usePortfolioFormatters } from '@/hooks/tokens/usePortfolioFormatters';

const sharedStackProps = {
  direction: 'row',
  useFlexGap: true,
} as const;

interface WalletTotalBalanceProps extends PropsWithChildren {
  isComplete: boolean;
  isFetching: boolean;
  refetch: () => void;
  updatedAt: number;
  balances: PortfolioBalance<WalletToken>[];
}

export const WalletTotalBalance: FC<WalletTotalBalanceProps> = ({
  isComplete,
  isFetching,
  refetch,
  updatedAt,
  children,
  balances,
}) => {
  const theme = useTheme();
  const { toAggregatedAmountUSD } = usePortfolioFormatters();
  const { t } = useTranslation();

  const totalValue = toAggregatedAmountUSD(balances);

  if (!isComplete && totalValue === 0) {
    return <WalletTotalBalanceSkeleton />;
  }

  const { prefix, suffix, numericValue } =
    getPortfolioValueInDollarParts(totalValue);

  return (
    <WalletBalanceSharedContainer disableGutters>
      <Stack sx={{ width: '100%' }}>
        <Typography variant="bodyXSmallStrong" color="textSecondary">
          {t('navbar.walletMenu.walletBalance')}
        </Typography>
        <Stack
          {...sharedStackProps}
          sx={{ gap: 2, justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Stack {...sharedStackProps} sx={{ gap: 1, alignItems: 'center' }}>
            <WalletTotalBalanceValue as="div">
              <>
                {prefix}
                <AnimatedCounter
                  value={Number(numericValue)}
                  fontSize={theme.typography.titleLarge.fontSize?.toString()}
                  includeDecimals
                  decimalPrecision={suffix ? 1 : 2}
                  includeCommas={!suffix}
                  incrementColor={(theme.vars || theme).palette.text.primary}
                  decrementColor={(theme.vars || theme).palette.text.primary}
                  color={(theme.vars || theme).palette.text.primary}
                  containerStyles={{
                    display: 'inline-flex',
                    textAlign: 'center',
                  }}
                  digitStyles={{
                    textOverflow: 'inherit',
                  }}
                />
                {suffix}
              </>
            </WalletTotalBalanceValue>
            <RefreshBalance
              updatedAt={updatedAt}
              timeToUpdate={0}
              isLoading={isFetching}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                refetch();
              }}
            />
          </Stack>
          {children}
        </Stack>
      </Stack>
    </WalletBalanceSharedContainer>
  );
};
