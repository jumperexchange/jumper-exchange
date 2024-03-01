import { Box, alpha, useTheme } from '@mui/material';
import { useAccounts } from 'src/hooks/useAccounts';

export const ProfileButton = () => {
  const theme = useTheme();
  const { account } = useAccounts();

  return (
    <>
      {account?.address ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: theme.spacing(1.5),
            cursor: 'pointer',
          }}
        >
          <img
            src={`https://effigy.im/a/${account.address}.png`}
            width={'44px'}
            height={'44px'}
            style={{
              borderRadius: '100%',
              borderStyle: 'solid',
              borderWidth: '2px',
              borderColor:
                theme.palette.mode === 'light'
                  ? '#FFFFFF'
                  : alpha(theme.palette.white.main, 0.08),
            }}
          />
        </Box>
      ) : null}
    </>
  );
};
