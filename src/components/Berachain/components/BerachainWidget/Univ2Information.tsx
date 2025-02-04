import InfoIcon from '@mui/icons-material/Info';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { alpha, Box, IconButton, Typography, useTheme } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
export const Univ2Information = ({
  link,
  appName,
}: {
  link: string;
  appName?: string;
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex', // 'place-content-center' is equivalent to a grid with centered content.
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        marginY: theme.spacing(8),
        gap: 1,
      }}
    >
      <IconButton
        disabled
        sx={{
          '&.Mui-disabled': {
            background: '#1F1D1D',
            borderRadius: '50%',
            width: '6rem',
            height: '6rem',
            marginBottom: 4,
          },
        }}
      >
        <CurrencyExchangeIcon
          sx={(theme) => ({
            color: theme.palette.primary.main,
            width: '3rem',
            height: '3rem',
          })}
        />
      </IconButton>
      <Typography
        variant="bodyLargeStrong"
        color="textPrimary"
        sx={{
          fontSize: '1.5rem',
        }}
      >
        Add liquidity
      </Typography>
      {/* <Typography variant="body2" color="textSecondary">
          Deposits and rewards can be withdrawn here.
        </Typography> */}

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
              <InfoIcon
                sx={{ color: '#FF8425', width: '16px', height: '16px' }}
              />
            </Box>
            <Typography
              sx={{ color: theme.palette.text.primary }}
              variant="bodySmall"
            >
              The token is a Uni-V2 position. You must add liquidity on the
              Uniswap protocol to get it.
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.white.main, 0.08),
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
                color: theme.palette.white.main,
              })}
            />
          </Box>
        </a>
      </Box>
    </Box>
  );
};
