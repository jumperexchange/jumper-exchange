import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Typography, useTheme } from '@mui/material';

export const TxConfirmation = ({
  s,
  link,
  success,
}: {
  s: string;
  link: string;
  success?: boolean;
}) => {
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
        border: `1px solid ${(theme.vars || theme).palette.alphaLight200.main}`,
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
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(1),
          }}
        >
          {success ? (
            <CheckIcon
              sx={{ color: '#FF8425', width: '16px', height: '16px' }}
            />
          ) : (
            <InfoIcon
              sx={{ color: '#FF8425', width: '16px', height: '16px' }}
            />
          )}
        </Box>
        <Typography sx={{ color: (theme.vars || theme).palette.text.primary }}>
          {s}
        </Typography>
      </Box>
      <a
        href={link}
        target="_blank"
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
        }}
        rel="noreferrer"
      >
        <Box
          sx={{
            backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
            borderRadius: '50%',
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacing(1),
            display: 'flex',
          }}
        >
          <OpenInNewIcon
            sx={(theme) => ({
              width: '16px',
              height: '16px',
              color: (theme.vars || theme).palette.white.main,
            })}
          />
        </Box>
      </a>
    </Box>
  );
};
