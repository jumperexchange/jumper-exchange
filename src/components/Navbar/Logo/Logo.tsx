import { JumperLearnLogo, JumperLogo } from '@/components/illustrations';
import { LogoWrapper } from '@/components/illustrations/Logo.style';
import Image from 'next/image';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
type LogoProps = {
  variant: 'default' | 'learn';
};

export const Logo = ({ variant }: LogoProps) => {
  const logo = variant === 'default' ? <JumperLogo /> : <JumperLearnLogo />;
  const { logoUrl, activeUid } = usePartnerTheme();
  return (
    <LogoWrapper>
      {activeUid && logoUrl ? (
        <Image
          alt="jumper-partner-logo"
          src={logoUrl.href}
          width={333}
          height={32}
        />
      ) : (
        logo
      )}
    </LogoWrapper>
  );
};
