import { Avatar, Container, Stack, Typography, useTheme } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { WalletButton } from './WalletMenu.style';

export const WalletCard = () => {
  const theme = useTheme();

  return (
    <Container
      sx={{
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.04)',
        padding: '24px',
        display: 'flex',
        cursor: 'pointer',
        background: theme.palette.surface2.main,
        borderRadius: '16px',
      }}
    >
      <Stack direction={'row'} spacing={4} sx={{ margin: 'auto' }}>
        <Avatar></Avatar>
        <Container
          sx={{
            display: 'grid',
            gridTemplateRows: 'repeat(2, auto)',
            gridTemplateColumns: 'repeat(2, auto)',
            gridGap: '12px',
            justifyItems: 'center',
            alignItems: 'center',
            width: 'fit-content',
            padding: '0 !important',
          }}
        >
          <WalletButton sx={{ gridColumn: '1/3', gridRow: '1/2' }}>
            <Typography variant="lifiBodySmallStrong">0x5542...0Ea0</Typography>
          </WalletButton>

          <WalletButton
            sx={{
              gridColumn: '1/2',
              gridRow: '2/3',
            }}
          >
            <OpenInNewIcon sx={{ height: '20px' }} />
          </WalletButton>

          <WalletButton
            colored
            sx={{
              gridColumn: '2/3',
              gridRow: '2/3',
            }}
          >
            <PowerSettingsNewIcon sx={{ height: '20px' }} />
          </WalletButton>
        </Container>
      </Stack>
    </Container>
  );
};
