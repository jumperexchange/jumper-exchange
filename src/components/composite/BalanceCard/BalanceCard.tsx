import type { FC } from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledContent,
} from './BalanceCard.styles';
import { BalanceStackItem } from './components/BalanceStackItem';
import { TokenSummaryRow } from './components/TokenSummaryRow';
import { BALANCE_CARD_CONFIG } from './constants';
import type { BalanceCardProps } from './types';
import { BalanceCardSize } from './types';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';

export const BalanceCard: FC<BalanceCardProps> = ({
  balances,
  size = BalanceCardSize.SM,
  onSelect,
  shouldShowExpandedEndDivider = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const config = BALANCE_CARD_CONFIG[size];
  const hasMultipleChains = balances.length > 1;

  const primaryBalance = balances[0];

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
          <TokenSummaryRow
            balances={balances}
            config={{
              tokenSize: config.primary.tokenSize,
              chainsSize: config.primary.chainsSize,
              inlineChainsSize: config.primary.inlineChainsSize,
              titleVariant: config.primary.titleVariant,
              descriptionVariant: config.primary.descriptionVariant,
              infoContainerGap: config.primary.infoContainerGap,
              chainsLimit: config.chainsLimit,
              chainsSpacing: config.chainsSpacing,
            }}
          />
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
