import { useMutation } from '@tanstack/react-query';

const fetchIntercomUserHash = async (userId: string): Promise<string> => {
  const response = await fetch('/api/intercom/user-hash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Intercom user hash');
  }

  const data = await response.json();
  return data.user_hash;
};

export const useIntercomUserHash = () => {
  return useMutation({
    mutationFn: fetchIntercomUserHash,
  });
};
