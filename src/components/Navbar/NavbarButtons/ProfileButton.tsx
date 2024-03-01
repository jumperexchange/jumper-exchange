import { Box, alpha, useTheme } from '@mui/material';
import { useAccounts } from 'src/hooks/useAccounts';
import { ProfileButtonBox } from './ProfileButton.style';

export const ProfileButton = () => {
  const theme = useTheme();
  const { account } = useAccounts();

  return (
    <>
      {account?.address ? (
        <ProfileButtonBox>
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
        </ProfileButtonBox>
      ) : null}
    </>
  );
};
