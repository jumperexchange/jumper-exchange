import { useMutation } from '@tanstack/react-query';
import config from '@/config/env-config';
import {
  TaskVerificationStatus,
  useTaskVerificationStatusStore,
} from 'src/stores/taskVerificationStatus/TaskVerificationStatusStore';

interface KnownVerifyTaskProps {
  questId: string;
  stepId: string;
  address?: string;
}

type VerifyTaskProps = KnownVerifyTaskProps & {
  [key: string]: string | undefined;
};

export async function verifyTaskQuery(props: VerifyTaskProps) {
  const apiBaseUrl = config.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${apiBaseUrl}/tasks_verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(props),
  });

  const jsonResponse = await res.json();

  if (!jsonResponse) {
    throw new Error(jsonResponse.message);
  }

  // TODO: Needs to be improved
  if (jsonResponse.status !== 201 && jsonResponse.statusCode !== 201) {
    throw new Error(jsonResponse.message);
  }

  return jsonResponse;
}

export const useVerifyTask = (missionId?: string, taskId?: string) => {
  const { setStatus } = useTaskVerificationStatusStore();
  return useMutation({
    mutationKey: ['verify-task', missionId, taskId],
    mutationFn: (props: VerifyTaskProps) => {
      return verifyTaskQuery(props);
    },
    onMutate: () => {
      setStatus(missionId ?? '', taskId ?? '', TaskVerificationStatus.Pending);
    },
    onSuccess: () => {
      setStatus(missionId ?? '', taskId ?? '', TaskVerificationStatus.Success);
    },
    onError: () => {
      setStatus(missionId ?? '', taskId ?? '', TaskVerificationStatus.Error);
    },
  });
};
