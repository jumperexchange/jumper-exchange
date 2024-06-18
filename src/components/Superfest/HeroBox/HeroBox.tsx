import { Box } from '@mui/material';
import { SuperfestLogo } from 'src/components/illustrations/SuperfestLogo';

export const HeroBox = ({}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <SuperfestLogo />
    </Box>
  );
};
