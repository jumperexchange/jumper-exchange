import { JumperLearnLogo, JumperLogo } from '@/components/illustrations';
import {
  CollabLogoWrapper,
  LogoWrapper,
} from '@/components/illustrations/Logo.style';
import { Box } from '@mui/material';
import { CrossIcon } from 'src/components/illustrations/Cross';
import { OptimismLogo } from 'src/components/illustrations/Optimism';

type LogoProps = {
  variant: 'default' | 'learn' | 'superfest';
};

export const Logo = ({ variant }: LogoProps) => {
  let logo = <JumperLogo />;
  if (variant === 'learn') {
    logo = <JumperLearnLogo />;
  } else if (variant === 'superfest') {
    return <JumperLogo />;
  }
  return <LogoWrapper>{logo}</LogoWrapper>;
};
