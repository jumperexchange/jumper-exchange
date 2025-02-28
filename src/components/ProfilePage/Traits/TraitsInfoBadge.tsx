import { Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  TraitsInfo,
  TraitsInfoIcon,
  TraitsInfoStar,
} from './TraitsInfoBadge.style';
export const TraitsInfoBadge = () => {
  const { t } = useTranslation();

  return (
    <TraitsInfo>
      <TraitsInfoStar />
      <Typography
        variant="bodyXSmallStrong"
        sx={(theme) => ({ color: theme.palette.text.primary })}
      >
        {t('traits.title')}
      </Typography>
      <Tooltip
        title={t('traits.description')}
        placement={'top'}
        enterTouchDelay={0}
        arrow
      >
        <TraitsInfoIcon />
      </Tooltip>
    </TraitsInfo>
  );
};
