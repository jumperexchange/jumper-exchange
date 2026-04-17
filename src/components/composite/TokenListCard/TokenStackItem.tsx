import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EntityChainStackChainsPlacement,
  EntityChainStackVariant,
} from '../EntityChainStack/EntityChainStack.types';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { TitleWithHint } from '../TitleWithHint/TitleWithHint';
import { StyledContent } from './TokenListCard.styles';
import type { PortfolioToken } from 'src/types/tokens';
import type { TokenStackConfig } from './constants';
import type { ResponsiveValue } from '@/types/responsive';
import { getResponsiveValue } from './utils';
import useMediaQuery from '@mui/material/useMediaQuery';

interface TokenStackItemProps {
  token: PortfolioToken;
  config: TokenStackConfig;
  chainsLimit: ResponsiveValue<number>;
  chainsSpacing: number;
  isClickable: boolean;
  onClick?: () => void;
}

export const TokenStackItem: FC<TokenStackItemProps> = ({
  token,
  config,
  chainsLimit,
  chainsSpacing,
  isClickable,
  onClick,
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const resolvedChainsLimit = getResponsiveValue(chainsLimit, isMobile);

  return (
    <StyledContent
      hideCursor={!isClickable}
      direction="row"
      spacing={2}
      useFlexGap
      onClick={onClick}
      sx={[
        { justifyContent: 'space-between' },
        ...(Array.isArray(config.itemSx) ? config.itemSx : [config.itemSx]),
      ]}
    >
      <EntityChainStack
        variant={EntityChainStackVariant.TokenWithChains}
        token={token}
        tokenSize={config.tokenSize}
        chainsPlacement={EntityChainStackChainsPlacement.Inline}
        chainsSize={config.chainsSize}
        chainsInlineSize={config.chainsInlineSize}
        chainsLimit={resolvedChainsLimit}
        content={{
          title: token.symbol,
          titleVariant: config.titleVariant,
          descriptionVariant: config.descriptionVariant,
        }}
        spacing={{
          chains: chainsSpacing,
          infoContainerGap: config.infoContainerGap,
        }}
      />
      <TitleWithHint
        title={t(`format.${isMobile ? 'currencyCompact' : 'currency'}`, {
          value: token.totalPriceUSD,
        })}
        titleVariant={config.titleVariant}
        hintVariant={config.descriptionVariant}
        hint={`${t(`format.${isMobile ? 'decimalCompact' : 'decimal'}`, { value: token.balance })} ${token.symbol}`}
        sx={{
          textAlign: 'right',
          marginLeft: 'auto',
          minWidth: 0,
        }}
        gap={config.infoContainerGap}
      />
    </StyledContent>
  );
};
