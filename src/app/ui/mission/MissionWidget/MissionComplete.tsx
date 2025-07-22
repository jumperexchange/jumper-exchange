'use client';

import { useTranslation } from 'react-i18next';
import {
  MissionWidgetContainer,
  MissionWidgetContentContainer,
  MissionWidgetDescription,
  MissionWidgetTitle,
  MissionWidgetIconContainer,
  MissionWidgetIcon,
} from './MissionWidget.styles';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';

export const MissionComplete = () => {
  const { t } = useTranslation();
  return (
    <SectionCardContainer>
      <MissionWidgetContainer>
        <MissionWidgetContentContainer>
          <MissionWidgetTitle variant="titleSmall">
            {t('missions.mission.completed.title')}
          </MissionWidgetTitle>
          <MissionWidgetDescription variant="bodyMedium">
            {t('missions.mission.completed.description')}
          </MissionWidgetDescription>
        </MissionWidgetContentContainer>
        <MissionWidgetIconContainer>
          <MissionWidgetIcon />
        </MissionWidgetIconContainer>
      </MissionWidgetContainer>
    </SectionCardContainer>
  );
};
