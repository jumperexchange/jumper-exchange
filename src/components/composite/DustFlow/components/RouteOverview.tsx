import { createTokenBalance } from '@/types/tokens';
import type { FC } from 'react';
import { useWidgetStore } from '../../JumperWidget/store';
import { Summary } from '../../JumperWidget/components/Summary';
import type { DustSummaryValue } from '../hooks/useDustFormFields';

const fieldSx = { background: 'transparent', boxShadow: 'none', padding: 0 };

export const RouteOverview: FC = () => {
  const dustSummary = useWidgetStore(
    (state) => state.values.dustSummary as DustSummaryValue | undefined,
  );

  if (!dustSummary) {
    return null;
  }

  return (
    <Summary
      label="Convert"
      from={dustSummary.selectedBalances}
      amountUSD={dustSummary.amountUSD}
      to={createTokenBalance(dustSummary.nativeToken, dustSummary.amount)}
      fieldSx={fieldSx}
    />
  );
};
