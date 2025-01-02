'use client';

import { Tooltip, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StyledInfoIcon } from '../../TooltipInfo/TooltipInfo.style';
import { IconHeaderContainer, IconHeaderTitle } from './IconHeader.style';

export interface IconHeaderProps {
  tooltipKey: string;
  title: string;
  icon?: React.ReactNode;
}

const IconHeader = ({ tooltipKey, title, icon }: IconHeaderProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <IconHeaderContainer>
      {icon}
      <IconHeaderTitle variant="title2xSmall">{title}</IconHeaderTitle>
      <Tooltip
        title={t(tooltipKey as any)}
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
