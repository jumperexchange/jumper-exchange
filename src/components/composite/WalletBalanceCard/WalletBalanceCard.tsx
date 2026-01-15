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
import Stack from '@mui/material/Stack';
import generateKey from 'src/app/lib/generateKey';
import { TokenListCardSkeleton } from '../TokenListCard/TokenListCardSkeleton';
import { TokenListCard } from '../TokenListCard/TokenListCard';
import type { PortfolioToken } from 'src/types/tokens';
import { WalletTotalBalance } from './components/WalletTotalBalance';
import { WalletWithActions } from './components/WalletWithActions';
import { useFormatDisplayWalletTokens } from '@/hooks/portfolio/useFormatDisplayWalletTokens';
import { useTokensWithoutLpPositions } from '@/hooks/portfolio/useTokensWithoutLpPositions';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

export const WalletBalanceCard: FC<WalletBalanceCardProps> = ({
  walletAddress,
  refetch,
  isFetching,
  isSuccess,
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
  const router = useRouter();
  const setFrom = useWidgetCacheStore((state) => state.setFrom);
  const { setWalletMenuState } = useMenuStore((state) => state);

  const formattedTokens = useFormatDisplayWalletTokens(data);
  const tokens = useTokensWithoutLpPositions(formattedTokens);

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

  const handleSelectToken = (token: PortfolioToken) => {
    setFrom(token.address, token.chain.chainId);
    setWalletMenuState(false);

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
              account={account}
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
              {!isSuccess &&
                tokens.length == 0 &&
                Array.from({ length: 8 }).map(() => (
                  <TokenListCardSkeleton key={generateKey('token')} />
                ))}
              {tokens.map((token) => (
                <TokenListCard
                  token={token}
                  key={`${token.chain.chainId}-${token.address}`}
                  onSelect={handleSelectToken}
                />
              ))}
            </Stack>
          </WalletBalanceCardContentContainer>
        </StyledAccordionDetails>
      </StyledAccordion>
    </WalletBalanceCardContainer>
  );
};
