import type { FC } from 'react';
import Box from '@mui/material/Box';
import { getAvatarSize } from '@/components/core/AvatarStack/AvatarStack.styles';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { EntityStackBadgePlacement } from '@/components/composite/EntityStackWithBadge/types';
import type { Token } from '@/types/tokens';
import type { TransactionSummaryRowConfig } from '../types';
import type { TransactionSummaryContent } from '../hooks';

export type FieldsConfig = Pick<
  TransactionSummaryRowConfig,
  'titleVariant' | 'descriptionVariant' | 'valueGap'
>;
export type TokenStackConfig = Pick<
  TransactionSummaryRowConfig,
  'tokenSize' | 'badgeSize' | 'inlineBadgeSize' | 'badgeSpacing'
>;

interface TransactionTokenStackProps {
  tokens: Token[];
  config: TokenStackConfig;
}

export const TransactionTokenStack: FC<TransactionTokenStackProps> = ({
  tokens,
  config,
}) => {
  if (!tokens.length) {
    const { width, height } = getAvatarSize(config.tokenSize);
    return <Box sx={{ width, height, display: 'flex' }}>-</Box>;
  }

  const chainEntities = tokens.map((token) => ({
    chainId: token.chainId,
    chainKey: token.chainId.toString(),
  }));
  const hasMultipleChains = chainEntities.length > 1;

  return (
    <EntityStackWithBadge
      entities={tokens}
      badgeEntities={chainEntities}
      placement={
        hasMultipleChains
          ? EntityStackBadgePlacement.Inline
          : EntityStackBadgePlacement.Overlay
      }
      size={config.tokenSize}
      badgeSize={hasMultipleChains ? config.inlineBadgeSize : config.badgeSize}
      isContentVisible={false}
      spacing={{ badge: config.badgeSpacing }}
    />
  );
};

interface FieldProps {
  content: TransactionSummaryContent;
  fieldsConfig: FieldsConfig;
}

export const TransactionSummaryAmountField: FC<FieldProps> = ({
  content,
  fieldsConfig,
}) => (
  <TitleWithHint
    title={content.amountTitle}
    titleVariant={fieldsConfig.titleVariant}
    hint={content.amountHint}
    hintVariant={fieldsConfig.descriptionVariant}
    gap={fieldsConfig.valueGap}
    sx={{
      '& > :nth-child(2)': {
        whiteSpace: 'pre-wrap',
      },
    }}
  />
);

export const TransactionSummaryActionField: FC<FieldProps> = ({
  content,
  fieldsConfig,
}) => (
  <TitleWithHint
    title={content.actionTitle}
    titleVariant={fieldsConfig.titleVariant}
    titleDataTestId="transaction-action"
    gap={fieldsConfig.valueGap}
  />
);

export const TransactionSummaryFeeField: FC<FieldProps> = ({
  content,
  fieldsConfig,
}) => (
  <TitleWithHint
    title={content.feeTitle}
    titleVariant={fieldsConfig.titleVariant}
    hint={content.feeHint}
    hintVariant={fieldsConfig.descriptionVariant}
    titleDataTestId="transaction-fee"
    hintDataTestId="transaction-fee-hint"
    gap={fieldsConfig.valueGap}
  />
);

export const TransactionSummaryDateField: FC<FieldProps> = ({
  content,
  fieldsConfig,
}) => (
  <TitleWithHint
    title={content.dateTitle}
    titleVariant={fieldsConfig.titleVariant}
    hint={content.dateHint}
    hintVariant={fieldsConfig.descriptionVariant}
    titleDataTestId="transaction-date"
    hintDataTestId="transaction-time"
    gap={fieldsConfig.valueGap}
  />
);
