import { useAccount } from '@lifi/wallet-management';
import { useVerifyTask } from '@/hooks/tasksVerification/useVerifyTask';
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskVerification } from '@/types/loyaltyPass';
import { useEffect } from 'react';

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ padding: 1, paddingBottom: '1px' }}>{children}</Box>
);

function Task({
  task,
  questId,
  isValid = false,
}: {
  questId: string;
  task: TaskVerification;
  isValid?: boolean;
}) {
  const { account } = useAccount();

  const { mutate, isSuccess, isPending, isError, reset, ...props } =
    useVerifyTask();

  useEffect(() => {
    if (!isError) {
      return;
    }

    setTimeout(() => reset(), 2000);
  }, [isError]);

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
      <Stack direction="column">
        {isValid || isSuccess ? (
          <IconWrapper>
            <CheckIcon />
          </IconWrapper>
        ) : isError ? (
          <IconWrapper>
            <CloseIcon />
          </IconWrapper>
        ) : (
          <IconButton
            loading={isPending}
            loadingIndicator={
              <CircularProgress
                sx={(theme) => ({ color: theme.palette.text.primary })}
                size={16}
              />
            }
            onClick={() =>
              mutate({
                questId,
                stepId: task.uuid,
                address: account?.address,
              })
            }
          >
            <RefreshIcon />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
}

export default Task;
