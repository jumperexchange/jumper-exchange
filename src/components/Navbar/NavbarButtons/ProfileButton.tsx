import { JUMPER_LOYALTY_PATH } from '@/const/urls';
import { useAccounts } from '@/hooks/useAccounts';
import { alpha, useTheme } from '@mui/material';
import Image from 'next/image';
import { useNavigate } from 'react-router-dom';
import { ProfileButtonBox } from './ProfileButton.style';

export const ProfileButton = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { account } = useAccounts();

  const imageSrc = account?.address
    ? `https://effigy.im/a/${account?.address}.png`
    : '/default_effigy.svg';

  return (
    <ProfileButtonBox onClick={() => navigate(JUMPER_LOYALTY_PATH)}>
      <Image
        src={imageSrc}
        alt="Effigy Wallet Icon"
        width={44}
        height={44}
        priority={false}
        unoptimized={true}
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
