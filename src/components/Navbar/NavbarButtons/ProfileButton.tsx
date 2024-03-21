import { Box, alpha, useTheme } from '@mui/material';
import { useAccounts } from 'src/hooks/useAccounts';
import { useNavigate } from 'react-router-dom';
import { ProfileButtonBox } from './ProfileButton.style';
import { JUMPER_LOYALTY_PATH } from 'src/const';

export const ProfileButton = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { account } = useAccounts();

  return (
    <ProfileButtonBox onClick={() => navigate(JUMPER_LOYALTY_PATH)}>
      <img
        src={`https://effigy.im/a/${account?.address ?? 'jumper.eth'}.png`}
        width={'44px'}
        height={'44px'}
        style={{
          borderRadius: '100%',
          borderStyle: 'solid',
          borderWidth: '2px',
          borderColor:
            theme.palette.mode === 'light'
              ? theme.palette.white.main
              : alpha(theme.palette.white.main, 0.08),
        }}
      />
    </ProfileButtonBox>
  );
};
