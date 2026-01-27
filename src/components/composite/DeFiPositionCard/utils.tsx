import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { DepositButtonDisplayMode } from '../DepositButton/DepositButton.types';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '../EntityChainStack/EntityChainStack.types';
import { TitleWithHint } from '../TitleWithHint/TitleWithHint';
import { COLUMN_SPACING } from './constants';
import type {
  EnhancedDefiTokenWithPositionData,
  RenderCellProps,
} from './DeFiPositionCard.types';
import { DepositFlowOnDemandButton } from '../DepositFlow/DepositFlow';
import { StyledPositionActions } from './DeFiPositionCard.styles';
import type { TFunction } from 'i18next';
import { WithdrawFlowOnDemandButton } from '../WithdrawFlow/WithdrawFlow';
import { formatUnits } from 'viem';
import { formatApy } from '@/utils/numbers/apy';
import type { AppToken, DefiToken, Token } from '@/types/jumper-backend';
import type { DefiPosition } from '@/utils/positions/type-guards';

const isTokenWithChain = (
  token: DefiToken | AppToken,
): token is DefiToken & Token => 'chain' in token && token.chain !== undefined;

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
  token: DefiToken | AppToken,
  position: DefiPosition,
): EnhancedDefiTokenWithPositionData => ({
  ...token,
  latest: position.latest,
  earn: position.earn,
  earnInteractionFlags: position.earnInteractionFlags,
  protocol: position.protocol,
});

export const renderEntityCell = ({
  item,
  titleVariant,
  descriptionVariant,
}: RenderCellProps<EnhancedDefiTokenWithPositionData>) => {
  if (isTokenWithChain(item)) {
    return (
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
  }

  return (
    <EntityChainStack
      variant={EntityChainStackVariant.Protocol}
      protocol={{
        name: item.name,
        logo: item.logo,
      }}
      protocolSize={AvatarSize.XL}
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
};

export const renderValueCell = ({
  item,
  t,
  titleVariant,
  descriptionVariant,
}: RenderCellProps<EnhancedDefiTokenWithPositionData>) => (
  <TitleWithHint
    title={t('format.currency', { value: item.amountUSD })}
    hint={`${formatUnits(BigInt(item.amount || '0'), item.decimals)} ${item.symbol}`}
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
