import { useMutation } from '@tanstack/react-query';

type IntercomUserHashResponse = {
  user_id: string;
  user_hash: string;
};

export const fetchIntercomUserHash = async (
  walletAddress?: string,
): Promise<IntercomUserHashResponse> => {
  const response = await fetch('/api/intercom/user-hash', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      walletAddress ? { wallet_address: walletAddress } : {},
    ),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Intercom user hash');
  }

  return response.json();
};

export const useIntercomUserHash = () => {
  return useMutation({
    mutationFn: fetchIntercomUserHash,
  });
};
