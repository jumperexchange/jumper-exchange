import { Tooltip, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StyledInfoIcon } from '../../TooltipInfo/TooltipInfo.style';
import { PointsBoxContainer } from '../LevelBox/PointsBox.style';
import { NoSelectTypography } from '../ProfilePage.style';

interface IconHeaderProps {
  tooltipKey: string;
  title: string;
}

export const IconHeader = ({ tooltipKey, title }: IconHeaderProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <PointsBoxContainer display="flex">
      <NoSelectTypography fontSize="14px" lineHeight="18px" fontWeight={700}>
        {title}
      </NoSelectTypography>
      <Tooltip
        title={t(tooltipKey as any)}
        sx={{ cursor: 'help', color: theme.palette.text.primary }}
        placement="top"
        enterTouchDelay={0}
        arrow
      >
        <StyledInfoIcon />
      </Tooltip>
    </PointsBoxContainer>
  );
};
