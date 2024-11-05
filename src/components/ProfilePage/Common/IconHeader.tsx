import { Tooltip, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StyledInfoIcon } from '../../TooltipInfo/TooltipInfo.style';
import { IconHeaderContainer, IconHeaderTitle } from './IconHeader.style';

interface IconHeaderProps {
  tooltipKey: string;
  title: string;
}

export const IconHeader = ({ tooltipKey, title }: IconHeaderProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <IconHeaderContainer>
      <IconHeaderTitle variant="bodySmallStrong">{title}</IconHeaderTitle>
      <Tooltip
        title={t(tooltipKey as any)}
        sx={{ cursor: 'help', color: theme.palette.text.primary }}
        placement="top"
        enterTouchDelay={0}
        arrow
      >
        <StyledInfoIcon />
      </Tooltip>
    </IconHeaderContainer>
  );
};
