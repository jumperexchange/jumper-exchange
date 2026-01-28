import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { DepositButtonDisplayMode } from '@/components/composite/DepositButton/DepositButton.types';
import { EntityStackWithBadge } from '../EntityStackWithBadge/EntityStackWithBadge';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import { TokenAmount } from '../TokenAmount/TokenAmount';
import { COLUMN_SPACING } from './constants';
import type { EnhancedPositionBalance, RenderCellProps } from './types';
import { DepositFlowOnDemandButton } from '@/components/composite/DepositFlow/DepositFlow';
import { StyledPositionActions } from './PositionCard.styles';
import type { TFunction } from 'i18next';
import { WithdrawFlowOnDemandButton } from '@/components/composite/WithdrawFlow/WithdrawFlow';
import { formatApy } from '@/utils/numbers/apy';
import type { PortfolioPosition } from '@/providers/PortfolioProvider/types';
import type { DisplayableEntity } from '../EntityAvatar/types';
import type { PortfolioBalance, PositionToken } from '@/types/tokens';

export const formatTimeDifference = (date: string, t: TFunction) => {
  const now = new Date();

  const years = differenceInYears(now, date);
  if (years > 0) {
    return t('portfolio.defiPositionCard.overview.lockupPeriod.years', {
      count: years,
    });
  }

  const months = differenceInMonths(now, date);
  if (months > 0) {
    return t('portfolio.defiPositionCard.overview.lockupPeriod.months', {
      count: months,
    });
  }

  const days = differenceInDays(now, date);
  if (days > 0) {
    return t('portfolio.defiPositionCard.overview.lockupPeriod.days', {
      count: days,
    });
  }

  const hours = differenceInHours(now, date);
  if (hours > 0) {
    return t('portfolio.defiPositionCard.overview.lockupPeriod.hours', {
      count: hours,
    });
  }

  const minutes = differenceInMinutes(now, date);
  if (minutes > 0) {
    return t('portfolio.defiPositionCard.overview.lockupPeriod.minutes', {
      count: minutes,
    });
  }

  return t(
    'portfolio.defiPositionCard.overview.lockupPeriod.lessThanOneMinute',
  );
};

export const createEnhancedBalance = (
  balance: PortfolioBalance<PositionToken>,
  position: PortfolioPosition,
): EnhancedPositionBalance => ({
  ...balance,
  latest: position.latest,
  earn: position.earn,
  earnInteractionFlags: position.earnInteractionFlags,
  protocol: position.protocol,
});

/**
 * Convert a PositionBalance token to a DisplayableEntity for EntityStackWithBadge.
 */
const toDisplayableEntity = (
  balance: PortfolioBalance<PositionToken>,
): DisplayableEntity => {
  return balance.token;
};

/**
 * Get chain entities from a PositionBalance for badge display.
 */
const getChainEntities = (
  balance: PortfolioBalance<PositionToken>,
): DisplayableEntity[] => {
  const { token } = balance;
  if (token.chain) {
    return [token.chain];
  }
  return [];
};

export const renderEntityCell = ({
  item,
  titleVariant,
  descriptionVariant,
}: RenderCellProps<EnhancedPositionBalance>) => {
  const entity = toDisplayableEntity(item);
  const chainEntities = getChainEntities(item);

  return (
    <EntityStackWithBadge
      entities={[entity]}
      badgeEntities={chainEntities}
      size={AvatarSize.XL}
      content={{
        title: item.token.name,
        titleVariant,
        hintVariant: descriptionVariant,
      }}
      spacing={{
        badge: COLUMN_SPACING.badge,
        infoContainerGap: COLUMN_SPACING.infoContainerGap,
      }}
    />
  );
};

export const renderValueCell = ({
  item,
  titleVariant,
  descriptionVariant,
}: RenderCellProps<EnhancedPositionBalance>) => (
  <TokenAmount
    balance={item}
    amountUSDVariant={titleVariant}
    amountVariant={descriptionVariant}
  />
);

export const renderApyCell = ({
  item,
  titleVariant,
}: {
  item: EnhancedPositionBalance;
  titleVariant: RenderCellProps['titleVariant'];
}) => {
  const apyValue = item.latest?.apy?.total;
  return (
    <TitleWithHint
      title={apyValue ? formatApy(apyValue) : '-'}
      titleVariant={titleVariant}
    />
  );
};

export const renderPositionActions = ({
  item,
  isMobile,
  t,
}: {
  item: EnhancedPositionBalance;
  isMobile: boolean;
  t: TFunction;
}) => {
  return (
    <StyledPositionActions
      direction={{
        md: 'row',
        xs: 'column',
      }}
      useFlexGap
    >
      <WithdrawFlowOnDemandButton
        label={t('portfolio.defiPositionCard.actions.withdraw')}
        fullWidth={isMobile}
        earnOpportunitySlug={item.earn || ''}
        earnOpportunityInteractionFlags={item.earnInteractionFlags}
        protocolUrl={item.protocol.url}
        protocolName={item.protocol.name}
        disabled={!item.earn}
      />
      <DepositFlowOnDemandButton
        displayMode={DepositButtonDisplayMode.LabelOnly}
        label={t('portfolio.defiPositionCard.actions.deposit')}
        fullWidth={isMobile}
        earnOpportunitySlug={item.earn || ''}
        earnOpportunityInteractionFlags={item.earnInteractionFlags}
        protocolUrl={item.protocol.url}
        protocolName={item.protocol.name}
        disabled={!item.earn}
      />
    </StyledPositionActions>
  );
};

export const renderRewardActions = ({}: {
  item: EnhancedPositionBalance;
  isMobile: boolean;
  t: TFunction;
}) => (
  <StyledPositionActions
    direction={{
      md: 'row',
      xs: 'column',
    }}
    useFlexGap
  />
);

export const renderBorrowedActions = ({}: {
  item: EnhancedPositionBalance;
  isMobile: boolean;
  t: TFunction;
}) => (
  <StyledPositionActions
    direction={{
      md: 'row',
      xs: 'column',
    }}
    useFlexGap
  />
);

export const hasPositionDataToDisplay = (position: PortfolioPosition) => {
  return (
    position.supplyTokens?.length > 0 ||
    position.borrowTokens?.length > 0 ||
    position.rewardTokens?.length > 0
  );
};
