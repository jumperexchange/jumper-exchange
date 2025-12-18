import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { toFixedFractionDigits } from 'src/utils/formatNumbers';
import { DepositButtonDisplayMode } from '../DepositButton/DepositButton.types';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '../EntityChainStack/EntityChainStack.types';
import { TitleWithHint } from '../TitleWithHint/TitleWithHint';
import { COLUMN_SPACING } from './constants';
import type { RenderCellProps } from './DeFiPositionCard.types';
import type { DefiToken, DefiPosition } from 'src/types/jumper-backend';
import { DepositFlowOnDemandButton } from '../DepositFlow/DepositFlow';
import { StyledPositionActions } from './DeFiPositionCard.styles';
import type { TFunction } from 'i18next';
import { WithdrawFlowOnDemandButton } from '../WithdrawFlow/WithdrawFlow';
import { formatUnits } from 'viem';

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

export const renderEntityCell = ({
  item,
  titleVariant,
  descriptionVariant,
}: RenderCellProps<DefiToken>) => (
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
}: RenderCellProps<DefiToken>) => (
  <TitleWithHint
    title={t('format.currency', { value: item.amountUSD })}
    hint={`${formatUnits(BigInt(item.amount || '0'), item.decimals)} ${item.symbol}`}
    titleVariant={titleVariant}
    hintVariant={descriptionVariant}
  />
);

export const renderApyCell = ({
  position,
  titleVariant,
}: {
  position: DefiPosition;
  titleVariant: RenderCellProps['titleVariant'];
}) => {
  const apyValue = position.latest?.apy?.total;
  return (
    <TitleWithHint
      // TODO: use the APY formatting function once available
      title={apyValue ? `${toFixedFractionDigits(apyValue, 0, 2)}%` : '-'}
      titleVariant={titleVariant}
    />
  );
};

export const renderPositionActions = ({
  position,
  isMobile,
  t,
}: {
  position: DefiPosition;
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
        earnOpportunitySlug={position.earn || ''}
        disabled={!position.earn}
      />
      <DepositFlowOnDemandButton
        displayMode={DepositButtonDisplayMode.LabelOnly}
        label={t('portfolio.defiPositionCard.actions.deposit')}
        fullWidth={isMobile}
        earnOpportunitySlug={position.earn || ''}
        disabled={!position.earn}
      />
    </StyledPositionActions>
  );
};

export const renderRewardActions = ({
  position,
  isMobile,
  t,
}: {
  position: DefiPosition;
  isMobile: boolean;
  t: TFunction;
}) => (
  <StyledPositionActions
    direction={{
      md: 'row',
      xs: 'column',
    }}
    useFlexGap
  >
  </StyledPositionActions>
);

export const renderBorrowedActions = ({
  position,
  isMobile,
  t,
}: {
  position: DefiPosition;
  isMobile: boolean;
  t: TFunction;
}) => (
  <StyledPositionActions
    direction={{
      md: 'row',
      xs: 'column',
    }}
    useFlexGap
  >
  </StyledPositionActions>
);
