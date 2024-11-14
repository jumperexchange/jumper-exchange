import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NoSelectTypography } from '@/components/ProfilePage/ProfilePage.style';
import { StyledInfoIcon } from './CustonInfoIcon';

interface IconHeaderProps {
  tooltipKey: string;
  title: string;
}

export const IconHeader = ({ tooltipKey, title }: IconHeaderProps) => {
  const { t } = useTranslation();

  return (
    <NoSelectTypography fontSize="14px" lineHeight="18px" fontWeight={700}>
      {title}
      <Tooltip
        title={t(tooltipKey as any)}
        sx={{ cursor: 'help' }}
        placement="top"
        enterTouchDelay={0}
        arrow
      >
        <StyledInfoIcon />
      </Tooltip>
    </NoSelectTypography>
  );
};
