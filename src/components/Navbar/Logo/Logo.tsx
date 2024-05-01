import { JumperLearnLogo, JumperLogo } from '@/components/illustrations';
import { useTheme } from '@mui/material';
import { LogoWrapper } from '@/components/illustrations/Logo.style';

type LogoProps = {
  variant: 'default' | 'learn';
};

export const Logo = ({ variant }: LogoProps) => {
  const theme = useTheme();
  const mainCol =
    theme.palette.mode === 'light'
      ? theme.palette.accent1.main
      : theme.palette.accent1Alt.main;
  const subCol = theme.palette.accent2.main;

  const logo = variant === 'default' ? <JumperLogo subCol={subCol} mainCol={mainCol} /> :
    <JumperLearnLogo subCol={subCol} mainCol={mainCol} />;

  return (
    <LogoWrapper>
      {logo}
    </LogoWrapper>
  );
};
