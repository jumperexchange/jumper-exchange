import { JumperLearnLogo, JumperLogo } from '@/components/illustrations';

type LogoProps = {
  variant: 'default' | 'learn';
};

export const Logo = ({ variant }: LogoProps) => {
  const logo = variant === 'default' ? <JumperLogo /> : <JumperLearnLogo />;

  return logo;
};
