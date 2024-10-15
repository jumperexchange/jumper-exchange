import { DEFAULT_EFFIGY, JUMPER_LOYALTY_PATH } from '@/const/urls';
import { useAccount } from '@lifi/wallet-management';
import { alpha, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProfileButtonBox } from './ProfileButton.style';
import useEffigyLink from 'src/hooks/useEffigyLink';

export const ProfileButton = () => {
  const router = useRouter();
  const theme = useTheme();
  const { account } = useAccount();
  const imgLink = useEffigyLink(
    `https://effigy.im/a/${account?.address}.png`,
    DEFAULT_EFFIGY,
  );

  return (
    <ProfileButtonBox onClick={() => router.push(JUMPER_LOYALTY_PATH)}>
      <Image
        src={imgLink}
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
