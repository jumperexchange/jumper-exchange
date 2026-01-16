import type { FC } from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from './TokenListCard.styles';
import type { TokenListCardProps } from './TokenListCard.types';
import { TokenListCardTokenSize } from './TokenListCard.types';
import type { PortfolioToken } from 'src/types/tokens';
import { TOKEN_LIST_CARD_CONFIG } from './constants';
import { TokenStackItem } from './TokenStackItem';

export const TokenListCard: FC<TokenListCardProps> = ({
  token: portfolioToken,
  size = TokenListCardTokenSize.SM,
  onSelect,
  shouldShowExpandedEndDivider = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const config = TOKEN_LIST_CARD_CONFIG[size];
  const hasMultipleChains =
    portfolioToken.relatedTokens && portfolioToken.relatedTokens.length > 1;

  const handlePrimaryTokenClick = () => {
    if (!hasMultipleChains) {
      onSelect?.(portfolioToken);
      return;
    }
    setIsExpanded((prev) => !prev);
  };

  const handleExpandedTokenClick = (token: PortfolioToken) => {
    onSelect?.(token);
  };

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
        <TokenStackItem
          token={portfolioToken}
          config={config.primary}
          chainsLimit={config.chainsLimit}
          chainsSpacing={config.chainsSpacing}
          isClickable={hasMultipleChains || !!onSelect}
          onClick={handlePrimaryTokenClick}
        />
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Stack direction="column" useFlexGap>
          <Divider
            sx={(theme) => ({
              borderColor: (theme.vars || theme).palette.alpha100.main,
              marginY: config.dividerSpacing,
            })}
          />
          {portfolioToken.relatedTokens?.map((token) => (
            <TokenStackItem
              key={`${token.address}-${token.chain.chainId}`}
              token={token}
              config={config.expanded}
              chainsLimit={config.chainsLimit}
              chainsSpacing={config.chainsSpacing}
              isClickable={!!onSelect}
              onClick={() => handleExpandedTokenClick(token)}
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
