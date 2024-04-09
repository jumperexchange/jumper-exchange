import { useQuery } from '@tanstack/react-query';

export interface MemeTokensProps {
  tokens: any[];
  isSuccess: boolean;
}

export interface UseMemeProps {
  enabled: boolean;
}

export const useMemelist = ({ enabled }: UseMemeProps): MemeTokensProps => {
  const { data, isSuccess } = useQuery({
    queryKey: ['memelist'],
    queryFn: async () => {
      //Todo: replace with an API return the token lists to implement in the widget
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos',
        // {
        //   headers: {
        //     Authorization: `Bearer ${''}`,
        //   },
        // },
      );
      const result = await response.json();
      return result;
    },
    enabled: enabled,
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    tokens: data,
    isSuccess,
  };
};
