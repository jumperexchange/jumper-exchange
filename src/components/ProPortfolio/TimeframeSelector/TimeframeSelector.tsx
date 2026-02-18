import type { PnLTimeframe } from '@/types/pro-portfolio';
import { TabSelect } from '@/components/core/TabSelect/TabSelect';
import type { TabOption } from '@/components/core/TabSelect/TabSelect.types';

export interface TimeframeSelectorProps {
  value: PnLTimeframe;
  onChange: (timeframe: PnLTimeframe) => void;
}

const timeframeOptions: TabOption[] = [
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '1y', label: '1Y' },
  { value: 'all', label: 'All' },
];

export const TimeframeSelector = ({
  value,
  onChange,
}: TimeframeSelectorProps) => {
  return (
    <TabSelect
      options={timeframeOptions}
      value={value}
      onChange={(v) => onChange(v as PnLTimeframe)}
      variant="standard"
      size="small"
      data-testid="pnl-timeframe-selector"
    />
  );
};
