import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { EntityStackWithBadge } from '../../EntityStackWithBadge/EntityStackWithBadge';
import { StyledTagsRow } from '../PositionCard.styles';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import { GiftIcon } from '@/components/illustrations/GiftIcon';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { COLUMN_SPACING, ICON_STYLES, TYPOGRAPHY_VARIANTS } from '../constants';
import { isChainPortfolioPosition } from '../types';
import type { PortfolioPosition } from '@/providers/PortfolioProvider/types';

interface PositionSummaryRowProps {
  positions: PortfolioPosition[];
}

export const PositionSummaryRow: FC<PositionSummaryRowProps> = ({
  positions,
}) => {
  const { t } = useTranslation();

  const firstPosition = positions[0];
  if (!firstPosition) {
    return null;
  }

  const totalNetUsd = positions.reduce((sum, pos) => sum + pos.netUsd, 0);
  const badgeEntities = isChainPortfolioPosition(firstPosition)
    ? [firstPosition.chain]
    : [];
  const hasRewards = positions.some(
    (position) => position.rewardTokens && position.rewardTokens.length > 0,
  );

  return (
    <>
      <EntityStackWithBadge
        entities={[firstPosition.protocol]}
        badgeEntities={badgeEntities}
        size={AvatarSize.XXL}
        content={{
          title: firstPosition.protocol.name,
          titleVariant: TYPOGRAPHY_VARIANTS.title,
          hintVariant: TYPOGRAPHY_VARIANTS.description,
        }}
        spacing={{
          badge: COLUMN_SPACING.badge,
        }}
      />
      <StyledTagsRow>
        <Badge
          variant={BadgeVariant.Secondary}
          size={BadgeSize.MD}
          label={firstPosition.type}
          data-testid={`earn-card-tag-${firstPosition.type.toLowerCase().replace(/\s+/g, '-')}`}
        />
        {hasRewards && (
          <Badge
            variant={BadgeVariant.Alpha}
            size={BadgeSize.MD}
            startIcon={<GiftIcon sx={ICON_STYLES} />}
          />
        )}
        <TitleWithHint
          title={t('format.currency', { value: totalNetUsd })}
          titleVariant={TYPOGRAPHY_VARIANTS.title}
          sx={(theme) => ({
            textAlign: 'left',
            flex: '1 0 100%',
            [theme.breakpoints.up('md')]: {
              textAlign: 'right',
              flex: '0 0 auto',
            },
          })}
        />
      </StyledTagsRow>
    </>
  );
};
