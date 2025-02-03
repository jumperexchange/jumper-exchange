import { parseRawAmountToTokenAmount } from 'royco/utils';
import type { EnrichedMarketDataType } from 'royco/queries';
import React from 'react';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

function TooltipProgressbar({
  market,
  children,
}: {
  market: EnrichedMarketDataType;
  children: React.ReactElement;
}) {
  const { t } = useTranslation();
  const fillable = parseRawAmountToTokenAmount(
    market.quantity_ip?.toString() ?? '0',
    market?.input_token_data?.decimals ?? 0,
  );

  return (
    <Tooltip
      title={
        <>
          There is still{' '}
          {t('format.decimal', {
            value: fillable,
            notation: 'compact',
          })}{' '}
          tokens to be invested.
        </>
      }
      placement="top"
      enterTouchDelay={0}
      arrow
    >
      {children}
    </Tooltip>
  );
}

export default TooltipProgressbar;
