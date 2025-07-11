'use client';

import { Tooltip, useTheme } from '@mui/material';
import { StyledInfoIcon } from '../../TooltipInfo/TooltipInfo.style';
import { IconHeaderContainer, IconHeaderTitle } from './IconHeader.style';

export interface IconHeaderProps {
  tooltip: string;
  title?: string;
  icon?: React.ReactNode;
}

const IconHeader = ({ tooltip, title, icon }: IconHeaderProps) => {
  const theme = useTheme();
  return (
    <IconHeaderContainer>
      {icon}
      {title && (
        <IconHeaderTitle variant="title2XSmall">{title}</IconHeaderTitle>
      )}
      <Tooltip
        title={tooltip}
        sx={{ cursor: 'help', color: theme.palette.text.primary }}
        placement="top"
        enterTouchDelay={0}
        arrow
      >
        <StyledInfoIcon size={20} />
      </Tooltip>
    </IconHeaderContainer>
  );
};

export default IconHeader;
