import { useEffect, useState } from 'react';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledContent,
} from './ExpandableSection.style';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from '@/utils/theme/mergeSx';

export interface ExpandableSectionProps<T> {
  header: React.ReactNode;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
  isExpanded?: boolean;
  showExpandedEndDivider?: boolean;
  showExpandIcon?: boolean;
  shouldExpand?: boolean;
  isDetailsItemClickable?: boolean;
  sx?: SxProps<Theme>;
  detailsListSx?: SxProps<Theme>;
  detailsItemSx?: SxProps<Theme>;
  dataTestId?: string;
}

export const ExpandableSection = <T,>({
  items,
  renderItem,
  onItemClick,
  header,
  isExpanded: initialIsExpanded = false,
  showExpandedEndDivider,
  shouldExpand = true,
  showExpandIcon = true,
  isDetailsItemClickable = true,
  sx,
  detailsListSx,
  detailsItemSx,
  dataTestId,
}: ExpandableSectionProps<T>) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initialIsExpanded);

  useEffect(() => {
    setIsExpanded(initialIsExpanded);
  }, [initialIsExpanded]);

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
      data-testid={dataTestId}
    >
      <StyledAccordionSummary
        useDefaultCursor={!shouldExpand}
        expandIcon={
          showExpandIcon && shouldExpand ? <ExpandMoreIcon /> : undefined
        }
        onClick={handleHeaderClick}
      >
        {header}
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Stack
          direction="column"
          useFlexGap
          sx={mergeSx(
            {
              gap: 1,
            },
            detailsListSx,
          )}
        >
          <Divider
            sx={(theme) => ({
              borderColor: (theme.vars || theme).palette.alpha100.main,
            })}
          />
          {items.map((item, index) => (
            <StyledContent
              useDefaultCursor={!isDetailsItemClickable}
              direction="row"
              spacing={2}
              useFlexGap
              key={`ExpandableSectionItem-${index}`}
              onClick={
                onItemClick && isDetailsItemClickable
                  ? () => onItemClick(item)
                  : undefined
              }
              sx={mergeSx(
                {
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
                detailsItemSx,
              )}
            >
              {renderItem(item)}
            </StyledContent>
          ))}
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
