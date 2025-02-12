import { DescriptionTitleTypography } from './DescriptionBox/DescriptionBox.style';
import {
  LeftTextBox,
  QuestsPageElementContainer,
} from './QuestsMissionPage.style';
import type { Quest } from '@/types/loyaltyPass';
import { IconButton, Stack, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAccount } from '@lifi/wallet-management';
import { useGetVerifiedTasks } from '@/hooks/tasksVerification/useGetVerifiedTasks';
import { useVerifyTask } from '@/hooks/tasksVerification/useVerifyTask';
import { useEffect } from 'react';
import CheckIcon from '@mui/icons-material/Check';

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
  const mutation = useVerifyTask();

  useEffect(() => {
    if (!mutation.isSuccess) {
      return;
    }

    refetch();
  }, [mutation.isSuccess]);

  return (
    <QuestsPageElementContainer>
      <LeftTextBox>
        <DescriptionTitleTypography>
          Tasks to complete the mission
        </DescriptionTitleTypography>
      </LeftTextBox>
      {tasks.map((task) => {
        return (
          <Stack
            key={task.uuid}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              border: '2px solid white',
              borderRadius: 1,
              padding: 3,
              margin: 1,
            }}
          >
            <Stack direction="column">
              <Typography>Task: {task.name}</Typography>
            </Stack>
            {!verified?.some(
              (verifiedTask) => verifiedTask.stepId === task.uuid,
            ) ? (
              <Stack direction="column">
                <IconButton
                  onClick={() =>
                    mutation.mutate({
                      questId: documentId,
                      stepId: task.uuid,
                      address: account?.address,
                    })
                  }
                >
                  <RefreshIcon />
                </IconButton>
              </Stack>
            ) : (
              <CheckIcon />
            )}
          </Stack>
        );
      })}
    </QuestsPageElementContainer>
  );
};
