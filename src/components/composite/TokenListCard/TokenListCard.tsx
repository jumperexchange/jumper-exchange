import { FC, useState } from 'react';
import {
  EntityChainStackChainsPlacement,
  EntityChainStackVariant,
} from '../EntityChainStack/EntityChainStack.types';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from './TokenListCard.styles';
import { useTranslation } from 'react-i18next';
import {
  TokenListCardProps,
  TokenListCardTokenSize,
} from './TokenListCard.types';
import { MinimalToken } from 'src/types/tokens';
import { TitleWithHint } from '../TitleWithHint/TitleWithHint';

export const TokenListCard: FC<TokenListCardProps> = ({
  token: portfolioToken,
  size = TokenListCardTokenSize.SM,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { t } = useTranslation();

  const isSmallVariant = size === TokenListCardTokenSize.SM;
  const tokenSize = isSmallVariant ? AvatarSize.LG : AvatarSize.XXL;
  const chainsSize = isSmallVariant ? AvatarSize.XXS : AvatarSize.SM;
  const titleVariant = isSmallVariant ? 'bodySmallStrong' : 'bodyMediumStrong';
  const descriptionVariant = isSmallVariant ? 'bodyXXSmall' : 'bodyXSmall';
  const spacing = isSmallVariant ? 2 : 3;

  const hasMultipleChains =
    portfolioToken.relatedTokens && portfolioToken.relatedTokens.length > 1;

  const handleMainTokenClick = (token: MinimalToken) => {
    if (!hasMultipleChains) {
      onSelect?.(token);
      return;
    }
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  const handleExpandedTokenClick = (token: MinimalToken) => {
    onSelect?.(token);
  };

  const renderTokenStack = (
    token: MinimalToken,
    onClick: (token: MinimalToken) => void,
  ) => {
    return (
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        justifyContent="space-between"
        sx={{ width: '100%', cursor: 'pointer' }}
        onClick={() => onClick(token)}
        key={`${token.address}-${token.chain.chainId}`}
      >
        <EntityChainStack
          variant={EntityChainStackVariant.TokenWithChains}
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
        <TitleWithHint
          title={t('format.currency', { value: token.totalPriceUSD })}
          titleVariant={titleVariant}
          hintVariant={descriptionVariant}
          hint={t('format.decimal', { value: token.balance })}
          sx={{ textAlign: 'right' }}
        />
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
          {portfolioToken.relatedTokens?.map((token) =>
            renderTokenStack(token, handleExpandedTokenClick),
          )}
        </Stack>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};
