import Grid from '@mui/material/Grid';
import { FC } from 'react';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { EntityChainStack } from 'src/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from 'src/components/composite/EntityChainStack/EntityChainStack.types';
import { RecommendationIcon } from 'src/components/illustrations/RecommendationIcon';
import {
  TopEarnCardContainer,
  TopEarnCardContentContainer,
  TopEarnCardFooterContainer,
  TopEarnCardHeaderContainer,
} from '../EarnCard.styles';
import { EarnCardProps } from '../EarnCard.types';
import { TopEarnCardSkeleton } from './TopEarnCardSkeleton';

export const TopEarnCard: FC<Omit<EarnCardProps, 'variant'>> = ({
  primaryAction,
  assets,
  protocol,
  link,
  recommended,
  tags,
  lockupPeriod,
  apy,
  tvl,
  isLoading,
  onClick,
}) => {
  if (isLoading) {
    return <TopEarnCardSkeleton />;
  }

  return (
    <TopEarnCardContainer onClick={onClick}>
      <TopEarnCardHeaderContainer direction="row">
        {recommended && (
          <Badge
            variant={BadgeVariant.Secondary}
            size={BadgeSize.SM}
            startIcon={<RecommendationIcon height={12} width={12} />}
          />
        )}
        {tags?.map((tag) => (
          <Badge
            variant={BadgeVariant.Secondary}
            size={BadgeSize.SM}
            label={tag}
            key={tag}
          />
        ))}
      </TopEarnCardHeaderContainer>
      <TopEarnCardContentContainer>
        <p>
          Use your spare <span>USDC</span> with <span>Aave</span> and earn up to{' '}
          <span>4.2%</span> APY
        </p>
      </TopEarnCardContentContainer>
      <TopEarnCardFooterContainer>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <EntityChainStack
              variant={EntityChainStackVariant.Protocol}
              protocol={protocol}
              chains={assets.tokens.map((asset) => asset.chain)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{primaryAction}</Grid>
        </Grid>
      </TopEarnCardFooterContainer>
    </TopEarnCardContainer>
  );
};
