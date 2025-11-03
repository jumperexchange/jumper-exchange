import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import {
  MissionWidgetDescription,
  MissionWidgetContainer,
  MissionWidgetContentContainer,
  MissionWidgetTitle,
} from './MissionWidget.styles';
import { useTranslation } from 'react-i18next';
import { AppPaths } from 'src/const/urls';
import { useRouter } from 'next/navigation';
import { Button } from 'src/components/Button/Button';

export const MissionEnded = () => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <SectionCardContainer>
      <MissionWidgetContainer>
        <MissionWidgetContentContainer>
          <MissionWidgetTitle variant="titleSmall">
            {t('missions.mission.ended.title')}
          </MissionWidgetTitle>
          <MissionWidgetDescription variant="bodyMedium" color="textSecondary">
            {t('missions.mission.ended.description')}
          </MissionWidgetDescription>
        </MissionWidgetContentContainer>
        <Button onClick={() => router.push(AppPaths.Missions)}>
          {t('missions.mission.ended.cta')}
        </Button>
      </MissionWidgetContainer>
    </SectionCardContainer>
  );
};
