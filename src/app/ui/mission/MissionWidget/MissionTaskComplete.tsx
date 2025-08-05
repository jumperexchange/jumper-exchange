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

export const MissionTaskComplete = () => {
  const { t } = useTranslation();
  return (
    <SectionCardContainer>
      <MissionWidgetContainer>
        <MissionWidgetContentContainer>
          <MissionWidgetTitle variant="titleSmall">
            {t('missions.tasks.completed.title')}
          </MissionWidgetTitle>
          <MissionWidgetDescription variant="bodyMedium">
            {t('missions.tasks.completed.description')}
          </MissionWidgetDescription>
        </MissionWidgetContentContainer>
        <MissionWidgetIconContainer>
          <MissionWidgetIcon />
        </MissionWidgetIconContainer>
      </MissionWidgetContainer>
    </SectionCardContainer>
  );
};
