import { uniqBy } from 'lodash';
import type { FC } from 'react';
import { Trans } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { RecommendationIcon } from 'src/components/illustrations/RecommendationIcon';
import {
  HeroEarnCardContainer,
  HeroEarnCardContentContainer,
  HeroEarnCardFooterContainer,
  HeroEarnCardFooterContentContainer,
  HeroEarnCardHeaderContainer,
} from './HeroEarnCard.styles';
import { HeroEarnCardSkeleton } from './HeroEarnCardSkeleton';
import { HeroHighlight, type HeroHighlightType } from './HeroHighlight';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { ConditionalLink } from 'src/components/Link/ConditionalLink';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { SxProps, Theme } from '@mui/material/styles';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';

const heroHighlightSx: Record<HeroHighlightType, SxProps<Theme>> = {
  asset: {},
  protocol: { textTransform: 'capitalize' },
  apy: {},
  token: {},
  tag: { textTransform: 'lowercase' },
  chain: {},
};

export enum EarnHeroCardCopyKey {
  USE_YOUR_SPARE = 'earn.top.useYourSpare',
  MAXIMIZE_YOUR_REVENUE = 'earn.top.maximizeYourRevenue',
  MAKE_THE_JUMP = 'earn.top.makeTheJump',
  EARN_UP_TO = 'earn.top.earnUpTo',
}

interface CommonHeroEarnCardProps {
  fullWidth?: boolean;
  primaryAction?: React.ReactNode;
  copy?: EarnHeroCardCopyKey;
  isMain?: boolean;
  href?: string;
}

export interface HeroEarnCardNotEmptyProps extends CommonHeroEarnCardProps {
  data: EarnOpportunityWithLatestAnalytics;
  isLoading?: boolean;
}

export interface HeroEarnCardEmptyAndLoadingProps extends CommonHeroEarnCardProps {
  data: null;
  isLoading: true;
}

type HeroEarnCardProps =
  | HeroEarnCardNotEmptyProps
  | HeroEarnCardEmptyAndLoadingProps;

export const HeroEarnCard: FC<HeroEarnCardProps> = ({
  primaryAction,
  data,
  isLoading,
  copy = EarnHeroCardCopyKey.USE_YOUR_SPARE,
  isMain = false,
  href,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  // Note: later we might want to keep rendering the card if it's loading but already has data (on ttl for examples).
  const isEmpty = data === null || isLoading;

  if (isEmpty) {
    return <HeroEarnCardSkeleton />;
  }

  // TODO: LF-14990: Complex Top Opportunity rendering
  // For now we're rendering the same text all the time, ideally
  // we'd use custom tags like "IsBest" + "Lending" to render different texts
  const { asset, protocol, forYou, tags, latest, name, lpToken } = data;

  const assets = [asset];
  const chains = uniqBy(
    assets.map((asset) => asset.chain),
    'chainId',
  );
  const formattedApy = `${(latest.apy.total * 100).toLocaleString()}%`;

  const title = name || protocol.product || protocol.name;

  return (
    <ConditionalLink href={href} sx={{ width: '100%' }}>
      <HeroEarnCardContainer hasLink={!!href}>
        <HeroEarnCardHeaderContainer direction="row">
          {forYou && (
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
              data-testid={`earn-card-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
            />
          ))}
        </HeroEarnCardHeaderContainer>
        <HeroEarnCardContentContainer isMain={isMain} as="p">
          <Trans
            i18nKey={copy}
            components={{
              asset: (
                <HeroHighlight type="asset" sx={heroHighlightSx.asset}>
                  {asset.symbol}
                </HeroHighlight>
              ),
              protocol: (
                <HeroHighlight type="protocol" sx={heroHighlightSx.protocol}>
                  {protocol.name}
                </HeroHighlight>
              ),
              apy: (
                <HeroHighlight type="apy" sx={heroHighlightSx.apy}>
                  {formattedApy}
                </HeroHighlight>
              ),
              token: (
                <HeroHighlight type="token" sx={heroHighlightSx.token}>
                  {asset.symbol}
                </HeroHighlight>
              ),
              tag: (
                <HeroHighlight type="tag" sx={heroHighlightSx.tag}>
                  {tags?.[0] ?? 'Crypto'}
                </HeroHighlight>
              ),
              chain: (
                <HeroHighlight type="chain" sx={heroHighlightSx.chain}>
                  {asset.chain.chainKey}
                </HeroHighlight>
              ),
            }}
          />
        </HeroEarnCardContentContainer>
        <HeroEarnCardFooterContainer>
          <HeroEarnCardFooterContentContainer>
            <EntityStackWithBadge
              addressOverride={lpToken?.address}
              entities={[protocol]}
              badgeEntities={chains}
              size={AvatarSize.XXL}
              badgeSize={AvatarSize.SM}
              content={{
                title,
                titleVariant: isMobile ? 'bodyLargeStrong' : 'titleXSmall',
              }}
            />
            {primaryAction}
          </HeroEarnCardFooterContentContainer>
        </HeroEarnCardFooterContainer>
      </HeroEarnCardContainer>
    </ConditionalLink>
  );
};
