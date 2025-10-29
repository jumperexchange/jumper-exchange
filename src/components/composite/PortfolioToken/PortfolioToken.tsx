import { FC, useState } from 'react';
import { CacheToken } from 'src/types/portfolio';
import { ExtendedTokenAmountWithChain } from '@/utils/getTokens';
import {
  EntityChainStackChainsPlacement,
  EntityChainStackVariant,
} from '../EntityChainStack/EntityChainStack.types';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import {
  EntityChainDescription,
  EntityChainInfoContainer,
  EntityChainTitle,
} from '../EntityChainStack/EntityChainStack.styles';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from './PortfolioToken.styles';
import { useTranslation } from 'react-i18next';

export enum PortfolioTokenSize {
  SM = 'sm',
  MD = 'md',
}

interface PortfolioTokenProps {
  token: CacheToken | ExtendedTokenAmountWithChain;
  size?: PortfolioTokenSize;
  onSelect?: (token: CacheToken | ExtendedTokenAmountWithChain) => void;
}

export const PortfolioToken: FC<PortfolioTokenProps> = ({
  token: portfolioToken,
  size = PortfolioTokenSize.SM,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { t } = useTranslation();

  const isSmallVariant = size === PortfolioTokenSize.SM;
  const tokenSize = isSmallVariant ? AvatarSize.LG : AvatarSize.XXL;
  const chainsSize = isSmallVariant ? AvatarSize.XXS : AvatarSize.SM;
  const titleVariant = isSmallVariant ? 'bodySmallStrong' : 'bodyMediumStrong';
  const descriptionVariant = isSmallVariant ? 'bodyXXSmall' : 'bodyXSmall';
  const spacing = isSmallVariant ? 2 : 3;

  const hasMultipleChains = portfolioToken.chains.length > 1;

  const handleMainTokenClick = (
    token: CacheToken | ExtendedTokenAmountWithChain,
  ) => {
    if (!hasMultipleChains) {
      onSelect?.(token);
      return;
    }
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  const handleExpandedTokenClick = (
    token: CacheToken | ExtendedTokenAmountWithChain,
  ) => {
    onSelect?.(token);
  };

  const renderTokenStack = (
    token: CacheToken | ExtendedTokenAmountWithChain,
    onClick: (token: CacheToken | ExtendedTokenAmountWithChain) => void,
  ) => {
    return (
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        justifyContent="space-between"
        sx={{ width: '100%', cursor: 'pointer' }}
        onClick={() => onClick(token)}
      >
        <EntityChainStack
          variant={EntityChainStackVariant.TokensWithChains}
          token={token}
          tokenSize={tokenSize}
          chainsPlacement={EntityChainStackChainsPlacement.Inline}
          chainsSize={chainsSize}
          chainsLimit={8}
          content={{
            title: token.symbol,
            titleVariant,
            descriptionVariant,
          }}
          spacing={{
            chains: -0.8,
          }}
        />

        <EntityChainInfoContainer gap={2} sx={{ textAlign: 'right' }}>
          <EntityChainTitle variant={titleVariant}>
            {t('format.currency', { value: token.cumulatedTotalUSD })}
          </EntityChainTitle>

          <EntityChainDescription
            variant={descriptionVariant}
            data-testid="portfolio-token-balance"
          >
            {t('format.decimal', { value: token.cumulatedBalance })}
          </EntityChainDescription>
        </EntityChainInfoContainer>
      </Stack>
    );
  };

  return (
    <StyledAccordion
      expanded={isExpanded}
      disableGutters
      sx={{ ':not(:last-child)': { paddingBottom: spacing } }}
    >
      <StyledAccordionSummary>
        {renderTokenStack(portfolioToken, handleMainTokenClick)}
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Stack direction="column" spacing={spacing} useFlexGap>
          <Divider
            sx={(theme) => ({
              borderColor: (theme.vars || theme).palette.alpha100.main,
              marginTop: spacing,
            })}
          />
          {portfolioToken.chains.map((token) =>
            renderTokenStack(token, handleExpandedTokenClick),
          )}
        </Stack>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};
