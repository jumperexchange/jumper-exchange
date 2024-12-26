import { Box, Skeleton, useTheme } from '@mui/material';
import { BerachainDepositInputBackground } from '../../BerachainWidgetWip/BerachainWidgetWip.style';

function BerachainWidgetLoader() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: theme.spacing(3),
        width: '592px',
        borderRadius: '24px',
        backgroundColor: '#121214',
      }}
    >
      {/* tabs height: 38px, radius 16px*/}
      <Skeleton
        variant="rectangular"
        sx={{ width: 'auto', height: '38px', borderRadius: '16px' }}
      />
      {/* info  height: 512px, radius 16px*/}
      <Skeleton
        variant="rectangular"
        sx={{
          marginTop: '16px',
          width: 'auto',
          height: '256px',
          borderRadius: '16px',
        }}
      />
      {/* deposit height: 478px*/}
      <Skeleton
        variant="rectangular"
        sx={{
          marginTop: '16px',
          width: 'auto',
          height: '216px',
          borderRadius: '16px',
        }}
      />
    </Box>
  );
}

export default BerachainWidgetLoader;
