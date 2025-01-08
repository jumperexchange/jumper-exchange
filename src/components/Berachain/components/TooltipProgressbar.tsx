import { parseRawAmountToTokenAmount } from 'royco/utils';
import type { EnrichedMarketDataType } from 'royco/queries';
import React from 'react';
import { t } from 'i18next';
import { Tooltip } from '@mui/material';

function TooltipProgressbar({
  market,
  children,
}: {
  market: EnrichedMarketDataType;
  children: React.ReactElement;
}) {
  const fillable = parseRawAmountToTokenAmount(
    market.quantity_ip?.toString() ?? '0',
    market?.input_token_data?.decimals ?? 0,
  );

  return (
    <Tooltip
      title={
        <>
          there is still{' '}
          {t('format.decimal', {
            value: fillable,
            notation: 'compact',
          })}{' '}
          to be filled
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
