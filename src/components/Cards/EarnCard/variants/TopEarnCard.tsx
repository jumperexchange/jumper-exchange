import Grid from '@mui/material/Grid';
import { uniqBy } from 'lodash';
import { FC } from 'react';
import { Trans } from 'react-i18next';
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
import { TopHighlight } from './TopHighlight';

export enum TopEarnCardCopyKey {
  USE_YOUR_SPARE = 'earn.top.useYourSpare',
  MAXIMIZE_YOUR_REVENUE = 'earn.top.maximizeYourRevenue',
  MAKE_THE_JUMP = 'earn.top.makeTheJump',
  EARN_UP_TO = 'earn.top.earnUpTo',
}

export const ithCopy = (index: number): TopEarnCardCopyKey => {
  const values = Object.values(TopEarnCardCopyKey);
  const safeIndex = (index + values.length) % values.length;
  return values[safeIndex] as TopEarnCardCopyKey;
};

type Props = Omit<EarnCardProps, 'variant'> & {
  copy?: TopEarnCardCopyKey;
  isMain?: boolean;
};

export const TopEarnCard: FC<Props> = ({
  primaryAction,
  data,
  isLoading,
  copy = TopEarnCardCopyKey.USE_YOUR_SPARE,
  isMain = false,
  onClick,
}) => {
  // Note: later we might want to keep rendering the card if it's loading but already has data (on ttl for examples).
  const isEmpty = data === null || isLoading;

  if (isEmpty) {
    return <TopEarnCardSkeleton />;
  }

  // TODO: LF-14990: Complex Top Opportunity rendering
  // For now we're rendering the same text all the time, ideally
  // we'd use custom tags like "IsBest" + "Lending" to render different texts
  const { asset, protocol, forYou, tags, latest } = data;

  const assets = [asset];
  const chains = uniqBy(
    assets.map((asset) => asset.chain),
    'chainId',
  );
  const formattedApy = `${(latest.apy.total * 100).toLocaleString()}%`;

  return (
    <TopEarnCardContainer onClick={onClick}>
      <TopEarnCardHeaderContainer direction="row">
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
          />
        ))}
      </TopEarnCardHeaderContainer>
      <TopEarnCardContentContainer isMain={isMain}>
        <p>
          <Trans
            i18nKey={copy}
            components={{
              asset: <TopHighlight type="asset">{asset.symbol}</TopHighlight>,
              protocol: (
                <TopHighlight type="protocol">{protocol.name}</TopHighlight>
              ),
              apy: <TopHighlight type="apy">{formattedApy}</TopHighlight>,
              token: <TopHighlight type="token">{asset.symbol}</TopHighlight>,
              tag: (
                <TopHighlight type="tag">{tags?.[0] ?? 'Crypto'}</TopHighlight>
              ),
              chain: (
                <TopHighlight type="chain">{asset.chain.chainKey}</TopHighlight>
              ),
            }}
          />
        </p>
      </TopEarnCardContentContainer>
      <TopEarnCardFooterContainer>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <EntityChainStack
              variant={EntityChainStackVariant.Protocol}
              protocol={protocol}
              chains={chains}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 'auto' }} sx={{ marginLeft: 'auto' }}>
            {primaryAction}
          </Grid>
        </Grid>
      </TopEarnCardFooterContainer>
    </TopEarnCardContainer>
  );
};
