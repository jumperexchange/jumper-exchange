import { Box } from '@mui/material';
import { SuperfestLogo } from 'src/components/illustrations/SuperfestLogo';
import { useTheme } from '@mui/material';

export const HeroBox = ({}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        marginTop: '64px',
        marginBottom: '128px',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <SuperfestLogo />
    </Box>
  );
};
