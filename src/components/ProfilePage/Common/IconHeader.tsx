'use client';

import { Tooltip, useTheme } from '@mui/material';
import { StyledInfoIcon } from '../../TooltipInfo/TooltipInfo.style';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { Badge } from '@/components/Badge/Badge';

export interface IconHeaderProps {
  tooltip: string;
  title?: string;
  icon?: React.ReactNode;
}

const IconHeader = ({ tooltip, title, icon }: IconHeaderProps) => {
  const theme = useTheme();
  return (
    <Badge
      label={title}
      size={BadgeSize.MD}
      variant={BadgeVariant.Alpha}
      endIcon={
        <Tooltip
          title={tooltip}
          sx={{ cursor: 'help', color: theme.palette.text.primary }}
          placement="top"
          enterTouchDelay={0}
          arrow
        >
          <StyledInfoIcon size={20} />
        </Tooltip>
      }
    />
  );
};

export default IconHeader;
