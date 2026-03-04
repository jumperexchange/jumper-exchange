import { createTokenBalance } from '@/types/tokens';
import type { FC } from 'react';
import { useWidgetStore } from '@/components/composite/JumperWidget/store';
import { Summary } from '@/components/composite/JumperWidget/components/Summary';
import type { DustSummaryValue } from '../hooks/useDustFormFields';
import type { OdosQuoteResponse } from '../api/odos';
import Box from '@mui/material/Box';
import { AvatarItem } from '@/components/core/AvatarStack/AvatarItem';
import Typography from '@mui/material/Typography';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { OdosNetworkCost } from '../../JumperWidget/components/NetworkCost/OdosNetworkCost';
import { SLIPPAGE_LIMIT_PERCENT } from '../hooks/useDustQuotes';

const fieldSx = { background: 'transparent', boxShadow: 'none', padding: 0 };

interface RouteOverviewProps {
  quote?: OdosQuoteResponse | null;
}

export const RouteOverview: FC<RouteOverviewProps> = ({ quote }) => {
  const dustSummary = useWidgetStore(
    (state) => state.values.dustSummary as DustSummaryValue | undefined,
  );

  if (!dustSummary || !quote?.pathId) {
    return null;
  }

  return (
    <>
      <Summary
        label="Convert"
        from={dustSummary.selectedBalances}
        amountUSD={dustSummary.amountUSD}
        to={createTokenBalance(dustSummary.nativeToken, dustSummary.amount)}
        fieldSx={fieldSx}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <AvatarItem
            avatar={{
              src: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/protocols/wrapper.svg',
              alt: 'Odos',
              id: 'odos',
            }}
            size={AvatarSize.XL}
          />
          <Typography variant="bodySmallStrong">Odos</Typography>
        </Box>
      </Summary>
      <OdosNetworkCost
        quote={quote}
        outputToken={dustSummary.nativeToken}
        slippagePercent={SLIPPAGE_LIMIT_PERCENT}
      />
    </>
  );
};
