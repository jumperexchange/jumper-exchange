import { useSuperfest } from 'src/hooks/useSuperfest';
import { PartnerThemeFooterImage } from '../PartnerThemeFooterImage';
import { SuperfestBackgroundContainer } from './BackgroundGradient.style';

const SuperfestBackground = () => {
  const { isSuperfest } = useSuperfest();
  return (
    <SuperfestBackgroundContainer>
      {!isSuperfest && <PartnerThemeFooterImage />}
    </SuperfestBackgroundContainer>
  );
};

export default SuperfestBackground;
