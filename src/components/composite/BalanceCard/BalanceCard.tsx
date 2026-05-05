import type { FC } from 'react';
import { useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { EntityStackWithBadge } from '../EntityStackWithBadge/EntityStackWithBadge';
import { EntityStackBadgePlacement } from '../EntityStackWithBadge/types';
import { TokenAmount } from '../TokenAmount/TokenAmount';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledContent,
} from './BalanceCard.styles';
import { BalanceStackItem } from './components/BalanceStackItem';
import { BALANCE_CARD_CONFIG } from './constants';
import type { BalanceCardProps } from './types';
import { BalanceCardSize } from './types';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import { getResponsiveValue, getUniqueChains } from './utils';

export const BalanceCard: FC<BalanceCardProps> = ({
  balances,
  size = BalanceCardSize.SM,
  onSelect,
  shouldShowExpandedEndDivider = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const config = BALANCE_CARD_CONFIG[size];
  const hasMultipleChains = balances.length > 1;

  const primaryBalance = balances[0];

  const chainEntities = useMemo(() => getUniqueChains(balances), [balances]);

  const resolvedChainsLimit = getResponsiveValue(config.chainsLimit, isMobile);

  const handlePrimaryClick = () => {
    if (!hasMultipleChains) {
      onSelect?.(primaryBalance);
      return;
    }
    setIsExpanded((prev) => !prev);
  };

  const handleExpandedClick = (balance: PortfolioBalance<WalletToken>) => {
    onSelect?.(balance);
  };

  if (!primaryBalance) {
    return null;
  }

  return (
    <StyledAccordion
      expanded={isExpanded}
      disableGutters
      sx={{
        ':not(:last-child)': {
          paddingBottom: config.paddingBottom,
        },
      }}
    >
      <StyledAccordionSummary>
        <StyledContent
          hideCursor={!hasMultipleChains && !onSelect}
          direction="row"
          spacing={2}
          useFlexGap
          onClick={handlePrimaryClick}
          sx={[
            { justifyContent: 'space-between', alignItems: 'center' },
            ...(Array.isArray(config.primary.itemSx)
              ? config.primary.itemSx
              : [config.primary.itemSx]),
          ]}
        >
          <EntityStackWithBadge
            disableBorder
            entities={[primaryBalance.token]}
            badgeEntities={chainEntities}
            placement={
              hasMultipleChains
                ? EntityStackBadgePlacement.Inline
                : EntityStackBadgePlacement.Overlay
            }
            size={config.primary.tokenSize}
            badgeSize={
              hasMultipleChains
                ? config.primary.inlineChainsSize
                : config.primary.chainsSize
            }
            badgeLimit={resolvedChainsLimit}
            content={{
              title: primaryBalance.token.symbol,
              titleVariant: config.primary.titleVariant,
              hintVariant: config.primary.descriptionVariant,
            }}
            spacing={{
              badge: config.chainsSpacing,
              infoContainerGap: config.primary.infoContainerGap,
            }}
          />
          {hasMultipleChains ? (
            <TokenAmount
              balances={balances}
              amountUSDVariant={config.primary.titleVariant}
              amountVariant={config.primary.descriptionVariant}
              compact={isMobile}
              gap={config.primary.infoContainerGap}
              sx={{
                textAlign: 'right',
                marginLeft: 'auto',
                minWidth: 0,
              }}
            />
          ) : (
            <TokenAmount
              balance={primaryBalance}
              amountUSDVariant={config.primary.titleVariant}
              amountVariant={config.primary.descriptionVariant}
              compact={isMobile}
              gap={config.primary.infoContainerGap}
              sx={{
                textAlign: 'right',
                marginLeft: 'auto',
                minWidth: 0,
              }}
            />
          )}
        </StyledContent>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Stack direction="column" useFlexGap>
          <Divider
            sx={(theme) => ({
              borderColor: (theme.vars || theme).palette.alpha100.main,
              marginY: config.dividerSpacing,
            })}
          />
          {balances.map((balance) => (
            <BalanceStackItem
              key={`${balance.token.address}-${balance.token.chainId}`}
              balance={balance}
              config={config.expanded}
              isClickable={!!onSelect}
              onClick={() => handleExpandedClick(balance)}
            />
          ))}
          {isExpanded && shouldShowExpandedEndDivider && (
            <Divider
              sx={(theme) => ({
                borderColor: (theme.vars || theme).palette.alpha100.main,
                marginY: config.dividerSpacing,
              })}
            />
          )}
        </Stack>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};
