import { Tooltip, Typography } from '@mui/material';
import {
  TraitsInfo,
  TraitsInfoIcon,
  TraitsInfoStar,
} from './TraitsInfoBadge.style';
export const TraitsInfoBadge = () => {
  return (
    <TraitsInfo>
      <TraitsInfoStar />
      <Typography
        variant="bodyXSmallStrong"
        sx={(theme) => ({ color: theme.palette.text.primary })}
      >
        Traits
      </Typography>
      <Tooltip
        title={
          'Each trait represents a specific aspect of your crypto trading profile on Jumper.'
        }
        placement={'top'}
        enterTouchDelay={0}
        arrow
      >
        <TraitsInfoIcon />
      </Tooltip>
    </TraitsInfo>
  );
};
