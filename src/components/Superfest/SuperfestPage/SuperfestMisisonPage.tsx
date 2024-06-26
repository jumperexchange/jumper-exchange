import { useTheme } from '@mui/material';
import { SuperfestContainer } from '../Superfest.style';
import { SuperfestPageMainBox } from './SuperfestMissionPage.style';
import generateKey from 'src/app/lib/generateKey';
import { MissionCTA } from './CTA/MissionCTA';
import { useRouter } from 'next/navigation';
import { Quest } from 'src/types/loyaltyPass';
import { BackButton } from './BackButton/BackButton';
import { BannerBox } from './Banner/Banner';
import { DescriptionBox } from './DescriptionBox/DescriptionBox';
import { StepsBox } from './StepsBox/StepsBox';
import { InformationAlertBox } from './InformationBox/InformationAlertBox';

interface SuperfestMissionPageVar {
  quest: Quest;
  baseUrl: string;
}

interface Chain {
  logo: string;
  name: string;
}

export const SuperfestMissionPage = ({
  quest,
  baseUrl,
}: SuperfestMissionPageVar) => {
  const theme = useTheme();
  const router = useRouter();

  const attributes = quest?.attributes;
  const rewards = attributes.CustomInformation['rewards'];
  const chains = attributes.CustomInformation['chains'];
  const partner = attributes.CustomInformation['partner'];

  return (
    <SuperfestContainer className="superfest">
      <SuperfestPageMainBox>
        {/* button to go back */}
        <BackButton />
        {/* big component with the main information */}
        <BannerBox quest={quest} baseUrl={baseUrl} />
        {/* Subtitle and description */}
        <DescriptionBox
          longTitle={attributes.Subtitle}
          description={attributes.Description}
        />
        {/* Steps */}
        <StepsBox steps={attributes.Steps} baseUrl={baseUrl} />
        {/* Additional Info */}
        <InformationAlertBox information={attributes.Information} />
        {/* Big Button */}
        <MissionCTA
          title={attributes.Title}
          url={attributes.Link}
          id={1}
          key={generateKey('cta')}
        />
      </SuperfestPageMainBox>
    </SuperfestContainer>
  );
};
