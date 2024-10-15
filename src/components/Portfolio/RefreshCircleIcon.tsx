import type { IconButtonProps } from '@mui/material';
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';

export const RefreshCircleIcon: React.FC<IconButtonProps> = ({
  onClick,
  ...other
}) => {
  return (
    <CircularProgress
      variant="determinate"
      size={24}
      value={100}
      sx={(theme) => ({
        position: 'absolute',
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[300]
            : theme.palette.grey[800],
      })}
    />
  );
};
