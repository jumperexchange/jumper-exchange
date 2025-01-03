import { alpha, Box, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
        border: `1px solid ${alpha(theme.palette.white.main, 0.08)}`,
        gap: '8px',
        backgroundColor: theme.palette.surface2.main,
        boxShadow:
          theme.palette.mode === 'light'
            ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
            : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
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
            backgroundColor: theme.palette.surface1.main,
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
              sx={{
                width: '16px',
                height: '16px',
                color: theme.palette.text.primary,
              }}
            />
          ) : (
            <InfoIcon
              sx={{
                width: '16px',
                height: '16px',
                color: theme.palette.text.primary,
              }}
            />
          )}
        </Box>
        <Typography color={theme.palette.text.primary}>{s}</Typography>
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
            backgroundColor: theme.palette.surface1.main,
            borderRadius: '50%',
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacing(1),
            display: 'flex',
          }}
        >
          <OpenInNewIcon
            sx={{
              width: '16px',
              height: '16px',
              color: theme.palette.text.primary,
            }}
          />
        </Box>
      </a>
    </Box>
  );
};
