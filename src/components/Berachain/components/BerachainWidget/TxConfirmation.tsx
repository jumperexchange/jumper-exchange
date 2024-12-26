import { alpha, Box, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export const TxConfirmation = ({ s, link }: { s: string; link: string }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '16px',
        justifyContent: 'space-between',
        backgroundColor: 'inherit',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
        border: `1px solid ${alpha(theme.palette.white.main, 0.08)}`,
        gap: '8px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#291812',
            borderRadius: '50%',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <CheckIcon sx={{ color: '#FF8425', width: '16px', height: '16px' }} />
        </Box>
        <Typography>{s}</Typography>
      </Box>
      <a
        href={link}
        target="_blank"
        style={{
          textDecoration: 'none',
          color: 'inherit',
        }}
        rel="noreferrer"
      >
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.white.main, 0.08),
            borderRadius: '50%',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <OpenInNewIcon sx={{ width: '16px', height: '16px' }} />
        </Box>
      </a>
    </Box>
  );
};
