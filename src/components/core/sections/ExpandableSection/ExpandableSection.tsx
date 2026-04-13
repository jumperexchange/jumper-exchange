import { useState, type FC } from 'react';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from './ExpandableSection.style';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { SxProps, Theme } from '@mui/material/styles';

interface ExpandableSectionProps {
  children: React.ReactNode;
  renderHeader: () => React.ReactNode;
  isExpanded?: boolean;
  showExpandedEndDivider?: boolean;
  showExpandIcon?: boolean;
  shouldExpand?: boolean;
  sx?: SxProps<Theme>;
}

export const ExpandableSection: FC<ExpandableSectionProps> = ({
  children,
  renderHeader,
  isExpanded: initialIsExpanded = false,
  showExpandedEndDivider,
  shouldExpand = true,
  showExpandIcon = true,
  sx,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initialIsExpanded);

  const handleHeaderClick = () => {
    if (!shouldExpand) {
      return;
    }
    setIsExpanded((prev) => !prev);
  };

  return (
    <StyledAccordion
      expanded={isExpanded}
      disableGutters
      sx={sx}
      slotProps={{
        heading: { component: 'div' },
        transition: { unmountOnExit: true },
      }}
    >
      <StyledAccordionSummary
        expandIcon={showExpandIcon ? <ExpandMoreIcon /> : undefined}
        onClick={handleHeaderClick}
      >
        {renderHeader()}
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Stack direction="column" useFlexGap gap={1}>
          <Divider
            sx={(theme) => ({
              borderColor: (theme.vars || theme).palette.alpha100.main,
            })}
          />
          {children}
          {isExpanded && showExpandedEndDivider && (
            <Divider
              sx={(theme) => ({
                borderColor: (theme.vars || theme).palette.alpha100.main,
              })}
            />
          )}
        </Stack>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};
