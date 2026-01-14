import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { DepositButtonDisplayMode } from '@/components/composite/DepositButton/DepositButton.types';
import { EntityChainStack } from '@/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '@/components/composite/EntityChainStack/EntityChainStack.types';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import { COLUMN_SPACING } from './constants';
import type {
  EnhancedDefiTokenWithPositionData,
  RenderCellProps,
} from './DeFiPositionCard.types';
import { DepositFlowOnDemandButton } from '@/components/composite/DepositFlow/DepositFlow';
import { StyledPositionActions } from './DeFiPositionCard.styles';
import type { TFunction } from 'i18next';
import { WithdrawFlowOnDemandButton } from '@/components/composite/WithdrawFlow/WithdrawFlow';
import { formatApy } from '@/utils/numbers/apy';
import type { DefiPosition, DefiToken } from '@/types/jumper-backend';
import { toFixedFractionDigits } from '@/utils/formatNumbers';

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

export const createEnhancedToken = (
  token: DefiToken,
  position: DefiPosition,
): EnhancedDefiTokenWithPositionData => ({
  ...token,
  latest: position.latest,
  earn: position.earn,
});

export const renderEntityCell = ({
  item,
  titleVariant,
  descriptionVariant,
}: RenderCellProps<EnhancedDefiTokenWithPositionData>) => (
  <EntityChainStack
    variant={EntityChainStackVariant.Tokens}
    tokens={[item]}
    tokensSize={AvatarSize.XL}
    content={{
      title: item.name,
      titleVariant,
      descriptionVariant,
    }}
    spacing={{
      chains: COLUMN_SPACING.chains,
      infoContainerGap: COLUMN_SPACING.infoContainerGap,
    }}
  />
);

export const renderValueCell = ({
  item,
  t,
  titleVariant,
  descriptionVariant,
}: RenderCellProps<EnhancedDefiTokenWithPositionData>) => (
  <TitleWithHint
    title={t('format.currency', { value: item.amountUSD })}
    hint={`${toFixedFractionDigits(Number(item.amount), 0, 6)} ${item.symbol}`}
    titleVariant={titleVariant}
    hintVariant={descriptionVariant}
  />
);

export const renderApyCell = ({
  item,
  titleVariant,
}: {
  item: EnhancedDefiTokenWithPositionData;
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
  item: EnhancedDefiTokenWithPositionData;
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
        disabled={!item.earn}
      />
      <DepositFlowOnDemandButton
        displayMode={DepositButtonDisplayMode.LabelOnly}
        label={t('portfolio.defiPositionCard.actions.deposit')}
        fullWidth={isMobile}
        earnOpportunitySlug={item.earn || ''}
        disabled={!item.earn}
      />
    </StyledPositionActions>
  );
};

export const renderRewardActions = ({}: {
  item: EnhancedDefiTokenWithPositionData;
  isMobile: boolean;
  t: TFunction;
}) => (
  <StyledPositionActions
    direction={{
      md: 'row',
      xs: 'column',
    }}
    useFlexGap
  ></StyledPositionActions>
);

export const renderBorrowedActions = ({}: {
  item: EnhancedDefiTokenWithPositionData;
  isMobile: boolean;
  t: TFunction;
}) => (
  <StyledPositionActions
    direction={{
      md: 'row',
      xs: 'column',
    }}
    useFlexGap
  ></StyledPositionActions>
);

export const hasPositionDataToDisplay = (position: DefiPosition) => {
  return (
    position.supplyTokens?.length > 0 ||
    position.borrowTokens?.length > 0 ||
    position.rewardTokens?.length > 0
  );
};
