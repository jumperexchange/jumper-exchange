import axios from 'axios';
import { useQuery } from 'react-query';

export const useChainInfo = () => {
  const { data, ...other } = useQuery(
    ['chainStats'],
    async () => {
      const result = await axios({
        method: 'GET',
        url: 'https://li.quest/v1/chains',
      });
      return result.data;
    },
    { enabled: true },
  );
  return { data, ...other };
};
