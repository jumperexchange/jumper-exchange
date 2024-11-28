import { useQuery } from '@tanstack/react-query';

export const useIonicData = () => {
  const apiBaseUrl =
    'https://uoagtjstsdrjypxlkuzr.supabase.co/rest/v1/asset-total-apy?select=*';

  // get data
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['ionic-data'],
    queryFn: async () => {
      const res = await fetch(apiBaseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: 'XXX',
          Authorization: 'Bearer XXX',
        },
      });

      if (!res.ok) {
        return { data: null };
      }

      const data = await res.json();

      return { data };
    },
  });
  return { data, isSuccess, isLoading };
};
