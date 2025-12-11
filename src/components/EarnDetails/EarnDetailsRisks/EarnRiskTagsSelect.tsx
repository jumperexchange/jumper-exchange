import { Box } from '@mui/system';

import { SelectVariant } from '@/components/core/form/Select/Select.types';
import { Select } from '@/components/core/form/Select/Select';

import type { RiskTag, RiskTagOptions } from './EarnDetailsRisks';

interface EarnRiskTagsSelectProps {
  onTagChange: (tag: string) => void;
  options: RiskTagOptions;
  selectedTag: RiskTag;
}

export const EarnRiskTagsSelect = ({
  onTagChange,
  options,
  selectedTag,
}: EarnRiskTagsSelectProps) => {
  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing(2) })}>
      <Select
        debounceMs={0}
        options={options}
        value={selectedTag}
        onChange={onTagChange}
        variant={SelectVariant.Single}
        menuPlacementX="left"
      />
    </Box>
  );
};
