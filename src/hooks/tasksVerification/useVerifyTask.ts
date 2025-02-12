import { useMutation } from '@tanstack/react-query';

interface VerifyTaskProps {
  questId: string;
  stepId: string;
  address?: string;
}

export async function verifyTaskQuery(props: VerifyTaskProps) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
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

  if (jsonResponse.statusCode !== 200) {
    throw new Error(jsonResponse.message);
  }

  return jsonResponse;
}

export const useVerifyTask = () => {
  return useMutation({
    mutationFn: (props: VerifyTaskProps) => {
      return verifyTaskQuery(props);
    },
  });
};
