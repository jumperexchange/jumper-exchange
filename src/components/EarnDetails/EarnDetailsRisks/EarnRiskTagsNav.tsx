import Box from '@mui/material/Box';

import type { RiskTag, RiskTagOptions } from './EarnDetailsRisks';
import { EarnDetailsRisksNavButton } from './EarnDetailsRisks.styles';

interface EarnRiskTagsNavProps {
  onTagChange: (tag: string) => void;
  options: RiskTagOptions;
  selectedTag: RiskTag;
}

export const EarnRiskTagsNav = ({
  onTagChange,
  options,
  selectedTag,
}: EarnRiskTagsNavProps) => {
  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing(4) })}>
      {options.map((tab) => (
        <EarnDetailsRisksNavButton
          key={tab.value}
          isActive={selectedTag === tab.value}
          onClick={() => onTagChange(tab.value)}
        >
          {tab.label}
        </EarnDetailsRisksNavButton>
      ))}
    </Box>
  );
};
