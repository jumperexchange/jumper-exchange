import { DescriptionTitleTypography } from './DescriptionBox/DescriptionBox.style';
import {
  LeftTextBox,
  QuestsPageElementContainer,
} from './QuestsMissionPage.style';
import type { Quest } from '@/types/loyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import { useGetVerifiedTasks } from '@/hooks/tasksVerification/useGetVerifiedTasks';
import Task from '@/components/QuestPage/Task';

interface StepsBoxProps {
  tasks: Quest['tasks_verification'];
  documentId: string;
}

export const TasksBox = ({ tasks, documentId }: StepsBoxProps) => {
  const { account } = useAccount();
  const {
    data: verified,
    isSuccess,
    refetch,
  } = useGetVerifiedTasks(account?.address);

  return (
    <QuestsPageElementContainer>
      <LeftTextBox>
        <DescriptionTitleTypography>
          Tasks to complete the mission
        </DescriptionTitleTypography>
      </LeftTextBox>
      {tasks.map((task) => (
        <Task
          task={task}
          isValid={
            !!verified?.find(
              (verifiedTask) => verifiedTask.stepId === task.uuid,
            )
          }
          questId={documentId}
          key={task.uuid}
        />
      ))}
    </QuestsPageElementContainer>
  );
};
