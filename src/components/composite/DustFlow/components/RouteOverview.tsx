import { createTokenBalance } from '@/types/tokens';
import type { FC } from 'react';
import { useWidgetStore } from '@/components/composite/JumperWidget/store';
import { Summary } from '@/components/composite/JumperWidget/components/Summary';
import type { DustSummaryValue } from '../hooks/useDustFormFields';
import type { LiFiStep } from '@lifi/sdk';
import Box from '@mui/material/Box';
import { AvatarItem } from '@/components/core/AvatarStack/AvatarItem';
import Typography from '@mui/material/Typography';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { NetworkCost } from '../../JumperWidget/components/NetworkCost/NetworkCost';

const fieldSx = { background: 'transparent', boxShadow: 'none', padding: 0 };

interface RouteOverviewProps {
  quotes?: LiFiStep[];
}

export const RouteOverview: FC<RouteOverviewProps> = ({ quotes }) => {
  const dustSummary = useWidgetStore(
    (state) => state.values.dustSummary as DustSummaryValue | undefined,
  );

  if (!dustSummary || !quotes) {
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
              alt: 'Wrapper',
              id: 'step',
            }}
            size={AvatarSize.XL}
          />
          <Typography variant="bodySmallStrong">Wrapper via Li.Fi</Typography>
        </Box>
      </Summary>
      <NetworkCost steps={quotes} />
    </>
  );
};
