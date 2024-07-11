import { useSelectedLayoutSegment } from 'next/navigation';

interface useSuperfestProps {
  isSuperfest: boolean;
}

export const useSuperfest = (): useSuperfestProps => {
  const segment = useSelectedLayoutSegment();

  return {
    isSuperfest: segment === 'superfest',
  };
};
