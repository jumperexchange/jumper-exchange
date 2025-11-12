import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import { ButtonTransparent } from 'src/components/Button';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { toFixedFractionDigits } from 'src/utils/formatNumbers';
import { DepositButton } from '../DepositButton/DepositButton';
import { DepositButtonDisplayMode } from '../DepositButton/DepositButton.types';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '../EntityChainStack/EntityChainStack.types';
import { TitleWithHint } from '../TitleWithHint/TitleWithHint';
import { COLUMN_SPACING } from './constants';
import {
  ApyItem,
  EntityItem,
  RenderCellProps,
  ValueItem,
} from './DeFiPositionCard.types';
import {
  EarnOpportunityRewardEntity,
  MinimalDeFiPosition,
} from 'src/types/defi';
import { DepositFlowButton } from '../DepositFlow/DepositFlow';
import {
  StyledButtonAlphaDark,
  StyledPositionActions,
  StyledButtonPrimary,
} from './DeFiPositionCard.styles';
import { TFunction } from 'i18next';

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

export const renderEntityCell = <T extends EntityItem>({
  item,
  titleVariant,
  descriptionVariant,
}: RenderCellProps<T>) => (
  <EntityChainStack
    variant={EntityChainStackVariant.Tokens}
    tokens={[item.asset]}
    tokensSize={AvatarSize.XL}
    content={{
      title: item.asset.name,
      titleVariant,
      descriptionVariant,
    }}
    spacing={{
      chains: COLUMN_SPACING.chains,
      infoContainerGap: COLUMN_SPACING.infoContainerGap,
    }}
  />
);

export const renderValueCell = <T extends ValueItem>({
  item,
  t,
  titleVariant,
  descriptionVariant,
}: RenderCellProps<T>) => (
  <TitleWithHint
    title={t('format.currency', { value: item.totalPriceUSD })}
    hint={`${item.balance.toString()} ${item.asset.symbol}`}
    titleVariant={titleVariant}
    hintVariant={descriptionVariant}
  />
);

export const renderApyCell = <T extends ApyItem>({
  item,
  titleVariant,
}: RenderCellProps<T>) => (
  <TitleWithHint
    title={`${toFixedFractionDigits(item.latest.apy.total, 0, 2)}%`}
    titleVariant={titleVariant}
  />
);

export const renderPositionActions = <T extends MinimalDeFiPosition>({
  item,
  isMobile,
  t,
}: RenderCellProps<T>) => (
  <StyledPositionActions direction="row" useFlexGap>
    {/** TODO: Add withdraw flow button */}
    <StyledButtonAlphaDark fullWidth={isMobile}>
      {t('portfolio.defiPositionCard.actions.withdraw')}
    </StyledButtonAlphaDark>
    <DepositFlowButton
      displayMode={DepositButtonDisplayMode.LabelOnly}
      label={t('portfolio.defiPositionCard.actions.deposit')}
      fullWidth={isMobile}
      earnOpportunity={{
        ...item,
        // TODO: Remove this once we have a proper way to get these props for a de fi position
        minFromAmountUSD: 0.99,
        positionUrl: item.url ?? 'unset',
        address: item.lpToken.address,
        rewards: [],
      }}
    />
  </StyledPositionActions>
);

export const renderRewardActions = <T extends EarnOpportunityRewardEntity>({
  item,
  isMobile,
  t,
}: RenderCellProps<T>) => (
  <StyledPositionActions direction="row" useFlexGap>
    {/** TODO: Add claim flow button */}
    <StyledButtonAlphaDark fullWidth={isMobile}>
      {t('portfolio.defiPositionCard.actions.claim')}
    </StyledButtonAlphaDark>
    {/** TODO: Add compound flow button */}
    <StyledButtonPrimary fullWidth={isMobile}>
      {t('portfolio.defiPositionCard.actions.compound')}
    </StyledButtonPrimary>
  </StyledPositionActions>
);
