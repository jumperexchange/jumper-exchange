import type { IconButtonProps } from '@mui/material';
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';

export const RefreshCircleIcon: React.FC<IconButtonProps> = ({
  onClick,
  ...other
}) => {
  return (
    // <IconButton onClick={onClick} {...other}>
    //   <Tooltip
    //     title={'Click here to restart the indexing of your tokens now.'}
    //     placement="top"
    //     enterTouchDelay={0}
    //     componentsProps={{
    //       popper: { sx: { zIndex: 2000 } },
    //     }}
    //     arrow
    //     sx={{
    //       zIndex: 25000,
    //     }}
    //   >
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
    //   </Tooltip>
    // </IconButton>
  );
};
