import { useMissionStore } from 'src/stores/mission';
import {
  MissionWidgetContainer,
  MissionWidgetContentContainer,
  MissionWidgetTitle,
  MissionWidgetDescription,
} from './MissionWidget.styles';
import { Button } from 'src/components/Button';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { openInNewTab } from 'src/utils/openInNewTab';
import { MissionForm } from './MissionForm';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import { useTranslation } from 'react-i18next';

export const MissionFormWidget = () => {
  const { t } = useTranslation();
  const {
    taskTitle,
    taskDescription,
    taskCTALink,
    taskCTAText,
    taskInputs,
    currentActiveTaskType,
  } = useMissionStore();

  const taskTitleWithFallback =
    taskTitle ?? t('missions.tasks.type', { type: currentActiveTaskType });
  const taskCTATextWithFallback = taskCTAText ?? t('missions.tasks.action.go');

  const { trackEvent } = useUserTracking();

  const hasForm = !taskCTALink || !!(taskInputs && taskInputs.length);

  const handleClick = () => {
    trackEvent({
      category: TrackingCategory.Quests,
      action: TrackingAction.ClickMissionCtaSteps,
      label: `click-mission-cta-steps`,
      data: {
        [TrackingEventParameter.MissionCtaStepsTitle]: taskTitle || '',
        [TrackingEventParameter.MissionCtaStepsLink]: taskCTALink || '',
        [TrackingEventParameter.MissionCtaStepsCTA]: taskCTAText || '',
      },
    });
    if (taskCTALink) {
      openInNewTab(taskCTALink);
    }
  };

  return (
    <SectionCardContainer>
      <MissionWidgetContainer>
        <MissionWidgetContentContainer>
          <MissionWidgetTitle variant="titleSmall">
            {taskTitleWithFallback}
          </MissionWidgetTitle>
          <MissionWidgetDescription variant="bodyMedium">
            {taskDescription}
          </MissionWidgetDescription>
        </MissionWidgetContentContainer>
        {hasForm ? (
          <MissionForm />
        ) : (
          <Button onClick={handleClick}>{taskCTATextWithFallback}</Button>
        )}
      </MissionWidgetContainer>
    </SectionCardContainer>
  );
};
