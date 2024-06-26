import { SuperfestLogo } from 'src/components/illustrations/SuperfestLogo';
import { useTheme } from '@mui/material';
import { FlexCenterRowBox } from '../SuperfestPage/SuperfestMissionPage.style';

export const HeroBox = ({}) => {
  const theme = useTheme();

  return (
    <FlexCenterRowBox mt={'64px'}>
      <SuperfestLogo />
    </FlexCenterRowBox>
  );
};
