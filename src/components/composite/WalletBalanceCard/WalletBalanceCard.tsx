import { useRouter } from 'next/navigation';
import { useMainPaths } from 'src/hooks/useMainPaths';
import { useMenuStore } from 'src/stores/menu';
import { useWidgetCacheStore } from 'src/stores/widgetCache';
import type { WalletBalanceCardProps } from './WalletBalanceCard.types';
import { useEffect, useMemo, useState, type FC } from 'react';
import { useAccount } from '@lifi/wallet-management';
import Divider from '@mui/material/Divider';
import {
  LightIconButton,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  WalletBalanceCardContainer,
  WalletBalanceCardContentContainer,
} from './WalletBalanceCard.styles';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import type { PortfolioBalance, WalletToken } from 'src/types/tokens';
import { WalletTotalBalance } from './components/WalletTotalBalance';
import { WalletWithActions } from './components/WalletWithActions';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useSettingsStore } from '@/stores/settings';
import { BalanceCardSize } from '../BalanceCard/types';
import { BalanceCardSkeleton } from '../BalanceCard/components/BalanceCardSkeleton';
import { BalanceCard } from '../BalanceCard/BalanceCard';
import { flatMap } from 'lodash';
import {
  balanceGroupSortAccessors,
  sortPortfolioItems,
} from '@/providers/PortfolioProvider/filtering/utils';
import { BaseAlert } from '@/components/Alerts/BaseAlert/BaseAlert';
import { BaseAlertVariant } from '@/components/Alerts/BaseAlert/BaseAlert.styles';

export const WalletBalanceCard: FC<WalletBalanceCardProps> = ({
  walletAddress,
  refetch,
  isFetching,
  isSuccess,
  updatedAt,
  error,
  data,
  'data-testid': dataTestId,
}) => {
  const { accounts } = useAccount();
  const account = accounts?.find(
    (account) => account.address === walletAddress,
  );
  const hasMultipleAccountsConnected = useMemo(
    () => accounts?.filter((account) => account.isConnected).length > 1,
    [accounts],
  );
  const [isExpanded, setIsExpanded] = useState(!hasMultipleAccountsConnected);
  const { isMainPaths } = useMainPaths();
  const { setWelcomeScreenClosed } = useSettingsStore((state) => state);
  const router = useRouter();
  const setFrom = useWidgetCacheStore((state) => state.setFrom);
  const { setWalletMenuState } = useMenuStore((state) => state);

  const balanceGroups = useMemo(() => {
    return sortPortfolioItems(
      Object.entries(data),
      'value',
      'desc',
      balanceGroupSortAccessors,
    );
  }, [data]);

  const balances = useMemo(() => {
    return flatMap(data);
  }, [data]);

  useEffect(() => {
    if (hasMultipleAccountsConnected) {
      return;
    }
    setIsExpanded(true);
  }, [hasMultipleAccountsConnected]);

  if (!account) {
    return null;
  }

  const handleToggleAccordion = () => {
    if (!hasMultipleAccountsConnected) {
      return;
    }
    setIsExpanded((prev) => !prev);
  };

  const handleSelectToken = (balance: PortfolioBalance<WalletToken>) => {
    setFrom(balance.token.address, balance.token.chainId);
    setWalletMenuState(false);
    setWelcomeScreenClosed(true);

    if (!isMainPaths) {
      router.push('/');
    }
  };
  return (
    <WalletBalanceCardContainer data-testid={dataTestId}>
      <StyledAccordion
        defaultExpanded={!hasMultipleAccountsConnected}
        expanded={isExpanded}
      >
        <StyledAccordionSummary slots={{ root: 'div' }}>
          <WalletBalanceCardContentContainer>
            <WalletWithActions account={account} />
            <WalletTotalBalance
              refetch={refetch}
              isFetching={isFetching}
              isComplete={isSuccess}
              balances={balances}
              updatedAt={updatedAt}
            >
              {hasMultipleAccountsConnected && (
                <LightIconButton
                  onClick={handleToggleAccordion}
                  sx={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                >
                  <KeyboardArrowDownRoundedIcon />
                </LightIconButton>
              )}
            </WalletTotalBalance>
          </WalletBalanceCardContentContainer>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <WalletBalanceCardContentContainer>
            <Divider
              sx={(theme) => ({
                marginTop: theme.spacing(3),
                borderColor: (theme.vars || theme).palette.alpha100.main,
              })}
            />
            <Stack>
              {error && (
                <BaseAlert
                  variant={BaseAlertVariant.Error}
                  description={error.message}
                />
              )}
              {!error && (
                <>
                  {!isSuccess &&
                    balanceGroups.length == 0 &&
                    Array.from({ length: 8 }).map(() => (
                      <BalanceCardSkeleton size={BalanceCardSize.SM} />
                    ))}
                  {balanceGroups.map(([symbol, balances], index) => (
                    <BalanceCard
                      balances={balances}
                      size={BalanceCardSize.SM}
                      key={symbol}
                      onSelect={handleSelectToken}
                      shouldShowExpandedEndDivider={
                        index !== balanceGroups.length - 1
                      }
                    />
                  ))}
                </>
              )}
            </Stack>
          </WalletBalanceCardContentContainer>
        </StyledAccordionDetails>
      </StyledAccordion>
    </WalletBalanceCardContainer>
  );
};
