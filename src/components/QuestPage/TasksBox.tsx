import Task from '@/components/QuestPage/Task';
import { useGetVerifiedTasks } from '@/hooks/tasksVerification/useGetVerifiedTasks';
import type { Quest } from '@/types/loyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import { MerklOpportunity } from 'src/types/merkl';
import { DescriptionTitleTypography } from './DescriptionBox/DescriptionBox.style';
import {
  LeftTextBox,
  QuestsPageElementContainer,
} from './QuestsMissionPage.style';

interface StepsBoxProps {
  tasks: Quest['tasks_verification'];
  documentId: string;
  taskOpportunities: Record<string, MerklOpportunity[]>;
}

export const TasksBox = ({
  tasks,
  documentId,
  taskOpportunities,
}: StepsBoxProps) => {
  const { account } = useAccount();
  const { data: verified } = useGetVerifiedTasks(account?.address);
  return (
    <QuestsPageElementContainer>
      <LeftTextBox>
        <DescriptionTitleTypography>
          Steps to complete the mission
        </DescriptionTitleTypography>
      </LeftTextBox>
      {tasks.map((task, index) => (
        <Task
          task={task}
          isValid={
            !!verified?.find(
              (verifiedTask) => verifiedTask.stepId === task.uuid,
            )
          }
          index={index}
          questId={documentId}
          key={task.uuid}
          merklOpportunities={taskOpportunities[task.uuid] || []}
        />
      ))}
    </QuestsPageElementContainer>
  );
};
